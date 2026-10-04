import { api } from '../../../shared/api/client';
import type { Paginated } from '../../../shared/types/pagination';
import type { PassengerDetailDto, PassengerSummaryDto } from '../types';

export interface PassengerListParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export async function listPassengers(params: PassengerListParams) {
  const { data } = await api.get<Paginated<PassengerSummaryDto>>('/admin/passengers', { params });
  return data;
}

export async function getPassenger(id: string) {
  const { data } = await api.get<PassengerDetailDto>(`/admin/passengers/${id}`);
  return data;
}
