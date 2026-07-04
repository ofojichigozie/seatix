import api from './api';
import type { ApiResponse, PaginatedData } from '../types/service.types';
import type { Booking } from '../types/booking.types';

export const bookingsService = {
  getMy: () => api.get<ApiResponse<Booking[]>>('/bookings'),

  getAll: (page = 1, limit = 20) =>
    api.get<ApiResponse<PaginatedData<Booking>>>('/bookings/all', { params: { page, limit } }),

  getById: (id: string) => api.get<ApiResponse<Booking>>(`/bookings/${id}`),

  getByEvent: (eventId: string) => api.get<ApiResponse<Booking[]>>(`/bookings/event/${eventId}`),
};
