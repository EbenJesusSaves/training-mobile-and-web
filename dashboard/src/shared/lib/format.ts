import { railDomain } from '../constants';

const moneyFormatter = new Intl.NumberFormat('en-GH', {
  style: 'currency',
  currency: 'GHS',
  minimumFractionDigits: 2,
});

const compactMoneyFormatter = new Intl.NumberFormat('en-GH', {
  style: 'currency',
  currency: 'GHS',
  notation: 'compact',
  maximumFractionDigits: 1,
});

const dayMonthFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  timeZone: railDomain.apiTimeZone,
});

const dateTimeFormatter = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: railDomain.apiTimeZone,
});

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'medium',
  timeZone: railDomain.apiTimeZone,
});

const timeFormatter = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: railDomain.apiTimeZone,
});

export function formatMoney(cents: number) {
  return moneyFormatter.format(cents / 100);
}

/** Short money for chart axes, e.g. "GH₵1.2K". */
export function formatMoneyCompact(cents: number) {
  return compactMoneyFormatter.format(cents / 100);
}

export function formatDayMonth(value: string | Date) {
  return dayMonthFormatter.format(new Date(value));
}

export function formatDateTime(value: string | Date | null | undefined) {
  if (!value) return '—';
  return dateTimeFormatter.format(new Date(value));
}

export function formatDate(value: string | Date | null | undefined) {
  if (!value) return '—';
  return dateFormatter.format(new Date(value));
}

export function formatTime(value: string | Date | null | undefined) {
  if (!value) return '—';
  return timeFormatter.format(new Date(value));
}

export function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (!hours) return `${mins}m`;
  return `${hours}h ${mins.toString().padStart(2, '0')}m`;
}

export function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

export function centsFromGhs(value: number | string | undefined) {
  const amount = Number(value ?? 0);
  return Math.round(amount * 100);
}

export function ghsFromCents(cents: number | undefined) {
  return ((cents ?? 0) / 100).toFixed(2);
}

export function datetimeLocalToIso(value: string) {
  // Ghana's rail network runs on GMT, so staff-entered datetime-local values are treated as UTC rather than as the browser's local offset.
  return value ? `${value}:00.000Z` : '';
}

export function isoToDatetimeLocal(value: string | Date | null | undefined) {
  if (!value) return '';
  const date = new Date(value);
  return date.toISOString().slice(0, 16);
}

export function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}
