import { useState, useEffect, useCallback } from 'react';
import { usersService } from '../services/users.service';
import { useAuthStore } from '../store/authStore';
import type { User } from '../types/user.types';
import { notify } from '../utils/notify';
import { getErrorMessage } from '../utils/error';

export function useProfile() {
  const { user, setAuth, token } = useAuthStore();
  const [saving, setSaving] = useState(false);

  const updateProfile = async (data: { name?: string; phone?: string }) => {
    setSaving(true);
    try {
      const res = await usersService.updateMe(data);
      const updated = res.data.data;
      if (updated && token) {
        setAuth(updated, token);
      }
      notify.success('Profile updated');
    } catch (err: unknown) {
      notify.error(getErrorMessage(err, 'Failed to update profile'));
    } finally {
      setSaving(false);
    }
  };

  return { user, saving, updateProfile };
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await usersService.getAll();
      setUsers(res.data.data?.items ?? []);
    } catch (err: unknown) {
      notify.error(getErrorMessage(err, 'Failed to load users'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const toggleStatus = async (user: User) => {
    try {
      await usersService.updateStatus(user.id, !user.isActive);
      notify.success(user.isActive ? 'User suspended' : 'User approved');
      fetch();
    } catch (err: unknown) {
      notify.error(getErrorMessage(err, 'Failed to update user status'));
    }
  };

  const removeUser = async (id: string) => {
    try {
      await usersService.remove(id);
      notify.success('User deleted');
      fetch();
    } catch (err: unknown) {
      notify.error(getErrorMessage(err, 'Failed to delete user'));
    }
  };

  return { users, loading, toggleStatus, removeUser, refetch: fetch };
}
