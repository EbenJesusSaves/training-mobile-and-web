// Course version (lesson 05) — becomes the full RailPass version in lesson 09.
import { createContext, type ReactNode, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';

import { type AppTheme, type ColorScheme, createTheme } from './tokens';

const ThemeContext = createContext<AppTheme>(createTheme('light'));

export function ThemeProvider({ children }: { children: ReactNode }) {
  const _systemScheme = useColorScheme();
  // LIVE 05.1 — Choose light or dark from the system color scheme.
  const scheme: ColorScheme = 'light';
  const theme = useMemo(() => createTheme(scheme), [scheme]);
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function ThemeScope({ scheme, children }: { scheme: ColorScheme; children: ReactNode }) {
  const theme = useMemo(() => createTheme(scheme), [scheme]);
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
