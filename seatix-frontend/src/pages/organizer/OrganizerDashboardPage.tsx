import { Link } from 'react-router-dom';
import { useMyEvents } from '../../hooks/useEvents';
import { useEventActions } from '../../hooks/useEvents';
import { formatDateTime } from '../../utils/formatDate';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';
import type { EventStatus } from '../../types/event.types';

const statusVariant: Record<EventStatus, 'default' | 'success' | 'warning' | 'danger'> = {
  draft: 'default',
  published: 'success',
};

export default function OrganizerDashboardPage() {
  const { events, loading, refetch } = useMyEvents();
  const { publishEvent } = useEventActions();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Events</h1>
        <Link
          to="/organizer/events/new"
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          + Create Event
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : events.length === 0 ? (
        <p className="text-gray-400">No events yet. Create your first event!</p>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <h2 className="font-semibold text-gray-900">{event.title}</h2>
                    <Badge label={event.status} variant={statusVariant[event.status]} />
                  </div>
                  <p className="text-sm text-gray-500">
                    {event.venue} · {formatDateTime(event.eventDate)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 text-sm">
                  <Link
                    to={`/organizer/events/${event.id}/seats`}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-gray-700 hover:bg-gray-50"
                  >
                    Seat Map
                  </Link>
                  <Link
                    to={`/organizer/events/${event.id}/bookings`}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-gray-700 hover:bg-gray-50"
                  >
                    Bookings
                  </Link>
                  <Link
                    to={`/organizer/events/${event.id}/edit`}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-gray-700 hover:bg-gray-50"
                  >
                    Edit
                  </Link>
                  {event.status === 'draft' && (
                    <button
                      onClick={() => publishEvent(event.id, refetch)}
                      className="rounded-lg bg-primary-600 px-3 py-1.5 text-white hover:bg-primary-700"
                    >
                      Publish
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
