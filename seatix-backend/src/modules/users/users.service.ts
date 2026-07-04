import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, count, eq } from 'drizzle-orm';
import { DRIZZLE, Database } from '@database/database.module';
import * as schema from '@database/schema';
import { paginate } from '@common/utils/pagination.util';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUsersDto } from './dto/query-users.dto';

@Injectable()
export class UsersService {
  constructor(@Inject(DRIZZLE) private db: Database) {}

  /**
   * Returns the profile of the currently authenticated user.
   * Password is excluded via an explicit column select.
   */
  async findMe(userId: string) {
    const [user] = await this.db
      .select({
        id: schema.users.id,
        name: schema.users.name,
        email: schema.users.email,
        role: schema.users.role,
        phone: schema.users.phone,
        isActive: schema.users.isActive,
        createdAt: schema.users.createdAt,
      })
      .from(schema.users)
      .where(eq(schema.users.id, userId));

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  /** Updates the authenticated user's own name and/or phone number. */
  async updateMe(userId: string, dto: UpdateUserDto) {
    const [user] = await this.db
      .update(schema.users)
      .set(dto)
      .where(eq(schema.users.id, userId))
      .returning({
        id: schema.users.id,
        name: schema.users.name,
        email: schema.users.email,
        role: schema.users.role,
        phone: schema.users.phone,
        isActive: schema.users.isActive,
        createdAt: schema.users.createdAt,
      });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  /**
   * Admin-only paginated list of all users.
   * Supports optional filtering by role and/or isActive status.
   * Queries the count and items in parallel for efficiency.
   */
  async findAll(query: QueryUsersDto) {
    const { role, isActive, page = 1, limit = 20 } = query;

    const conditions: any[] = [];
    if (role) conditions.push(eq(schema.users.role, role));
    if (isActive !== undefined) conditions.push(eq(schema.users.isActive, isActive));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [items, [{ value: total }]] = await Promise.all([
      this.db
        .select({
          id: schema.users.id,
          name: schema.users.name,
          email: schema.users.email,
          role: schema.users.role,
          phone: schema.users.phone,
          isActive: schema.users.isActive,
          createdAt: schema.users.createdAt,
        })
        .from(schema.users)
        .where(where)
        .limit(limit)
        .offset((page - 1) * limit),
      this.db.select({ value: count() }).from(schema.users).where(where),
    ]);

    return paginate(items, total, page, limit);
  }

  /** Fetches a single user by ID. Used by admin endpoints. */
  async findById(id: string) {
    const [user] = await this.db
      .select({
        id: schema.users.id,
        name: schema.users.name,
        email: schema.users.email,
        role: schema.users.role,
        phone: schema.users.phone,
        isActive: schema.users.isActive,
        createdAt: schema.users.createdAt,
      })
      .from(schema.users)
      .where(eq(schema.users.id, id));

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  /**
   * Admin toggles a user's active status.
   * Setting isActive=true on an organizer effectively approves their account.
   * Setting isActive=false suspends them from logging in.
   */
  async updateStatus(id: string, isActive: boolean) {
    const [user] = await this.db
      .update(schema.users)
      .set({ isActive })
      .where(eq(schema.users.id, id))
      .returning({
        id: schema.users.id,
        name: schema.users.name,
        email: schema.users.email,
        role: schema.users.role,
        isActive: schema.users.isActive,
      });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  /** Hard-deletes a user from the database. Admin only. */
  async remove(id: string) {
    const [user] = await this.db
      .delete(schema.users)
      .where(eq(schema.users.id, id))
      .returning({ id: schema.users.id });

    if (!user) throw new NotFoundException('User not found');
    return null;
  }
}
