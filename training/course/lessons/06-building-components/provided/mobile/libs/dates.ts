const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_MS = 86_400_000;
const DATE_KEY_LENGTH = 'YYYY-MM-DD'.length;

/** Date keys are YYYY-MM-DD strings in network time (GMT), matching the API's `date` parameter. */
export type DateKey = string;

export const toDateKey = (date: Date): DateKey => date.toISOString().slice(0, DATE_KEY_LENGTH);

export const todayKey = (now = new Date()): DateKey => toDateKey(now);

export const addDays = (key: DateKey, days: number): DateKey => toDateKey(new Date(Date.parse(`${key}T00:00:00Z`) + days * DAY_MS));

export const compareDateKeys = (a: DateKey, b: DateKey) => (a < b ? -1 : a > b ? 1 : 0);

export interface DateChip {
  key: DateKey;
  day: string;
  month: string;
  weekday: string;
}

export function buildDateChips(start: DateKey, count: number): DateChip[] {
  return Array.from({ length: count }, (_, index) => {
    const key = addDays(start, index);
    const date = new Date(`${key}T00:00:00Z`);
    return { key, day: String(date.getUTCDate()), month: MONTHS[date.getUTCMonth()], weekday: WEEKDAYS[date.getUTCDay()] };
  });
}

export const formatDateKey = (key: DateKey) => {
  const date = new Date(`${key}T00:00:00Z`);
  return `${WEEKDAYS[date.getUTCDay()]} ${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]}`;
};
