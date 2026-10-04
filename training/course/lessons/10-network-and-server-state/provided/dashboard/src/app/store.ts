import { configureStore } from '@reduxjs/toolkit';

import { authReducer, type AuthState, initialAuthState, logout } from '../features/auth/auth-slice';
import { initialPreferencesState, preferencesReducer, type PreferencesState } from '../features/preferences/preferences-slice';
import { setAuthAccessors } from '../shared/api/client';

const STORAGE_KEY = 'railpass-dashboard-state-v1';

interface PersistedState {
  auth?: AuthState;
  preferences?: PreferencesState;
}

function loadState(): PersistedState | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    return JSON.parse(raw) as PersistedState;
  } catch {
    return undefined;
  }
}

const persisted = loadState();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    preferences: preferencesReducer,
  },
  preloadedState: {
    auth: persisted?.auth ?? initialAuthState,
    preferences: persisted?.preferences ?? initialPreferencesState,
  },
});

store.subscribe(() => {
  if (typeof window === 'undefined') return;
  const { auth, preferences } = store.getState();
  // The training API issues bearer tokens only, so the dashboard persists the token in localStorage. In production, prefer httpOnly cookies to reduce XSS blast radius.
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ auth, preferences }));
});

setAuthAccessors({
  getToken: () => store.getState().auth.token,
  onUnauthorized: () => store.dispatch(logout()),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
