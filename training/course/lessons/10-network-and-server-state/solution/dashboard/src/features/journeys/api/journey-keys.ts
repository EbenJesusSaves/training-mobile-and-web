import type { JourneyListParams } from './journeys-api';

export const journeyKeys = {
  all: ['journeys'] as const,
  list: (params: JourneyListParams) => [...journeyKeys.all, 'list', params] as const,
  detail: (id: string | undefined) => [...journeyKeys.all, 'detail', id] as const,
};
