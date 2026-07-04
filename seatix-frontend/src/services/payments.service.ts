import api from './api';
import type { ApiResponse } from '../types/service.types';

export interface InitializePayload {
  eventId: string;
  seatIds: string[];
}

export interface InitializeData {
  authorizationUrl: string;
  reference: string;
  bookingId: string;
}

export const paymentsService = {
  initialize: (data: InitializePayload) =>
    api.post<ApiResponse<InitializeData>>('/payments/initialize', data),

  verify: (data: { reference: string }) => api.post<ApiResponse<unknown>>('/payments/verify', data),
};
