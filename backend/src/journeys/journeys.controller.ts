import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Public } from '../common/decorators/auth.decorators.js';
import { SearchJourneysDto } from './dto/search-journeys.dto.js';
import { JourneysService } from './journeys.service.js';

@ApiTags('journeys')
@Public()
@Controller('journeys')
export class JourneysController {
  constructor(private readonly journeys: JourneysService) {}

  @Get('search')
  search(@Query() query: SearchJourneysDto) {
    return this.journeys.search(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.journeys.findOne(id);
  }

  @Get(':id/seats')
  seats(@Param('id', ParseUUIDPipe) id: string) {
    return this.journeys.seatMap(id);
  }
}
