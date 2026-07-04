import { IsDateString, IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsIn(['Concert', 'Sports', 'Theatre', 'Conference', 'Comedy', 'Festival', 'Other'])
  category: string;

  @IsString()
  @IsNotEmpty()
  venue: string;

  @IsDateString()
  eventDate: string;
}
