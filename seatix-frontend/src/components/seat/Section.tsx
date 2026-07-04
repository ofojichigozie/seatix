import type { Section as SectionType, Seat as SeatType } from '../../types/seat.types';
import Seat from './Seat';

interface SectionProps {
  section: SectionType;
  selectedSeatIds: string[];
  onSeatClick: (seat: SeatType) => void;
  readonly?: boolean;
}

export default function Section({ section, selectedSeatIds, onSeatClick, readonly }: SectionProps) {
  const rows = section.seats.reduce<Record<string, SeatType[]>>((acc, seat) => {
    if (!acc[seat.row]) acc[seat.row] = [];
    acc[seat.row].push(seat);
    return acc;
  }, {});

  return (
    <div className="mb-6">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-600">
        {section.name}
      </h3>
      <div className="space-y-2">
        {Object.entries(rows).map(([row, seats]) => (
          <div key={row} className="flex items-center gap-2">
            <span className="w-5 text-right text-xs font-medium text-gray-400">{row}</span>
            <div className="flex flex-wrap gap-1.5">
              {seats
                .sort((a, b) => Number(a.seatNumber) - Number(b.seatNumber))
                .map((seat) => (
                  <Seat
                    key={seat.id}
                    seat={seat}
                    isSelected={selectedSeatIds.includes(seat.id)}
                    onClick={onSeatClick}
                    readonly={readonly}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
