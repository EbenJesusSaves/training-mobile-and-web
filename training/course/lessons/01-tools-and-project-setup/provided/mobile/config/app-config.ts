// LIVE 01.1 — Resolve the API URL from env, Metro host, then localhost.
export const defaultApiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

export const appConfig = {
  currencySymbol: 'GH₵',
  maxPassengers: 6,
  searchDays: 30,
  seatRefreshMs: 20_000,
  requestTimeoutMs: 15_000,
  healthCheckTimeoutMs: 5_000,
  defaultReturnOffsetDays: 2,
  avatarPortraits: { baseUrl: 'https://randomuser.me/api/portraits', perSet: 100 },
  validation: {
    minNameLength: 2,
    minPasswordLength: 8,
    resetCodeLength: 6,
    resetCodeTtlMinutes: 15,
    phonePattern: /^$|^\+?[0-9 ]{7,16}$/,
  },
} as const;
