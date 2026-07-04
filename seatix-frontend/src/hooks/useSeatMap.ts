import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { seatsService } from '../services/seats.service';
import { useSeatStore } from '../store/seatStore';
import type { SeatMap, SeatType } from '../types/seat.types';
import { notify } from '../utils/notify';
import { getErrorMessage } from '../utils/error';

interface SeatRow {
  row: string;
  seatCount: number;
  seatType: SeatType;
  price: number;
}

export interface SeatSection {
  name: string;
  rows: SeatRow[];
}

export function useSeatMap(eventId: string) {
  const [seatMap, setSeatMap] = useState<SeatMap | null>(null);
  const [loading, setLoading] = useState(false);
  const [holdLoading, setHoldLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const { selectedSeats, toggleSeat, clearSelection, setHeldUntil } = useSeatStore();
  const navigate = useNavigate();

  const fetch = useCallback(async () => {
    if (!eventId) return;
    setLoading(true);
    try {
      const res = await seatsService.getSeatMap(eventId);
      setSeatMap(res.data.data as SeatMap);
    } catch (err: unknown) {
      notify.error(getErrorMessage(err, 'Failed to load seat map'));
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const holdSeats = async () => {
    if (selectedSeats.length === 0) return;
    setHoldLoading(true);
    try {
      const res = await seatsService.holdSeats(eventId, {
        seatIds: selectedSeats.map((s) => s.id),
      });
      const held = res.data.data;
      if (held) setHeldUntil(held.heldUntil);
      notify.success('Seats held for 10 minutes');
      return held;
    } catch (err: unknown) {
      const message = getErrorMessage(err, 'Failed to hold seats');
      notify.error(message);
    } finally {
      setHoldLoading(false);
    }
  };

  const releaseSeats = async () => {
    try {
      await seatsService.releaseHolds(eventId);
      clearSelection();
    } catch {
      // silent
    }
  };

  const saveSeatMap = async (sections: SeatSection[], redirectTo?: string) => {
    setSaveLoading(true);
    try {
      const payload = {
        sections: sections.map((s) => ({
          name: s.name,
          seats: s.rows.flatMap((row) =>
            Array.from({ length: row.seatCount }, (_, idx) => ({
              row: row.row,
              seatNumber: String(idx + 1),
              seatType: row.seatType,
              price: row.price,
            })),
          ),
        })),
      };
      await seatsService.saveSeatMap(eventId, payload);
      notify.success('Seat map saved');
      if (redirectTo) navigate(redirectTo);
    } catch (err: unknown) {
      notify.error(getErrorMessage(err, 'Failed to save seat map'));
    } finally {
      setSaveLoading(false);
    }
  };

  return {
    seatMap,
    loading,
    holdLoading,
    saveLoading,
    selectedSeats,
    toggleSeat,
    holdSeats,
    releaseSeats,
    saveSeatMap,
    clearSelection,
    refetch: fetch,
  };
}
