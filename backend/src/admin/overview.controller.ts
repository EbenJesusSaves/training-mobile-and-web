import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { bookingInclude, toBookingDto } from '../bookings/booking.mapper.js';
import { Roles } from '../common/decorators/auth.decorators.js';
import { JourneyAvailabilityService } from '../journeys/journey-availability.service.js';
import { journeyInclude, toJourneyDto } from '../journeys/journey.mapper.js';
import { PrismaService } from '../prisma/prisma.service.js';

const DAY_MS = 86_400_000;
const startOfUtcDay = (date: Date) => new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));

@ApiTags('admin')
@ApiBearerAuth()
@Roles('STAFF')
@Controller('admin/overview')
export class OverviewController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly availability: JourneyAvailabilityService,
  ) {}

  @Get()
  async overview() {
    const now = new Date();
    const today = startOfUtcDay(now);
    const fourteenDaysAgo = new Date(today.getTime() - 13 * DAY_MS);
    const nextWeek = new Date(now.getTime() + 7 * DAY_MS);

    const [recentBookings, upcomingJourneys, passengerCount, latest] = await Promise.all([
      this.prisma.booking.findMany({
        where: { createdAt: { gte: fourteenDaysAgo } },
        select: { createdAt: true, totalCents: true, status: true },
      }),
      this.prisma.journey.findMany({
        where: { departureAt: { gte: now, lt: nextWeek }, status: { not: 'CANCELLED' } },
        include: journeyInclude,
        orderBy: { departureAt: 'asc' },
      }),
      this.prisma.user.count({ where: { role: 'PASSENGER' } }),
      this.prisma.booking.findMany({ include: bookingInclude, orderBy: { createdAt: 'desc' }, take: 8 }),
    ]);

    const reserved = await this.availability.reservedByCar(upcomingJourneys.map((journey) => journey.id));
    const journeys = upcomingJourneys.map((journey) => toJourneyDto(journey, reserved.get(journey.id)));
    const seats = journeys.reduce((sum, journey) => sum + journey.totalSeats, 0);
    const sold = journeys.reduce((sum, journey) => sum + journey.totalSeats - journey.availableSeats, 0);

    const daily = Array.from({ length: 14 }, (_, index) => {
      const day = new Date(fourteenDaysAgo.getTime() + index * DAY_MS);
      const items = recentBookings.filter(
        (booking) => booking.createdAt >= day && booking.createdAt < new Date(day.getTime() + DAY_MS) && booking.status !== 'CANCELLED',
      );
      return { date: day.toISOString().slice(0, 10), bookings: items.length, revenueCents: items.reduce((sum, item) => sum + item.totalCents, 0) };
    });
    const todayStats = daily[daily.length - 1];
    const lastSeven = daily.slice(-7);

    return {
      currency: 'GHS',
      generatedAt: now,
      totals: {
        bookingsToday: todayStats.bookings,
        revenueTodayCents: todayStats.revenueCents,
        bookingsLast7Days: lastSeven.reduce((sum, day) => sum + day.bookings, 0),
        revenueLast7DaysCents: lastSeven.reduce((sum, day) => sum + day.revenueCents, 0),
        upcomingJourneys: journeys.length,
        delayedJourneys: journeys.filter((journey) => journey.status === 'DELAYED').length,
        passengers: passengerCount,
        averageOccupancy: seats === 0 ? 0 : Math.round((sold / seats) * 100) / 100,
      },
      daily,
      nextDepartures: journeys.slice(0, 8),
      busiestJourneys: [...journeys].sort((a, b) => b.occupancy - a.occupancy).slice(0, 5),
      recentBookings: latest.map((booking) => toBookingDto(booking, now)),
    };
  }
}
