import { useMyBookings } from '../../hooks/useBooking';
import BookingCard from '../../components/booking/BookingCard';
import Spinner from '../../components/common/Spinner';

export default function MyBookingsPage() {
  const { bookings, loading } = useMyBookings();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">My Bookings</h1>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : bookings.length === 0 ? (
        <p className="text-gray-400">You have no bookings yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bookings.map((b) => (
            <BookingCard key={b.id} booking={b} />
          ))}
        </div>
      )}
    </div>
  );
}
