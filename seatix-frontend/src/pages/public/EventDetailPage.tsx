import { useParams } from 'react-router-dom';
import { useEventDetail } from '../../hooks/useEvents';
import { useSeatMap } from '../../hooks/useSeatMap';
import { usePayment } from '../../hooks/usePayment';
import { useAuthStore } from '../../store/authStore';
import { useSeatStore } from '../../store/seatStore';
import { formatDateTime } from '../../utils/formatDate';
import SeatMap from '../../components/seat/SeatMap';
import SeatLegend from '../../components/seat/SeatLegend';
import SeatSummaryPanel from '../../components/seat/SeatSummaryPanel';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuthStore();

  const { event, loading: evtLoading } = useEventDetail(id!);
  const {
    seatMap,
    loading: mapLoading,
    selectedSeats,
    toggleSeat,
    holdSeats,
    holdLoading,
  } = useSeatMap(id!);
  const heldUntil = useSeatStore((s) => s.heldUntil);
  const { loading: payLoading, initializePayment } = usePayment();

  const handleProceed = async () => {
    const held = await holdSeats();
    if (!held) return;
    await initializePayment(
      id!,
      selectedSeats.map((s) => s.id),
    );
  };

  if (evtLoading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!event) {
    return <div className="py-24 text-center text-gray-500">Event not found</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Event header */}
      <div className="mb-8">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge label={event.category} variant="info" />
          <Badge
            label={event.status}
            variant={event.status === 'published' ? 'success' : 'default'}
          />
        </div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900">{event.title}</h1>
        <p className="mb-4 text-gray-600">{event.description}</p>
        <div className="flex flex-wrap gap-6 text-sm text-gray-600">
          <span>📍 {event.venue}</span>
          <span>📅 {formatDateTime(event.eventDate)}</span>
        </div>
      </div>

      {/* Seat map + summary */}
      <div className="mb-6">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Select Seats</h2>
        <SeatLegend sections={seatMap?.sections} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {mapLoading ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : seatMap ? (
          <SeatMap
            seatMap={seatMap}
            selectedSeatIds={selectedSeats.map((s) => s.id)}
            onSeatClick={toggleSeat}
          />
        ) : (
          <p className="text-gray-400">No seat map configured yet.</p>
        )}

        <SeatSummaryPanel
          selectedSeats={selectedSeats}
          onProceed={handleProceed}
          loading={holdLoading || payLoading}
          heldUntil={heldUntil}
          isAuthenticated={isAuthenticated}
          loginPath={`/login?redirect=/events/${id}`}
        />
      </div>
    </div>
  );
}
