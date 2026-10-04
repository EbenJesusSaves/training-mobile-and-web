import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';

import { appConfig } from '../config/app-config.js';
import { createBookingReference, createTicketCode } from '../common/utils/codes.js';
import { Prisma } from '../generated/prisma/client.js';
import { journeyInclude, seatsInCar, type JourneyWithRelations } from '../journeys/journey.mapper.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { bookingInclude, toBookingDto, type BookingDto } from './booking.mapper.js';
import { calculatePrice, type PricedAddOn } from './pricing.js';
import type { CreateBookingDto, QuoteBookingDto, SegmentSelectionDto } from './dto/booking.dto.js';

export interface UnavailableSeat {
  journeyId: string;
  direction: string;
  carNumber: number;
  seatNumber: number;
}

const badRequest = (code: string, message: string) => new BadRequestException({ code, message });
const CLASS_LABEL = { FIRST: '1st Class', SECOND: '2nd Class' } as const;

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Validates a selection against the database and prices it. Used by both quote and create. */
  private async prepare(dto: QuoteBookingDto) {
    const passengerCount = dto.segments[0].seats.length;
    if (passengerCount > appConfig.maxPassengersPerBooking) {
      throw badRequest('TOO_MANY_PASSENGERS', `You can book up to ${appConfig.maxPassengersPerBooking} passengers at a time.`);
    }
    if (dto.segments.some((segment) => segment.seats.length !== passengerCount)) {
      throw badRequest('SEAT_COUNT_MISMATCH', 'Choose the same number of seats for every journey.');
    }

    const directions = dto.segments.map((segment) => segment.direction).sort().join(',');
    const expected = dto.tripType === 'ONE_WAY' ? 'OUTBOUND' : 'OUTBOUND,RETURN';
    if (directions !== expected) {
      throw badRequest('INVALID_TRIP', dto.tripType === 'ONE_WAY' ? 'A one-way trip has a single outbound journey.' : 'A round trip needs an outbound and a return journey.');
    }

    const journeys = await this.prisma.journey.findMany({
      where: { id: { in: dto.segments.map((segment) => segment.journeyId) } },
      include: journeyInclude,
    });
    const journeyById = new Map(journeys.map((journey) => [journey.id, journey]));
    const now = new Date();

    const segments = dto.segments.map((selection) => {
      const journey = journeyById.get(selection.journeyId);
      if (!journey) throw new NotFoundException({ code: 'JOURNEY_NOT_FOUND', message: 'One of the selected journeys no longer exists.' });
      if (journey.status === 'CANCELLED') throw badRequest('JOURNEY_CANCELLED', `${journey.trainNumber} has been cancelled. Please choose another journey.`);
      if (journey.departureAt <= now) throw badRequest('JOURNEY_DEPARTED', `${journey.trainNumber} has already departed.`);
      this.assertSeatsExist(journey, selection);
      const unitFareCents = selection.travelClass === 'FIRST' ? journey.firstClassFareCents : journey.secondClassFareCents;
      const label = `${selection.direction === 'RETURN' ? 'Return' : 'Outbound'} · ${journey.route.origin.city} → ${journey.route.destination.city} · ${CLASS_LABEL[selection.travelClass]}`;
      return { selection, journey, unitFareCents, label };
    });

    if (dto.tripType === 'ROUND_TRIP') {
      const outbound = segments.find((segment) => segment.selection.direction === 'OUTBOUND')!.journey;
      const inbound = segments.find((segment) => segment.selection.direction === 'RETURN')!.journey;
      if (inbound.route.originId !== outbound.route.destinationId || inbound.route.destinationId !== outbound.route.originId) {
        throw badRequest('INVALID_RETURN', 'The return journey must travel back between the same stations.');
      }
      if (inbound.departureAt < outbound.arrivalAt) {
        throw badRequest('INVALID_RETURN', 'The return journey must depart after the outbound journey arrives.');
      }
    }

    const addOns = await this.resolveAddOns(dto, passengerCount);
    const price = calculatePrice(
      passengerCount,
      segments.map((segment) => ({
        direction: segment.selection.direction,
        travelClass: segment.selection.travelClass,
        unitFareCents: segment.unitFareCents,
        label: segment.label,
      })),
      addOns,
    );
    const unavailableSeats = await this.findTakenSeats(dto.segments);
    return { passengerCount, segments, addOns, price, unavailableSeats };
  }

  private assertSeatsExist(journey: JourneyWithRelations, selection: SegmentSelectionDto) {
    const seen = new Set<string>();
    for (const seat of selection.seats) {
      const key = `${seat.carNumber}-${seat.seatNumber}`;
      if (seen.has(key)) throw badRequest('DUPLICATE_SEAT', `Seat ${seat.seatNumber} in car ${seat.carNumber} was selected twice.`);
      seen.add(key);
      const car = journey.cars.find((item) => item.carNumber === seat.carNumber);
      if (!car || car.travelClass !== selection.travelClass) {
        throw badRequest('INVALID_SEAT', `Car ${seat.carNumber} is not a ${CLASS_LABEL[selection.travelClass]} car on ${journey.trainNumber}.`);
      }
      if (seat.seatNumber > seatsInCar(car)) {
        throw badRequest('INVALID_SEAT', `Car ${seat.carNumber} has no seat ${seat.seatNumber}.`);
      }
    }
  }

  private async resolveAddOns(dto: QuoteBookingDto, passengerCount: number): Promise<(PricedAddOn & { id: string })[]> {
    const requested = (dto.addOns ?? []).filter((item) => item.quantity > 0);
    if (requested.length === 0) return [];
    const codes = requested.map((item) => item.code);
    if (new Set(codes).size !== codes.length) throw badRequest('DUPLICATE_ADD_ON', 'Each extra can only be listed once.');
    const addOns = await this.prisma.addOn.findMany({ where: { code: { in: codes }, isActive: true } });
    return requested.map((item) => {
      const addOn = addOns.find((candidate) => candidate.code === item.code);
      if (!addOn) throw badRequest('INVALID_ADD_ON', `The extra "${item.code}" is not available.`);
      if (item.quantity > passengerCount) {
        throw badRequest('INVALID_ADD_ON', `${addOn.name} is limited to one per passenger.`);
      }
      return { id: addOn.id, code: addOn.code, name: addOn.name, unitPriceCents: addOn.priceCents, quantity: item.quantity };
    });
  }

  private async findTakenSeats(selections: SegmentSelectionDto[]): Promise<UnavailableSeat[]> {
    const conditions = selections.flatMap((selection) =>
      selection.seats.map((seat) => ({ journeyId: selection.journeyId, carNumber: seat.carNumber, seatNumber: seat.seatNumber })),
    );
    const taken = await this.prisma.seatReservation.findMany({ where: { OR: conditions } });
    return taken.map((reservation) => ({
      journeyId: reservation.journeyId,
      direction: selections.find((selection) => selection.journeyId === reservation.journeyId)?.direction ?? 'OUTBOUND',
      carNumber: reservation.carNumber,
      seatNumber: reservation.seatNumber,
    }));
  }

  private seatTaken(unavailableSeats: UnavailableSeat[]) {
    const list = unavailableSeats.map((seat) => `car ${seat.carNumber} seat ${seat.seatNumber}`).join(', ');
    return new ConflictException({
      code: 'SEAT_TAKEN',
      message: `Sorry, ${list} ${unavailableSeats.length === 1 ? 'was' : 'were'} just booked by someone else. Please choose another seat.`,
      details: { unavailableSeats },
    });
  }

  async quote(dto: QuoteBookingDto) {
    const prepared = await this.prepare(dto);
    return {
      currency: appConfig.currency,
      passengerCount: prepared.passengerCount,
      ...prepared.price,
      unavailableSeats: prepared.unavailableSeats,
    };
  }

  async create(userId: string, userEmail: string, dto: CreateBookingDto): Promise<BookingDto> {
    const prepared = await this.prepare(dto);
    if (dto.passengers.length !== prepared.passengerCount) {
      throw badRequest('PASSENGER_COUNT_MISMATCH', 'Add a name for every selected seat.');
    }
    if (prepared.unavailableSeats.length > 0) throw this.seatTaken(prepared.unavailableSeats);

    // Retry only for the (very unlikely) booking-reference collision.
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        const bookingId = await this.prisma.$transaction(async (tx) => {
          const booking = await tx.booking.create({
            data: {
              reference: createBookingReference(),
              userId,
              tripType: dto.tripType,
              contactEmail: dto.contactEmail ?? userEmail,
              currency: appConfig.currency,
              fareTotalCents: prepared.price.fareTotalCents,
              addOnTotalCents: prepared.price.addOnTotalCents,
              totalCents: prepared.price.totalCents,
              passengers: { create: dto.passengers.map((passenger, index) => ({ position: index + 1, fullName: passenger.fullName })) },
              addOns: {
                create: prepared.addOns.map((addOn) => ({ addOnId: addOn.id, quantity: addOn.quantity, unitPriceCents: addOn.unitPriceCents })),
              },
            },
            include: { passengers: { orderBy: { position: 'asc' } } },
          });

          for (const segment of prepared.segments) {
            await tx.bookingSegment.create({
              data: {
                bookingId: booking.id,
                journeyId: segment.journey.id,
                direction: segment.selection.direction,
                travelClass: segment.selection.travelClass,
                unitFareCents: segment.unitFareCents,
                tickets: {
                  create: segment.selection.seats.map((seat, index) => ({
                    passengerId: booking.passengers[index].id,
                    carNumber: seat.carNumber,
                    seatNumber: seat.seatNumber,
                    ticketCode: createTicketCode(),
                    // The unique (journeyId, carNumber, seatNumber) index rejects a concurrent double booking here.
                    reservation: { create: { journeyId: segment.journey.id, carNumber: seat.carNumber, seatNumber: seat.seatNumber } },
                  })),
                },
              },
            });
          }
          return booking.id;
        });
        return this.findOwned(userId, bookingId);
      } catch (error) {
        if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== 'P2002') throw error;
        const nowTaken = await this.findTakenSeats(dto.segments);
        if (nowTaken.length > 0) throw this.seatTaken(nowTaken);
      }
    }
    throw new ConflictException({ code: 'BOOKING_FAILED', message: 'We could not complete the booking. Please try again.' });
  }

  async listForUser(userId: string, scope: 'upcoming' | 'past' = 'upcoming') {
    const bookings = await this.prisma.booking.findMany({
      where: { userId },
      include: bookingInclude,
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    const now = new Date();
    const dtos = bookings.map((booking) => toBookingDto(booking, now));
    const time = (booking: BookingDto) => booking.firstDepartureAt?.getTime() ?? 0;
    return scope === 'upcoming'
      ? dtos.filter((booking) => booking.isUpcoming).sort((a, b) => time(a) - time(b))
      : dtos.filter((booking) => !booking.isUpcoming).sort((a, b) => time(b) - time(a));
  }

  /** Passengers can only read their own bookings; anything else is reported as not found. */
  async findOwned(userId: string, bookingId: string): Promise<BookingDto> {
    const booking = await this.prisma.booking.findUnique({ where: { id: bookingId }, include: bookingInclude });
    if (!booking || booking.userId !== userId) {
      throw new NotFoundException({ code: 'BOOKING_NOT_FOUND', message: 'We could not find that booking.' });
    }
    return toBookingDto(booking, new Date(), { includeBarcodes: true });
  }

  async cancelOwned(userId: string, bookingId: string) {
    const booking = await this.findOwned(userId, bookingId);
    if (!booking.canCancel) {
      throw new ForbiddenException({
        code: 'CANNOT_CANCEL',
        message: booking.status === 'CANCELLED' ? 'This booking is already cancelled.' : 'This booking can no longer be cancelled.',
      });
    }
    await this.cancel(bookingId, 'Cancelled by passenger');
    return this.findOwned(userId, bookingId);
  }

  /** Cancelling releases seats by deleting their reservations; tickets stay as history. */
  async cancel(bookingId: string, reason: string) {
    await this.prisma.$transaction(async (tx) => {
      await tx.seatReservation.deleteMany({ where: { ticket: { segment: { bookingId } } } });
      await tx.booking.update({
        where: { id: bookingId },
        data: { status: 'CANCELLED', cancelledAt: new Date(), cancellationReason: reason },
      });
    });
  }
}

