import { IsArray, IsUUID } from 'class-validator';

export class InitializePaymentDto {
  @IsUUID('4')
  eventId: string;

  @IsArray()
  @IsUUID('4', { each: true })
  seatIds: string[];
}
