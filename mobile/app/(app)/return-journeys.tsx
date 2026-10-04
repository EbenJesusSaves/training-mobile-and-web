import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { AppText } from '@/components/atomic/app-text';
import { HeaderBar } from '@/components/layout/header-bar';
import { Screen } from '@/components/layout/screen';
import { useTheme } from '@/components/theme/theme-provider';
import { EmptyState, ErrorState } from '@/components/ui/feedback/state-views';
import { Skeleton } from '@/components/ui/loaders/skeleton';
import { DateStrip } from '@/features/booking/date-strip';
import { JourneyCard } from '@/features/booking/journey-card';

import { useJourneySearch } from '@/hooks/use-journey-search';

import { addDays, formatDateKey, toDateKey } from '@/libs/dates';
import { classLabel, formatDateTime } from '@/libs/format';
import { useBookingDraftStore } from '@/store/booking-draft-store';

import { layout } from '@/constants/layout';
import { radii } from '@/constants/radii';
import { sizes } from '@/constants/sizes';
import { spacing } from '@/constants/spacing';
import { ui } from '@/constants/ui';

import type { Journey, TravelClass } from '@/api/types';

export default function ReturnJourneysScreen() {
  const { colors } = useTheme();
  const outbound = useBookingDraftStore((state) => state.outbound);
  const returnDate = useBookingDraftStore((state) => state.returnDate);
  const passengerCount = useBookingDraftStore((state) => state.passengerCount);
  const sort = useBookingDraftStore((state) => state.sort);
  const setReturnDate = useBookingDraftStore((state) => state.setReturnDate);

  const search = useJourneySearch({
    originId: outbound?.journey.destination.id,
    destinationId: outbound?.journey.origin.id,
    date: returnDate,
    sort,
    passengers: passengerCount,
  });

  const selectClass = useCallback((journey: Journey, travelClass: TravelClass) => {
    useBookingDraftStore.getState().chooseJourney('RETURN', journey, travelClass);
    router.push({ pathname: '/journeys/[id]', params: { id: journey.id, direction: 'RETURN' } });
  }, []);

  if (!outbound) {
    return (
      <Screen>
        <HeaderBar title="Choose Return" />
        <EmptyState
          icon="route"
          title="Choose your outbound trip first"
          message="Start from Home to pick where you are going."
          actionLabel="Back to Home"
          onAction={() => router.dismissAll()}
        />
      </Screen>
    );
  }

  // A return must leave after the outbound train arrives.
  const journeys = (search.data ?? []).filter((journey) => journey.departureAt > outbound.journey.arrivalAt);
  const hiddenCount = (search.data?.length ?? 0) - journeys.length;

  return (
    <Screen bleed>
      <View style={styles.padded}>
        <HeaderBar title="Choose Return" />
        <View style={[styles.outbound, { backgroundColor: colors.surfaceRaised }]}>
          <AppText variant="caption" tone="muted">
            Outbound · {classLabel(outbound.travelClass)} · Seats {outbound.seats.map((seat) => seat.seatNumber).join(', ')}
          </AppText>
          <AppText variant="bodyStrong">
            {outbound.journey.origin.city} → {outbound.journey.destination.city}, {formatDateTime(outbound.journey.departureAt)}
          </AppText>
        </View>
        <AppText variant="title" accessibilityRole="header" style={styles.title}>
          {outbound.journey.destination.city}-{outbound.journey.origin.city}
        </AppText>
      </View>
      <DateStrip value={returnDate} minDate={toDateKey(new Date(outbound.journey.arrivalAt))} onChange={setReturnDate} />
      <View style={[styles.padded, styles.results]}>
        {search.isLoading ? (
          <Skeleton height={sizes.skeletonCard} radius={layout.heroCardRadius} inverse />
        ) : search.error && !search.data ? (
          <ErrorState error={search.error} onRetry={search.refetch} />
        ) : journeys.length === 0 ? (
          <EmptyState
            icon="calendar"
            title="No return trains"
            message={`No ${outbound.journey.destination.city} → ${outbound.journey.origin.city} trains after your arrival on ${formatDateKey(returnDate)}.`}
            actionLabel="Try the next day"
            onAction={() => setReturnDate(addDays(returnDate, ui.dayStep))}
          />
        ) : (
          journeys.map((journey) => (
            <JourneyCard key={journey.id} journey={journey} passengers={passengerCount} onSelectClass={selectClass} />
          ))
        )}
        {hiddenCount > 0 ? (
          <AppText variant="caption" tone="muted" align="center">
            {hiddenCount} earlier {hiddenCount === 1 ? 'train leaves' : 'trains leave'} before your outbound train arrives.
          </AppText>
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  padded: { paddingHorizontal: layout.screenGutter },
  outbound: { borderRadius: radii.xl, padding: spacing.lg, gap: spacing.xxs },
  title: { marginTop: spacing.xl, marginBottom: spacing.md },
  results: { gap: layout.listGap, marginTop: layout.sectionGap, paddingBottom: layout.screenBottomPadding },
});
