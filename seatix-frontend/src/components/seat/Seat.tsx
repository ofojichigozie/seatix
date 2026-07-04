import { cn } from '../../utils/cn';
import type { Seat as SeatType } from '../../types/seat.types';
import { SEAT_TYPE_COLORS } from '../../types/seat.types';

interface SeatProps {
  seat: SeatType;
  isSelected: boolean;
  onClick: (seat: SeatType) => void;
  readonly?: boolean;
}

export default function Seat({ seat, isSelected, onClick, readonly }: SeatProps) {
  const isUnavailable =
    seat.status === 'booked' || seat.status === 'held' || seat.status === 'blocked';

  const getStyle = (): React.CSSProperties => {
    if (seat.status === 'blocked') return { backgroundColor: '#374151', borderColor: '#374151' };
    if (seat.status === 'booked') return { backgroundColor: '#9CA3AF', borderColor: '#9CA3AF' };
    if (seat.status === 'held') return { backgroundColor: '#FACC15', borderColor: '#FACC15' };
    if (isSelected) return { backgroundColor: '#2563EB', borderColor: '#2563EB' };
    return {
      backgroundColor: SEAT_TYPE_COLORS[seat.seatType],
      borderColor: SEAT_TYPE_COLORS[seat.seatType],
    };
  };

  return (
    <button
      title={`${seat.row}${seat.seatNumber} — ${seat.seatType}`}
      disabled={isUnavailable || readonly}
      onClick={() => !isUnavailable && !readonly && onClick(seat)}
      style={getStyle()}
      className={cn(
        'flex h-7 w-7 items-center justify-center rounded-md border text-[10px] font-medium text-white transition-all',
        isUnavailable
          ? 'cursor-not-allowed opacity-60'
          : readonly
            ? 'cursor-default'
            : 'hover:opacity-90',
        isSelected && 'ring-2 ring-primary-600',
      )}
    >
      {seat.seatNumber}
    </button>
  );
}
