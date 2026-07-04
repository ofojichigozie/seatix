import { create } from 'zustand';
import type { Seat } from '../types/seat.types';

interface SeatStoreState {
  selectedSeats: Seat[];
  heldUntil: string | null;
  selectSeat: (seat: Seat) => void;
  deselectSeat: (seatId: string) => void;
  toggleSeat: (seat: Seat) => void;
  setHeldUntil: (heldUntil: string) => void;
  clearSelection: () => void;
}

export const useSeatStore = create<SeatStoreState>((set, get) => ({
  selectedSeats: [],
  heldUntil: null,

  selectSeat: (seat) => set((state) => ({ selectedSeats: [...state.selectedSeats, seat] })),

  deselectSeat: (seatId) =>
    set((state) => ({
      selectedSeats: state.selectedSeats.filter((s) => s.id !== seatId),
    })),

  toggleSeat: (seat) => {
    const { selectedSeats, selectSeat, deselectSeat } = get();
    const isSelected = selectedSeats.some((s) => s.id === seat.id);
    if (isSelected) deselectSeat(seat.id);
    else selectSeat(seat);
  },

  setHeldUntil: (heldUntil) => set({ heldUntil }),

  clearSelection: () => set({ selectedSeats: [], heldUntil: null }),
}));
