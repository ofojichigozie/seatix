import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class SeatDto {
  @IsString()
  @IsNotEmpty()
  row: string;

  @IsString()
  @IsNotEmpty()
  seatNumber: string;

  @IsEnum(['vip', 'regular', 'economy', 'disabled'])
  seatType: 'vip' | 'regular' | 'economy' | 'disabled';

  @IsNumber()
  @Min(0)
  price: number;
}

export class SectionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SeatDto)
  seats: SeatDto[];
}

export class CreateSeatMapDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SectionDto)
  sections: SectionDto[];
}
