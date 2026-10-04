import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/atomic/app-text';
import { Icon, type IconName } from '@/components/atomic/icon';
import { useTheme } from '@/components/theme/theme-provider';

import { borderWidths } from '@/constants/borders';
import { iconSizes, sizes } from '@/constants/sizes';
import { spacing } from '@/constants/spacing';

import type { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';

type TabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

export const TABS: Record<string, { icon: IconName; label: string }> = {
  index: { icon: 'home', label: 'Home' },
  stations: { icon: 'stations', label: 'Stations' },
  tickets: { icon: 'tickets', label: 'Tickets' },
  profile: { icon: 'profile', label: 'Profile' },
};

/**
 * Android bottom navigation: icon over label, active item in ink (light) or the red accent (dark).
 * iOS uses the native tab bar instead (see `app/(app)/(tabs)/_layout.tsx`).
 */
export function AppTabBar({ state, navigation }: TabBarProps) {
  const { colors, scheme } = useTheme();
  const insets = useSafeAreaInsets();
  const activeColor = scheme === 'dark' ? colors.accent : colors.ink;

  return (
    <View
      accessibilityRole="tablist"
      style={[
        styles.bar,
        { backgroundColor: colors.surfaceRaised, borderTopColor: colors.line, paddingBottom: Math.max(insets.bottom, spacing.md) },
      ]}
    >
      {state.routes.map((route, index) => {
        const tab = TABS[route.name];
        if (!tab) return null;
        const isFocused = state.index === index;
        const color = isFocused ? activeColor : colors.tabInactive;
        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name, route.params);
        };
        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: isFocused }}
            accessibilityLabel={tab.label}
            onPress={onPress}
            style={styles.item}
          >
            <Icon name={tab.icon} size={iconSizes.tab} color={color} />
            <AppText variant={isFocused ? 'tabActive' : 'tab'} color={color}>
              {tab.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', borderTopWidth: borderWidths.hairline, paddingTop: spacing.md },
  item: { flex: 1, alignItems: 'center', gap: spacing.xxs, minHeight: sizes.tabItemMinHeight },
});
