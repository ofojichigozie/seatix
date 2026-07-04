import api from './api';
import type { ApiResponse } from '../types/service.types';
import type { SeatMap, SeatType } from '../types/seat.types';

interface SeatDto {
  row: string;
  seatNumber: string;
  seatType: SeatType;
  price: number;
}

interface SectionDto {
  name: string;
  seats: SeatDto[];
}

interface HoldSeatsPayload {
  seatIds: string[];
}

export interface HeldSeatsData {
  heldUntil: string;
  seatIds: string[];
}

export const seatsService = {
  getSeatMap: (eventId: string) => api.get<ApiResponse<SeatMap>>(`/events/${eventId}/seats`),

  saveSeatMap: (eventId: string, data: { sections: SectionDto[] }) =>
    api.post<ApiResponse<SeatMap>>(`/events/${eventId}/seats`, data),

  updateSeat: (
    eventId: string,
    seatId: string,
    data: { seatType?: SeatType; price?: number; status?: 'available' | 'blocked' },
  ) => api.patch<ApiResponse<unknown>>(`/events/${eventId}/seats/${seatId}`, data),

  holdSeats: (eventId: string, data: HoldSeatsPayload) =>
    api.post<ApiResponse<HeldSeatsData>>(`/events/${eventId}/seats/hold`, data),

  releaseHolds: (eventId: string) => api.delete<ApiResponse<null>>(`/events/${eventId}/seats/hold`),
};
