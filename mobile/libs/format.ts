import { appConfig } from '@/config/app-config';

import type { TravelClass } from '@/api/types';

const PESEWAS_PER_CEDI = 100;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_HALF_DAY = 12;
const MONEY_DECIMALS = 2;
const TIME_DIGITS = 2;
const INITIALS_COUNT = 2;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Formatting is done by hand rather than with Intl because Intl support differs between
 * Hermes builds and Node (tests). The rail network runs on GMT (UTC+0), so we read UTC fields:
 * a 07:25 departure shows as 7:25 AM on every phone, whatever its own time zone.
 */
export function formatMoney(cents: number, options: { showCents?: boolean; sign?: boolean } = {}): string {
  const { showCents = true, sign = false } = options;
  const amount = Math.abs(cents) / PESEWAS_PER_CEDI;
  const fixed = showCents ? amount.toFixed(MONEY_DECIMALS) : String(Math.round(amount));
  const [whole, fraction] = fixed.split('.');
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const prefix = cents < 0 ? '-' : sign ? '+' : '';
  return `${prefix}${appConfig.currencySymbol}${grouped}${fraction ? `.${fraction}` : ''}`;
}

/** Whole cedis when the amount is round (GH₵175), otherwise two decimals (GH₵175.50). */
export const formatFare = (cents: number, options: { sign?: boolean } = {}) =>
  formatMoney(cents, {
    showCents: cents % PESEWAS_PER_CEDI !== 0,
    sign: options.sign,
  });

export function formatTime(iso: string): string {
  const date = new Date(iso);
  const hours = date.getUTCHours();
  const minutes = String(date.getUTCMinutes()).padStart(TIME_DIGITS, '0');
  const clockHour = hours % HOURS_PER_HALF_DAY === 0 ? HOURS_PER_HALF_DAY : hours % HOURS_PER_HALF_DAY;
  return `${clockHour}:${minutes} ${hours < HOURS_PER_HALF_DAY ? 'AM' : 'PM'}`;
}

export const formatDayMonth = (iso: string) => {
  const date = new Date(iso);
  return `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]}`;
};

export const formatDateTime = (iso: string) => `${formatDayMonth(iso)}, ${formatTime(iso)}`;

export const formatLongDate = (iso: string) => {
  const date = new Date(iso);
  return `${WEEKDAYS[date.getUTCDay()]}, ${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
};

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / MINUTES_PER_HOUR);
  const rest = minutes % MINUTES_PER_HOUR;
  if (hours === 0) return `${rest}m`;
  return rest === 0 ? `${hours}h` : `${hours}h ${rest}m`;
}

export const classLabel = (travelClass: TravelClass) => (travelClass === 'FIRST' ? '1st Class' : '2nd Class');

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, INITIALS_COUNT)
    .map((part) => part[0]!.toUpperCase())
    .join('');

export const pluralize = (count: number, singular: string, plural = `${singular}s`) => `${count} ${count === 1 ? singular : plural}`;
