import { useMutation, useQuery } from '@tanstack/react-query';

import { notifyError, notifySuccess } from '../../../shared/hooks/use-query-notification';
import type { CreateJourneyPayload } from '../types';
import { journeyKeys } from './journey-keys';
import { createJourney, getJourney, type JourneyListParams, listJourneys } from './journeys-api';

export function useJourneys(params: JourneyListParams) {
  return useQuery({ queryKey: journeyKeys.list(params), queryFn: () => listJourneys(params) });
}

export function useJourney(id: string | undefined) {
  return useQuery({ queryKey: journeyKeys.detail(id), queryFn: () => getJourney(id!), enabled: Boolean(id) });
}

export function useCreateJourney() {
  return useMutation({
    mutationFn: (payload: CreateJourneyPayload) => createJourney(payload),
    onSuccess: () => {
      // LIVE 10.7 — Add useQueryClient and invalidate journeyKeys.all plus overviewKeys.all after create.
      notifySuccess('Journey scheduled.');
    },
    onError: (error) => notifyError(error),
  });
}
