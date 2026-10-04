import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import { JourneyAvailabilityService } from './journey-availability.service.js';
import { journeyInclude, seatsInCar, toJourneyDto, type JourneyDto } from './journey.mapper.js';
import type { SearchJourneysDto } from './dto/search-journeys.dto.js';

const DAY_MS = 86_400_000;

@Injectable()
export class JourneysService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly availability: JourneyAvailabilityService,
  ) {}

  async search(query: SearchJourneysDto): Promise<JourneyDto[]> {
    if (query.originId === query.destinationId) {
      throw new BadRequestException({ code: 'SAME_STATION', message: 'Departure and arrival stations must be different.' });
    }
    // The sample network runs on GMT (UTC+0), so a calendar day is a UTC day.
    const dayStart = new Date(`${query.date}T00:00:00.000Z`);
    if (Number.isNaN(dayStart.getTime())) {
      throw new BadRequestException({ code: 'INVALID_DATE', message: 'Choose a valid travel date.' });
    }
    const now = new Date();
    const from = dayStart > now ? dayStart : now;
    const to = new Date(dayStart.getTime() + DAY_MS);

    const journeys = await this.prisma.journey.findMany({
      where: {
        route: { originId: query.originId, destinationId: query.destinationId, isActive: true },
        departureAt: { gte: from, lt: to },
        status: { not: 'CANCELLED' },
      },
      include: journeyInclude,
    });

    const reserved = await this.availability.reservedByCar(journeys.map((journey) => journey.id));
    const passengers = query.passengers ?? 1;
    const results = journeys
      .map((journey) => toJourneyDto(journey, reserved.get(journey.id)))
      .map((journey) => ({ ...journey, hasEnoughSeats: journey.classes.some((item) => item.availableSeats >= passengers) }));

    const lowestFare = (journey: JourneyDto) => Math.min(...journey.classes.map((item) => item.fareCents));
    const sorters = {
      fastest: (a: JourneyDto, b: JourneyDto) => a.durationMinutes - b.durationMinutes || +a.departureAt - +b.departureAt,
      earliest: (a: JourneyDto, b: JourneyDto) => +a.departureAt - +b.departureAt,
      cheapest: (a: JourneyDto, b: JourneyDto) => lowestFare(a) - lowestFare(b) || +a.departureAt - +b.departureAt,
    };
    return results.sort(sorters[query.sort ?? 'fastest']);
  }

  async findOne(id: string): Promise<JourneyDto> {
    const journey = await this.prisma.journey.findUnique({ where: { id }, include: journeyInclude });
    if (!journey) throw new NotFoundException({ code: 'JOURNEY_NOT_FOUND', message: 'This journey no longer exists.' });
    const reserved = await this.availability.reservedByCar([id]);
    return toJourneyDto(journey, reserved.get(id));
  }

  async seatMap(id: string) {
    const journey = await this.findOne(id);
    const cars = await this.prisma.journeyCar.findMany({ where: { journeyId: id }, orderBy: { carNumber: 'asc' } });
    const taken = await this.availability.takenSeats(id);
    return {
      journeyId: id,
      generatedAt: new Date(),
      journey,
      cars: cars.map((car) => {
        const takenSeats = taken.get(car.carNumber) ?? [];
        const totalSeats = seatsInCar(car);
        return {
          carNumber: car.carNumber,
          travelClass: car.travelClass,
          compartments: car.compartments,
          airConditioned: car.airConditioned,
          totalSeats,
          availableSeats: totalSeats - takenSeats.length,
          takenSeats,
        };
      }),
    };
  }
}
