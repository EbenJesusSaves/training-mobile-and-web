// Request and response shapes of the RailPass API (see backend/src/**/**.mapper.ts).

export type Role = 'PASSENGER' | 'STAFF';
export type TravelClass = 'FIRST' | 'SECOND';
export type JourneyStatus = 'SCHEDULED' | 'DELAYED' | 'CANCELLED';
export type BookingStatus = 'CONFIRMED' | 'CHECKED_IN' | 'CANCELLED';
export type TripType = 'ONE_WAY' | 'ROUND_TRIP';
export type Direction = 'OUTBOUND' | 'RETURN';
export type JourneySort = 'fastest' | 'earliest' | 'cheapest';
export type BookingScope = 'upcoming' | 'past';

export interface MessageResponse {
  message: string;
}

export interface HealthStatus {
  status: string;
}

export interface ApiErrorBody {
  code?: string;
  message?: string;
  details?: { fieldErrors?: Record<string, string> };
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  role: Role;
  createdAt: string;
}

export interface Session {
  accessToken: string;
  user: User;
}

export interface Station {
  id: string;
  code: string;
  name: string;
  city: string;
  address: string | null;
  isActive: boolean;
  routeCount?: number;
}

export interface JourneyClass {
  travelClass: TravelClass;
  fareCents: number;
  totalSeats: number;
  availableSeats: number;
  airConditioned: boolean;
  carNumbers: number[];
}

export interface Journey {
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
  origin: Station;
  destination: Station;
  currency: string;
  totalSeats: number;
  availableSeats: number;
  occupancy: number;
  classes: JourneyClass[];
  hasEnoughSeats?: boolean;
}

export interface StationDetail extends Station {
  destinations: {
    routeId: string;
    distanceKm: number;
    station: Station;
    fromFareCents: number;
  }[];
  departures: Journey[];
}

export interface SeatMapCar {
  carNumber: number;
  travelClass: TravelClass;
  compartments: number;
  airConditioned: boolean;
  totalSeats: number;
  availableSeats: number;
  takenSeats: number[];
}

export interface SeatMap {
  journeyId: string;
  generatedAt: string;
  journey: Journey;
  cars: SeatMapCar[];
}

export interface AddOn {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  priceCents: number;
}

export interface SeatRef {
  carNumber: number;
  seatNumber: number;
}

export interface PriceLine {
  kind: 'FARE' | 'ADD_ON';
  label: string;
  quantity: number;
  unitPriceCents: number;
  totalCents: number;
}

export interface Quote {
  currency: string;
  passengerCount: number;
  lines: PriceLine[];
  fareTotalCents: number;
  addOnTotalCents: number;
  totalCents: number;
  unavailableSeats: (SeatRef & { journeyId: string; direction: Direction })[];
}

export interface BarcodeMatrix {
  format: 'PDF417';
  payload: string;
  columns: number;
  rows: string[];
}

export interface Ticket {
  id: string;
  passengerId: string;
  passengerName: string;
  carNumber: number;
  seatNumber: number;
  ticketCode: string;
  isActive: boolean;
  barcode?: BarcodeMatrix;
}

export interface BookingSegment {
  id: string;
  direction: Direction;
  travelClass: TravelClass;
  unitFareCents: number;
  journey: Journey;
  tickets: Ticket[];
}

export interface Booking {
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
  passengers: { id: string; position: number; fullName: string }[];
  segments: BookingSegment[];
  addOns: {
    code: string;
    name: string;
    icon: string;
    quantity: number;
    unitPriceCents: number;
    totalCents: number;
  }[];
}

export interface BookingRequest {
  tripType: TripType;
  segments: {
    journeyId: string;
    travelClass: TravelClass;
    direction: Direction;
    seats: SeatRef[];
  }[];
  addOns: { code: string; quantity: number }[];
  passengers?: { fullName: string }[];
  contactEmail?: string;
}

export type QuoteRequest = Omit<BookingRequest, 'passengers' | 'contactEmail'>;

export interface JourneySearch {
  originId: string;
  destinationId: string;
  date: string;
  passengers?: number;
  sort?: JourneySort;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends SignInRequest {
  fullName: string;
}

export interface ResetPasswordRequest extends SignInRequest {
  code: string;
}

export interface UpdateProfileRequest {
  fullName?: string;
  phone?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
