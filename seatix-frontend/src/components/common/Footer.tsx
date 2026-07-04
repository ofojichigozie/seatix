import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <Link to="/" className="flex items-center gap-2">
            <Logo size={20} className="text-primary-600" />
            <span className="text-sm font-bold text-primary-600">Seatix</span>
          </Link>
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Seatix. All rights reserved.
          </p>
          <Link to="/events" className="text-xs text-gray-400 hover:text-primary-600">
            Browse Events
          </Link>
        </div>
      </div>
    </footer>
  );
}
