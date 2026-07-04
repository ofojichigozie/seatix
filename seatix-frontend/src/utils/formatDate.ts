import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';

/** Formats an ISO date string to "Jan 15, 2026" */
export function formatDate(dateStr: string): string {
  const date = parseISO(dateStr);
  return isValid(date) ? format(date, 'MMM d, yyyy') : '—';
}

/** Formats an ISO date string to "Jan 15, 2026 at 7:00 PM" */
export function formatDateTime(dateStr: string): string {
  const date = parseISO(dateStr);
  return isValid(date) ? format(date, "MMM d, yyyy 'at' h:mm a") : '—';
}

/** Formats a date string as relative time, e.g. "3 days ago" */
export function formatRelative(dateStr: string): string {
  const date = parseISO(dateStr);
  return isValid(date) ? formatDistanceToNow(date, { addSuffix: true }) : '—';
}
