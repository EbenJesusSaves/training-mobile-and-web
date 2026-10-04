import { api } from '../../../shared/api/client';
import type { Paginated } from '../../../shared/types/pagination';
import type { BookingDto, BookingStatus } from '../types';

export interface BookingListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: BookingStatus | '';
  journeyId?: string;
  userId?: string;
}

export async function listBookings(params: BookingListParams) {
  const { data } = await api.get<Paginated<BookingDto>>('/admin/bookings', { params });
  return data;
}

export async function getBooking(id: string) {
  const { data } = await api.get<BookingDto>(`/admin/bookings/${id}`);
  return data;
}

export async function updateBookingStatus(id: string, payload: { status: BookingStatus; reason?: string }) {
  const { data } = await api.patch<BookingDto>(`/admin/bookings/${id}/status`, payload);
  return data;
}
