import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { DRIZZLE, Database } from '@database/database.module';
import * as schema from '@database/schema';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DRIZZLE) private db: Database,
    private jwtService: JwtService,
  ) {}

  /**
   * Registers a new user. Organizers are set as inactive (isActive: false)
   * and must be approved by an admin before they can log in.
   * Attendees are active immediately upon registration.
   */
  async register(dto: RegisterDto) {
    const [existing] = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, dto.email));

    if (existing) throw new ConflictException('Email is already registered');

    const hashed = await bcrypt.hash(dto.password, 10);

    const [user] = await this.db
      .insert(schema.users)
      .values({
        ...dto,
        password: hashed,
        isActive: dto.role === 'organizer' ? false : true,
      })
      .returning();

    const { password, ...result } = user;
    return result;
  }

  /**
   * Validates credentials and returns a signed JWT along with the user object.
   * Throws 401 for wrong credentials, 403 if the account is inactive.
   * Inactive organizers receive a specific pending-approval message.
   */
  async login(dto: LoginDto) {
    const [user] = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, dto.email));

    if (!user) throw new UnauthorizedException('Invalid email or password');

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid email or password');

    if (!user.isActive) {
      const message =
        user.role === 'organizer'
          ? 'Your organizer account is pending admin approval'
          : 'Your account has been suspended';
      throw new ForbiddenException(message);
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    const { password, ...userData } = user;
    return { token, user: userData };
  }
}
