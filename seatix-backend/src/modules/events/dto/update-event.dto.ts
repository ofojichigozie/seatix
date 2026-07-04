import { IsDateString, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateEventDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsString()
  @IsIn(['Concert', 'Sports', 'Theatre', 'Conference', 'Comedy', 'Festival', 'Other'])
  category?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  venue?: string;

  @IsOptional()
  @IsDateString()
  eventDate?: string;
}
