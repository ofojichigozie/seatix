import { useParams, useNavigate, Link } from 'react-router-dom';
import { useBookingDetail } from '../../hooks/useBooking';
import { formatDateTime } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';
import { printTicket } from '../../utils/printTicket';
import { SEAT_TYPE_COLORS, SEAT_TYPE_LABELS } from '../../types/seat.types';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';

const statusVariant: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
  confirmed: 'success',
  pending: 'warning',
  failed: 'danger',
};

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { booking, loading } = useBookingDetail(id!);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="py-16 text-center text-gray-400">
        Booking not found.{' '}
        <Link to="/my-bookings" className="text-primary-600 hover:underline">
          Back to bookings
        </Link>
      </div>
    );
  }

  const seats = booking.seats ?? [];
  const total = Number(booking.totalAmount);
  const isConfirmed = booking.status === 'confirmed';

  return (
    <div className="max-w-2xl">
      {/* Back */}
      <button
        onClick={() => navigate('/my-bookings')}
        className="mb-6 flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        My Bookings
      </button>

      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs text-gray-400">#{booking.reference}</p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">
            {booking.event?.title ?? 'Booking Details'}
          </h1>
          {booking.event && (
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
              <span>📍 {booking.event.venue}</span>
              <span>📅 {formatDateTime(booking.event.eventDate)}</span>
            </div>
          )}
        </div>
        <Badge label={booking.status} variant={statusVariant[booking.status] ?? 'default'} />
      </div>

      {/* Seat cards */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700">
          {seats.length} Ticket{seats.length !== 1 ? 's' : ''}
        </h2>
        {isConfirmed && seats.length > 1 && (
          <span className="text-xs text-gray-400">Each ticket can be printed individually</span>
        )}
      </div>

      {seats.length === 0 ? (
        <p className="rounded-xl border border-gray-200 bg-white px-5 py-4 text-sm text-gray-400">
          No seat details available.
        </p>
      ) : (
        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          {seats.map((seat) => (
            <div
              key={seat.id}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
            >
              {/* Colored top strip */}
              <div
                className="h-1.5 w-full"
                style={{ backgroundColor: SEAT_TYPE_COLORS[seat.seatType] }}
              />
              <div className="p-4">
                {/* Seat number + type */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                      Seat
                    </p>
                    <p className="mt-0.5 text-3xl font-extrabold leading-none tracking-tight text-gray-900">
                      {seat.row}
                      {seat.seatNumber}
                    </p>
                  </div>
                  <span
                    className="mt-1 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
                    style={{
                      backgroundColor: SEAT_TYPE_COLORS[seat.seatType] + '20',
                      color: SEAT_TYPE_COLORS[seat.seatType],
                    }}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: SEAT_TYPE_COLORS[seat.seatType] }}
                    />
                    {SEAT_TYPE_LABELS[seat.seatType]}
                  </span>
                </div>

                {/* Divider */}
                <div className="my-3 border-t border-dashed border-gray-200" />

                {/* Price + print */}
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(Number(seat.price))}
                  </span>
                  {isConfirmed && (
                    <button
                      onClick={() => printTicket(seat, booking)}
                      className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 active:bg-gray-100"
                    >
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                        />
                      </svg>
                      Print
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Total */}
      <div className="rounded-xl border border-gray-200 bg-white px-5 py-4">
        <p className="text-xs text-gray-400">Total paid</p>
        <p className="text-xl font-bold text-gray-900">{formatCurrency(total)}</p>
      </div>
    </div>
  );
}
