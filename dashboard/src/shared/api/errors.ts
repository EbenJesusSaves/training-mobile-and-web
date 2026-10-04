import axios from 'axios';

export interface ApiErrorBody {
  statusCode?: number;
  code?: string;
  message?: string | string[];
  details?: { fieldErrors?: Record<string, string>; [key: string]: unknown };
}

export class ApiError extends Error {
  statusCode?: number;
  code?: string;
  details?: ApiErrorBody['details'];
  fieldErrors: Record<string, string>;

  constructor(message: string, body: ApiErrorBody = {}) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = body.statusCode;
    this.code = body.code;
    this.details = body.details;
    this.fieldErrors = body.details?.fieldErrors ?? {};
  }
}

export function parseApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (axios.isAxiosError<ApiErrorBody>(error)) {
    const body = error.response?.data;
    if (body && typeof body === 'object') {
      const rawMessage = body.message ?? error.message;
      const message = Array.isArray(rawMessage) ? rawMessage.join(' ') : rawMessage;
      return new ApiError(message || 'The request failed.', { ...body, statusCode: body.statusCode ?? error.response?.status });
    }
    return new ApiError(error.message || 'The request failed.', { statusCode: error.response?.status });
  }

  if (error instanceof Error) return new ApiError(error.message);
  return new ApiError('Something went wrong. Please try again.');
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function fieldError(error: unknown, field: string) {
  return parseApiError(error).fieldErrors[field];
}
