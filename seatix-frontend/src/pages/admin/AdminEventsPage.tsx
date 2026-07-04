import { useEvents } from '../../hooks/useEvents';
import { useEventActions } from '../../hooks/useEvents';
import { formatDateTime } from '../../utils/formatDate';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';
import type { EventStatus } from '../../types/event.types';

const statusVariant: Record<EventStatus, 'default' | 'success' | 'warning' | 'danger'> = {
  draft: 'default',
  published: 'success',
};

export default function AdminEventsPage() {
  const { events, loading, refetch } = useEvents(undefined, true);
  const { deleteEvent } = useEventActions();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">All Events</h1>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Title', 'Organizer', 'Category', 'Date', 'Status', 'Actions'].map((h) => (
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
              {events.map((e) => (
                <tr key={e.id} className="hover:bg-gray-50">
                  <td className="max-w-xs truncate px-4 py-3 font-medium text-gray-900">
                    {e.title}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{e.organizerId}</td>
                  <td className="px-4 py-3">
                    <Badge label={e.category} variant="info" />
                  </td>
                  <td className="px-4 py-3 text-gray-500">{formatDateTime(e.eventDate)}</td>
                  <td className="px-4 py-3">
                    <Badge label={e.status} variant={statusVariant[e.status]} />
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => deleteEvent(e.id, refetch)}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Delete
                    </button>
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
