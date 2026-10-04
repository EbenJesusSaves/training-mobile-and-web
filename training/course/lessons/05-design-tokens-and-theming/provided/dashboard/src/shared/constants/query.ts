export const queryTimings = {
  staleMs: 30_000,
  overviewRefetchMs: 60_000,
  debounceMs: 350,
} as const;

export const pageSizes = {
  default: 12,
  compact: 18,
} as const;
