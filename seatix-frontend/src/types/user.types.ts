export type UserRole = 'admin' | 'organizer' | 'attendee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string | null;
  isActive: boolean;
  createdAt: string;
}
