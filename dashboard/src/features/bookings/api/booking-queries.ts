import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { notifyError, notifySuccess } from '../../../shared/hooks/use-query-notification';
import { journeyKeys } from '../../journeys/api/journey-keys';
import { overviewKeys } from '../../overview/api/overview-keys';
import type { BookingStatus } from '../types';
import { bookingKeys } from './booking-keys';
import { type BookingListParams, getBooking, listBookings, updateBookingStatus } from './bookings-api';

export function useBookings(params: BookingListParams) {
  return useQuery({ queryKey: bookingKeys.list(params), queryFn: () => listBookings(params) });
}

export function useBooking(id: string | null) {
  return useQuery({ queryKey: bookingKeys.detail(id), queryFn: () => getBooking(id!), enabled: Boolean(id) });
}

export function useBookingStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, reason }: { id: string; status: BookingStatus; reason?: string }) =>
      updateBookingStatus(id, { status, reason }),
    onSuccess: (booking) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all });
      queryClient.invalidateQueries({ queryKey: bookingKeys.detail(booking.id) });
      queryClient.invalidateQueries({ queryKey: journeyKeys.all });
      queryClient.invalidateQueries({ queryKey: overviewKeys.all });
      notifySuccess('Booking status updated.');
    },
    onError: (error) => notifyError(error),
  });
}
