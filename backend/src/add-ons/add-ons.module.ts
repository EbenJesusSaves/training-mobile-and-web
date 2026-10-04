import { Module } from '@nestjs/common';

import { AddOnsController } from './add-ons.controller.js';

@Module({ controllers: [AddOnsController] })
export class AddOnsModule {}
