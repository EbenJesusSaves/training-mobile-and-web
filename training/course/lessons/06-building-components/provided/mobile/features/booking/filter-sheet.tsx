import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/atomic/app-text';
import { Icon } from '@/components/atomic/icon';
import { useTheme } from '@/components/theme/theme-provider';

import { borderWidths } from '@/constants/borders';
import { radii } from '@/constants/radii';
import { iconSizes, sizes } from '@/constants/sizes';
import { spacing } from '@/constants/spacing';

import type { JourneySort } from '@/api/types';

export const SORT_TITLES: Record<JourneySort, string> = {
  fastest: 'The Fastest',
  earliest: 'Earliest First',
  cheapest: 'The Cheapest',
};

const OPTIONS: { value: JourneySort; label: string; description: string }[] = [
  { value: 'fastest', label: 'Fastest', description: 'Shortest journey time first' },
  { value: 'earliest', label: 'Earliest departure', description: 'In timetable order' },
  { value: 'cheapest', label: 'Cheapest', description: 'Lowest fare first' },
];

interface SortOptionsProps {
  sort: JourneySort;
  onChange: (sort: JourneySort) => void;
}

/** Radio list shown in the native "Sort journeys" sheet (`app/(app)/sort.tsx`). */
export function SortOptions({ sort, onChange }: SortOptionsProps) {
  const { colors } = useTheme();
  return (
    <View accessibilityRole="radiogroup" style={[styles.list, { borderColor: colors.line, backgroundColor: colors.surfaceRaised }]}>
      {OPTIONS.map((option, index) => {
        const selected = option.value === sort;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            onPress={() => onChange(option.value)}
            style={[styles.option, index > 0 && { borderTopColor: colors.line, borderTopWidth: borderWidths.hairline }]}
          >
            <View style={styles.text}>
              <AppText variant="bodyStrong">{option.label}</AppText>
              <AppText variant="label" tone="muted">
                {option.description}
              </AppText>
            </View>
            <View
              style={[
                styles.radio,
                { borderColor: selected ? colors.ink : colors.line, backgroundColor: selected ? colors.ink : colors.transparent },
              ]}
            >
              {selected ? <Icon name="checkPlain" size={iconSizes.xs} color={colors.canvas} /> : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { borderRadius: radii.xl, borderWidth: borderWidths.hairline, overflow: 'hidden' },
  option: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, minHeight: sizes.rowMinHeight, gap: spacing.md },
  text: { flex: 1, gap: spacing.xxxs },
  radio: {
    width: sizes.radio,
    height: sizes.radio,
    borderRadius: radii.pill,
    borderWidth: borderWidths.thick,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
