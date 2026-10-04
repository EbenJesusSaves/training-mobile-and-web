import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, type TextTone } from '@/components/atomic/app-text';
import { Icon } from '@/components/atomic/icon';
import { useTheme } from '@/components/theme/theme-provider';

import { classLabel, formatFare } from '@/libs/format';

import { opacity } from '@/constants/opacity';
import { radii } from '@/constants/radii';
import { iconSizes, sizes } from '@/constants/sizes';
import { spacing } from '@/constants/spacing';

import type { JourneyClass, TravelClass } from '@/api/types';

interface ClassPickerProps {
  classes: JourneyClass[];
  value: TravelClass;
  onChange: (travelClass: TravelClass) => void;
}

/** Side-by-side class cards; the selected card is inverse (light) or the red accent (dark). */
export function ClassPicker({ classes, value, onChange }: ClassPickerProps) {
  const { colors, scheme } = useTheme();
  const isDark = scheme === 'dark';
  return (
    <View style={styles.row} accessibilityRole="radiogroup" accessibilityLabel="Travel class">
      {classes.map((option) => {
        const selected = option.travelClass === value;
        const soldOut = option.availableSeats === 0;
        const background = selected ? (isDark ? colors.accent : colors.inverse) : colors.surfaceRaised;
        const strong: TextTone = selected ? (isDark ? 'onAccent' : 'onInverse') : 'ink';
        const muted: TextTone = selected ? (isDark ? 'onAccent' : 'onInverseMuted') : 'muted';
        const iconColor = selected ? (isDark ? colors.onAccent : colors.onInverse) : colors.ink;
        return (
          <Pressable
            key={option.travelClass}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected, disabled: soldOut }}
            accessibilityLabel={`${classLabel(option.travelClass)}, ${option.availableSeats} seats available, ${formatFare(option.fareCents)} per passenger`}
            disabled={soldOut}
            onPress={() => onChange(option.travelClass)}
            style={[styles.card, { backgroundColor: background, opacity: soldOut ? opacity.unavailable : opacity.full }]}
          >
            <View style={styles.info}>
              <View style={styles.title}>
                <AppText variant="bodyStrong" tone={strong}>
                  {classLabel(option.travelClass)}
                </AppText>
                {option.airConditioned ? <Icon name="snowflake" size={iconSizes.xs} color={iconColor} /> : null}
              </View>
              <AppText variant="label" tone={muted}>
                {soldOut ? 'Sold out' : `${option.availableSeats} Seats`}
              </AppText>
            </View>
            <AppText variant="price" tone={strong}>
              {formatFare(option.fareCents)}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm },
  card: {
    flex: 1,
    borderRadius: radii.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: sizes.cardRowMinHeight,
    gap: spacing.xs,
  },
  info: { flex: 1, gap: spacing.xxxs },
  title: { flexDirection: 'row', alignItems: 'center', gap: spacing.xxs },
});
