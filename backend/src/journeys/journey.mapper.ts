import { appConfig } from '../config/app-config.js';
import type { Journey, JourneyCar, Prisma, Route, Station, TravelClass } from '../generated/prisma/client.js';

export type JourneyWithRelations = Journey & {
  route: Route & { origin: Station; destination: Station };
  cars: JourneyCar[];
};

/** reservedByCar: carNumber -> number of reserved seats on this journey. */
export type ReservedByCar = Map<number, number>;

export const seatsInCar = (car: Pick<JourneyCar, 'compartments'>) => car.compartments * appConfig.seatsPerCompartment;

export const toStationDto = (station: Station) => ({
  id: station.id,
  code: station.code,
  name: station.name,
  city: station.city,
  address: station.address,
  isActive: station.isActive,
});

export function toJourneyDto(journey: JourneyWithRelations, reservedByCar: ReservedByCar = new Map()) {
  const classes = (['FIRST', 'SECOND'] as TravelClass[])
    .map((travelClass) => {
      const cars = journey.cars.filter((car) => car.travelClass === travelClass);
      if (cars.length === 0) return null;
      const totalSeats = cars.reduce((sum, car) => sum + seatsInCar(car), 0);
      const reserved = cars.reduce((sum, car) => sum + (reservedByCar.get(car.carNumber) ?? 0), 0);
      return {
        travelClass,
        fareCents: travelClass === 'FIRST' ? journey.firstClassFareCents : journey.secondClassFareCents,
        totalSeats,
        availableSeats: totalSeats - reserved,
        airConditioned: cars.every((car) => car.airConditioned),
        carNumbers: cars.map((car) => car.carNumber).sort((a, b) => a - b),
      };
    })
    .filter((value) => value !== null);

  const totalSeats = classes.reduce((sum, item) => sum + item.totalSeats, 0);
  const availableSeats = classes.reduce((sum, item) => sum + item.availableSeats, 0);

  return {
    id: journey.id,
    routeId: journey.routeId,
    serviceCode: journey.serviceCode,
    trainNumber: journey.trainNumber,
    trainName: journey.trainName,
    departureAt: journey.departureAt,
    arrivalAt: journey.arrivalAt,
    durationMinutes: Math.round((journey.arrivalAt.getTime() - journey.departureAt.getTime()) / 60_000),
    status: journey.status,
    delayMinutes: journey.delayMinutes,
    origin: toStationDto(journey.route.origin),
    destination: toStationDto(journey.route.destination),
    currency: appConfig.currency,
    totalSeats,
    availableSeats,
    occupancy: totalSeats === 0 ? 0 : Math.round(((totalSeats - availableSeats) / totalSeats) * 100) / 100,
    classes,
  };
}

export type JourneyDto = ReturnType<typeof toJourneyDto>;

export const journeyInclude = {
  route: { include: { origin: true, destination: true } },
  cars: { orderBy: { carNumber: 'asc' } },
} satisfies Prisma.JourneyInclude;
