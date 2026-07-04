import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, eq, inArray, lt } from 'drizzle-orm';
import { DRIZZLE, Database } from '@database/database.module';
import * as schema from '@database/schema';
import { CreateSeatMapDto } from './dto/create-seat-map.dto';
import { HoldSeatsDto } from './dto/hold-seats.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';

/** How long (in milliseconds) a seat is reserved for a user before it is automatically released. Currently 10 minutes. */
const HOLD_DURATION_MS = 10 * 60 * 1000;

@Injectable()
export class SeatsService {
  constructor(@Inject(DRIZZLE) private db: Database) {}

  /**
   * Replaces the entire seat map for an event inside a single transaction.
   * Deletes all existing sections (which cascades to their seats), then
   * re-inserts the new sections and seats from the DTO.
   * Returns the freshly built seat map after saving.
   */
  async saveSeatMap(eventId: string, organizerId: string, dto: CreateSeatMapDto) {
    const [event] = await this.db.select().from(schema.events).where(eq(schema.events.id, eventId));

    if (!event) throw new NotFoundException('Event not found');
    if (event.organizerId !== organizerId)
      throw new ForbiddenException('You do not own this event');

    await this.db.transaction(async (tx) => {
      await tx.delete(schema.sections).where(eq(schema.sections.eventId, eventId));

      for (const sectionDto of dto.sections) {
        const [section] = await tx
          .insert(schema.sections)
          .values({ eventId, name: sectionDto.name })
          .returning();

        if (sectionDto.seats.length > 0) {
          await tx.insert(schema.seats).values(
            sectionDto.seats.map((seat) => ({
              sectionId: section.id,
              eventId,
              row: seat.row,
              seatNumber: seat.seatNumber,
              seatType: seat.seatType,
              price: seat.price.toString(),
            })),
          );
        }
      }
    });

    return this.getSeatMap(eventId);
  }

  /**
   * Fetches the full seat map for an event: the event record plus its sections,
   * each containing their seats. Also sweeps expired holds before returning
   * so seat statuses are always accurate.
   */
  async getSeatMap(eventId: string) {
    const [event] = await this.db.select().from(schema.events).where(eq(schema.events.id, eventId));

    if (!event) throw new NotFoundException('Event not found');

    await this.releaseExpiredHolds(eventId);

    const sectionRows = await this.db
      .select()
      .from(schema.sections)
      .where(eq(schema.sections.eventId, eventId));

    const seatRows = await this.db
      .select()
      .from(schema.seats)
      .where(eq(schema.seats.eventId, eventId));

    const sections = sectionRows.map((section) => ({
      ...section,
      seats: seatRows.filter((seat) => seat.sectionId === section.id),
    }));

    return { event, sections };
  }

  /**
   * Allows an organizer to update an individual seat's type, price, or status.
   * Status can only be set to 'available' or 'blocked' via this endpoint —
   * 'held' and 'booked' are managed by the hold/payment flows.
   */
  async updateSeat(eventId: string, seatId: string, organizerId: string, dto: UpdateSeatDto) {
    const [event] = await this.db.select().from(schema.events).where(eq(schema.events.id, eventId));

    if (!event) throw new NotFoundException('Event not found');
    if (event.organizerId !== organizerId)
      throw new ForbiddenException('You do not own this event');

    const [seat] = await this.db
      .select()
      .from(schema.seats)
      .where(and(eq(schema.seats.id, seatId), eq(schema.seats.eventId, eventId)));

    if (!seat) throw new NotFoundException('Seat not found');

    const [updated] = await this.db
      .update(schema.seats)
      .set({
        ...(dto.seatType ? { seatType: dto.seatType } : {}),
        ...(dto.price !== undefined ? { price: dto.price.toString() } : {}),
        ...(dto.status ? { status: dto.status } : {}),
      })
      .where(eq(schema.seats.id, seatId))
      .returning();

    return updated;
  }

  /**
   * Temporarily reserves a set of seats for the authenticated user.
   * First releases any expired holds, then checks all requested seats are 'available'.
   * Sets status to 'held' with heldByUserId and a heldUntil timestamp of now + HOLD_DURATION_MS.
   * The frontend should redirect to payment before the hold expires.
   */
  async holdSeats(eventId: string, userId: string, dto: HoldSeatsDto) {
    const { seatIds } = dto;

    await this.releaseExpiredHolds(eventId);

    const requestedSeats = await this.db
      .select()
      .from(schema.seats)
      .where(and(eq(schema.seats.eventId, eventId), inArray(schema.seats.id, seatIds)));

    if (requestedSeats.length !== seatIds.length)
      throw new NotFoundException('One or more seats were not found');

    const unavailable = requestedSeats.filter((s) => s.status !== 'available');
    if (unavailable.length > 0) {
      throw new BadRequestException(
        `Seat(s) ${unavailable.map((s) => s.seatNumber).join(', ')} are no longer available`,
      );
    }

    const heldUntil = new Date(Date.now() + HOLD_DURATION_MS);

    await this.db
      .update(schema.seats)
      .set({ status: 'held', heldByUserId: userId, heldUntil })
      .where(inArray(schema.seats.id, seatIds));

    return { heldUntil, seatIds };
  }

  /**
   * Manually releases all seats currently held by the user for a given event.
   * Called when the user leaves the checkout flow or cancels seat selection.
   */
  async releaseHolds(eventId: string, userId: string) {
    await this.db
      .update(schema.seats)
      .set({ status: 'available', heldByUserId: null, heldUntil: null })
      .where(
        and(
          eq(schema.seats.eventId, eventId),
          eq(schema.seats.status, 'held'),
          eq(schema.seats.heldByUserId, userId),
        ),
      );

    return null;
  }

  /**
   * Verifies that all requested seat IDs are still actively held by the given user
   * and that none of the holds have expired. Called by the payments service before
   * creating a booking to prevent payment on already-expired holds.
   */
  async validateHeldSeats(seatIds: string[], userId: string) {
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
      throw new BadRequestException('One or more seats are no longer held by you');

    return seats;
  }

  /**
   * Sweeps the seats table for the given event and resets any held seats
   * whose heldUntil timestamp has passed back to 'available'.
   * Called automatically before reading or modifying seat availability.
   */
  private async releaseExpiredHolds(eventId: string) {
    await this.db
      .update(schema.seats)
      .set({ status: 'available', heldByUserId: null, heldUntil: null })
      .where(
        and(
          eq(schema.seats.eventId, eventId),
          eq(schema.seats.status, 'held'),
          lt(schema.seats.heldUntil, new Date()),
        ),
      );
  }
}
