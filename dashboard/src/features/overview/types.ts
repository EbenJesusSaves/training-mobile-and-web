import type { BookingDto } from '../bookings/types';
import type { JourneyDto } from '../journeys/types';

export interface OverviewDto {
  currency: 'GHS';
  generatedAt: string;
  totals: {
    bookingsToday: number;
    revenueTodayCents: number;
    bookingsLast7Days: number;
    revenueLast7DaysCents: number;
    upcomingJourneys: number;
    delayedJourneys: number;
    passengers: number;
    averageOccupancy: number;
  };
  daily: { date: string; bookings: number; revenueCents: number }[];
  nextDepartures: JourneyDto[];
  busiestJourneys: JourneyDto[];
  recentBookings: BookingDto[];
}
