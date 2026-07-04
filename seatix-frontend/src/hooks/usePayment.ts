import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { paymentsService } from '../services/payments.service';
import { useSeatStore } from '../store/seatStore';
import { notify } from '../utils/notify';
import { getErrorMessage } from '../utils/error';

export function usePayment() {
  const [loading, setLoading] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState<'idle' | 'loading' | 'success' | 'failed'>(
    'idle',
  );
  const clearSelection = useSeatStore((s) => s.clearSelection);
  const navigate = useNavigate();

  const initializePayment = async (eventId: string, seatIds: string[]) => {
    setLoading(true);
    try {
      const res = await paymentsService.initialize({ eventId, seatIds });
      const authUrl = res.data.data?.authorizationUrl;
      if (authUrl) window.location.href = authUrl;
    } catch (err: unknown) {
      notify.error(getErrorMessage(err, 'Payment initialization failed'));
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async (reference: string) => {
    setVerifyStatus('loading');
    try {
      await paymentsService.verify({ reference });
      setVerifyStatus('success');
      clearSelection();
      setTimeout(() => navigate('/my-bookings'), 2500);
    } catch (err: unknown) {
      setVerifyStatus('failed');
      notify.error(getErrorMessage(err, 'Payment verification failed'));
    }
  };

  return { loading, verifyStatus, initializePayment, verifyPayment };
}
