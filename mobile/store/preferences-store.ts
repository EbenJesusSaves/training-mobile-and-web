import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { secureStorage } from '@/libs/secure-storage';

export type ThemeMode = 'system' | 'light' | 'dark';

interface PreferencesState {
  themeMode: ThemeMode;
  hasSeenOnboarding: boolean;
  /** Development only: point the app at another API without restarting Metro. */
  apiUrlOverride: string | null;
  hasHydrated: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  completeOnboarding: () => void;
  setApiUrlOverride: (url: string | null) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      themeMode: 'system',
      hasSeenOnboarding: false,
      apiUrlOverride: null,
      hasHydrated: false,
      setThemeMode: (themeMode) => set({ themeMode }),
      completeOnboarding: () => set({ hasSeenOnboarding: true }),
      setApiUrlOverride: (apiUrlOverride) => set({ apiUrlOverride }),
    }),
    {
      name: 'railpass.preferences',
      storage: createJSONStorage(() => secureStorage),
      partialize: ({ themeMode, hasSeenOnboarding, apiUrlOverride }) => ({ themeMode, hasSeenOnboarding, apiUrlOverride }),
      onRehydrateStorage: () => () => usePreferencesStore.setState({ hasHydrated: true }),
    },
  ),
);
