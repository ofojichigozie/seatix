import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, count, eq, gte, ilike, lte, or } from 'drizzle-orm';
import { DRIZZLE, Database } from '@database/database.module';
import * as schema from '@database/schema';
import { paginate } from '@common/utils/pagination.util';
import { CreateEventDto } from './dto/create-event.dto';
import { QueryEventsDto } from './dto/query-events.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(@Inject(DRIZZLE) private db: Database) {}

  /**
   * Creates a new event owned by the authenticated organizer.
   * Status defaults to 'draft' — the event is not visible publicly until published.
   */
  async create(organizerId: string, dto: CreateEventDto) {
    const [event] = await this.db
      .insert(schema.events)
      .values({ ...dto, organizerId, eventDate: new Date(dto.eventDate) })
      .returning();

    return event;
  }

  /**
   * Public paginated list of all published events.
   * Supports optional text search (title/venue), category filter, and date range.
   * Results are ordered by event date ascending.
   */
  async findPublished(query: QueryEventsDto) {
    const { search, category, startDate, endDate, page = 1, limit = 20 } = query;

    const conditions: any[] = [eq(schema.events.status, 'published')];

    if (search) {
      conditions.push(
        or(ilike(schema.events.title, `%${search}%`), ilike(schema.events.venue, `%${search}%`)),
      );
    }
    if (category) conditions.push(eq(schema.events.category, category));
    if (startDate) conditions.push(gte(schema.events.eventDate, new Date(startDate)));
    if (endDate) conditions.push(lte(schema.events.eventDate, new Date(endDate)));

    const where = and(...conditions);

    const [items, [{ value: total }]] = await Promise.all([
      this.db
        .select()
        .from(schema.events)
        .where(where)
        .limit(limit)
        .offset((page - 1) * limit)
        .orderBy(schema.events.eventDate),
      this.db.select({ value: count() }).from(schema.events).where(where),
    ]);

    return paginate(items, total, page, limit);
  }

  /**
   * Admin-only view of all events regardless of status (draft, published, cancelled).
   * Ordered by creation date descending.
   */
  async findAll(query: QueryEventsDto) {
    const { page = 1, limit = 20 } = query;

    const [items, [{ value: total }]] = await Promise.all([
      this.db
        .select()
        .from(schema.events)
        .limit(limit)
        .offset((page - 1) * limit)
        .orderBy(schema.events.createdAt),
      this.db.select({ value: count() }).from(schema.events),
    ]);

    return paginate(items, total, page, limit);
  }

  /** Returns all events created by the authenticated organizer. */
  async findMyEvents(organizerId: string) {
    return this.db
      .select()
      .from(schema.events)
      .where(eq(schema.events.organizerId, organizerId))
      .orderBy(schema.events.createdAt);
  }

  /** Fetches a single event by ID. Throws 404 if not found. */
  async findById(id: string) {
    const [event] = await this.db.select().from(schema.events).where(eq(schema.events.id, id));

    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  /**
   * Updates an event's fields. Only the owning organizer can edit.
   * eventDate is destructured separately to ensure it's converted to a Date object.
   */
  async update(id: string, organizerId: string, dto: UpdateEventDto) {
    const event = await this.findById(id);
    if (event.organizerId !== organizerId)
      throw new ForbiddenException('You do not own this event');

    const { eventDate, ...rest } = dto;
    const [updated] = await this.db
      .update(schema.events)
      .set({
        ...rest,
        ...(eventDate ? { eventDate: new Date(eventDate) } : {}),
      })
      .where(eq(schema.events.id, id))
      .returning();

    return updated;
  }

  /**
   * Deletes an event. The owning organizer or an admin can do this.
   * Cascades to sections, seats, and bookings via the DB foreign key constraints.
   */
  async remove(id: string, userId: string, role: string) {
    const event = await this.findById(id);

    if (role !== 'admin' && event.organizerId !== userId)
      throw new ForbiddenException('You do not own this event');

    await this.db.delete(schema.events).where(eq(schema.events.id, id));
    return null;
  }

  /**
   * Transitions an event from 'draft' to 'published', making it
   * visible in the public events listing.
   */
  async publish(id: string, organizerId: string) {
    const event = await this.findById(id);
    if (event.organizerId !== organizerId)
      throw new ForbiddenException('You do not own this event');

    const [updated] = await this.db
      .update(schema.events)
      .set({ status: 'published' })
      .where(eq(schema.events.id, id))
      .returning();

    return updated;
  }
}
