import { pdf417Matrix, ticketPayload } from './barcode.js';
import { journeyInclude, toJourneyDto, type JourneyWithRelations } from '../journeys/journey.mapper.js';
import type { Prisma } from '../generated/prisma/client.js';
import type {
  AddOn,
  Booking,
  BookingAddOn,
  BookingPassenger,
  BookingSegment,
  SeatReservation,
  Ticket,
  User,
} from '../generated/prisma/client.js';

export const bookingInclude = {
  user: true,
  passengers: { orderBy: { position: 'asc' } },
  addOns: { include: { addOn: true } },
  segments: {
    orderBy: { direction: 'asc' },
    include: {
      journey: { include: journeyInclude },
      tickets: { include: { reservation: true }, orderBy: [{ carNumber: 'asc' }, { seatNumber: 'asc' }] },
    },
  },
} satisfies Prisma.BookingInclude;

type BookingWithRelations = Booking & {
  user: User;
  passengers: BookingPassenger[];
  addOns: (BookingAddOn & { addOn: AddOn })[];
  segments: (BookingSegment & {
    journey: JourneyWithRelations;
    tickets: (Ticket & { reservation: SeatReservation | null })[];
  })[];
};

export function toBookingDto(booking: BookingWithRelations, now = new Date(), options: { includeBarcodes?: boolean } = {}) {
  const passengerName = new Map(booking.passengers.map((passenger) => [passenger.id, passenger.fullName]));
  const segments = booking.segments.map((segment) => ({
    id: segment.id,
    direction: segment.direction,
    travelClass: segment.travelClass,
    unitFareCents: segment.unitFareCents,
    // Availability is not needed on a booking, so seat counts are omitted here.
    journey: toJourneyDto(segment.journey),
    tickets: segment.tickets.map((ticket) => ({
      id: ticket.id,
      passengerId: ticket.passengerId,
      passengerName: passengerName.get(ticket.passengerId) ?? '',
      carNumber: ticket.carNumber,
      seatNumber: ticket.seatNumber,
      ticketCode: ticket.ticketCode,
      isActive: ticket.reservation !== null,
      ...(options.includeBarcodes ? { barcode: pdf417Matrix(ticketPayload(booking.reference, ticket.ticketCode)) } : {}),
    })),
  }));

  const firstDeparture = segments.reduce<Date | null>(
    (earliest, segment) => (!earliest || segment.journey.departureAt < earliest ? segment.journey.departureAt : earliest),
    null,
  );
  const lastArrival = segments.reduce<Date | null>(
    (latest, segment) => (!latest || segment.journey.arrivalAt > latest ? segment.journey.arrivalAt : latest),
    null,
  );

  return {
    id: booking.id,
    reference: booking.reference,
    status: booking.status,
    tripType: booking.tripType,
    contactEmail: booking.contactEmail,
    currency: booking.currency,
    fareTotalCents: booking.fareTotalCents,
    addOnTotalCents: booking.addOnTotalCents,
    totalCents: booking.totalCents,
    paymentMethod: booking.paymentMethod,
    createdAt: booking.createdAt,
    cancelledAt: booking.cancelledAt,
    cancellationReason: booking.cancellationReason,
    checkedInAt: booking.checkedInAt,
    firstDepartureAt: firstDeparture,
    lastArrivalAt: lastArrival,
    isUpcoming: booking.status !== 'CANCELLED' && !!lastArrival && lastArrival > now,
    canCancel: booking.status === 'CONFIRMED' && !!firstDeparture && firstDeparture > now,
    customer: { id: booking.user.id, fullName: booking.user.fullName, email: booking.user.email },
    passengers: booking.passengers.map((passenger) => ({ id: passenger.id, position: passenger.position, fullName: passenger.fullName })),
    segments,
    addOns: booking.addOns.map((item) => ({
      code: item.addOn.code,
      name: item.addOn.name,
      icon: item.addOn.icon,
      quantity: item.quantity,
      unitPriceCents: item.unitPriceCents,
      totalCents: item.quantity * item.unitPriceCents,
    })),
  };
}

export type BookingDto = ReturnType<typeof toBookingDto>;
