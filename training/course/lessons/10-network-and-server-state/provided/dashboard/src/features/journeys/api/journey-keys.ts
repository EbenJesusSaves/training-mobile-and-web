import type { JourneyListParams } from './journeys-api';

export const journeyKeys = {
  all: ['journeys'] as const,
  // LIVE 10.6 — Build stable query keys from the journeys namespace.
  list: (_params: JourneyListParams) => journeyKeys.all,
  detail: (_id: string | undefined) => journeyKeys.all,
};
