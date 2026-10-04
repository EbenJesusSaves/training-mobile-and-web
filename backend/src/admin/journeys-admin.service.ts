import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { Prisma } from '../generated/prisma/client.js';
import { JourneyAvailabilityService } from '../journeys/journey-availability.service.js';
import { journeyInclude, seatsInCar, toJourneyDto } from '../journeys/journey.mapper.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { paginate } from './dto/pagination.dto.js';
import type { CreateJourneyDto, JourneyCarDto, ListJourneysQueryDto, UpdateJourneyDto } from './dto/admin.dto.js';

const DAY_MS = 86_400_000;

@Injectable()
export class JourneysAdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly availability: JourneyAvailabilityService,
  ) {}

  async list(query: ListJourneysQueryDto) {
    const { page, pageSize, skip, take } = paginate(query);
    const now = new Date();
    const search = query.search?.trim();
    const departureAt: Prisma.DateTimeFilter = {};
    if (query.from) departureAt.gte = new Date(`${query.from}T00:00:00.000Z`);
    if (query.to) departureAt.lt = new Date(new Date(`${query.to}T00:00:00.000Z`).getTime() + DAY_MS);
    if (query.when === 'upcoming' || (!query.when && !query.from && !query.to)) departureAt.gte ??= now;
    if (query.when === 'past') departureAt.lt = now;

    const where: Prisma.JourneyWhereInput = {
      departureAt,
      ...(query.routeId ? { routeId: query.routeId } : {}),
      ...(query.status ? { status: query.status } : {}),
      ...(query.stationId ? { route: { OR: [{ originId: query.stationId }, { destinationId: query.stationId }] } } : {}),
      ...(search
        ? {
            OR: [
              { trainNumber: { contains: search, mode: 'insensitive' } },
              { trainName: { contains: search, mode: 'insensitive' } },
              { route: { origin: { name: { contains: search, mode: 'insensitive' } } } },
              { route: { destination: { name: { contains: search, mode: 'insensitive' } } } },
            ],
          }
        : {}),
    };

    const [total, journeys] = await Promise.all([
      this.prisma.journey.count({ where }),
      this.prisma.journey.findMany({
        where,
        include: journeyInclude,
        orderBy: { departureAt: query.when === 'past' ? 'desc' : 'asc' },
        skip,
        take,
      }),
    ]);
    const reserved = await this.availability.reservedByCar(journeys.map((journey) => journey.id));
    return { items: journeys.map((journey) => toJourneyDto(journey, reserved.get(journey.id))), total, page, pageSize };
  }

  async detail(id: string) {
    const journey = await this.prisma.journey.findUnique({ where: { id }, include: journeyInclude });
    if (!journey) throw new NotFoundException({ code: 'JOURNEY_NOT_FOUND', message: 'Journey not found.' });
    const [reserved, taken, tickets] = await Promise.all([
      this.availability.reservedByCar([id]),
      this.availability.takenSeats(id),
      this.prisma.ticket.findMany({
        where: { segment: { journeyId: id } },
        include: { passenger: true, reservation: true, segment: { include: { booking: true } } },
        orderBy: [{ carNumber: 'asc' }, { seatNumber: 'asc' }],
      }),
    ]);
    return {
      ...toJourneyDto(journey, reserved.get(id)),
      bookingCount: new Set(tickets.filter((ticket) => ticket.reservation).map((ticket) => ticket.segment.bookingId)).size,
      cars: journey.cars.map((car) => {
        const takenSeats = taken.get(car.carNumber) ?? [];
        return {
          carNumber: car.carNumber,
          travelClass: car.travelClass,
          compartments: car.compartments,
          airConditioned: car.airConditioned,
          totalSeats: seatsInCar(car),
          availableSeats: seatsInCar(car) - takenSeats.length,
          takenSeats,
        };
      }),
      manifest: tickets.map((ticket) => ({
        ticketId: ticket.id,
        ticketCode: ticket.ticketCode,
        passengerName: ticket.passenger.fullName,
        carNumber: ticket.carNumber,
        seatNumber: ticket.seatNumber,
        travelClass: ticket.segment.travelClass,
        bookingId: ticket.segment.bookingId,
        bookingReference: ticket.segment.booking.reference,
        bookingStatus: ticket.segment.booking.status,
        holdsSeat: ticket.reservation !== null,
      })),
    };
  }

  async create(dto: CreateJourneyDto) {
    const route = await this.prisma.route.findUnique({ where: { id: dto.routeId } });
    if (!route) throw new NotFoundException({ code: 'ROUTE_NOT_FOUND', message: 'Choose an existing route.' });
    if (!route.isActive) throw new BadRequestException({ code: 'ROUTE_INACTIVE', message: 'Activate the route before scheduling journeys.' });

    const departureAt = new Date(dto.departureAt);
    const arrivalAt = new Date(dto.arrivalAt);
    this.assertTimes(departureAt, arrivalAt, true);
    this.assertCars(dto.cars);

    const repeatDays = dto.repeatDays ?? 1;
    const ids = await this.prisma.$transaction(async (tx) => {
      const created: string[] = [];
      for (let day = 0; day < repeatDays; day += 1) {
        const journey = await tx.journey.create({
          data: {
            routeId: route.id,
            serviceCode: dto.serviceCode,
            trainNumber: dto.trainNumber,
            trainName: dto.trainName,
            departureAt: new Date(departureAt.getTime() + day * DAY_MS),
            arrivalAt: new Date(arrivalAt.getTime() + day * DAY_MS),
            firstClassFareCents: dto.firstClassFareCents ?? route.defaultFirstClassFareCents,
            secondClassFareCents: dto.secondClassFareCents ?? route.defaultSecondClassFareCents,
            cars: { create: dto.cars.map((car) => ({ ...car, airConditioned: car.airConditioned ?? true })) },
          },
        });
        created.push(journey.id);
      }
      return created;
    });
    return { createdIds: ids, journey: await this.detail(ids[0]) };
  }

  async update(id: string, dto: UpdateJourneyDto) {
    const journey = await this.prisma.journey.findUnique({ where: { id }, include: { cars: true } });
    if (!journey) throw new NotFoundException({ code: 'JOURNEY_NOT_FOUND', message: 'Journey not found.' });

    const departureAt = dto.departureAt ? new Date(dto.departureAt) : journey.departureAt;
    const arrivalAt = dto.arrivalAt ? new Date(dto.arrivalAt) : journey.arrivalAt;
    if (dto.departureAt || dto.arrivalAt) this.assertTimes(departureAt, arrivalAt, false);

    if (dto.cars) {
      this.assertCars(dto.cars);
      await this.assertCarsKeepReservations(id, dto.cars);
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.journey.update({
        where: { id },
        data: {
          serviceCode: dto.serviceCode,
          trainNumber: dto.trainNumber,
          trainName: dto.trainName,
          departureAt,
          arrivalAt,
          status: dto.status,
          delayMinutes: dto.status && dto.status !== 'DELAYED' ? 0 : dto.delayMinutes,
          firstClassFareCents: dto.firstClassFareCents,
          secondClassFareCents: dto.secondClassFareCents,
        },
      });
      if (dto.cars) {
        await tx.journeyCar.deleteMany({ where: { journeyId: id } });
        await tx.journeyCar.createMany({
          data: dto.cars.map((car) => ({ ...car, journeyId: id, airConditioned: car.airConditioned ?? true })),
        });
      }
    });
    return this.detail(id);
  }

  private assertTimes(departureAt: Date, arrivalAt: Date, mustBeFuture: boolean) {
    if (mustBeFuture && departureAt <= new Date()) {
      throw new BadRequestException({
        code: 'VALIDATION_FAILED',
        message: 'Departure must be in the future.',
        details: { fieldErrors: { departureAt: 'Departure must be in the future.' } },
      });
    }
    if (arrivalAt <= departureAt) {
      throw new BadRequestException({
        code: 'VALIDATION_FAILED',
        message: 'Arrival must be after departure.',
        details: { fieldErrors: { arrivalAt: 'Arrival must be after departure.' } },
      });
    }
  }

  private assertCars(cars: JourneyCarDto[]) {
    const numbers = cars.map((car) => car.carNumber);
    if (new Set(numbers).size !== numbers.length) {
      throw new BadRequestException({ code: 'DUPLICATE_CAR', message: 'Each car needs a unique number.' });
    }
  }

  /** Capacity can change, but never in a way that strands a passenger's reserved seat. */
  private async assertCarsKeepReservations(journeyId: string, cars: JourneyCarDto[]) {
    const reservations = await this.prisma.seatReservation.findMany({
      where: { journeyId },
      include: { ticket: { include: { segment: true } } },
    });
    for (const reservation of reservations) {
      const car = cars.find((item) => item.carNumber === reservation.carNumber);
      const fits = car && car.travelClass === reservation.ticket.segment.travelClass && reservation.seatNumber <= seatsInCar(car);
      if (!fits) {
        throw new ConflictException({
          code: 'CAPACITY_CONFLICT',
          message: `Car ${reservation.carNumber} seat ${reservation.seatNumber} is booked. Keep that seat in the layout or cancel the booking first.`,
        });
      }
    }
  }
}
