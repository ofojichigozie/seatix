import { useAnalytics } from '../../hooks/useAnalytics';
import { formatCurrency } from '../../utils/formatCurrency';
import Spinner from '../../components/common/Spinner';

interface StatCardProps {
  label: string;
  value: string | number;
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { stats, loading } = useAnalytics();

  if (loading)
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  if (!stats) return null;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Overview</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Users" value={stats.totalUsers} />
        <StatCard label="Total Events" value={stats.totalEvents} />
        <StatCard label="Confirmed Bookings" value={stats.confirmedBookings} />
        <StatCard label="Total Revenue" value={formatCurrency(Number(stats.totalRevenue))} />
      </div>
    </div>
  );
}
