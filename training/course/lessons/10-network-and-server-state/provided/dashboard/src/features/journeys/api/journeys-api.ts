import { api } from '../../../shared/api/client';
import type { Paginated } from '../../../shared/types/pagination';
import type {
  CreateJourneyPayload,
  CreateJourneyResponse,
  JourneyDetailDto,
  JourneyDto,
  JourneyStatus,
  UpdateJourneyPayload,
} from '../types';

export interface JourneyListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  routeId?: string;
  stationId?: string;
  status?: JourneyStatus | '';
  from?: string;
  to?: string;
  when?: 'upcoming' | 'past' | 'all';
}

export async function listJourneys(params: JourneyListParams) {
  const { data } = await api.get<Paginated<JourneyDto>>('/admin/journeys', { params });
  return data;
}

export async function getJourney(id: string) {
  const { data } = await api.get<JourneyDetailDto>(`/admin/journeys/${id}`);
  return data;
}

export async function createJourney(payload: CreateJourneyPayload) {
  const { data } = await api.post<CreateJourneyResponse>('/admin/journeys', payload);
  return data;
}

export async function updateJourney(id: string, payload: UpdateJourneyPayload) {
  const { data } = await api.patch<JourneyDetailDto>(`/admin/journeys/${id}`, payload);
  return data;
}
