import api from './api';
import type { ApiResponse, PaginatedData } from '../types/service.types';
import type { Event } from '../types/event.types';

interface EventsQuery {
  search?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

interface CreateEventPayload {
  title: string;
  description: string;
  category: string;
  venue: string;
  eventDate: string;
}

export const eventsService = {
  getPublished: (params?: EventsQuery) =>
    api.get<ApiResponse<PaginatedData<Event>>>('/events', { params }),

  getAll: (params?: EventsQuery) =>
    api.get<ApiResponse<PaginatedData<Event>>>('/events/all', { params }),

  getMy: () => api.get<ApiResponse<Event[]>>('/events/my'),

  getById: (id: string) => api.get<ApiResponse<Event>>(`/events/${id}`),

  create: (data: CreateEventPayload) => api.post<ApiResponse<Event>>('/events', data),

  update: (id: string, data: Partial<CreateEventPayload>) =>
    api.patch<ApiResponse<Event>>(`/events/${id}`, data),

  remove: (id: string) => api.delete<ApiResponse<null>>(`/events/${id}`),

  publish: (id: string) => api.patch<ApiResponse<Event>>(`/events/${id}/publish`),
};
