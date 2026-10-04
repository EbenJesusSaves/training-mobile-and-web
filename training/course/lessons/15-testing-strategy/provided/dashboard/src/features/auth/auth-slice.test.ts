import { describe, expect, it } from 'vitest';

import { authReducer, setSession } from './auth-slice';

const staff = {
  id: '1',
  email: 'staff@railpass.dev',
  fullName: 'RailPass Staff',
  phone: null,
  role: 'STAFF' as const,
  createdAt: '2026-01-01T00:00:00.000Z',
};

describe('auth slice', () => {
  it('stores and clears a staff session', () => {
    const signedIn = authReducer(undefined, setSession({ token: 'token', user: staff }));
    expect(signedIn.token).toBe('token');
    expect(signedIn.user?.role).toBe('STAFF');
    // LIVE 15.5 — Assert logout clears the token and user.
    throw new Error('LIVE 15.5 — add logout assertions');
  });
});
