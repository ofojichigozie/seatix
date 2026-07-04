import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventsService } from '../services/events.service';
import type { Event } from '../types/event.types';
import type { PaginatedData } from '../types/service.types';
import { notify } from '../utils/notify';
import { getErrorMessage } from '../utils/error';

interface EventsQuery {
  search?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

interface EventPayload {
  title: string;
  description: string;
  category: string;
  venue: string;
  eventDate: string;
}

// ── List (published or all) ───────────────────────────────────────────────────
export function useEvents(query?: EventsQuery, fetchAll = false) {
  const [data, setData] = useState<PaginatedData<Event> | null>(null);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = fetchAll
        ? await eventsService.getAll(query)
        : await eventsService.getPublished(query);
      setData(res.data.data as PaginatedData<Event>);
    } catch (err: unknown) {
      notify.error(getErrorMessage(err, 'Failed to load events'));
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(query), fetchAll]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { events: data?.items ?? [], total: data?.total ?? 0, loading, refetch: fetch };
}

// ── Organizer's own events ────────────────────────────────────────────────────
export function useMyEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await eventsService.getMy();
      setEvents(res.data.data ?? []);
    } catch (err: unknown) {
      notify.error(getErrorMessage(err, 'Failed to load your events'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { events, loading, refetch: fetch };
}

// ── Single event detail ───────────────────────────────────────────────────────
export function useEventDetail(id: string) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await eventsService.getById(id);
      setEvent(res.data.data ?? null);
    } catch (err: unknown) {
      notify.error(getErrorMessage(err, 'Failed to load event'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { event, loading, refetch: fetch };
}

// ── Mutations (create / update / publish / cancel / delete) ──────────────────
export function useEventActions() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const createEvent = async (data: EventPayload, redirectAfter?: (id: string) => string) => {
    setLoading(true);
    try {
      const res = await eventsService.create(data);
      const event = res.data.data;
      notify.success('Event created! Set up the seat map next.');
      if (event && redirectAfter) navigate(redirectAfter(event.id));
      return event;
    } catch (err: unknown) {
      notify.error(getErrorMessage(err, 'Failed to create event'));
    } finally {
      setLoading(false);
    }
  };

  const updateEvent = async (id: string, data: Partial<EventPayload>, redirectTo?: string) => {
    setLoading(true);
    try {
      await eventsService.update(id, data);
      notify.success('Event updated');
      if (redirectTo) navigate(redirectTo);
    } catch (err: unknown) {
      notify.error(getErrorMessage(err, 'Failed to update event'));
    } finally {
      setLoading(false);
    }
  };

  const publishEvent = async (id: string, onSuccess?: () => void) => {
    try {
      await eventsService.publish(id);
      notify.success('Event published');
      onSuccess?.();
    } catch (err: unknown) {
      notify.error(getErrorMessage(err, 'Failed to publish event'));
    }
  };

  const deleteEvent = async (id: string, onSuccess?: () => void) => {
    try {
      await eventsService.remove(id);
      notify.success('Event deleted');
      onSuccess?.();
    } catch (err: unknown) {
      notify.error(getErrorMessage(err, 'Failed to delete event'));
    }
  };

  return { createEvent, updateEvent, publishEvent, deleteEvent, loading };
}
