import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary-600 to-primary-700 px-4 py-12">
      <Link to="/" className="mb-8 text-3xl font-bold tracking-tight text-white">
        Seatix
      </Link>
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <Outlet />
      </div>
    </div>
  );
}
