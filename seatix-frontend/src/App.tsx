import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';

import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

import HomePage from './pages/public/HomePage';
import EventsPage from './pages/public/EventsPage';
import EventDetailPage from './pages/public/EventDetailPage';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

import PaymentCallbackPage from './pages/payment/PaymentCallbackPage';

import MyBookingsPage from './pages/attendee/MyBookingsPage';
import BookingDetailPage from './pages/attendee/BookingDetailPage';
import ProfilePage from './pages/attendee/ProfilePage';

import OrganizerDashboardPage from './pages/organizer/OrganizerDashboardPage';
import CreateEventPage from './pages/organizer/CreateEventPage';
import EditEventPage from './pages/organizer/EditEventPage';
import SeatMapBuilderPage from './pages/organizer/SeatMapBuilderPage';
import EventBookingsPage from './pages/organizer/EventBookingsPage';

import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminEventsPage from './pages/admin/AdminEventsPage';

export default function App() {
  return (
    <>
      <Toaster richColors position="top-right" />
      <Routes>
        {/* Public */}
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="events/:id" element={<EventDetailPage />} />
        </Route>

        {/* Auth */}
        <Route element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        {/* Payment callback */}
        <Route path="payment/callback" element={<PaymentCallbackPage />} />

        {/* Attendee / all authenticated users */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="my-bookings" element={<MyBookingsPage />} />
          <Route path="my-bookings/:id" element={<BookingDetailPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Organizer */}
        <Route
          element={
            <ProtectedRoute roles={['organizer']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="organizer" element={<OrganizerDashboardPage />} />
          <Route path="organizer/events/new" element={<CreateEventPage />} />
          <Route path="organizer/events/:id/edit" element={<EditEventPage />} />
          <Route path="organizer/events/:id/seats" element={<SeatMapBuilderPage />} />
          <Route path="organizer/events/:id/bookings" element={<EventBookingsPage />} />
        </Route>

        {/* Admin */}
        <Route
          element={
            <ProtectedRoute roles={['admin']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="admin" element={<AdminDashboardPage />} />
          <Route path="admin/users" element={<AdminUsersPage />} />
          <Route path="admin/events" element={<AdminEventsPage />} />
        </Route>
      </Routes>
    </>
  );
}
