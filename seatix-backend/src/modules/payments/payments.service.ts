import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import axios from 'axios';
import { and, eq, inArray } from 'drizzle-orm';
import { ConfigService } from '@nestjs/config';
import { DRIZZLE, Database } from '@database/database.module';
import * as schema from '@database/schema';
import { generateBookingRef } from '@common/utils/booking-ref.util';
import { InitializePaymentDto } from './dto/initialize-payment.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';

@Injectable()
export class PaymentsService {
  private readonly paystackSecretKey: string;
  private readonly clientUrl: string;

  constructor(
    @Inject(DRIZZLE) private db: Database,
    private config: ConfigService,
  ) {
    this.paystackSecretKey = this.config.getOrThrow<string>('PAYSTACK_SECRET_KEY');
    this.clientUrl = this.config.get<string>('CLIENT_URL', 'http://localhost:5173');
  }

  /**
   * Initiates a Paystack payment for a set of held seats.
   * Flow:
   *   1. Fetches the user's email for Paystack.
   *   2. Validates that all requested seats are currently held by this user and not expired.
   *   3. Sums the seat prices to get the total (prices are stored as strings in DB, parsed via parseFloat).
   *   4. Creates a 'pending' booking record and booking_seats rows inside a transaction.
   *   5. Calls Paystack's initialize endpoint — amount is converted to kobo (NGN × 100).
   *   6. Returns the Paystack authorization URL for the frontend to redirect the user.
   *   7. If the Paystack call fails, the pending booking is deleted to avoid orphaned records.
   */
  async initialize(userId: string, dto: InitializePaymentDto) {
    const { eventId, seatIds } = dto;

    const [user] = await this.db
      .select({ id: schema.users.id, email: schema.users.email })
      .from(schema.users)
      .where(eq(schema.users.id, userId));

    if (!user) throw new NotFoundException('User not found');

    const seats = await this.db
      .select()
      .from(schema.seats)
      .where(inArray(schema.seats.id, seatIds));

    if (seats.length !== seatIds.length)
      throw new BadRequestException('One or more seats not found');

    const now = new Date();
    const invalid = seats.filter(
      (s) => s.status !== 'held' || s.heldByUserId !== userId || !s.heldUntil || s.heldUntil < now,
    );

    if (invalid.length > 0)
      throw new BadRequestException(
        'One or more seats are no longer held by you. Please re-select them.',
      );

    const totalAmount = seats.reduce((sum, seat) => sum + parseFloat(seat.price as string), 0);

    const bookingRef = generateBookingRef();
    const paystackRef = `${bookingRef}-${Date.now()}`;

    const booking = await this.db.transaction(async (tx) => {
      const [newBooking] = await tx
        .insert(schema.bookings)
        .values({
          userId,
          eventId,
          reference: bookingRef,
          totalAmount: totalAmount.toString(),
          status: 'pending',
          paystackReference: paystackRef,
        })
        .returning();

      await tx
        .insert(schema.bookingSeats)
        .values(seatIds.map((seatId) => ({ bookingId: newBooking.id, seatId })));

      return newBooking;
    });

    try {
      const response = await axios.post(
        'https://api.paystack.co/transaction/initialize',
        {
          email: user.email,
          amount: Math.round(totalAmount * 100),
          reference: paystackRef,
          callback_url: `${this.clientUrl}/payment/callback`,
        },
        {
          headers: {
            Authorization: `Bearer ${this.paystackSecretKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return {
        authorizationUrl: response.data.data.authorization_url,
        reference: paystackRef,
        bookingId: booking.id,
      };
    } catch {
      await this.db.delete(schema.bookings).where(eq(schema.bookings.id, booking.id));

      throw new InternalServerErrorException('Failed to initialize payment. Please try again.');
    }
  }

  /**
   * Verifies a Paystack transaction after the user returns from the payment page.
   * Flow:
   *   1. Finds the pending booking by its Paystack reference.
   *   2. If already confirmed, returns the booking immediately (idempotent).
   *   3. Calls Paystack's verify endpoint to get the real payment status.
   *   4. On success: marks booking as 'confirmed', sets paidAt, and marks seats as 'booked'.
   *   5. On failure: marks booking as 'failed' and releases seats back to 'available'.
   * All DB updates run inside transactions to keep booking and seat states consistent.
   */
  async verify(userId: string, dto: VerifyPaymentDto) {
    const { reference } = dto;

    const [booking] = await this.db
      .select()
      .from(schema.bookings)
      .where(
        and(eq(schema.bookings.paystackReference, reference), eq(schema.bookings.userId, userId)),
      );

    if (!booking) throw new NotFoundException('Booking not found for this reference');

    if (booking.status === 'confirmed') return booking;

    if (booking.status === 'failed')
      throw new BadRequestException('This payment session has already failed');

    let paystackStatus: string;

    try {
      const response = await axios.get(
        `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
        {
          headers: { Authorization: `Bearer ${this.paystackSecretKey}` },
        },
      );
      paystackStatus = response.data.data.status;
    } catch {
      throw new InternalServerErrorException('Failed to verify payment. Please try again.');
    }

    const bSeats = await this.db
      .select()
      .from(schema.bookingSeats)
      .where(eq(schema.bookingSeats.bookingId, booking.id));

    const seatIds = bSeats.map((bs) => bs.seatId);

    if (paystackStatus === 'success') {
      await this.db.transaction(async (tx) => {
        await tx
          .update(schema.bookings)
          .set({ status: 'confirmed', paidAt: new Date() })
          .where(eq(schema.bookings.id, booking.id));

        if (seatIds.length > 0) {
          await tx
            .update(schema.seats)
            .set({ status: 'booked', heldByUserId: null, heldUntil: null })
            .where(inArray(schema.seats.id, seatIds));
        }
      });

      const [confirmed] = await this.db
        .select()
        .from(schema.bookings)
        .where(eq(schema.bookings.id, booking.id));

      return confirmed;
    } else {
      await this.db.transaction(async (tx) => {
        await tx
          .update(schema.bookings)
          .set({ status: 'failed' })
          .where(eq(schema.bookings.id, booking.id));

        if (seatIds.length > 0) {
          await tx
            .update(schema.seats)
            .set({ status: 'available', heldByUserId: null, heldUntil: null })
            .where(inArray(schema.seats.id, seatIds));
        }
      });

      throw new BadRequestException('Payment was not successful. Your seats have been released.');
    }
  }
}
