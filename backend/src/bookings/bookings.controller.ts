import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CurrentUser, Roles, type AuthUser } from '../common/decorators/auth.decorators.js';
import { BookingsService } from './bookings.service.js';
import { CreateBookingDto, ListBookingsQueryDto, QuoteBookingDto } from './dto/booking.dto.js';

@ApiTags('bookings')
@ApiBearerAuth()
@Roles('PASSENGER')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookings: BookingsService) {}

  @Post('quote')
  @HttpCode(HttpStatus.OK)
  quote(@Body() dto: QuoteBookingDto) {
    return this.bookings.quote(dto);
  }

  /** Simulated checkout: creates a real, persisted booking. No payment is taken. */
  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateBookingDto) {
    return this.bookings.create(user.id, user.email, dto);
  }

  @Get()
  list(@CurrentUser() user: AuthUser, @Query() query: ListBookingsQueryDto) {
    return this.bookings.listForUser(user.id, query.scope);
  }

  @Get(':id')
  findOne(@CurrentUser() user: AuthUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.bookings.findOwned(user.id, id);
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  cancel(@CurrentUser() user: AuthUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.bookings.cancelOwned(user.id, id);
  }
}
