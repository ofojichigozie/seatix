import { numeric, pgEnum, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { events } from './events.schema';
import { sections } from './sections.schema';
import { users } from './users.schema';

export const seatTypeEnum = pgEnum('seat_type', ['vip', 'regular', 'economy', 'disabled']);
export const seatStatusEnum = pgEnum('seat_status', ['available', 'held', 'booked', 'blocked']);

export const seats = pgTable('seats', {
  id: uuid('id').defaultRandom().primaryKey(),
  sectionId: uuid('section_id')
    .notNull()
    .references(() => sections.id, { onDelete: 'cascade' }),
  eventId: uuid('event_id')
    .notNull()
    .references(() => events.id, { onDelete: 'cascade' }),
  row: varchar('row', { length: 5 }).notNull(),
  seatNumber: varchar('seat_number', { length: 10 }).notNull(),
  seatType: seatTypeEnum('seat_type').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  status: seatStatusEnum('status').notNull().default('available'),
  heldByUserId: uuid('held_by_user_id').references(() => users.id),
  heldUntil: timestamp('held_until'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export type Seat = typeof seats.$inferSelect;
export type NewSeat = typeof seats.$inferInsert;
