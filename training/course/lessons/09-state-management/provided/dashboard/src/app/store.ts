// Course version (lesson 09) — becomes the full RailPass version in lesson 10.
import { configureStore } from '@reduxjs/toolkit';

import { authReducer, initialAuthState } from '../features/auth/auth-slice';
import { initialPreferencesState, preferencesReducer, type PreferencesState } from '../features/preferences/preferences-slice';

const STORAGE_KEY = 'railpass-dashboard-state-v1';

interface PersistedState {
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
    auth: initialAuthState,
    preferences: persisted?.preferences ?? initialPreferencesState,
  },
});

store.subscribe(() => {
  if (typeof window === 'undefined') return;
  // LIVE 09.7 — Persist only dashboard preferences to localStorage.
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
