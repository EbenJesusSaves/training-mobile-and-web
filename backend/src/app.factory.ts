import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module.js';
import { ApiExceptionFilter } from './common/filters/api-exception.filter.js';
import { validationPipe } from './common/utils/validation.js';
import { appConfig } from './config/app-config.js';

/** Shared by main.ts and the e2e tests so both run the exact same pipeline. */
export function configureApp(app: INestApplication) {
  app.setGlobalPrefix('api');
  app.useGlobalPipes(validationPipe);
  app.useGlobalFilters(new ApiExceptionFilter());
  // Native apps do not send an Origin header, so CORS only affects the browser dashboard.
  app.enableCors({ origin: appConfig.corsOrigins.length ? appConfig.corsOrigins : true });
  app.enableShutdownHooks();
  return app;
}

export async function createApp() {
  const app = configureApp(await NestFactory.create(AppModule));
  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder().setTitle('RailPass API').setVersion('1.0').addBearerAuth().build(),
  );
  SwaggerModule.setup('api/docs', app, document);
  return app;
}
