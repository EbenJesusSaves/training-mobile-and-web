import type { PassengerListParams } from './passengers-api';

export const passengerKeys = {
  all: ['passengers'] as const,
  list: (params: PassengerListParams) => [...passengerKeys.all, 'list', params] as const,
  detail: (id: string | undefined) => [...passengerKeys.all, 'detail', id] as const,
};
