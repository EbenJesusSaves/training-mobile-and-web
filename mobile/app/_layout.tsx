import { useEffect, useMemo } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider as NavigationThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import { ThemeProvider, useTheme } from '@/components/theme/theme-provider';

import { usePreferencesStore } from '@/store/preferences-store';
import { selectIsSignedIn, useSessionStore } from '@/store/session-store';

import { fontAssets } from '@/constants/fonts';

void SplashScreen.preventAutoHideAsync();

/**
 * Root layout: loads fonts and persisted state, then decides which route group is reachable.
 * Protected groups mean screens never check auth themselves; changing the session store is enough.
 */
export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fontAssets);
  const sessionReady = useSessionStore((state) => state.hasHydrated);
  const preferencesReady = usePreferencesStore((state) => state.hasHydrated);
  const isReady = (fontsLoaded || Boolean(fontError)) && sessionReady && preferencesReady;

  useEffect(() => {
    if (isReady) void SplashScreen.hideAsync();
  }, [isReady]);

  if (!isReady) return null;

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <RootNavigator />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function RootNavigator() {
  const { colors, scheme } = useTheme();
  const isSignedIn = useSessionStore(selectIsSignedIn);
  const hasSeenOnboarding = usePreferencesStore((state) => state.hasSeenOnboarding);
  const navigationTheme = useMemo(() => {
    const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: colors.accent,
        background: colors.canvas,
        card: colors.surfaceRaised,
        text: colors.ink,
        border: colors.line,
      },
    };
  }, [colors, scheme]);

  return (
    <NavigationThemeProvider value={navigationTheme}>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.canvas } }}>
        <Stack.Protected guard={isSignedIn}>
          <Stack.Screen name="(app)" />
        </Stack.Protected>
        <Stack.Protected guard={!isSignedIn && !hasSeenOnboarding}>
          <Stack.Screen name="onboarding" />
        </Stack.Protected>
        <Stack.Protected guard={!isSignedIn && hasSeenOnboarding}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
      </Stack>
    </NavigationThemeProvider>
  );
}
