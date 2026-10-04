import type { BookingStatus } from '../bookings/types';
import type { StationDto } from '../network/types';

export type TravelClass = 'FIRST' | 'SECOND';
export type JourneyStatus = 'SCHEDULED' | 'DELAYED' | 'CANCELLED';

export interface JourneyClassDto {
  travelClass: TravelClass;
  fareCents: number;
  totalSeats: number;
  availableSeats: number;
  airConditioned: boolean;
  carNumbers: number[];
}

export interface JourneyDto {
  id: string;
  routeId: string;
  serviceCode: string;
  trainNumber: string;
  trainName: string;
  departureAt: string;
  arrivalAt: string;
  durationMinutes: number;
  status: JourneyStatus;
  delayMinutes: number;
  origin: StationDto;
  destination: StationDto;
  currency: string;
  totalSeats: number;
  availableSeats: number;
  occupancy: number;
  classes: JourneyClassDto[];
}

export interface JourneyCarDto {
  carNumber: number;
  travelClass: TravelClass;
  compartments: number;
  airConditioned: boolean;
  totalSeats?: number;
  availableSeats?: number;
  takenSeats?: number[];
}

export interface JourneyManifestItem {
  ticketId: string;
  ticketCode: string;
  passengerName: string;
  carNumber: number;
  seatNumber: number;
  travelClass: TravelClass;
  bookingId: string;
  bookingReference: string;
  bookingStatus: BookingStatus;
  holdsSeat: boolean;
}

export interface JourneyDetailDto extends JourneyDto {
  bookingCount: number;
  cars: Required<
    Pick<JourneyCarDto, 'carNumber' | 'travelClass' | 'compartments' | 'airConditioned' | 'totalSeats' | 'availableSeats' | 'takenSeats'>
  >[];
  manifest: JourneyManifestItem[];
}

export interface CreateJourneyPayload {
  routeId: string;
  serviceCode: string;
  trainNumber: string;
  trainName: string;
  departureAt: string;
  arrivalAt: string;
  firstClassFareCents?: number;
  secondClassFareCents?: number;
  cars: JourneyCarDto[];
  repeatDays?: number;
}

export interface UpdateJourneyPayload extends Partial<Omit<CreateJourneyPayload, 'routeId' | 'repeatDays'>> {
  status?: JourneyStatus;
  delayMinutes?: number;
}

export interface CreateJourneyResponse {
  createdIds: string[];
  journey: JourneyDetailDto;
}
