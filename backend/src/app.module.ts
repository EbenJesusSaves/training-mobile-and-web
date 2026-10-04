import { Module } from '@nestjs/common';

import { AddOnsModule } from './add-ons/add-ons.module.js';
import { AdminModule } from './admin/admin.module.js';
import { AuthModule } from './auth/auth.module.js';
import { BookingsModule } from './bookings/bookings.module.js';
import { HealthController } from './health.controller.js';
import { JourneysModule } from './journeys/journeys.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { StationsModule } from './stations/stations.module.js';
import { UsersModule } from './users/users.module.js';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, StationsModule, JourneysModule, AddOnsModule, BookingsModule, AdminModule],
  controllers: [HealthController],
})
export class AppModule {}
