import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateSeatDto {
  @IsOptional()
  @IsEnum(['vip', 'regular', 'economy', 'disabled'])
  seatType?: 'vip' | 'regular' | 'economy' | 'disabled';

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsEnum(['available', 'blocked'])
  status?: 'available' | 'blocked';
}
