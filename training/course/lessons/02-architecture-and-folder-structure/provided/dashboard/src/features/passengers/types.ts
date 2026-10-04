import type { UserDto } from '../auth/types';
import type { BookingDto } from '../bookings/types';

export interface PassengerSummaryDto extends UserDto {
  bookingCount: number;
  totalSpentCents: number;
}

export interface PassengerDetailDto extends UserDto {
  bookings: BookingDto[];
}
