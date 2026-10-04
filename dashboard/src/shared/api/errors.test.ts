import axios from 'axios';
import { describe, expect, it } from 'vitest';

import { parseApiError } from './errors';

describe('parseApiError', () => {
  it('extracts field errors from API validation responses', () => {
    const error = new axios.AxiosError('Bad request', '400', undefined, undefined, {
      data: {
        statusCode: 400,
        code: 'VALIDATION_FAILED',
        message: 'Validation failed',
        details: { fieldErrors: { email: 'Invalid email' } },
      },
      status: 400,
      statusText: 'Bad Request',
      headers: {},
      config: {} as never,
    });
    const parsed = parseApiError(error);
    expect(parsed.code).toBe('VALIDATION_FAILED');
    expect(parsed.fieldErrors.email).toBe('Invalid email');
  });
});
