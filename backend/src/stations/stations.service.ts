import { Injectable, NotFoundException } from '@nestjs/common';

import { JourneyAvailabilityService } from '../journeys/journey-availability.service.js';
import { journeyInclude, toJourneyDto, toStationDto } from '../journeys/journey.mapper.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class StationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly availability: JourneyAvailabilityService,
  ) {}

  async list(search?: string) {
    const term = search?.trim();
    const stations = await this.prisma.station.findMany({
      where: {
        isActive: true,
        ...(term
          ? {
              OR: [
                { name: { contains: term, mode: 'insensitive' } },
                { city: { contains: term, mode: 'insensitive' } },
                { code: { contains: term, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      include: { _count: { select: { departures: { where: { isActive: true } } } } },
      orderBy: { name: 'asc' },
    });
    return stations.map((station) => ({ ...toStationDto(station), routeCount: station._count.departures }));
  }

  /** Station detail with a small departures board for the next 48 hours. */
  async findOne(id: string) {
    const station = await this.prisma.station.findUnique({
      where: { id },
      include: {
        departures: { where: { isActive: true }, include: { destination: true }, orderBy: { destination: { name: 'asc' } } },
      },
    });
    if (!station || !station.isActive) {
      throw new NotFoundException({ code: 'STATION_NOT_FOUND', message: 'This station is not available.' });
    }
    const now = new Date();
    const departures = await this.prisma.journey.findMany({
      where: {
        route: { originId: id, isActive: true },
        departureAt: { gte: now, lt: new Date(now.getTime() + 48 * 3_600_000) },
      },
      include: journeyInclude,
      orderBy: { departureAt: 'asc' },
      take: 12,
    });
    const reserved = await this.availability.reservedByCar(departures.map((journey) => journey.id));
    return {
      ...toStationDto(station),
      destinations: station.departures.map((route) => ({
        routeId: route.id,
        distanceKm: route.distanceKm,
        station: toStationDto(route.destination),
        fromFareCents: Math.min(route.defaultSecondClassFareCents, route.defaultFirstClassFareCents),
      })),
      departures: departures.map((journey) => toJourneyDto(journey, reserved.get(journey.id))),
    };
  }
}
