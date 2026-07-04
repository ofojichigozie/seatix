import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/authStore';
import { notify } from '../utils/notify';
import { getErrorMessage } from '../utils/error';

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: 'attendee' | 'organizer';
}

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const { setAuth, logout: storeLogout } = useAuthStore();
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await authService.login({ email, password });
      const { user, token } = res.data.data!;
      setAuth(user, token);
      notify.success('Welcome back!');
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'organizer') navigate('/organizer');
      else navigate('/events');
    } catch (err: unknown) {
      notify.error(getErrorMessage(err, 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterPayload) => {
    setLoading(true);
    try {
      await authService.register(data);
      notify.success(
        data.role === 'organizer'
          ? 'Account created. Await admin approval before logging in.'
          : 'Account created successfully! Please log in.',
      );
      navigate('/login');
    } catch (err: unknown) {
      notify.error(getErrorMessage(err, 'Registration failed'));
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      storeLogout();
      notify.success('Logged out');
      navigate('/login');
    }
  };

  return { login, register, logout, loading };
}
