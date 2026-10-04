import { api } from '../../../shared/api/client';
import type { AuthResponse, UserDto } from '../types';

export async function login(payload: { email: string; password: string }) {
  const { data } = await api.post<AuthResponse>('/auth/login', payload);
  return data;
}

export async function getMe() {
  const { data } = await api.get<UserDto>('/auth/me');
  return data;
}
