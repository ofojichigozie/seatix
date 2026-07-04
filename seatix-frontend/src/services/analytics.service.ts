import api from './api';
import type { ApiResponse } from '../types/service.types';

export interface AnalyticsSummary {
  totalUsers: number;
  totalEvents: number;
  publishedEvents: number;
  confirmedBookings: number;
  totalRevenue: string;
}

export const analyticsService = {
  getSummary: () => api.get<ApiResponse<AnalyticsSummary>>('/analytics'),
};
