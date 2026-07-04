import { useState, useEffect, useCallback } from 'react';
import { analyticsService, type AnalyticsSummary } from '../services/analytics.service';
import { notify } from '../utils/notify';
import { getErrorMessage } from '../utils/error';

export function useAnalytics() {
  const [stats, setStats] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await analyticsService.getSummary();
      setStats(res.data.data ?? null);
    } catch (err: unknown) {
      notify.error(getErrorMessage(err, 'Failed to load analytics'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { stats, loading };
}
