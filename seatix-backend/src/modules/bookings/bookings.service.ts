import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, count, eq, inArray } from 'drizzle-orm';
import { DRIZZLE, Database } from '@database/database.module';
import * as schema from '@database/schema';
import { paginate } from '@common/utils/pagination.util';

@Injectable()
export class BookingsService {
  constructor(@Inject(DRIZZLE) private db: Database) {}

  /**
   * Returns all bookings for the authenticated user, with each booking
   * enriched with its event summary and the list of seats booked.
   */
  async getUserBookings(userId: string) {
    const bookingRows = await this.db
      .select()
      .from(schema.bookings)
      .where(eq(schema.bookings.userId, userId))
      .orderBy(schema.bookings.createdAt);

    const result = await Promise.all(
      bookingRows.map(async (booking) => {
        const bSeats = await this.db
          .select({ seat: schema.seats })
          .from(schema.bookingSeats)
          .innerJoin(schema.seats, eq(schema.bookingSeats.seatId, schema.seats.id))
          .where(eq(schema.bookingSeats.bookingId, booking.id));

        const [event] = await this.db
          .select({
            id: schema.events.id,
            title: schema.events.title,
            eventDate: schema.events.eventDate,
            venue: schema.events.venue,
          })
          .from(schema.events)
          .where(eq(schema.events.id, booking.eventId));

        return { ...booking, event, seats: bSeats.map((b) => b.seat) };
      }),
    );

    return result;
  }

  /**
   * Fetches a single booking by ID with its event and seat details.
   * Only the booking owner or an admin can access it.
   */
  async getBookingById(bookingId: string, userId: string, role: string) {
    const [booking] = await this.db
      .select()
      .from(schema.bookings)
      .where(eq(schema.bookings.id, bookingId));

    if (!booking) throw new NotFoundException('Booking not found');

    if (role !== 'admin' && booking.userId !== userId)
      throw new ForbiddenException('You do not have access to this booking');

    const bSeats = await this.db
      .select({ seat: schema.seats })
      .from(schema.bookingSeats)
      .innerJoin(schema.seats, eq(schema.bookingSeats.seatId, schema.seats.id))
      .where(eq(schema.bookingSeats.bookingId, booking.id));

    const [event] = await this.db
      .select()
      .from(schema.events)
      .where(eq(schema.events.id, booking.eventId));

    return { ...booking, event, seats: bSeats.map((b) => b.seat) };
  }

  /**
   * Returns all bookings for a specific event, visible to the owning organizer only.
   * Each booking includes the attendee's basic info and the seats they booked.
   */
  async getEventBookings(eventId: string, organizerId: string) {
    const [event] = await this.db.select().from(schema.events).where(eq(schema.events.id, eventId));

    if (!event) throw new NotFoundException('Event not found');
    if (event.organizerId !== organizerId)
      throw new ForbiddenException('You do not own this event');

    const bookingRows = await this.db
      .select()
      .from(schema.bookings)
      .where(eq(schema.bookings.eventId, eventId))
      .orderBy(schema.bookings.createdAt);

    const result = await Promise.all(
      bookingRows.map(async (booking) => {
        const [user] = await this.db
          .select({ id: schema.users.id, name: schema.users.name, email: schema.users.email })
          .from(schema.users)
          .where(eq(schema.users.id, booking.userId));

        const bSeats = await this.db
          .select({ seat: schema.seats })
          .from(schema.bookingSeats)
          .innerJoin(schema.seats, eq(schema.bookingSeats.seatId, schema.seats.id))
          .where(eq(schema.bookingSeats.bookingId, booking.id));

        return { ...booking, user, seats: bSeats.map((b) => b.seat) };
      }),
    );

    return result;
  }

  /** Admin-only paginated list of every booking in the system. */
  async getAllBookings(page = 1, limit = 20) {
    const [items, [{ value: total }]] = await Promise.all([
      this.db
        .select()
        .from(schema.bookings)
        .limit(limit)
        .offset((page - 1) * limit)
        .orderBy(schema.bookings.createdAt),
      this.db.select({ value: count() }).from(schema.bookings),
    ]);

    return paginate(items, total, page, limit);
  }
}
