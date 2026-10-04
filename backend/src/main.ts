import { Logger } from '@nestjs/common';

import { createApp } from './app.factory.js';
import { appConfig } from './config/app-config.js';

const app = await createApp();
// 0.0.0.0 lets phones and emulators on the same network reach a facilitator-hosted API.
await app.listen(appConfig.port, '0.0.0.0');
Logger.log(`RailPass API on http://localhost:${appConfig.port}/api (docs: /api/docs)`, 'Bootstrap');
