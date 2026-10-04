import { useMemo } from 'react';

import { useApiQuery } from '@/hooks/use-api-query';

import { bookingsApi } from '@/api/bookings-api';

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
export function useTripUpdates() {
  const query = useApiQuery('bookings:upcoming', (signal) => bookingsApi.list('upcoming', signal), { refetchOnFocus: true });
  const updates = useMemo<TripUpdate[]>(
    () =>
      (query.data ?? []).flatMap((booking) =>
        booking.segments
          .filter((segment) => segment.journey.status !== 'SCHEDULED')
          .map((segment) => ({
            id: `${booking.id}-${segment.id}`,
            booking,
            journey: segment.journey,
            kind: segment.journey.status as 'DELAYED' | 'CANCELLED',
          })),
      ),
    [query.data],
  );
  return { ...query, updates, hasUpdates: updates.length > 0 };
}
