/**
 * Development seed. Runs only against an EMPTY database (e.g. via `yarn db:reset`).
 * Data is generated relative to "today" with a fixed random seed, so every reset gives a
 * realistic, repeatable network: past trips for history, near-term trips with bookings,
 * and quieter trips further out.
 */
import { randomUUID } from 'node:crypto';
import { existsSync } from 'node:fs';
import { PrismaPg } from '@prisma/adapter-pg';

import { hashPassword } from '../src/auth/password.js';
import { PrismaClient, type Prisma, type TravelClass } from '../src/generated/prisma/client.js';

if (existsSync('.env')) process.loadEnvFile('.env');
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

// ---------------------------------------------------------------------------------------------
// Deterministic helpers
// ---------------------------------------------------------------------------------------------
let state = 20261003;
const random = () => {
  state |= 0;
  state = (state + 0x6d2b79f5) | 0;
  let t = Math.imul(state ^ (state >>> 15), 1 | state);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const between = (min: number, max: number) => Math.floor(random() * (max - min + 1)) + min;
const pick = <T>(items: readonly T[]) => items[Math.floor(random() * items.length)];
const DAY = 86_400_000;
const MINUTE = 60_000;
const roundTo = (value: number, step: number) => Math.round(value / step) * step;

const usedReferences = new Set<string>();
const reference = (createdAt: Date) => {
  let value: string;
  do value = `TRN-${createdAt.getUTCFullYear()}-${String(between(0, 999_999)).padStart(6, '0')}`;
  while (usedReferences.has(value));
  usedReferences.add(value);
  return value;
};
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const usedCodes = new Set<string>();
const ticketCode = () => {
  const chunk = () => Array.from({ length: 4 }, () => ALPHABET[between(0, ALPHABET.length - 1)]).join('');
  let value: string;
  do value = `RP-${chunk()}-${chunk()}`;
  while (usedCodes.has(value));
  usedCodes.add(value);
  return value;
};

// ---------------------------------------------------------------------------------------------
// Reference data
// ---------------------------------------------------------------------------------------------
const STATIONS = [
  { code: 'ACC', name: 'Accra Central', city: 'Accra', address: 'Kinbu Road, Accra Central' },
  { code: 'TMA', name: 'Tema Harbour', city: 'Tema', address: 'Harbour Road, Community 1, Tema' },
  { code: 'NSW', name: 'Nsawam', city: 'Nsawam', address: 'Station Road, Nsawam' },
  { code: 'KFD', name: 'Koforidua', city: 'Koforidua', address: 'Jackson Park Road, Koforidua' },
  { code: 'KSI', name: 'Kumasi Central', city: 'Kumasi', address: 'Railway Road, Adum, Kumasi' },
  { code: 'OBU', name: 'Obuasi', city: 'Obuasi', address: 'Station Road, Obuasi' },
  { code: 'TKD', name: 'Takoradi', city: 'Sekondi-Takoradi', address: 'Harbour Road, Takoradi' },
  { code: 'CCT', name: 'Cape Coast', city: 'Cape Coast', address: 'Commercial Street, Cape Coast' },
  { code: 'HOO', name: 'Ho', city: 'Ho', address: 'Station Road, Ho' },
  { code: 'TML', name: 'Tamale', city: 'Tamale', address: 'Bolgatanga Road, Tamale' },
] as const;

// [from, to, distance km, base duration minutes, departure times (UTC = GMT)]
const ROUTE_PAIRS: [string, string, number, number, string[]][] = [
  ['ACC', 'KSI', 250, 190, ['06:15', '07:25', '12:40', '17:10']],
  ['ACC', 'TKD', 230, 175, ['06:40', '11:30', '16:20']],
  ['ACC', 'TMA', 30, 35, ['06:00', '08:30', '13:00', '18:15']],
  ['ACC', 'CCT', 145, 120, ['07:05', '13:20', '17:45']],
  ['ACC', 'KFD', 85, 80, ['06:50', '12:10', '17:30']],
  ['ACC', 'HOO', 160, 140, ['08:00', '15:00']],
  ['KSI', 'TKD', 240, 185, ['06:30', '14:00']],
  ['KSI', 'OBU', 60, 55, ['07:15', '12:45', '18:00']],
  ['KSI', 'TML', 380, 300, ['07:00', '20:30']],
  ['ACC', 'NSW', 35, 40, ['07:40', '16:50']],
];

const SERVICES = [
  { code: 'IC+', name: 'Express InterCity', speed: 0.88, fare: 1.15 },
  { code: 'IC', name: 'InterCity', speed: 1, fare: 1 },
  { code: 'R', name: 'Regional', speed: 1.12, fare: 0.85 },
] as const;

const ADD_ONS = [
  { code: 'EXTRA_LUGGAGE', name: 'Extra Luggage', description: '+1 large bag (23kg max)', icon: 'luggage', priceCents: 3500, sortOrder: 1 },
  { code: 'BICYCLE', name: 'Bicycle Space', description: 'Reserved rack in the luggage car', icon: 'bicycle', priceCents: 2500, sortOrder: 2 },
  { code: 'MEAL', name: 'Onboard Meal', description: 'Jollof or waakye box with a drink', icon: 'meal', priceCents: 4500, sortOrder: 3 },
] as const;

const FIRST_NAMES = ['Ama', 'Kofi', 'Akosua', 'Kwame', 'Yaa', 'Kwabena', 'Abena', 'Yaw', 'Efua', 'Kojo', 'Adwoa', 'Kwaku', 'Esi', 'Fiifi', 'Afia', 'Nana', 'Akua', 'Kwesi', 'Dzifa', 'Selorm', 'Naa', 'Nii', 'Mawuli', 'Elikem', 'Aisha', 'Ibrahim', 'Zainab', 'Fuseini', 'Grace', 'Daniel', 'Priscilla', 'Samuel'];
const LAST_NAMES = ['Mensah', 'Owusu', 'Boateng', 'Asante', 'Osei', 'Agyeman', 'Appiah', 'Addo', 'Ofori', 'Darko', 'Quaye', 'Tetteh', 'Amoah', 'Badu', 'Acheampong', 'Sarpong', 'Gyamfi', 'Nkrumah', 'Danso', 'Ansah', 'Agbeko', 'Kpodo', 'Abdulai', 'Iddrisu'];
const fullName = () => `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;

// Long-distance trains get two first-class cars; short hops get one.
const carsFor = (distanceKm: number): { carNumber: number; travelClass: TravelClass; compartments: number }[] =>
  distanceKm >= 140
    ? [
        { carNumber: 1, travelClass: 'FIRST', compartments: 6 },
        { carNumber: 2, travelClass: 'FIRST', compartments: 6 },
        { carNumber: 3, travelClass: 'SECOND', compartments: 8 },
        { carNumber: 4, travelClass: 'SECOND', compartments: 8 },
        { carNumber: 5, travelClass: 'SECOND', compartments: 8 },
      ]
    : [
        { carNumber: 1, travelClass: 'FIRST', compartments: 5 },
        { carNumber: 2, travelClass: 'SECOND', compartments: 8 },
        { carNumber: 3, travelClass: 'SECOND', compartments: 8 },
      ];

/** How full a journey should be, by days from today. */
const targetOccupancy = (dayOffset: number) => {
  if (dayOffset < 0) return 0.25 + random() * 0.35;
  if (dayOffset <= 1) return 0.2 + random() * 0.3;
  if (dayOffset <= 6) return 0.06 + random() * 0.18;
  return random() * 0.05;
};

async function insertInChunks<T>(rows: T[], insert: (chunk: T[]) => Promise<unknown>, size = 2000) {
  for (let index = 0; index < rows.length; index += size) await insert(rows.slice(index, index + size));
}

async function main() {
  if ((await prisma.user.count()) > 0) {
    console.error('The database already contains data. Run `yarn db:reset` to wipe it and reseed (development only).');
    process.exitCode = 1;
    return;
  }

  const now = new Date();
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());

  // Users ------------------------------------------------------------------------------------
  const staffHash = await hashPassword('Staff#2026');
  const passengerHash = await hashPassword('Passenger#2026');
  const staff = await prisma.user.create({
    data: { email: 'staff@railpass.dev', fullName: 'Efua Mensah', role: 'STAFF', passwordHash: staffHash, phone: '+233 20 555 0101' },
  });
  await prisma.user.create({
    data: { email: 'ops@railpass.dev', fullName: 'Kojo Asante', role: 'STAFF', passwordHash: staffHash },
  });
  const ama = await prisma.user.create({
    data: { email: 'ama@railpass.dev', fullName: 'Ama Owusu', passwordHash: passengerHash, phone: '+233 24 555 0142' },
  });
  await prisma.user.create({
    data: { email: 'kwame@railpass.dev', fullName: 'Kwame Boateng', passwordHash: passengerHash },
  });

  const crowd = Array.from({ length: 160 }, (_, index) => {
    const name = fullName();
    return {
      id: randomUUID(),
      email: `${name.toLowerCase().replace(/[^a-z]+/g, '.')}.${index + 1}@example.com`,
      fullName: name,
      passwordHash: passengerHash,
      createdAt: new Date(today - between(20, 400) * DAY),
    };
  });
  await prisma.user.createMany({ data: crowd });

  // Network ----------------------------------------------------------------------------------
  const stations = await Promise.all(STATIONS.map((station) => prisma.station.create({ data: station })));
  const stationByCode = new Map(stations.map((station) => [station.code, station]));

  await prisma.addOn.createMany({ data: [...ADD_ONS] });

  type RouteInfo = { id: string; distanceKm: number; minutes: number; times: string[]; first: number; second: number; index: number };
  const routes: RouteInfo[] = [];
  const routeIdByCodes = new Map<string, string>();
  for (const [index, [from, to, distanceKm, minutes, times]] of ROUTE_PAIRS.entries()) {
    const second = Math.max(1500, roundTo(distanceKm * 45, 500));
    const first = roundTo(second * 1.5, 500);
    for (const [originCode, destinationCode, slotShift] of [
      [from, to, 0],
      [to, from, 35],
    ] as const) {
      const route = await prisma.route.create({
        data: {
          originId: stationByCode.get(originCode)!.id,
          destinationId: stationByCode.get(destinationCode)!.id,
          distanceKm,
          defaultFirstClassFareCents: first,
          defaultSecondClassFareCents: second,
        },
      });
      // Return services leave a little later in the day so the two directions differ.
      const shifted = times.map((time) => {
        const [hours, mins] = time.split(':').map(Number);
        const total = hours * 60 + mins + slotShift;
        return `${String(Math.floor(total / 60) % 24).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
      });
      routeIdByCodes.set(`${originCode}-${destinationCode}`, route.id);
      routes.push({ id: route.id, distanceKm, minutes, times: shifted, first, second, index: routes.length });
    }
  }

  // Journeys (3 days ago → 21 days ahead) ---------------------------------------------------
  type JourneyRow = Prisma.JourneyCreateManyInput & { id: string; departureAt: Date; arrivalAt: Date };
  const journeys: (JourneyRow & { dayOffset: number; cars: ReturnType<typeof carsFor> })[] = [];
  for (let dayOffset = -3; dayOffset <= 21; dayOffset += 1) {
    for (const route of routes) {
      route.times.forEach((time, slot) => {
        const service = route.distanceKm < 50 ? SERVICES[2] : slot === 1 ? SERVICES[0] : SERVICES[1];
        const [hours, mins] = time.split(':').map(Number);
        const departureAt = new Date(today + dayOffset * DAY + (hours * 60 + mins) * MINUTE);
        const duration = roundTo(route.minutes * service.speed, 5);
        journeys.push({
          id: randomUUID(),
          routeId: route.id,
          serviceCode: service.code,
          trainNumber: `${service.code.replace('+', '')} ${6100 + route.index * 10 + slot}`,
          trainName: service.name,
          departureAt,
          arrivalAt: new Date(departureAt.getTime() + duration * MINUTE),
          firstClassFareCents: roundTo(route.first * service.fare, 500),
          secondClassFareCents: roundTo(route.second * service.fare, 500),
          dayOffset,
          cars: carsFor(route.distanceKm),
        });
      });
    }
  }
  // A couple of live operational states for the dashboard and passenger updates.
  const tomorrows = journeys.filter((journey) => journey.dayOffset === 1);
  if (tomorrows[2]) Object.assign(tomorrows[2], { status: 'DELAYED', delayMinutes: 25 });
  if (tomorrows[9]) Object.assign(tomorrows[9], { status: 'CANCELLED' });

  await insertInChunks(journeys, (chunk) =>
    prisma.journey.createMany({ data: chunk.map(({ dayOffset: _day, cars: _cars, ...row }) => row) }),
  );
  await insertInChunks(
    journeys.flatMap((journey) => journey.cars.map((car) => ({ ...car, journeyId: journey.id }))),
    (chunk) => prisma.journeyCar.createMany({ data: chunk }),
  );

  // Bookings ---------------------------------------------------------------------------------
  const bookings: Prisma.BookingCreateManyInput[] = [];
  const passengers: Prisma.BookingPassengerCreateManyInput[] = [];
  const segments: Prisma.BookingSegmentCreateManyInput[] = [];
  const tickets: Prisma.TicketCreateManyInput[] = [];
  const reservations: Prisma.SeatReservationCreateManyInput[] = [];
  const addOnRows = await prisma.addOn.findMany();
  const bookingAddOns: Prisma.BookingAddOnCreateManyInput[] = [];
  const takenByJourney = new Map<string, Set<string>>();

  const takeSeats = (journey: (typeof journeys)[number], travelClass: TravelClass, count: number) => {
    const taken = takenByJourney.get(journey.id) ?? new Set<string>();
    takenByJourney.set(journey.id, taken);
    const free = journey.cars
      .filter((car) => car.travelClass === travelClass)
      .flatMap((car) => Array.from({ length: car.compartments * 6 }, (_, i) => ({ carNumber: car.carNumber, seatNumber: i + 1 })))
      .filter((seat) => !taken.has(`${seat.carNumber}-${seat.seatNumber}`));
    if (free.length < count) return null;
    // Groups usually sit together: start at a random free seat and take the next ones.
    const start = between(0, free.length - count);
    const chosen = free.slice(start, start + count);
    chosen.forEach((seat) => taken.add(`${seat.carNumber}-${seat.seatNumber}`));
    return chosen;
  };

  const addBooking = (options: {
    userId: string;
    userEmail: string;
    names: string[];
    legs: { journey: (typeof journeys)[number]; direction: 'OUTBOUND' | 'RETURN'; travelClass: TravelClass }[];
    createdAt: Date;
    status?: 'CONFIRMED' | 'CHECKED_IN' | 'CANCELLED';
    extras?: { code: string; quantity: number }[];
  }) => {
    const seatsPerLeg = options.legs.map((leg) => takeSeats(leg.journey, leg.travelClass, options.names.length));
    if (seatsPerLeg.some((seats) => seats === null)) return false;

    const bookingId = randomUUID();
    const passengerIds = options.names.map(() => randomUUID());
    const fareTotal = options.legs.reduce(
      (sum, leg) => sum + (leg.travelClass === 'FIRST' ? leg.journey.firstClassFareCents : leg.journey.secondClassFareCents) * options.names.length,
      0,
    );
    const extras = (options.extras ?? []).map((extra) => ({ ...extra, addOn: addOnRows.find((row) => row.code === extra.code)! }));
    const addOnTotal = extras.reduce((sum, extra) => sum + extra.addOn.priceCents * extra.quantity, 0);
    const status = options.status ?? 'CONFIRMED';

    bookings.push({
      id: bookingId,
      reference: reference(options.createdAt),
      userId: options.userId,
      tripType: options.legs.length === 2 ? 'ROUND_TRIP' : 'ONE_WAY',
      status,
      contactEmail: options.userEmail,
      fareTotalCents: fareTotal,
      addOnTotalCents: addOnTotal,
      totalCents: fareTotal + addOnTotal,
      createdAt: options.createdAt,
      cancelledAt: status === 'CANCELLED' ? new Date(options.createdAt.getTime() + DAY) : null,
      cancellationReason: status === 'CANCELLED' ? 'Cancelled by passenger' : null,
      checkedInAt: status === 'CHECKED_IN' ? options.legs[0].journey.departureAt : null,
    });
    options.names.forEach((name, index) => passengers.push({ id: passengerIds[index], bookingId, position: index + 1, fullName: name }));
    extras.forEach((extra) => bookingAddOns.push({ bookingId, addOnId: extra.addOn.id, quantity: extra.quantity, unitPriceCents: extra.addOn.priceCents }));

    options.legs.forEach((leg, legIndex) => {
      const segmentId = randomUUID();
      segments.push({
        id: segmentId,
        bookingId,
        journeyId: leg.journey.id,
        direction: leg.direction,
        travelClass: leg.travelClass,
        unitFareCents: leg.travelClass === 'FIRST' ? leg.journey.firstClassFareCents : leg.journey.secondClassFareCents,
      });
      seatsPerLeg[legIndex]!.forEach((seat, index) => {
        const ticketId = randomUUID();
        tickets.push({ id: ticketId, segmentId, passengerId: passengerIds[index], ...seat, ticketCode: ticketCode() });
        if (status === 'CANCELLED') {
          takenByJourney.get(leg.journey.id)!.delete(`${seat.carNumber}-${seat.seatNumber}`);
        } else {
          reservations.push({ journeyId: leg.journey.id, ticketId, ...seat });
        }
      });
    });
    return true;
  };

  // Ama's curated trips, used in the training walkthroughs.
  const findJourney = (from: string, to: string, dayOffset: number, slot = 0) => {
    const routeId = routeIdByCodes.get(`${from}-${to}`);
    const journey = journeys.filter((item) => item.routeId === routeId && item.dayOffset === dayOffset)[slot];
    if (!journey) throw new Error(`No seeded journey ${from}-${to} on day ${dayOffset} slot ${slot}`);
    return journey;
  };

  const amaTrips = [
    { legs: [{ journey: findJourney('ACC', 'KSI', 2, 1), direction: 'OUTBOUND' as const, travelClass: 'FIRST' as const }], names: ['Ama Owusu'], createdAt: new Date(now.getTime() - 3 * DAY), extras: [{ code: 'EXTRA_LUGGAGE', quantity: 1 }] },
    {
      legs: [
        { journey: findJourney('ACC', 'TKD', 5, 0), direction: 'OUTBOUND' as const, travelClass: 'SECOND' as const },
        { journey: findJourney('TKD', 'ACC', 7, 2), direction: 'RETURN' as const, travelClass: 'SECOND' as const },
      ],
      names: ['Ama Owusu', 'Kofi Owusu'],
      createdAt: new Date(now.getTime() - 2 * DAY),
    },
    { legs: [{ journey: findJourney('KSI', 'ACC', -2, 2), direction: 'OUTBOUND' as const, travelClass: 'FIRST' as const }], names: ['Ama Owusu'], createdAt: new Date(now.getTime() - 9 * DAY), status: 'CHECKED_IN' as const },
    { legs: [{ journey: findJourney('ACC', 'CCT', 4, 1), direction: 'OUTBOUND' as const, travelClass: 'SECOND' as const }], names: ['Ama Owusu'], createdAt: new Date(now.getTime() - 4 * DAY), status: 'CANCELLED' as const },
  ];
  for (const trip of amaTrips) addBooking({ userId: ama.id, userEmail: ama.email, ...trip });

  // Everyone else.
  for (const journey of journeys) {
    if (journey.status === 'CANCELLED') continue;
    const totalSeats = journey.cars.reduce((sum, car) => sum + car.compartments * 6, 0);
    let remaining = Math.round(totalSeats * targetOccupancy(journey.dayOffset));
    while (remaining > 0) {
      const party = Math.min(remaining, pick([1, 1, 1, 2, 2, 3, 4]));
      const customer = pick(crowd);
      const names = [customer.fullName, ...Array.from({ length: party - 1 }, fullName)];
      const travelClass: TravelClass = random() < 0.25 ? 'FIRST' : 'SECOND';
      const latestCreation = Math.min(now.getTime(), journey.departureAt.getTime() - 2 * 3_600_000);
      const createdAt = new Date(latestCreation - between(0, 12 * 24 * 60) * MINUTE);
      const departed = journey.departureAt < now;
      const status = random() < 0.04 ? 'CANCELLED' : departed && random() < 0.85 ? 'CHECKED_IN' : 'CONFIRMED';
      const extras = random() < 0.2 ? [{ code: pick(['EXTRA_LUGGAGE', 'BICYCLE', 'MEAL']), quantity: between(1, party) }] : [];
      addBooking({ userId: customer.id, userEmail: customer.email, names, legs: [{ journey, direction: 'OUTBOUND', travelClass }], createdAt, status, extras });
      remaining -= party;
    }
  }

  await insertInChunks(bookings, (chunk) => prisma.booking.createMany({ data: chunk }));
  await insertInChunks(passengers, (chunk) => prisma.bookingPassenger.createMany({ data: chunk }));
  await insertInChunks(segments, (chunk) => prisma.bookingSegment.createMany({ data: chunk }));
  await insertInChunks(tickets, (chunk) => prisma.ticket.createMany({ data: chunk }));
  await insertInChunks(reservations, (chunk) => prisma.seatReservation.createMany({ data: chunk }));
  await insertInChunks(bookingAddOns, (chunk) => prisma.bookingAddOn.createMany({ data: chunk }));

  console.log(
    `Seeded ${stations.length} stations, ${routes.length} routes, ${journeys.length} journeys, ${bookings.length} bookings, ${tickets.length} tickets.`,
  );
  console.log(`Staff login: ${staff.email} / Staff#2026 · Passenger logins: ama@railpass.dev, kwame@railpass.dev / Passenger#2026`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
