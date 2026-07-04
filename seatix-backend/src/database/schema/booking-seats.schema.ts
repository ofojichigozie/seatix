import { pgTable, uuid } from 'drizzle-orm/pg-core';
import { bookings } from './bookings.schema';
import { seats } from './seats.schema';

export const bookingSeats = pgTable('booking_seats', {
  id: uuid('id').defaultRandom().primaryKey(),
  bookingId: uuid('booking_id')
    .notNull()
    .references(() => bookings.id, { onDelete: 'cascade' }),
  seatId: uuid('seat_id')
    .notNull()
    .references(() => seats.id, { onDelete: 'cascade' }),
});

export type BookingSeat = typeof bookingSeats.$inferSelect;
