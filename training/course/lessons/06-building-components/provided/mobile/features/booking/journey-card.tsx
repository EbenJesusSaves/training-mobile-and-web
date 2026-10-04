import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/atomic/app-text';
import { Icon } from '@/components/atomic/icon';
import { useTheme } from '@/components/theme/theme-provider';
import { JourneyTimeline } from '@/components/ui/display/journey-timeline';
import { StatusChip } from '@/components/ui/display/status-chip';

import { classLabel, formatDuration, formatFare, formatTime, pluralize } from '@/libs/format';

import { borderWidths } from '@/constants/borders';
import { layout } from '@/constants/layout';
import { opacity } from '@/constants/opacity';
import { radii } from '@/constants/radii';
import { iconSizes, sizes } from '@/constants/sizes';
import { spacing } from '@/constants/spacing';

import type { Journey, JourneyClass, TravelClass } from '@/api/types';

interface JourneyCardProps {
  journey: Journey;
  passengers: number;
  onSelectClass: (journey: Journey, travelClass: TravelClass) => void;
}

/** The dark journey card from the reference, with one tappable row per travel class. */
export const JourneyCard = memo(function JourneyCard({ journey, passengers, onSelectClass }: JourneyCardProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.inverse }]}>
      <View style={styles.titleRow}>
        <View style={[styles.badge, { borderColor: colors.accentStrong }]}>
          <AppText variant="captionStrong" tone="onInverse">
            {journey.serviceCode}
          </AppText>
        </View>
        <AppText variant="bodyStrong" tone="onInverse" numberOfLines={1} style={styles.flex}>
          {journey.trainNumber} {journey.trainName}
        </AppText>
      </View>
      {journey.status === 'DELAYED' ? <StatusChip kind="DELAYED" suffix={`+${journey.delayMinutes} min`} /> : null}

      <View style={styles.timesRow}>
        <View style={styles.flexShrink}>
          <AppText variant="bodyStrong" tone="onInverse">
            {formatTime(journey.departureAt)}
          </AppText>
          <AppText variant="label" tone="onInverseMuted" numberOfLines={1}>
            {journey.origin.name}
          </AppText>
        </View>
        <AppText variant="caption" tone="onInverseMuted" style={styles.duration}>
          {formatDuration(journey.durationMinutes)}
        </AppText>
        <View style={[styles.flexShrink, styles.alignEnd]}>
          <AppText variant="bodyStrong" tone="onInverse">
            {formatTime(journey.arrivalAt)}
          </AppText>
          <AppText variant="label" tone="onInverseMuted" numberOfLines={1}>
            {journey.destination.name}
          </AppText>
        </View>
      </View>

      <JourneyTimeline
        lineColor={colors.accentStrong}
        dashColor={colors.accentStrong}
        trainColor={colors.accent}
        backgroundColor={colors.inverse}
      />

      <View style={styles.classes}>
        {journey.classes.map((option) => (
          <ClassRow
            key={option.travelClass}
            option={option}
            passengers={passengers}
            onPress={() => onSelectClass(journey, option.travelClass)}
          />
        ))}
      </View>
    </View>
  );
});

function ClassRow({ option, passengers, onPress }: { option: JourneyClass; passengers: number; onPress: () => void }) {
  const { colors } = useTheme();
  const soldOut = option.availableSeats === 0;
  const tooFew = !soldOut && option.availableSeats < passengers;
  const seatsText = soldOut
    ? 'Sold out'
    : tooFew
      ? `Only ${pluralize(option.availableSeats, 'seat')} left`
      : `${option.availableSeats} Seats Available`;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${classLabel(option.travelClass)}, ${seatsText}, ${formatFare(option.fareCents)}`}
      accessibilityHint="Choose seats in this class"
      accessibilityState={{ disabled: soldOut }}
      disabled={soldOut}
      onPress={onPress}
      style={({ pressed }) => [
        styles.classRow,
        { backgroundColor: colors.inverseRaised, opacity: soldOut ? opacity.unavailable : pressed ? opacity.pressed : opacity.full },
      ]}
    >
      <View style={styles.classInfo}>
        <View style={styles.classTitle}>
          <AppText variant="bodyStrong" tone="onInverse">
            {classLabel(option.travelClass)}
          </AppText>
          {option.airConditioned ? <Icon name="snowflake" size={iconSizes.sm} color={colors.onInverse} /> : null}
        </View>
        <AppText variant="label" tone={tooFew ? 'warning' : 'onInverseMuted'}>
          {seatsText}
        </AppText>
      </View>
      <AppText variant="price" tone="onInverse">
        {formatFare(option.fareCents)}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: layout.heroCardRadius, padding: layout.cardPadding, gap: spacing.md },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  badge: {
    borderWidth: borderWidths.thin,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xxs,
    minWidth: sizes.badgeMinWidth,
    alignItems: 'center',
  },
  flex: { flex: 1 },
  flexShrink: { flexShrink: 1 },
  timesRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', gap: spacing.sm },
  duration: { marginBottom: spacing.xxxs },
  alignEnd: { alignItems: 'flex-end' },
  classes: { gap: spacing.sm, marginTop: spacing.xxs },
  classRow: {
    borderRadius: radii.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: sizes.rowMinHeight,
  },
  classInfo: { gap: spacing.xxxs, flex: 1 },
  classTitle: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
});
