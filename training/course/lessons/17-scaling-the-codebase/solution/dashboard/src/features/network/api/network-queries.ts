import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { notifyError, notifySuccess } from '../../../shared/hooks/use-query-notification';
import { journeyKeys } from '../../journeys/api/journey-keys';
import type { AddOnDto } from '../types';
import {
  createRoute,
  createStation,
  listAddOns,
  listRoutes,
  listStations,
  type RoutePayload,
  type StationPayload,
  updateAddOn,
  updateRoute,
  updateStation,
} from './network-api';
import { networkKeys } from './network-keys';

export function useStations() {
  return useQuery({ queryKey: networkKeys.stations, queryFn: listStations });
}

export function useRoutes() {
  return useQuery({ queryKey: networkKeys.routes, queryFn: listRoutes });
}

export function useAddOns() {
  return useQuery({ queryKey: networkKeys.addOns, queryFn: listAddOns });
}

export function useStationMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: networkKeys.stations });
  return {
    create: useMutation({
      mutationFn: (payload: StationPayload) => createStation(payload),
      onSuccess: () => {
        invalidate();
        notifySuccess('Station created.');
      },
      onError: (error) => notifyError(error),
    }),
    update: useMutation({
      mutationFn: ({ id, payload }: { id: string; payload: Partial<StationPayload> }) => updateStation(id, payload),
      onSuccess: () => {
        invalidate();
        notifySuccess('Station updated.');
      },
      onError: (error) => notifyError(error),
    }),
  };
}

export function useRouteMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: networkKeys.routes });
    queryClient.invalidateQueries({ queryKey: journeyKeys.all });
  };
  return {
    create: useMutation({
      mutationFn: (payload: RoutePayload) => createRoute(payload),
      onSuccess: () => {
        invalidate();
        notifySuccess('Route created.');
      },
      onError: (error) => notifyError(error),
    }),
    update: useMutation({
      mutationFn: ({
        id,
        payload,
      }: {
        id: string;
        payload: Partial<Omit<RoutePayload, 'originId' | 'destinationId' | 'createReturnRoute'>>;
      }) => updateRoute(id, payload),
      onSuccess: () => {
        invalidate();
        notifySuccess('Route updated.');
      },
      onError: (error) => notifyError(error),
    }),
  };
}

export function useAddOnMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Pick<AddOnDto, 'name' | 'description' | 'priceCents' | 'isActive'>> }) =>
      updateAddOn(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: networkKeys.addOns });
      notifySuccess('Add-on updated.');
    },
    onError: (error) => notifyError(error),
  });
}
