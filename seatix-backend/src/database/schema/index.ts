import { relations } from 'drizzle-orm';
import { bookingSeats } from './booking-seats.schema';
import { bookings } from './bookings.schema';
import { events } from './events.schema';
import { seats } from './seats.schema';
import { sections } from './sections.schema';
import { users } from './users.schema';

export * from './users.schema';
export * from './events.schema';
export * from './sections.schema';
export * from './seats.schema';
export * from './bookings.schema';
export * from './booking-seats.schema';

export const usersRelations = relations(users, ({ many }) => ({
  events: many(events),
  bookings: many(bookings),
}));

export const eventsRelations = relations(events, ({ one, many }) => ({
  organizer: one(users, { fields: [events.organizerId], references: [users.id] }),
  sections: many(sections),
  seats: many(seats),
  bookings: many(bookings),
}));

export const sectionsRelations = relations(sections, ({ one, many }) => ({
  event: one(events, { fields: [sections.eventId], references: [events.id] }),
  seats: many(seats),
}));

export const seatsRelations = relations(seats, ({ one, many }) => ({
  section: one(sections, { fields: [seats.sectionId], references: [sections.id] }),
  event: one(events, { fields: [seats.eventId], references: [events.id] }),
  heldByUser: one(users, { fields: [seats.heldByUserId], references: [users.id] }),
  bookingSeats: many(bookingSeats),
}));

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  user: one(users, { fields: [bookings.userId], references: [users.id] }),
  event: one(events, { fields: [bookings.eventId], references: [events.id] }),
  bookingSeats: many(bookingSeats),
}));

export const bookingSeatsRelations = relations(bookingSeats, ({ one }) => ({
  booking: one(bookings, { fields: [bookingSeats.bookingId], references: [bookings.id] }),
  seat: one(seats, { fields: [bookingSeats.seatId], references: [seats.id] }),
}));
