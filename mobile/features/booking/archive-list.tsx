import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/atomic/app-text';
import { Icon } from '@/components/atomic/icon';
import { useTheme } from '@/components/theme/theme-provider';
import { StatusChip } from '@/components/ui/display/status-chip';
import { EmptyState, ErrorState } from '@/components/ui/feedback/state-views';
import { Skeleton } from '@/components/ui/loaders/skeleton';

import { useApiQuery } from '@/hooks/use-api-query';

import { bookingsApi } from '@/api/bookings-api';
import { formatDateTime, formatMoney } from '@/libs/format';

import { layout } from '@/constants/layout';
import { radii } from '@/constants/radii';
import { iconSizes, sizes } from '@/constants/sizes';
import { spacing } from '@/constants/spacing';
import { placeholderKeys, ui } from '@/constants/ui';

import type { Booking } from '@/api/types';

interface ArchiveListProps {
  onBookAgain: (booking: Booking) => void;
  onOpen: (booking: Booking) => void;
}

/** "Archive" tab on Home: past and cancelled trips, with a shortcut to book the same route again. */
export function ArchiveList({ onBookAgain, onOpen }: ArchiveListProps) {
  const { colors } = useTheme();
  const { data, error, isLoading, refetch } = useApiQuery('bookings:past', (signal) => bookingsApi.list('past', signal), {
    refetchOnFocus: true,
  });

  if (isLoading) {
    return (
      <View style={styles.list}>
        {placeholderKeys(ui.skeletonCount.cards).map((key) => (
          <Skeleton key={key} height={sizes.skeletonArchiveItem} radius={layout.cardRadius} />
        ))}
      </View>
    );
  }
  if (error && !data) return <ErrorState error={error} onRetry={refetch} />;
  if (!data?.length)
    return <EmptyState icon="archive" title="No past trips yet" message="Trips you have taken or cancelled will appear here." />;

  return (
    <View style={styles.list}>
      {data.map((booking) => {
        const { journey } = booking.segments[0];
        const route = `${journey.origin.city} to ${journey.destination.city}`;
        return (
          <Pressable
            key={booking.id}
            accessibilityRole="button"
            accessibilityLabel={`${route}, ${formatDateTime(journey.departureAt)}`}
            onPress={() => onOpen(booking)}
            style={[styles.item, { backgroundColor: colors.surfaceRaised }]}
          >
            <View style={styles.row}>
              <AppText variant="bodyStrong" style={styles.flex} numberOfLines={1}>
                {journey.origin.city} → {journey.destination.city}
              </AppText>
              <StatusChip kind={booking.status === 'CANCELLED' ? 'CANCELLED' : 'COMPLETED'} />
            </View>
            <AppText variant="label" tone="muted">
              {formatDateTime(journey.departureAt)} · {journey.trainNumber} · {formatMoney(booking.totalCents)}
            </AppText>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Book ${route} again`}
              onPress={() => onBookAgain(booking)}
              style={[styles.again, { backgroundColor: colors.surface }]}
            >
              <Icon name="repeat" size={iconSizes.sm} color={colors.ink} />
              <AppText variant="label">Book again</AppText>
            </Pressable>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: layout.listGap, paddingHorizontal: layout.screenGutter },
  item: { borderRadius: layout.cardRadius, padding: spacing.lg, gap: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  flex: { flex: 1 },
  again: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'flex-start',
    borderRadius: radii.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginTop: spacing.xxs,
  },
});
