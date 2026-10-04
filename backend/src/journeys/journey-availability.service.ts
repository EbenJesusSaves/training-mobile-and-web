import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import type { ReservedByCar } from './journey.mapper.js';

@Injectable()
export class JourneyAvailabilityService {
  constructor(private readonly prisma: PrismaService) {}

  /** One grouped query for many journeys, instead of one query per journey card (avoids N+1). */
  async reservedByCar(journeyIds: string[]): Promise<Map<string, ReservedByCar>> {
    const result = new Map<string, ReservedByCar>();
    if (journeyIds.length === 0) return result;
    const rows = await this.prisma.seatReservation.groupBy({
      by: ['journeyId', 'carNumber'],
      where: { journeyId: { in: journeyIds } },
      _count: { _all: true },
    });
    for (const row of rows) {
      const perCar = result.get(row.journeyId) ?? new Map<number, number>();
      perCar.set(row.carNumber, row._count._all);
      result.set(row.journeyId, perCar);
    }
    return result;
  }

  async takenSeats(journeyId: string): Promise<Map<number, number[]>> {
    const rows = await this.prisma.seatReservation.findMany({
      where: { journeyId },
      select: { carNumber: true, seatNumber: true },
      orderBy: [{ carNumber: 'asc' }, { seatNumber: 'asc' }],
    });
    const byCar = new Map<number, number[]>();
    for (const row of rows) byCar.set(row.carNumber, [...(byCar.get(row.carNumber) ?? []), row.seatNumber]);
    return byCar;
  }
}
