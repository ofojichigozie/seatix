import { NavLink, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Navbar from '../components/common/Navbar';
import { cn } from '../utils/cn';

interface NavItem {
  to: string;
  label: string;
}

const adminLinks: NavItem[] = [
  { to: '/admin', label: 'Overview' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/events', label: 'Events' },
];

const organizerLinks: NavItem[] = [
  { to: '/organizer', label: 'Dashboard' },
  { to: '/organizer/events/new', label: 'Create Event' },
];

const attendeeLinks: NavItem[] = [
  { to: '/my-bookings', label: 'My Bookings' },
  { to: '/profile', label: 'Profile' },
];

export default function DashboardLayout() {
  const { user } = useAuthStore();

  const links =
    user?.role === 'admin'
      ? adminLinks
      : user?.role === 'organizer'
        ? organizerLinks
        : attendeeLinks;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:px-8">
        <aside className="shrink-0 lg:w-48">
          <nav className="flex flex-row gap-1 overflow-x-auto lg:flex-col">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end
                className={({ isActive }) =>
                  cn(
                    'whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
