import { createContext, type ReactNode, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';

import { usePreferencesStore } from '@/store/preferences-store';

import { type AppTheme, type ColorScheme, createTheme } from './tokens';

const ThemeContext = createContext<AppTheme>(createTheme('light'));

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const themeMode = usePreferencesStore((state) => state.themeMode);
  const scheme = themeMode === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : themeMode;
  const theme = useMemo(() => createTheme(scheme), [scheme]);
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

/** Forces a scheme for a subtree, e.g. chips printed on the always-white paper ticket. */
export function ThemeScope({ scheme, children }: { scheme: ColorScheme; children: ReactNode }) {
  const theme = useMemo(() => createTheme(scheme), [scheme]);
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
