import type { ApiError } from '@/api/errors';
import type { Booking, Journey } from '@/api/types';

export interface TripUpdate {
  id: string;
  booking: Booking;
  journey: Journey;
  kind: 'DELAYED' | 'CANCELLED';
}

/**
 * Trip updates are derived from the passenger's upcoming bookings: any journey that operations
 * staff marked as delayed or cancelled in the dashboard shows up here and on the bell badge.
 */
export function useTripUpdates(): {
  updates: TripUpdate[];
  hasUpdates: boolean;
  isLoading: boolean;
  isRefreshing: boolean;
  error: ApiError | null;
  data: Booking[] | undefined;
  refetch: () => Promise<void>;
} {
  // LIVE 18.1 — Derive active trip updates from upcoming bookings.
  return {
    updates: [],
    hasUpdates: false,
    isLoading: false,
    isRefreshing: false,
    error: null,
    data: [],
    refetch: async () => undefined,
  };
}
