import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/atomic/app-text';
import { Icon } from '@/components/atomic/icon';
import { useTheme } from '@/components/theme/theme-provider';
import { type ChipKind, StatusChip } from '@/components/ui/display/status-chip';

import { classLabel, formatDayMonth, formatTime, pluralize } from '@/libs/format';

import { layout } from '@/constants/layout';
import { opacity } from '@/constants/opacity';
import { radii } from '@/constants/radii';
import { iconSizes, sizes } from '@/constants/sizes';
import { spacing } from '@/constants/spacing';

import type { Booking } from '@/api/types';

function chipFor(booking: Booking): { kind: ChipKind; suffix?: string } {
  if (booking.status === 'CANCELLED') return { kind: 'CANCELLED' };
  const disrupted = booking.segments.find((segment) => segment.journey.status !== 'SCHEDULED');
  if (disrupted?.journey.status === 'CANCELLED') return { kind: 'JOURNEY_CANCELLED' };
  if (disrupted?.journey.status === 'DELAYED') return { kind: 'DELAYED', suffix: `+${disrupted.journey.delayMinutes} min` };
  if (booking.status === 'CHECKED_IN') return { kind: 'CHECKED_IN' };
  return booking.isUpcoming ? { kind: 'CONFIRMED' } : { kind: 'COMPLETED' };
}

export const TripListItem = memo(function TripListItem({ booking, onPress }: { booking: Booking; onPress: (booking: Booking) => void }) {
  const { colors } = useTheme();
  const first = booking.segments[0];
  const chip = chipFor(booking);
  const seats = first.tickets.map((ticket) => ticket.seatNumber).join(', ');

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${first.journey.origin.city} to ${first.journey.destination.city}, ${formatDayMonth(first.journey.departureAt)} at ${formatTime(first.journey.departureAt)}, booking ${booking.reference}`}
      onPress={() => onPress(booking)}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.surfaceRaised, opacity: pressed ? opacity.pressedLight : opacity.full },
      ]}
    >
      <View style={[styles.date, { backgroundColor: colors.inverse }]}>
        <AppText variant="heading" tone="onInverse">
          {new Date(first.journey.departureAt).getUTCDate()}
        </AppText>
        <AppText variant="caption" tone="onInverseMuted">
          {formatDayMonth(first.journey.departureAt).split(' ')[1]}
        </AppText>
      </View>
      <View style={styles.body}>
        <View style={styles.row}>
          <AppText variant="bodyStrong" numberOfLines={1} style={styles.flex}>
            {first.journey.origin.city} → {first.journey.destination.city}
          </AppText>
          {booking.tripType === 'ROUND_TRIP' ? <Icon name="repeat" size={iconSizes.sm} color={colors.inkMuted} /> : null}
        </View>
        <AppText variant="label" tone="muted" numberOfLines={1}>
          {formatTime(first.journey.departureAt)} · {first.journey.trainNumber} · {classLabel(first.travelClass)} · Car{' '}
          {first.tickets[0]?.carNumber}, seat {seats}
        </AppText>
        <View style={styles.row}>
          <StatusChip kind={chip.kind} suffix={chip.suffix} />
          <AppText variant="caption" tone="muted">
            {pluralize(booking.passengers.length, 'passenger')}
          </AppText>
        </View>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: { flexDirection: 'row', gap: spacing.md, borderRadius: layout.cardRadius, padding: spacing.md, alignItems: 'center' },
  date: {
    width: sizes.tripDateWidth,
    height: sizes.tripDateHeight,
    borderRadius: radii.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1, gap: spacing.xs },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  flex: { flex: 1 },
});
