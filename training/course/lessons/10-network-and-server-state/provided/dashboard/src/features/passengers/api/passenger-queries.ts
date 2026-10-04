import { useQuery } from '@tanstack/react-query';

import { passengerKeys } from './passenger-keys';
import { getPassenger, listPassengers, type PassengerListParams } from './passengers-api';

export function usePassengers(params: PassengerListParams) {
  return useQuery({ queryKey: passengerKeys.list(params), queryFn: () => listPassengers(params) });
}

export function usePassenger(id: string | undefined) {
  return useQuery({ queryKey: passengerKeys.detail(id), queryFn: () => getPassenger(id!), enabled: Boolean(id) });
}
