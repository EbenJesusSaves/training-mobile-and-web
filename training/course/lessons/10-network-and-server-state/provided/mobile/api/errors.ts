import { isAxiosError } from 'axios';

import type { ApiErrorBody } from './types';

export const HTTP_STATUS = { unauthorized: 401, conflict: 409 } as const;

/** One error type for every failed request, so screens never inspect raw Axios errors. */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly code: string,
    readonly status: number | null,
    readonly fieldErrors: Record<string, string> = {},
    readonly details: unknown = undefined,
  ) {
    super(message);
    this.name = 'ApiError';
  }

  get isNetworkError() {
    return this.status === null;
  }
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;
  if (isAxiosError(error)) {
    if (!error.response) {
      const timedOut = error.code === 'ECONNABORTED';
      return new ApiError(
        timedOut
          ? 'The server took too long to respond. Please try again.'
          : 'We can’t reach RailPass right now. Check your connection and try again.',
        timedOut ? 'TIMEOUT' : 'NETWORK_ERROR',
        null,
      );
    }
    const body = error.response.data as ApiErrorBody | undefined;
    return new ApiError(
      body?.message ?? 'Something went wrong. Please try again.',
      body?.code ?? 'UNKNOWN',
      error.response.status,
      body?.details?.fieldErrors ?? {},
      body?.details,
    );
  }
  return new ApiError(error instanceof Error ? error.message : 'Something went wrong.', 'UNKNOWN', null);
}
