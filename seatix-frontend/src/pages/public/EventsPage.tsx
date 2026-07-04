import { useState } from 'react';
import { useEvents } from '../../hooks/useEvents';
import EventList from '../../components/event/EventList';
import EventFilters from '../../components/event/EventFilters';

interface Filters {
  search: string;
  category: string;
  startDate: string;
  endDate: string;
}

export default function EventsPage() {
  const [filters, setFilters] = useState<Filters>({
    search: '',
    category: '',
    startDate: '',
    endDate: '',
  });

  const { events, total, loading } = useEvents({
    search: filters.search || undefined,
    category: filters.category || undefined,
    startDate: filters.startDate || undefined,
    endDate: filters.endDate || undefined,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">Events</h1>
        <EventFilters value={filters} onChange={setFilters} />
      </div>
      <p className="mb-4 text-sm text-gray-500">{total} event(s) found</p>
      <EventList events={events} loading={loading} />
    </div>
  );
}
