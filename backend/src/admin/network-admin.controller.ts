import { BadRequestException, Body, Controller, Get, NotFoundException, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { toAddOnDto } from '../add-ons/add-ons.controller.js';
import { Roles } from '../common/decorators/auth.decorators.js';
import { toStationDto } from '../journeys/journey.mapper.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateRouteDto, CreateStationDto, UpdateAddOnDto, UpdateRouteDto, UpdateStationDto } from './dto/admin.dto.js';

/** Stations, routes and extras: small CRUD resources that do not need their own services. */
@ApiTags('admin')
@ApiBearerAuth()
@Roles('STAFF')
@Controller('admin')
export class NetworkAdminController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('stations')
  async stations() {
    const stations = await this.prisma.station.findMany({
      include: { _count: { select: { departures: true, arrivals: true } } },
      orderBy: { name: 'asc' },
    });
    return stations.map((station) => ({
      ...toStationDto(station),
      routeCount: station._count.departures + station._count.arrivals,
    }));
  }

  @Post('stations')
  async createStation(@Body() dto: CreateStationDto) {
    return toStationDto(await this.prisma.station.create({ data: dto }));
  }

  @Patch('stations/:id')
  async updateStation(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateStationDto) {
    return toStationDto(await this.prisma.station.update({ where: { id }, data: dto }));
  }

  @Get('routes')
  async routes() {
    const now = new Date();
    const routes = await this.prisma.route.findMany({
      include: {
        origin: true,
        destination: true,
        _count: { select: { journeys: { where: { departureAt: { gte: now }, status: { not: 'CANCELLED' } } } } },
      },
      orderBy: [{ origin: { name: 'asc' } }, { destination: { name: 'asc' } }],
    });
    return routes.map((route) => ({
      id: route.id,
      origin: toStationDto(route.origin),
      destination: toStationDto(route.destination),
      distanceKm: route.distanceKm,
      defaultFirstClassFareCents: route.defaultFirstClassFareCents,
      defaultSecondClassFareCents: route.defaultSecondClassFareCents,
      isActive: route.isActive,
      upcomingJourneys: route._count.journeys,
    }));
  }

  @Post('routes')
  async createRoute(@Body() dto: CreateRouteDto) {
    if (dto.originId === dto.destinationId) {
      throw new BadRequestException({ code: 'SAME_STATION', message: 'Origin and destination must be different stations.' });
    }
    const { createReturnRoute, ...data } = dto;
    const stations = await this.prisma.station.count({ where: { id: { in: [dto.originId, dto.destinationId] } } });
    if (stations !== 2) throw new NotFoundException({ code: 'STATION_NOT_FOUND', message: 'Choose two existing stations.' });
    return this.prisma.$transaction(async (tx) => {
      const route = await tx.route.create({ data });
      if (createReturnRoute) {
        await tx.route.upsert({
          where: { originId_destinationId: { originId: dto.destinationId, destinationId: dto.originId } },
          update: {},
          create: { ...data, originId: dto.destinationId, destinationId: dto.originId },
        });
      }
      return route;
    });
  }

  @Patch('routes/:id')
  updateRoute(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateRouteDto) {
    return this.prisma.route.update({ where: { id }, data: dto });
  }

  @Get('add-ons')
  async addOns() {
    const addOns = await this.prisma.addOn.findMany({ orderBy: { sortOrder: 'asc' } });
    return addOns.map(toAddOnDto);
  }

  @Patch('add-ons/:id')
  async updateAddOn(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateAddOnDto) {
    return toAddOnDto(await this.prisma.addOn.update({ where: { id }, data: dto }));
  }
}
