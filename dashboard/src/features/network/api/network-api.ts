import { api } from '../../../shared/api/client';
import type { AddOnDto, RouteDto, StationDto } from '../types';

export interface StationPayload {
  code: string;
  name: string;
  city: string;
  address?: string;
  isActive?: boolean;
}

export interface RoutePayload {
  originId: string;
  destinationId: string;
  distanceKm: number;
  defaultFirstClassFareCents: number;
  defaultSecondClassFareCents: number;
  isActive?: boolean;
  createReturnRoute?: boolean;
}

export async function listStations() {
  const { data } = await api.get<StationDto[]>('/admin/stations');
  return data;
}

export async function createStation(payload: StationPayload) {
  const { data } = await api.post<StationDto>('/admin/stations', payload);
  return data;
}

export async function updateStation(id: string, payload: Partial<StationPayload>) {
  const { data } = await api.patch<StationDto>(`/admin/stations/${id}`, payload);
  return data;
}

export async function listRoutes() {
  const { data } = await api.get<RouteDto[]>('/admin/routes');
  return data;
}

export async function createRoute(payload: RoutePayload) {
  const { data } = await api.post<RouteDto>('/admin/routes', payload);
  return data;
}

export async function updateRoute(id: string, payload: Partial<Omit<RoutePayload, 'originId' | 'destinationId' | 'createReturnRoute'>>) {
  const { data } = await api.patch<RouteDto>(`/admin/routes/${id}`, payload);
  return data;
}

export async function listAddOns() {
  const { data } = await api.get<AddOnDto[]>('/admin/add-ons');
  return data;
}

export async function updateAddOn(id: string, payload: Partial<Pick<AddOnDto, 'name' | 'description' | 'priceCents' | 'isActive'>>) {
  const { data } = await api.patch<AddOnDto>(`/admin/add-ons/${id}`, payload);
  return data;
}
