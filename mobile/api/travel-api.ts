import { appConfig } from '@/config/app-config';

import { apiClient } from './client';

import type { AddOn, HealthStatus, Journey, JourneySearch, SeatMap, Station, StationDetail } from './types';

export const travelApi = {
  stations: (search?: string) => apiClient.get<Station[]>('/stations', { params: { search } }).then((r) => r.data),
  station: (id: string) => apiClient.get<StationDetail>(`/stations/${id}`).then((r) => r.data),
  searchJourneys: (params: JourneySearch, signal?: AbortSignal) =>
    apiClient.get<Journey[]>('/journeys/search', { params, signal }).then((r) => r.data),
  journey: (id: string) => apiClient.get<Journey>(`/journeys/${id}`).then((r) => r.data),
  seatMap: (id: string, signal?: AbortSignal) => apiClient.get<SeatMap>(`/journeys/${id}/seats`, { signal }).then((r) => r.data),
  addOns: () => apiClient.get<AddOn[]>('/add-ons').then((r) => r.data),
  health: (baseURL?: string) =>
    apiClient
      .get<HealthStatus>('/health', {
        baseURL,
        timeout: appConfig.healthCheckTimeoutMs,
      })
      .then((r) => r.data),
};
