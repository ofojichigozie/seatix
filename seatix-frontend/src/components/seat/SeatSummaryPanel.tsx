import { Link } from 'react-router-dom';
import type { Seat } from '../../types/seat.types';
import { SEAT_TYPE_LABELS } from '../../types/seat.types';
import { formatCurrency } from '../../utils/formatCurrency';
import Spinner from '../common/Spinner';

interface SeatSummaryPanelProps {
  selectedSeats: Seat[];
  onProceed: () => void;
  loading?: boolean;
  heldUntil?: string | null;
  isAuthenticated?: boolean;
  loginPath?: string;
}

export default function SeatSummaryPanel({
  selectedSeats,
  onProceed,
  loading,
  heldUntil,
  isAuthenticated = true,
  loginPath = '/login',
}: SeatSummaryPanelProps) {
  const total = selectedSeats.reduce((sum, s) => sum + Number(s.price), 0);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <h3 className="mb-4 text-base font-semibold text-gray-900">Selected Seats</h3>

      {selectedSeats.length === 0 ? (
        <p className="text-sm text-gray-400">No seats selected</p>
      ) : (
        <>
          <ul className="mb-4 space-y-2">
            {selectedSeats.map((seat) => (
              <li key={seat.id} className="flex items-center justify-between text-sm">
                <span className="text-gray-700">
                  {seat.row}
                  {seat.seatNumber} — {SEAT_TYPE_LABELS[seat.seatType]}
                </span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(Number(seat.price))}
                </span>
              </li>
            ))}
          </ul>

          <div className="mb-4 flex justify-between border-t border-gray-100 pt-3 text-sm font-semibold text-gray-900">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>

          {heldUntil && (
            <p className="mb-3 text-xs text-yellow-600">
              Seats held until {new Date(heldUntil).toLocaleTimeString()}
            </p>
          )}

          {isAuthenticated ? (
            <button
              onClick={onProceed}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-60"
            >
              {loading && <Spinner size="sm" />}
              Proceed to Payment
            </button>
          ) : (
            <div className="rounded-lg border border-primary-100 bg-primary-50 p-3 text-center">
              <p className="mb-2 text-xs text-gray-600">You need to be logged in to book seats.</p>
              <Link
                to={loginPath}
                className="inline-block rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
              >
                Log in to Continue
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
