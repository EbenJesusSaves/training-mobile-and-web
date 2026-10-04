import { Module } from '@nestjs/common';

import { JourneyAvailabilityService } from './journey-availability.service.js';
import { JourneysController } from './journeys.controller.js';
import { JourneysService } from './journeys.service.js';

@Module({
  controllers: [JourneysController],
  providers: [JourneysService, JourneyAvailabilityService],
  exports: [JourneysService, JourneyAvailabilityService],
})
export class JourneysModule {}
