import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { secureStorage } from '@/libs/secure-storage';

import type { Session, User } from '@/api/types';

interface SessionState {
  token: string | null;
  user: User | null;
  /** "Remember me": when false the session lives in memory only and ends when the app closes. */
  remember: boolean;
  hasHydrated: boolean;
  signIn: (session: Session, remember?: boolean) => void;
  updateUser: (user: User) => void;
  signOut: () => void;
}

/** The signed-in passenger. Persisted in SecureStore so the app opens straight into the session. */
export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      remember: true,
      hasHydrated: false,
      signIn: ({ accessToken, user }, remember = true) => set({ token: accessToken, user, remember }),
      updateUser: (user) => set({ user }),
      signOut: () => set({ token: null, user: null }),
    }),
    {
      name: 'railpass.session',
      storage: createJSONStorage(() => secureStorage),
      partialize: ({ token, user, remember }) => (remember ? { token, user, remember } : { token: null, user: null, remember }),
      onRehydrateStorage: () => () => useSessionStore.setState({ hasHydrated: true }),
    },
  ),
);

export const selectIsSignedIn = (state: SessionState) => Boolean(state.token && state.user);
