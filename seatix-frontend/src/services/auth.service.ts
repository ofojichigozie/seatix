import api from './api';
import type { ApiResponse } from '../types/service.types';
import type { User } from '../types/user.types';

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: 'attendee' | 'organizer';
}

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginData {
  token: string;
  user: User;
}

export const authService = {
  register: (data: RegisterPayload) => api.post<ApiResponse<User>>('/auth/register', data),

  login: (data: LoginPayload) => api.post<ApiResponse<LoginData>>('/auth/login', data),

  logout: () => api.post<ApiResponse<null>>('/auth/logout'),
};
