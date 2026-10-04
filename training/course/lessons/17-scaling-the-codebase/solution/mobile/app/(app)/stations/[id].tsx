import { Pressable, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { AppText } from '@/components/atomic/app-text';
import { Icon } from '@/components/atomic/icon';
import { HeaderBar } from '@/components/layout/header-bar';
import { Screen } from '@/components/layout/screen';
import { useTheme } from '@/components/theme/theme-provider';
import { Button } from '@/components/ui/buttons/button';
import { StatusChip } from '@/components/ui/display/status-chip';
import { EmptyState, ErrorState } from '@/components/ui/feedback/state-views';
import { Skeleton } from '@/components/ui/loaders/skeleton';

import { useApiQuery } from '@/hooks/use-api-query';

import { travelApi } from '@/api/travel-api';
import { formatDayMonth, formatDuration, formatFare, formatTime } from '@/libs/format';
import { useBookingDraftStore } from '@/store/booking-draft-store';

import { layout } from '@/constants/layout';
import { radii } from '@/constants/radii';
import { iconSizes, sizes } from '@/constants/sizes';
import { spacing } from '@/constants/spacing';
import { placeholderKeys, ui } from '@/constants/ui';

import type { Station } from '@/api/types';

export default function StationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const detail = useApiQuery(`station:${id}`, () => travelApi.station(id), { refetchOnFocus: true });
  const { setStation } = useBookingDraftStore.getState();

  const bookFrom = (destination?: Station) => {
    if (!detail.data) return;
    setStation('origin', detail.data);
    if (destination) setStation('destination', destination);
    router.navigate('/');
  };

  return (
    <Screen refreshing={detail.isRefreshing} onRefresh={detail.refetch}>
      <HeaderBar title="Station" />
      {detail.error && !detail.data ? (
        <ErrorState error={detail.error} onRetry={detail.refetch} />
      ) : !detail.data ? (
        <View style={styles.skeletons}>
          {placeholderKeys(ui.skeletonCount.list).map((key) => (
            <Skeleton key={key} height={sizes.skeletonListItem} radius={layout.cardRadius} />
          ))}
        </View>
      ) : (
        <>
          <View style={[styles.hero, { backgroundColor: colors.inverse }]}>
            <AppText variant="labelStrong" tone="onInverseMuted">
              {detail.data.code} · {detail.data.city}
            </AppText>
            <AppText variant="title" tone="onInverse" accessibilityRole="header">
              {detail.data.name}
            </AppText>
            {detail.data.address ? (
              <View style={styles.address}>
                <Icon name="location" size={iconSizes.sm} color={colors.onInverseMuted} />
                <AppText variant="label" tone="onInverseMuted">
                  {detail.data.address}
                </AppText>
              </View>
            ) : null}
            <Button title="Book from this station" onPress={() => bookFrom()} style={styles.heroButton} />
          </View>

          <AppText variant="heading" accessibilityRole="header" style={styles.section}>
            Destinations
          </AppText>
          <View style={styles.list}>
            {detail.data.destinations.map((destination) => (
              <Pressable
                key={destination.routeId}
                accessibilityRole="button"
                accessibilityLabel={`Book to ${destination.station.name}, from ${formatFare(destination.fromFareCents)}`}
                onPress={() => bookFrom(destination.station)}
                style={[styles.row, { backgroundColor: colors.surfaceRaised }]}
              >
                <View style={styles.flex}>
                  <AppText variant="bodyStrong">{destination.station.name}</AppText>
                  <AppText variant="label" tone="muted">
                    {destination.distanceKm} km
                  </AppText>
                </View>
                <AppText variant="label" tone="secondary">
                  from {formatFare(destination.fromFareCents)}
                </AppText>
                <Icon name="forward" size={iconSizes.md} color={colors.inkMuted} />
              </Pressable>
            ))}
          </View>

          <AppText variant="heading" accessibilityRole="header" style={styles.section}>
            Next departures
          </AppText>
          {detail.data.departures.length === 0 ? (
            <EmptyState icon="clock" title="No departures soon" message="There are no departures from this station in the next 48 hours." />
          ) : (
            <View style={styles.list}>
              {detail.data.departures.map((journey) => (
                <View key={journey.id} style={[styles.row, { backgroundColor: colors.surfaceRaised }]} accessible>
                  <View style={styles.time}>
                    <AppText variant="subheading">{formatTime(journey.departureAt)}</AppText>
                    <AppText variant="caption" tone="muted">
                      {formatDayMonth(journey.departureAt)}
                    </AppText>
                  </View>
                  <View style={styles.flex}>
                    <AppText variant="bodyStrong">{journey.destination.city}</AppText>
                    <AppText variant="label" tone="muted">
                      {journey.trainNumber} · {formatDuration(journey.durationMinutes)} · {journey.availableSeats} seats left
                    </AppText>
                  </View>
                  {journey.status === 'SCHEDULED' ? null : (
                    <StatusChip kind={journey.status} suffix={journey.status === 'DELAYED' ? `+${journey.delayMinutes} min` : undefined} />
                  )}
                </View>
              ))}
            </View>
          )}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  skeletons: { gap: layout.listGap },
  hero: { borderRadius: layout.heroCardRadius, padding: layout.cardPadding, gap: spacing.xs },
  address: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  heroButton: { marginTop: spacing.md },
  section: { marginTop: layout.sectionGap, marginBottom: spacing.md },
  list: { gap: spacing.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radii.xl,
    padding: spacing.md,
    minHeight: sizes.rowMinHeight,
  },
  flex: { flex: 1, gap: spacing.xxxs },
  time: { width: sizes.tripDateHeight },
});
