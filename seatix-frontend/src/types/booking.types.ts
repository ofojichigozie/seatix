import type { Seat } from './seat.types';
import type { Event } from './event.types';
import type { User } from './user.types';

export type BookingStatus = 'pending' | 'confirmed' | 'failed';

export interface Booking {
  id: string;
  userId: string;
  eventId: string;
  reference: string;
  totalAmount: string;
  status: BookingStatus;
  paystackReference: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  event?: Pick<Event, 'id' | 'title' | 'venue' | 'eventDate'>;
  seats?: Seat[];
  user?: Pick<User, 'id' | 'name' | 'email'>;
}
