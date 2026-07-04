import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePayment } from '../../hooks/usePayment';
import Spinner from '../../components/common/Spinner';

export default function PaymentCallbackPage() {
  const [params] = useSearchParams();
  const reference = params.get('reference');
  const { verifyStatus, verifyPayment } = usePayment();

  useEffect(() => {
    if (reference) verifyPayment(reference);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reference]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-50 px-4">
      {(verifyStatus === 'idle' || verifyStatus === 'loading') && (
        <>
          <Spinner size="lg" />
          <p className="text-gray-600">Verifying payment…</p>
        </>
      )}

      {verifyStatus === 'success' && (
        <div className="max-w-md text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Payment Successful!</h1>
          <p className="text-gray-500">Your booking is confirmed. Redirecting to your bookings…</p>
        </div>
      )}

      {verifyStatus === 'failed' && (
        <div className="max-w-md text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Payment Failed</h1>
          <p className="mb-6 text-gray-500">
            Something went wrong. Your seats have not been booked.
          </p>
          <button
            onClick={() => history.back()}
            className="rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
