import Constants from 'expo-constants';

/**
 * API base URL resolution, in priority order:
 *  1. A developer override saved in Profile → Developer settings (see preferences-store).
 *  2. EXPO_PUBLIC_API_URL from mobile/.env (use this for a facilitator-hosted API).
 *  3. In development, the machine running Metro (works for phones on the same Wi-Fi and simulators).
 */
function metroHostApiUrl(): string | undefined {
  const host = Constants.expoConfig?.hostUri?.split(':')[0];
  return host ? `http://${host}:3000/api` : undefined;
}

export const defaultApiUrl = process.env.EXPO_PUBLIC_API_URL || metroHostApiUrl() || 'http://localhost:3000/api';

export const appConfig = {
  currencySymbol: 'GH₵',
  maxPassengers: 6,
  /** How many days ahead the date strip offers. */
  searchDays: 30,
  /** Seat maps refresh this often while visible, so availability does not go stale. */
  seatRefreshMs: 20_000,
  requestTimeoutMs: 15_000,
  /** Quick connectivity check used by Developer settings. */
  healthCheckTimeoutMs: 5_000,
  /** Round trips default to returning this many days after departure. */
  defaultReturnOffsetDays: 2,
  /** Profile photos: randomuser.me serves men/0–99 and women/0–99. */
  avatarPortraits: { baseUrl: 'https://randomuser.me/api/portraits', perSet: 100 },
  /** Mirrors the API's validation rules so forms can explain problems before submitting. */
  validation: {
    minNameLength: 2,
    minPasswordLength: 8,
    resetCodeLength: 6,
    resetCodeTtlMinutes: 15,
    phonePattern: /^$|^\+?[0-9 ]{7,16}$/,
  },
} as const;
