// Course-only prototype data (lesson 06); lesson 07 deletes this file when the route prototypes arrive.
import type { Booking, Journey, Station } from '@/api/types';

export const prototypeStations: Station[] = [
  { id: 'accra', name: 'Accra Central', city: 'Accra', code: 'ACC', address: 'Ring Road Central', isActive: true },
  { id: 'kumasi', name: 'Kumasi Kejetia', city: 'Kumasi', code: 'KSI', address: 'Kejetia Station', isActive: true },
];

export const prototypeJourneys: Journey[] = [
  {
    id: 'jrny_001',
    routeId: 'route_acc_ksi',
    serviceCode: 'RP 101',
    trainNumber: 'GCX-1',
    trainName: 'Gold Coast Express',
    departureAt: new Date(Date.now() + 3_600_000).toISOString(),
    arrivalAt: new Date(Date.now() + 14_400_000).toISOString(),
    durationMinutes: 180,
    status: 'SCHEDULED',
    delayMinutes: 0,
    origin: prototypeStations[0],
    destination: prototypeStations[1],
    currency: 'GHS',
    totalSeats: 120,
    availableSeats: 18,
    occupancy: 0.85,
    classes: [
      { travelClass: 'SECOND', fareCents: 8500, totalSeats: 80, availableSeats: 12, airConditioned: true, carNumbers: [2, 3] },
      { travelClass: 'FIRST', fareCents: 14000, totalSeats: 40, availableSeats: 6, airConditioned: true, carNumbers: [1] },
    ],
  },
];

export const prototypeBookings: Booking[] = [];
