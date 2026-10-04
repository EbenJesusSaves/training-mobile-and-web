import { Platform, useColorScheme } from 'react-native';
import { Stack } from 'expo-router';

import { useTheme } from '@/components/theme/theme-provider';

import { radii } from '@/constants/radii';

export const unstable_settings = { initialRouteName: '(tabs)' };

const LIQUID_GLASS_IOS_VERSION = 26;
const supportsLiquidGlass = Platform.OS === 'ios' && Number.parseInt(String(Platform.Version), 10) >= LIQUID_GLASS_IOS_VERSION;

/** Signed-in area: the tab navigator plus the screens pushed over it. */
export default function AppLayout() {
  const { colors, scheme } = useTheme();
  const systemScheme = useColorScheme();
  // Glass follows the system appearance, so only use it when the app theme agrees (text stays legible).
  const glassSheet = supportsLiquidGlass && systemScheme === scheme;
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.canvas } }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="station-picker" />
      <Stack.Screen
        name="sort"
        options={{
          presentation: 'formSheet',
          sheetAllowedDetents: 'fitToContents',
          sheetGrabberVisible: true,
          sheetCornerRadius: radii.xxxl,
          contentStyle: { backgroundColor: glassSheet ? colors.transparent : colors.surfaceRaised },
        }}
      />
      <Stack.Screen name="journeys/[id]" />
      <Stack.Screen name="return-journeys" />
      <Stack.Screen name="checkout" />
      <Stack.Screen name="booking-confirmed/[id]" options={{ gestureEnabled: false, animation: 'fade' }} />
      <Stack.Screen name="tickets/[id]" />
      <Stack.Screen name="stations/[id]" />
      <Stack.Screen name="updates" />
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="change-password" />
    </Stack>
  );
}
