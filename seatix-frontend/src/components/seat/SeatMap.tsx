import type { SeatMap as SeatMapType, Seat } from '../../types/seat.types';
import Section from './Section';

interface SeatMapProps {
  seatMap: SeatMapType;
  selectedSeatIds: string[];
  onSeatClick: (seat: Seat) => void;
  readonly?: boolean;
}

export default function SeatMap({ seatMap, selectedSeatIds, onSeatClick, readonly }: SeatMapProps) {
  if (!seatMap.sections || seatMap.sections.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-400">
        No seats configured for this event.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-gray-50 p-6">
      <div className="mb-6 flex flex-col items-center gap-1">
        <div className="w-full max-w-sm rounded-b-[50%] border border-gray-300 bg-gradient-to-b from-gray-200 to-gray-100 py-2 text-center text-xs font-medium uppercase tracking-widest text-gray-500 shadow-sm">
          Stage / Screen
        </div>
        <div className="h-2 w-16 rounded-b-full bg-gray-200" />
      </div>
      {seatMap.sections.map((section) => (
        <Section
          key={section.id}
          section={section}
          selectedSeatIds={selectedSeatIds}
          onSeatClick={onSeatClick}
          readonly={readonly}
        />
      ))}
    </div>
  );
}
