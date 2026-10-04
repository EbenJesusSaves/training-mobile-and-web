import { api } from '../../../shared/api/client';
import type { OverviewDto } from '../types';

export async function getOverview() {
  const { data } = await api.get<OverviewDto>('/admin/overview');
  return data;
}
