import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/atomic/app-text';
import { useTheme } from '@/components/theme/theme-provider';

import { radii } from '@/constants/radii';
import { sizes } from '@/constants/sizes';
import { spacing } from '@/constants/spacing';

interface SegmentedTabsProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  accessibilityLabel: string;
}

/** The "One Way / Round Trip / Archive" control: an iOS-style track with a raised active segment. */
export function SegmentedTabs<T extends string>({ options, value, onChange, accessibilityLabel }: SegmentedTabsProps<T>) {
  const { colors } = useTheme();
  return (
    <View
      accessibilityRole="tablist"
      accessibilityLabel={accessibilityLabel}
      style={[styles.track, { backgroundColor: colors.glassTrack }]}
    >
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            onPress={() => onChange(option.value)}
            style={[styles.tab, isActive && { backgroundColor: colors.controlActive }]}
          >
            <AppText variant={isActive ? 'labelStrong' : 'label'} tone={isActive ? 'ink' : 'muted'}>
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: { flexDirection: 'row', borderRadius: radii.md, padding: spacing.xxxs },
  tab: { flex: 1, minHeight: sizes.segmentHeight, borderRadius: radii.sm, alignItems: 'center', justifyContent: 'center' },
});
