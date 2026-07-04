import api from './api';
import type { ApiResponse, PaginatedData } from '../types/service.types';
import type { User } from '../types/user.types';

interface UpdateProfilePayload {
  name?: string;
  phone?: string;
}

export const usersService = {
  getMe: () => api.get<ApiResponse<User>>('/users/me'),

  updateMe: (data: UpdateProfilePayload) => api.patch<ApiResponse<User>>('/users/me', data),

  getAll: (params?: { role?: string; isActive?: boolean; page?: number; limit?: number }) =>
    api.get<ApiResponse<PaginatedData<User>>>('/users', { params }),

  getById: (id: string) => api.get<ApiResponse<User>>(`/users/${id}`),

  updateStatus: (id: string, isActive: boolean) =>
    api.patch<ApiResponse<User>>(`/users/${id}/status`, undefined, { params: { isActive } }),

  remove: (id: string) => api.delete<ApiResponse<null>>(`/users/${id}`),
};
