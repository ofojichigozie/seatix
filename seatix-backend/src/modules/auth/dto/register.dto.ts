import { IsEmail, IsNotEmpty, IsEnum, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(['attendee', 'organizer'])
  role: 'attendee' | 'organizer';
}
