import { BadRequestException, Body, Controller, Get, NotFoundException, Param, ParseUUIDPipe, Patch, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { bookingInclude, toBookingDto } from '../bookings/booking.mapper.js';
import { BookingsService } from '../bookings/bookings.service.js';
import { Roles } from '../common/decorators/auth.decorators.js';
import { Prisma } from '../generated/prisma/client.js';
import { toUserDto } from '../users/user.mapper.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { paginate, PaginationQueryDto } from './dto/pagination.dto.js';
import { ListBookingsAdminQueryDto, UpdateBookingStatusDto } from './dto/admin.dto.js';

@ApiTags('admin')
@ApiBearerAuth()
@Roles('STAFF')
@Controller('admin')
export class BookingsAdminController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bookings: BookingsService,
  ) {}

  @Get('bookings')
  async list(@Query() query: ListBookingsAdminQueryDto) {
    const { page, pageSize, skip, take } = paginate(query);
    const search = query.search?.trim();
    const contains = (value: string) => ({ contains: value, mode: 'insensitive' as const });
    const where: Prisma.BookingWhereInput = {
      ...(query.status ? { status: query.status } : {}),
      ...(query.userId ? { userId: query.userId } : {}),
      ...(query.journeyId ? { segments: { some: { journeyId: query.journeyId } } } : {}),
      ...(search
        ? {
            OR: [
              { reference: contains(search) },
              { contactEmail: contains(search) },
              { user: { fullName: contains(search) } },
              { user: { email: contains(search) } },
              { passengers: { some: { fullName: contains(search) } } },
              { segments: { some: { tickets: { some: { ticketCode: contains(search) } } } } },
            ],
          }
        : {}),
    };
    const [total, bookings] = await Promise.all([
      this.prisma.booking.count({ where }),
      this.prisma.booking.findMany({ where, include: bookingInclude, orderBy: { createdAt: 'desc' }, skip, take }),
    ]);
    return { items: bookings.map((booking) => toBookingDto(booking)), total, page, pageSize };
  }

  @Get('bookings/:id')
  async detail(@Param('id', ParseUUIDPipe) id: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id }, include: bookingInclude });
    if (!booking) throw new NotFoundException({ code: 'BOOKING_NOT_FOUND', message: 'Booking not found.' });
    return toBookingDto(booking, new Date(), { includeBarcodes: true });
  }

  /** Allowed transitions: CONFIRMED ⇄ CHECKED_IN, and either → CANCELLED (final). */
  @Patch('bookings/:id/status')
  async updateStatus(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateBookingStatusDto) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException({ code: 'BOOKING_NOT_FOUND', message: 'Booking not found.' });
    if (booking.status === 'CANCELLED') {
      throw new BadRequestException({ code: 'INVALID_TRANSITION', message: 'Cancelled bookings cannot be changed.' });
    }
    if (dto.status === 'CANCELLED') {
      await this.bookings.cancel(id, dto.reason || 'Cancelled by RailPass staff');
    } else if (dto.status !== booking.status) {
      await this.prisma.booking.update({
        where: { id },
        data: { status: dto.status, checkedInAt: dto.status === 'CHECKED_IN' ? new Date() : null },
      });
    }
    return this.detail(id);
  }

  @Get('passengers')
  async passengers(@Query() query: PaginationQueryDto) {
    const { page, pageSize, skip, take } = paginate(query);
    const search = query.search?.trim();
    const where: Prisma.UserWhereInput = {
      role: 'PASSENGER',
      ...(search
        ? {
            OR: [
              { fullName: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
              { phone: { contains: search } },
            ],
          }
        : {}),
    };
    const [total, users] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take, include: { _count: { select: { bookings: true } } } }),
    ]);
    const spend = await this.prisma.booking.groupBy({
      by: ['userId'],
      where: { userId: { in: users.map((user) => user.id) }, status: { not: 'CANCELLED' } },
      _sum: { totalCents: true },
    });
    const spendByUser = new Map(spend.map((row) => [row.userId, row._sum.totalCents ?? 0]));
    return {
      items: users.map((user) => ({
        ...toUserDto(user),
        bookingCount: user._count.bookings,
        totalSpentCents: spendByUser.get(user.id) ?? 0,
      })),
      total,
      page,
      pageSize,
    };
  }

  @Get('passengers/:id')
  async passenger(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user || user.role !== 'PASSENGER') throw new NotFoundException({ code: 'PASSENGER_NOT_FOUND', message: 'Passenger not found.' });
    const bookings = await this.prisma.booking.findMany({ where: { userId: id }, include: bookingInclude, orderBy: { createdAt: 'desc' } });
    return { ...toUserDto(user), bookings: bookings.map((booking) => toBookingDto(booking)) };
  }
}
