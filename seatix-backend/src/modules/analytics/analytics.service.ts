import { Inject, Injectable } from '@nestjs/common';
import { count, eq, sum } from 'drizzle-orm';
import { DRIZZLE, Database } from '@database/database.module';
import * as schema from '@database/schema';

@Injectable()
export class AnalyticsService {
  constructor(@Inject(DRIZZLE) private db: Database) {}

  /**
   * Runs 5 aggregate queries in parallel using Promise.all for efficiency.
   * Returns platform-wide counts and total confirmed revenue.
   * totalRevenue comes from Drizzle's sum() which returns a string or null —
   * falls back to '0.00' if there are no confirmed bookings yet.
   */
  async getSummary() {
    const [
      [{ totalUsers }],
      [{ totalEvents }],
      [{ publishedEvents }],
      [{ confirmedBookings }],
      [{ totalRevenue }],
    ] = await Promise.all([
      this.db.select({ totalUsers: count() }).from(schema.users),
      this.db.select({ totalEvents: count() }).from(schema.events),
      this.db
        .select({ publishedEvents: count() })
        .from(schema.events)
        .where(eq(schema.events.status, 'published')),
      this.db
        .select({ confirmedBookings: count() })
        .from(schema.bookings)
        .where(eq(schema.bookings.status, 'confirmed')),
      this.db
        .select({ totalRevenue: sum(schema.bookings.totalAmount) })
        .from(schema.bookings)
        .where(eq(schema.bookings.status, 'confirmed')),
    ]);

    return {
      totalUsers,
      totalEvents,
      publishedEvents,
      confirmedBookings,
      totalRevenue: totalRevenue ?? '0.00',
    };
  }
}
