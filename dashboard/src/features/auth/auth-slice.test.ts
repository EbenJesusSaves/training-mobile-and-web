import { describe, expect, it } from 'vitest';

import { authReducer, logout, setSession } from './auth-slice';

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
    expect(authReducer(signedIn, logout()).token).toBeNull();
  });
});
