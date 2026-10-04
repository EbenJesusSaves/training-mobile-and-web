import type { JourneyDto, TravelClass } from '../journeys/types';

export type BookingStatus = 'CONFIRMED' | 'CHECKED_IN' | 'CANCELLED';
export type TripType = 'ONE_WAY' | 'ROUND_TRIP';
export type SegmentDirection = 'OUTBOUND' | 'RETURN';

export interface BookingTicketDto {
  id: string;
  passengerId: string;
  passengerName: string;
  carNumber: number;
  seatNumber: number;
  ticketCode: string;
  isActive: boolean;
  barcode?: number[][];
}

export interface BookingSegmentDto {
  id: string;
  direction: SegmentDirection;
  travelClass: TravelClass;
  unitFareCents: number;
  journey: JourneyDto;
  tickets: BookingTicketDto[];
}

export interface BookingPassengerDto {
  id: string;
  position: number;
  fullName: string;
}

export interface BookingAddOnDto {
  code: string;
  name: string;
  icon: string;
  quantity: number;
  unitPriceCents: number;
  totalCents: number;
}

export interface BookingCustomerDto {
  id: string;
  fullName: string;
  email: string;
}

export interface BookingDto {
  id: string;
  reference: string;
  status: BookingStatus;
  tripType: TripType;
  contactEmail: string;
  currency: string;
  fareTotalCents: number;
  addOnTotalCents: number;
  totalCents: number;
  paymentMethod: string;
  createdAt: string;
  cancelledAt: string | null;
  cancellationReason: string | null;
  checkedInAt: string | null;
  firstDepartureAt: string | null;
  lastArrivalAt: string | null;
  isUpcoming: boolean;
  canCancel: boolean;
  customer: BookingCustomerDto;
  passengers: BookingPassengerDto[];
  segments: BookingSegmentDto[];
  addOns: BookingAddOnDto[];
}
