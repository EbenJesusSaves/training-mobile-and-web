import { Module } from '@nestjs/common';

import { BookingsModule } from '../bookings/bookings.module.js';
import { JourneysModule } from '../journeys/journeys.module.js';
import { BookingsAdminController } from './bookings-admin.controller.js';
import { JourneysAdminController } from './journeys-admin.controller.js';
import { JourneysAdminService } from './journeys-admin.service.js';
import { NetworkAdminController } from './network-admin.controller.js';
import { OverviewController } from './overview.controller.js';

@Module({
  imports: [BookingsModule, JourneysModule],
  controllers: [OverviewController, JourneysAdminController, NetworkAdminController, BookingsAdminController],
  providers: [JourneysAdminService],
})
export class AdminModule {}
