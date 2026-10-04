import { Module } from '@nestjs/common';

import { JourneysModule } from '../journeys/journeys.module.js';
import { StationsController } from './stations.controller.js';
import { StationsService } from './stations.service.js';

@Module({
  imports: [JourneysModule],
  controllers: [StationsController],
  providers: [StationsService],
})
export class StationsModule {}
