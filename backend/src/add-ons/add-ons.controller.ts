import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Public } from '../common/decorators/auth.decorators.js';
import { PrismaService } from '../prisma/prisma.service.js';

export const toAddOnDto = (addOn: {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  priceCents: number;
  isActive: boolean;
  sortOrder: number;
}) => ({
  id: addOn.id,
  code: addOn.code,
  name: addOn.name,
  description: addOn.description,
  icon: addOn.icon,
  priceCents: addOn.priceCents,
  isActive: addOn.isActive,
  sortOrder: addOn.sortOrder,
});

@ApiTags('add-ons')
@Public()
@Controller('add-ons')
export class AddOnsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async list() {
    const addOns = await this.prisma.addOn.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } });
    return addOns.map(toAddOnDto);
  }
}
