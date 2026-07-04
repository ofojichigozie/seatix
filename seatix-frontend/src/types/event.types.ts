export type EventStatus = 'draft' | 'published';

export interface Event {
  id: string;
  organizerId: string;
  title: string;
  description: string;
  category: string;
  venue: string;
  eventDate: string;
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
}

export const EVENT_CATEGORIES = [
  'Concert',
  'Sports',
  'Theatre',
  'Conference',
  'Festival',
  'Comedy',
  'Exhibition',
  'Other',
] as const;

export type EventCategory = (typeof EVENT_CATEGORIES)[number];
