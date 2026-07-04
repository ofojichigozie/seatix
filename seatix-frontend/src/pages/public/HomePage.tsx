import { Link } from 'react-router-dom';
import { useEvents } from '../../hooks/useEvents';
import EventList from '../../components/event/EventList';

export default function HomePage() {
  const { events, loading } = useEvents({ limit: 6 });

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 py-20 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h1 className="mb-4 text-4xl font-bold sm:text-5xl">Book Seats for Events You Love</h1>
          <p className="mb-8 text-lg text-primary-100">
            Discover concerts, conferences, theatre shows and more. Pick your seat, pay instantly.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/events"
              className="rounded-xl bg-white px-8 py-3 font-semibold text-primary-700 hover:bg-primary-50"
            >
              Browse Events
            </Link>
            <Link
              to="/register"
              className="rounded-xl border border-white px-8 py-3 font-semibold text-white hover:bg-primary-500"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Featured events */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
          <Link to="/events" className="text-sm font-medium text-primary-600 hover:underline">
            View all →
          </Link>
        </div>
        <EventList events={events} loading={loading} />
      </section>
    </div>
  );
}
