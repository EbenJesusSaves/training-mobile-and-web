import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/atomic/app-text';
import { useTheme } from '@/components/theme/theme-provider';

import { radii } from '@/constants/radii';
import { sizes } from '@/constants/sizes';
import { spacing } from '@/constants/spacing';

import type { SeatMapCar } from '@/api/types';

interface CarSelectorProps {
  cars: SeatMapCar[];
  value: number;
  onChange: (carNumber: number) => void;
}

/** "Train Car 1 · 41/64 available" with numbered car pills on the right. */
export function CarSelector({ cars, value, onChange }: CarSelectorProps) {
  const { colors, scheme } = useTheme();
  const current = cars.find((car) => car.carNumber === value);
  const isDark = scheme === 'dark';
  return (
    <View style={styles.row}>
      <View>
        <AppText variant="title" accessibilityRole="header">
          Train Car {value}
        </AppText>
        {current ? (
          <AppText variant="label" tone="muted">
            {current.availableSeats}/{current.totalSeats} available
          </AppText>
        ) : null}
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pills} accessibilityRole="tablist">
        {cars.map((car) => {
          const selected = car.carNumber === value;
          return (
            <Pressable
              key={car.carNumber}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              accessibilityLabel={`Car ${car.carNumber}, ${car.availableSeats} seats available`}
              onPress={() => onChange(car.carNumber)}
              style={[styles.pill, { backgroundColor: selected ? (isDark ? colors.accent : colors.inverse) : colors.surfaceRaised }]}
            >
              <AppText variant="subheading" tone={selected ? (isDark ? 'onAccent' : 'onInverse') : 'secondary'}>
                {car.carNumber}
              </AppText>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  pills: { gap: spacing.sm, paddingLeft: spacing.xxs, flexGrow: 1, justifyContent: 'flex-end' },
  pill: { width: sizes.carPill, height: sizes.carPill, borderRadius: radii.lg, alignItems: 'center', justifyContent: 'center' },
});
