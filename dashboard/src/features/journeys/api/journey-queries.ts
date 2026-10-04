import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { notifyError, notifySuccess } from '../../../shared/hooks/use-query-notification';
import { overviewKeys } from '../../overview/api/overview-keys';
import type { CreateJourneyPayload, UpdateJourneyPayload } from '../types';
import { journeyKeys } from './journey-keys';
import { createJourney, getJourney, type JourneyListParams, listJourneys, updateJourney } from './journeys-api';

export function useJourneys(params: JourneyListParams) {
  return useQuery({ queryKey: journeyKeys.list(params), queryFn: () => listJourneys(params) });
}

export function useJourney(id: string | undefined) {
  return useQuery({ queryKey: journeyKeys.detail(id), queryFn: () => getJourney(id!), enabled: Boolean(id) });
}

export function useCreateJourney() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateJourneyPayload) => createJourney(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: journeyKeys.all });
      queryClient.invalidateQueries({ queryKey: overviewKeys.all });
      notifySuccess('Journey scheduled.');
    },
    onError: (error) => notifyError(error),
  });
}

export function useUpdateJourney(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateJourneyPayload) => updateJourney(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: journeyKeys.all });
      queryClient.invalidateQueries({ queryKey: journeyKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: overviewKeys.all });
      notifySuccess('Journey updated.');
    },
    onError: (error) => notifyError(error),
  });
}
