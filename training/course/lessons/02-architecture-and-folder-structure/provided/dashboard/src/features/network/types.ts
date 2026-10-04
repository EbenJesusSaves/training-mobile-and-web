export interface StationDto {
  id: string;
  code: string;
  name: string;
  city: string;
  address: string | null;
  isActive: boolean;
  routeCount?: number;
}

export interface RouteDto {
  id: string;
  origin: StationDto;
  destination: StationDto;
  distanceKm: number;
  defaultFirstClassFareCents: number;
  defaultSecondClassFareCents: number;
  isActive: boolean;
  upcomingJourneys: number;
}

export interface AddOnDto {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  priceCents: number;
  isActive: boolean;
  sortOrder: number;
}
