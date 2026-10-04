// Course-only prototype data for lesson 06; lesson 07 deletes src/prototype/ when the routed pages arrive.
import type { JourneyDto } from '../features/journeys/types';

const accra = { id: 'station-acc', code: 'ACC', name: 'Accra Central', city: 'Accra', address: 'Station Road', isActive: true };
const kumasi = { id: 'station-ksi', code: 'KSI', name: 'Kumasi Kejetia', city: 'Kumasi', address: 'Kejetia', isActive: true };

export const prototypeJourneys: JourneyDto[] = [
  {
    id: 'journey-training-1',
    routeId: 'route-acc-ksi',
    serviceCode: 'IC',
    trainNumber: 'IC 204',
    trainName: 'Gold Coast Express',
    departureAt: new Date().toISOString(),
    arrivalAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    durationMinutes: 240,
    status: 'SCHEDULED',
    delayMinutes: 0,
    origin: accra,
    destination: kumasi,
    currency: 'GHS',
    totalSeats: 96,
    availableSeats: 42,
    occupancy: 0.56,
    classes: [
      { travelClass: 'FIRST', fareCents: 12000, totalSeats: 24, availableSeats: 10, airConditioned: true, carNumbers: [1] },
      { travelClass: 'SECOND', fareCents: 7000, totalSeats: 72, availableSeats: 32, airConditioned: true, carNumbers: [2, 3] },
    ],
  },
];
