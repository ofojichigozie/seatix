import { useState, useEffect, useCallback } from 'react';
import { bookingsService } from '../services/bookings.service';
import type { Booking } from '../types/booking.types';
import { notify } from '../utils/notify';
import { getErrorMessage } from '../utils/error';

// ── Attendee's own bookings ───────────────────────────────────────────────────
export function useMyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await bookingsService.getMy();
      setBookings(res.data.data ?? []);
    } catch (err: unknown) {
      notify.error(getErrorMessage(err, 'Failed to load bookings'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { bookings, loading, refetch: fetch };
}

// ── Single booking detail ─────────────────────────────────────────────────────
export function useBookingDetail(id: string) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await bookingsService.getById(id);
      setBooking(res.data.data ?? null);
    } catch (err: unknown) {
      notify.error(getErrorMessage(err, 'Failed to load booking'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { booking, loading };
}

// ── Bookings for a specific event (organizer/admin view) ─────────────────────
export function useEventBookings(eventId: string) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    if (!eventId) return;
    setLoading(true);
    try {
      const res = await bookingsService.getByEvent(eventId);
      setBookings(res.data.data ?? []);
    } catch (err: unknown) {
      notify.error(getErrorMessage(err, 'Failed to load bookings'));
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { bookings, loading, refetch: fetch };
}
