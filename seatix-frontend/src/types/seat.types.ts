export type SeatType = 'vip' | 'regular' | 'economy' | 'disabled';
export type SeatStatus = 'available' | 'held' | 'booked' | 'blocked';

export interface Seat {
  id: string;
  sectionId: string;
  eventId: string;
  row: string;
  seatNumber: string;
  seatType: SeatType;
  price: string;
  status: SeatStatus;
  heldByUserId: string | null;
  heldUntil: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Section {
  id: string;
  eventId: string;
  name: string;
  createdAt: string;
  seats: Seat[];
}

export interface SeatMap {
  event: {
    id: string;
    title: string;
    venue: string;
    eventDate: string;
    status: string;
  };
  sections: Section[];
}

export const SEAT_TYPE_COLORS: Record<SeatType, string> = {
  vip: '#A855F7',
  regular: '#3B82F6',
  economy: '#22C55E',
  disabled: '#FB923C',
};

export const SEAT_TYPE_LABELS: Record<SeatType, string> = {
  vip: 'VIP',
  regular: 'Regular',
  economy: 'Economy',
  disabled: 'Accessible',
};
