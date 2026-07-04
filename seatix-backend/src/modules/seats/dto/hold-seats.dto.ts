import { IsArray, IsUUID } from 'class-validator';

export class HoldSeatsDto {
  @IsArray()
  @IsUUID('4', { each: true })
  seatIds: string[];
}
