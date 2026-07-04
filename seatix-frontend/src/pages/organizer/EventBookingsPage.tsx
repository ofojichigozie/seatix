import { useParams } from 'react-router-dom';
import { useEventBookings } from '../../hooks/useBooking';
import { formatDateTime } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';

const statusVariant: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
  confirmed: 'success',
  pending: 'warning',
  cancelled: 'danger',
  failed: 'danger',
};

export default function EventBookingsPage() {
  const { id } = useParams<{ id: string }>();
  const { bookings, loading } = useEventBookings(id!);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Event Bookings</h1>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : bookings.length === 0 ? (
        <p className="text-gray-400">No bookings for this event yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Reference', 'Attendee', 'Seats', 'Date', 'Amount', 'Status'].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">#{b.reference}</td>
                  <td className="px-4 py-3 text-gray-700">{b.user?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-700">{b.seats?.length ?? 0}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {b.event ? formatDateTime(b.event.eventDate) : '—'}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {formatCurrency(Number(b.totalAmount))}
                  </td>
                  <td className="px-4 py-3">
                    <Badge label={b.status} variant={statusVariant[b.status] ?? 'default'} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
