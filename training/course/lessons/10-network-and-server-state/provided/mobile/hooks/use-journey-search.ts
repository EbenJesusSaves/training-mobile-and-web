import { useApiQuery } from '@/hooks/use-api-query';

import { travelApi } from '@/api/travel-api';

import type { JourneySort } from '@/api/types';
import type { DateKey } from '@/libs/dates';

interface Params {
  originId?: string;
  destinationId?: string;
  date: DateKey;
  sort: JourneySort;
  passengers: number;
}

/** Search results for a route and day. Nothing is fetched until both stations are chosen. */
export function useJourneySearch({ originId, destinationId, date, sort, passengers }: Params) {
  const key = originId && destinationId ? `journeys:${originId}:${destinationId}:${date}:${sort}:${passengers}` : null;
  return useApiQuery(
    key,
    (signal) => travelApi.searchJourneys({ originId: originId!, destinationId: destinationId!, date, sort, passengers }, signal),
    { refetchOnFocus: true },
  );
}
