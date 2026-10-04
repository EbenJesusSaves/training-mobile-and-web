import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Roles } from '../common/decorators/auth.decorators.js';
import { CreateJourneyDto, ListJourneysQueryDto, UpdateJourneyDto } from './dto/admin.dto.js';
import { JourneysAdminService } from './journeys-admin.service.js';

@ApiTags('admin')
@ApiBearerAuth()
@Roles('STAFF')
@Controller('admin/journeys')
export class JourneysAdminController {
  constructor(private readonly journeys: JourneysAdminService) {}

  @Get()
  list(@Query() query: ListJourneysQueryDto) {
    return this.journeys.list(query);
  }

  @Get(':id')
  detail(@Param('id', ParseUUIDPipe) id: string) {
    return this.journeys.detail(id);
  }

  @Post()
  create(@Body() dto: CreateJourneyDto) {
    return this.journeys.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateJourneyDto) {
    return this.journeys.update(id, dto);
  }
}
