import { SEAT_TYPE_COLORS, SEAT_TYPE_LABELS } from '../../types/seat.types';
import type { SeatType, Section } from '../../types/seat.types';

const SEAT_TYPES: SeatType[] = ['vip', 'regular', 'economy'];

interface SeatLegendProps {
  sections?: Section[];
}

export default function SeatLegend({ sections }: SeatLegendProps) {
  return (
    <div className="flex flex-wrap gap-4 rounded-xl border border-gray-200 bg-white p-4 text-xs">
      {sections && sections.length > 0
        ? sections.map((section) => {
            const firstSeat = section.seats?.[0];
            const color = firstSeat ? SEAT_TYPE_COLORS[firstSeat.seatType] : '#6B7280';
            const typeLabel = firstSeat ? SEAT_TYPE_LABELS[firstSeat.seatType] : '';
            return (
              <div key={section.id} className="flex items-center gap-1.5">
                <span className="h-4 w-4 rounded" style={{ backgroundColor: color }} />
                <span className="text-gray-600">
                  {section.name}
                  {typeLabel ? <span className="ml-1 text-gray-400">({typeLabel})</span> : null}
                </span>
              </div>
            );
          })
        : SEAT_TYPES.map((type) => (
            <div key={type} className="flex items-center gap-1.5">
              <span
                className="h-4 w-4 rounded"
                style={{ backgroundColor: SEAT_TYPE_COLORS[type] }}
              />
              <span className="text-gray-600">{SEAT_TYPE_LABELS[type]}</span>
            </div>
          ))}
      <div className="h-4 w-px self-center bg-gray-200 max-sm:hidden" />
      <div className="flex items-center gap-1.5">
        <span className="h-4 w-4 rounded bg-yellow-400" />
        <span className="text-gray-600">Held (10 min)</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="h-4 w-4 rounded bg-gray-400" />
        <span className="text-gray-600">Booked</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="h-4 w-4 rounded bg-gray-700" />
        <span className="text-gray-600">Blocked</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="h-4 w-4 rounded bg-primary-600 ring-2 ring-primary-600" />
        <span className="text-gray-600">Selected</span>
      </div>
    </div>
  );
}
