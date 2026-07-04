import { Link } from 'react-router-dom';
import type { Booking } from '../../types/booking.types';
import Badge from '../common/Badge';
import { formatDateTime } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';
import { SEAT_TYPE_LABELS } from '../../types/seat.types';

const statusVariant: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
  confirmed: 'success',
  pending: 'warning',
  failed: 'danger',
};

interface BookingCardProps {
  booking: Booking;
}

export default function BookingCard({ booking }: BookingCardProps) {
  const seats = booking.seats ?? [];
  const seatSummary =
    seats.length > 0
      ? seats
          .slice(0, 3)
          .map((s) => `${s.row}${s.seatNumber} (${SEAT_TYPE_LABELS[s.seatType]})`)
          .join(', ') + (seats.length > 3 ? ` +${seats.length - 3} more` : '')
      : `${booking.seats?.length ?? 0} seat(s)`;

  return (
    <Link
      to={`/my-bookings/${booking.id}`}
      className="block rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <p className="font-mono text-xs text-gray-400">#{booking.reference}</p>
          <p className="mt-1 font-semibold text-gray-900">{booking.event?.title ?? '—'}</p>
        </div>
        <Badge label={booking.status} variant={statusVariant[booking.status] ?? 'default'} />
      </div>

      <div className="space-y-1 text-sm text-gray-600">
        {booking.event && <p>📅 {formatDateTime(booking.event.eventDate)}</p>}
        {booking.event && <p>📍 {booking.event.venue}</p>}
        <p className="text-xs text-gray-400">{seatSummary}</p>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
        <span className="font-semibold text-gray-900">
          {formatCurrency(Number(booking.totalAmount))}
        </span>
        <span className="text-xs font-medium text-primary-600">View details →</span>
      </div>
    </Link>
  );
}
