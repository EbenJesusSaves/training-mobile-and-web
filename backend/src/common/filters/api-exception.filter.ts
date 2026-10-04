import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import type { Response } from 'express';

import { Prisma } from '../../generated/prisma/client.js';

/** Response shape for every error: { statusCode, code, message, details? } */
export interface ApiErrorBody {
  statusCode: number;
  code: string;
  message: string;
  details?: unknown;
}

const DEFAULT_CODES: Record<number, string> = {
  400: 'BAD_REQUEST',
  401: 'UNAUTHENTICATED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  409: 'CONFLICT',
  422: 'UNPROCESSABLE',
  429: 'TOO_MANY_REQUESTS',
};

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('ApiException');

  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const body = this.toBody(exception);
    if (body.statusCode >= 500) {
      this.logger.error(exception instanceof Error ? exception.stack : exception);
    }
    response.status(body.statusCode).json(body);
  }

  private toBody(exception: unknown): ApiErrorBody {
    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const raw = exception.getResponse();
      if (typeof raw === 'object' && raw !== null) {
        const { code, message, details } = raw as { code?: string; message?: string | string[]; details?: unknown };
        return {
          statusCode,
          code: code ?? DEFAULT_CODES[statusCode] ?? 'ERROR',
          message: Array.isArray(message) ? message[0] : (message ?? exception.message),
          ...(details !== undefined ? { details } : {}),
        };
      }
      return { statusCode, code: DEFAULT_CODES[statusCode] ?? 'ERROR', message: String(raw) };
    }

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      if (exception.code === 'P2025') {
        return { statusCode: HttpStatus.NOT_FOUND, code: 'NOT_FOUND', message: 'The requested record was not found.' };
      }
      if (exception.code === 'P2002') {
        return { statusCode: HttpStatus.CONFLICT, code: 'CONFLICT', message: 'A record with these details already exists.' };
      }
    }

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      code: 'INTERNAL_ERROR',
      message: 'Something went wrong on our side. Please try again.',
    };
  }
}
