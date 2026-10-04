import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../src/app.module.js';
import { configureApp } from '../src/app.factory.js';
import { hashPassword } from '../src/auth/password.js';
import { MailService } from '../src/mail/mail.service.js';
import { PrismaService } from '../src/prisma/prisma.service.js';

const DAY = 86_400_000;

describe('RailPass booking flow (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let http: () => ReturnType<typeof request>;
  const sentCodes: Record<string, string> = {};
  let staffToken: string;
  let ama: string;
  let kofi: string;
  let routeId: string;
  let journeyId: string;

  const auth = (token: string) => ({ Authorization: `Bearer ${token}` });
  const seatBooking = (seatNumber: number, extra: Record<string, unknown> = {}) => ({
    tripType: 'ONE_WAY',
    passengers: [{ fullName: 'Test Passenger' }],
    segments: [{ journeyId, travelClass: 'FIRST', direction: 'OUTBOUND', seats: [{ carNumber: 1, seatNumber }] }],
    ...extra,
  });

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(MailService)
      .useValue({ sendPasswordResetCode: async (to: string, _name: string, code: string) => void (sentCodes[to] = code) })
      .compile();
    app = configureApp(moduleRef.createNestApplication());
    await app.init();
    prisma = app.get(PrismaService);
    http = () => request(app.getHttpServer());

    await prisma.$executeRawUnsafe(
      'TRUNCATE seat_reservations, tickets, booking_segments, booking_passengers, booking_add_ons, bookings, journey_cars, journeys, routes, stations, add_ons, password_reset_tokens, users CASCADE',
    );
    await prisma.user.create({
      data: { email: 'staff@test.dev', fullName: 'Staff Tester', role: 'STAFF', passwordHash: await hashPassword('Staff#2026') },
    });
    await prisma.addOn.create({
      data: { code: 'EXTRA_LUGGAGE', name: 'Extra Luggage', description: '+1 bag', icon: 'luggage', priceCents: 3_500 },
    });

    staffToken = (await http().post('/api/auth/login').send({ email: 'staff@test.dev', password: 'Staff#2026' }).expect(200)).body.accessToken;
    ama = (await http().post('/api/auth/register').send({ fullName: 'Ama Test', email: 'ama@test.dev', password: 'Passenger1' }).expect(201)).body.accessToken;
    kofi = (await http().post('/api/auth/register').send({ fullName: 'Kofi Test', email: 'kofi@test.dev', password: 'Passenger1' }).expect(201)).body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('rejects anonymous and passenger access to staff endpoints', async () => {
    await http().get('/api/admin/overview').expect(401);
    const response = await http().get('/api/admin/overview').set(auth(ama)).expect(403);
    expect(response.body.code).toBe('FORBIDDEN');
  });

  it('returns field errors for invalid registration', async () => {
    const response = await http().post('/api/auth/register').send({ fullName: 'A', email: 'nope', password: 'short' }).expect(400);
    expect(response.body.code).toBe('VALIDATION_FAILED');
    expect(Object.keys(response.body.details.fieldErrors)).toEqual(expect.arrayContaining(['fullName', 'email', 'password']));
  });

  it('lets staff build a route and schedule a journey', async () => {
    const station = (code: string, name: string) =>
      http().post('/api/admin/stations').set(auth(staffToken)).send({ code, name, city: name }).expect(201);
    const accra = (await station('TAC', 'Test Accra')).body;
    const kumasi = (await station('TKS', 'Test Kumasi')).body;
    routeId = (
      await http()
        .post('/api/admin/routes')
        .set(auth(staffToken))
        .send({ originId: accra.id, destinationId: kumasi.id, distanceKm: 250, defaultFirstClassFareCents: 17_500, defaultSecondClassFareCents: 11_500, createReturnRoute: true })
        .expect(201)
    ).body.id;

    const departure = new Date(Date.now() + 2 * DAY);
    const created = await http()
      .post('/api/admin/journeys')
      .set(auth(staffToken))
      .send({
        routeId,
        serviceCode: 'IC',
        trainNumber: 'IC 9001',
        trainName: 'InterCity',
        departureAt: departure.toISOString(),
        arrivalAt: new Date(departure.getTime() + 190 * 60_000).toISOString(),
        cars: [
          { carNumber: 1, travelClass: 'FIRST', compartments: 1 },
          { carNumber: 2, travelClass: 'SECOND', compartments: 2 },
        ],
      })
      .expect(201);
    journeyId = created.body.createdIds[0];
    expect(created.body.journey.totalSeats).toBe(18);

    const search = await http()
      .get('/api/journeys/search')
      .query({ originId: accra.id, destinationId: kumasi.id, date: departure.toISOString().slice(0, 10) })
      .expect(200);
    expect(search.body.map((journey: { id: string }) => journey.id)).toContain(journeyId);
  });

  it('prices on the server and refuses client-supplied totals', async () => {
    const quote = await http()
      .post('/api/bookings/quote')
      .set(auth(ama))
      .send({ tripType: 'ONE_WAY', segments: seatBooking(1).segments, addOns: [{ code: 'EXTRA_LUGGAGE', quantity: 1 }] })
      .expect(200);
    expect(quote.body.totalCents).toBe(17_500 + 3_500);

    await http().post('/api/bookings').set(auth(ama)).send(seatBooking(1, { totalCents: 1 })).expect(400);
  });

  it('books a seat and shows it as taken', async () => {
    const booking = await http()
      .post('/api/bookings')
      .set(auth(ama))
      .send(seatBooking(1, { addOns: [{ code: 'EXTRA_LUGGAGE', quantity: 1 }] }))
      .expect(201);
    expect(booking.body.reference).toMatch(/^TRN-\d{4}-\d{6}$/);
    expect(booking.body.totalCents).toBe(21_000);
    expect(booking.body.segments[0].tickets[0].ticketCode).toMatch(/^RP-/);

    const seats = await http().get(`/api/journeys/${journeyId}/seats`).expect(200);
    expect(seats.body.cars[0].takenSeats).toEqual([1]);
  });

  it('allows exactly one of two concurrent bookings for the same seat', async () => {
    const results = await Promise.all([
      http().post('/api/bookings').set(auth(ama)).send(seatBooking(2)),
      http().post('/api/bookings').set(auth(kofi)).send(seatBooking(2)),
    ]);
    const statuses = results.map((result) => result.status).sort();
    expect(statuses).toEqual([201, 409]);
    expect(results.find((result) => result.status === 409)!.body.code).toBe('SEAT_TAKEN');
    expect(await prisma.seatReservation.count({ where: { journeyId, carNumber: 1, seatNumber: 2 } })).toBe(1);
  });

  it('hides other passengers’ bookings and frees seats on cancellation', async () => {
    const mine = (await http().get('/api/bookings').set(auth(ama)).expect(200)).body;
    const target = mine.find((booking: { segments: { tickets: { seatNumber: number }[] }[] }) => booking.segments[0].tickets[0].seatNumber === 1);
    await http().get(`/api/bookings/${target.id}`).set(auth(kofi)).expect(404);
    await http().post(`/api/bookings/${target.id}/cancel`).set(auth(kofi)).expect(404);

    const cancelled = await http().post(`/api/bookings/${target.id}/cancel`).set(auth(ama)).expect(200);
    expect(cancelled.body.status).toBe('CANCELLED');
    const seats = await http().get(`/api/journeys/${journeyId}/seats`).expect(200);
    expect(seats.body.cars[0].takenSeats).not.toContain(1);

    await http().post('/api/bookings').set(auth(kofi)).send(seatBooking(1)).expect(201);
  });

  it('gives staff searchable bookings, occupancy and status control', async () => {
    const list = await http().get('/api/admin/bookings').query({ search: 'Ama Test' }).set(auth(staffToken)).expect(200);
    expect(list.body.total).toBeGreaterThan(0);

    const detail = await http().get(`/api/admin/journeys/${journeyId}`).set(auth(staffToken)).expect(200);
    expect(detail.body.availableSeats).toBe(16);
    expect(detail.body.manifest.length).toBeGreaterThan(0);

    const forJourney = await http().get('/api/admin/bookings').query({ journeyId, status: 'CONFIRMED' }).set(auth(staffToken)).expect(200);
    const active = forJourney.body.items[0];
    const checkedIn = await http()
      .patch(`/api/admin/bookings/${active.id}/status`)
      .set(auth(staffToken))
      .send({ status: 'CHECKED_IN' })
      .expect(200);
    expect(checkedIn.body.status).toBe('CHECKED_IN');
  });

  it('protects booked seats when staff change capacity', async () => {
    const response = await http()
      .patch(`/api/admin/journeys/${journeyId}`)
      .set(auth(staffToken))
      .send({ cars: [{ carNumber: 2, travelClass: 'SECOND', compartments: 2 }] })
      .expect(409);
    expect(response.body.code).toBe('CAPACITY_CONFLICT');
  });

  it('resets a password with an emailed code', async () => {
    await http().post('/api/auth/password/forgot').send({ email: 'ama@test.dev' }).expect(202);
    await http().post('/api/auth/password/forgot').send({ email: 'nobody@test.dev' }).expect(202);
    const code = sentCodes['ama@test.dev'];
    expect(code).toMatch(/^\d{6}$/);

    const wrong = code === '000000' ? '111111' : '000000';
    await http().post('/api/auth/password/reset').send({ email: 'ama@test.dev', code: wrong, password: 'NewPassword1' }).expect(400);
    await http().post('/api/auth/password/reset').send({ email: 'ama@test.dev', code, password: 'NewPassword1' }).expect(200);
    await http().post('/api/auth/login').send({ email: 'ama@test.dev', password: 'NewPassword1' }).expect(200);
    await http().post('/api/auth/password/reset').send({ email: 'ama@test.dev', code, password: 'Another1pass' }).expect(400);
  });
});
