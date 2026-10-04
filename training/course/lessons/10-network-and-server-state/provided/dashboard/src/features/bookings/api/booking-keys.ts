import type { BookingListParams } from './bookings-api';

export const bookingKeys = {
  all: ['bookings'] as const,
  list: (params: BookingListParams) => [...bookingKeys.all, 'list', params] as const,
  detail: (id: string | null) => [...bookingKeys.all, 'detail', id] as const,
};
