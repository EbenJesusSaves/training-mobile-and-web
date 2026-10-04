import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useShallow } from 'zustand/react/shallow';

import { AppText } from '@/components/atomic/app-text';
import { Icon } from '@/components/atomic/icon';
import { Screen } from '@/components/layout/screen';
import { useTheme } from '@/components/theme/theme-provider';
import { IconButton } from '@/components/ui/buttons/icon-button';
import { Avatar } from '@/components/ui/display/avatar';
import { EmptyState, ErrorState } from '@/components/ui/feedback/state-views';
import { SegmentedTabs } from '@/components/ui/inputs/segmented-tabs';
import { Skeleton } from '@/components/ui/loaders/skeleton';
import { ArchiveList } from '@/features/booking/archive-list';
import { DateStrip } from '@/features/booking/date-strip';
import { SORT_TITLES } from '@/features/booking/filter-sheet';
import { JourneyCard } from '@/features/booking/journey-card';
import { RouteCard } from '@/features/booking/route-card';

import { useJourneySearch } from '@/hooks/use-journey-search';

import { addDays, formatDateKey } from '@/libs/dates';
import { useBookingDraftStore } from '@/store/booking-draft-store';
import { useSessionStore } from '@/store/session-store';

import { borderWidths } from '@/constants/borders';
import { layout } from '@/constants/layout';
import { radii } from '@/constants/radii';
import { iconSizes, sizes } from '@/constants/sizes';
import { spacing } from '@/constants/spacing';
import { ui } from '@/constants/ui';

import type { Booking, Journey, TravelClass } from '@/api/types';

type HomeTab = 'ONE_WAY' | 'ROUND_TRIP' | 'ARCHIVE';

const TABS: { value: HomeTab; label: string }[] = [
  { value: 'ONE_WAY', label: 'One Way' },
  { value: 'ROUND_TRIP', label: 'Round Trip' },
  { value: 'ARCHIVE', label: 'Archive' },
];

export default function HomeScreen() {
  // hooks
  const { colors } = useTheme();
  const user = useSessionStore((state) => state.user);
  // Subscribe only to the fields this screen renders (useShallow avoids re-rendering on unrelated changes).
  const draft = useBookingDraftStore(
    useShallow((state) => ({
      tripType: state.tripType,
      origin: state.origin,
      destination: state.destination,
      departDate: state.departDate,
      returnDate: state.returnDate,
      sort: state.sort,
      passengerCount: state.passengerCount,
    })),
  );
  const { setTripType, setStation, swapStations, setDepartDate, setReturnDate } = useBookingDraftStore.getState();
  const [tab, setTab] = useState<HomeTab>(draft.tripType);
  const [editingReturn, setEditingReturn] = useState(false);
  // LIVE 18.3 — Show the home bell badge when trips need attention.
  const hasUpdates = false;
  const search = useJourneySearch({
    originId: draft.origin?.id,
    destinationId: draft.destination?.id,
    date: draft.departDate,
    sort: draft.sort,
    passengers: draft.passengerCount,
  });

  // derived state
  const isRoundTrip = tab === 'ROUND_TRIP';
  const firstName = user?.fullName.split(' ')[0] ?? 'traveller';

  // handlers
  const changeTab = (next: HomeTab) => {
    setTab(next);
    setEditingReturn(false);
    if (next !== 'ARCHIVE') setTripType(next);
  };

  const pickStation = (field: 'origin' | 'destination') => router.push({ pathname: '/station-picker', params: { field } });

  const selectClass = useCallback((journey: Journey, travelClass: TravelClass) => {
    useBookingDraftStore.getState().chooseJourney('OUTBOUND', journey, travelClass);
    router.push({ pathname: '/journeys/[id]', params: { id: journey.id, direction: 'OUTBOUND' } });
  }, []);

  const bookAgain = (booking: Booking) => {
    const { origin, destination } = booking.segments[0].journey;
    setStation('origin', origin);
    setStation('destination', destination);
    changeTab('ONE_WAY');
  };

  // render
  const header = (
    <View style={styles.header}>
      <View style={styles.welcomeRow}>
        <Avatar name={user?.fullName ?? 'RailPass'} seed={user?.id} />
        <View style={styles.welcomeText}>
          <AppText variant="label" tone="secondary">
            Welcome back,
          </AppText>
          <AppText variant="name" numberOfLines={1}>
            {user?.fullName ?? firstName}
          </AppText>
        </View>
        <IconButton
          icon="bell"
          label={hasUpdates ? 'Trip updates, new' : 'Trip updates'}
          badge={hasUpdates}
          onPress={() => router.push('/updates')}
        />
      </View>

      <AppText variant="display" accessibilityRole="header" style={styles.title}>
        Book Tickets
      </AppText>

      <SegmentedTabs options={TABS} value={tab} onChange={changeTab} accessibilityLabel="Trip type" />

      {tab !== 'ARCHIVE' ? (
        <>
          <RouteCard
            origin={draft.origin}
            destination={draft.destination}
            onPickOrigin={() => pickStation('origin')}
            onPickDestination={() => pickStation('destination')}
            onSwap={swapStations}
          />
          {isRoundTrip ? (
            <View style={styles.legToggle} accessibilityRole="tablist">
              {[
                { key: false, label: 'Depart', date: draft.departDate },
                { key: true, label: 'Return', date: draft.returnDate },
              ].map((leg) => {
                const active = editingReturn === leg.key;
                return (
                  <Pressable
                    key={leg.label}
                    accessibilityRole="tab"
                    accessibilityState={{ selected: active }}
                    accessibilityLabel={`${leg.label} date, ${formatDateKey(leg.date)}`}
                    onPress={() => setEditingReturn(leg.key)}
                    style={[
                      styles.legChip,
                      {
                        backgroundColor: active ? colors.surfaceRaised : colors.transparent,
                        borderColor: active ? colors.line : colors.transparent,
                      },
                    ]}
                  >
                    <Icon name="calendar" size={iconSizes.sm} color={active ? colors.ink : colors.inkMuted} />
                    <AppText variant="label" tone={active ? 'ink' : 'muted'}>
                      {leg.label} · {formatDateKey(leg.date)}
                    </AppText>
                  </Pressable>
                );
              })}
            </View>
          ) : null}
        </>
      ) : null}
    </View>
  );

  const dateStrip =
    tab === 'ARCHIVE' ? null : (
      <View style={styles.dateStrip}>
        {editingReturn && isRoundTrip ? (
          <DateStrip value={draft.returnDate} minDate={draft.departDate} onChange={setReturnDate} />
        ) : (
          <DateStrip value={draft.departDate} onChange={setDepartDate} />
        )}
      </View>
    );

  const resultsHeader =
    tab === 'ARCHIVE' ? (
      <AppText variant="heading" style={styles.sectionTitle} accessibilityRole="header">
        Previous trips
      </AppText>
    ) : (
      <View style={styles.sectionRow}>
        <AppText variant="heading" accessibilityRole="header">
          {SORT_TITLES[draft.sort]}
        </AppText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Sort and filter journeys"
          onPress={() => router.push('/sort')}
          style={[styles.filter, { backgroundColor: colors.surfaceRaised, borderColor: colors.line }]}
        >
          <Icon name="filter" size={iconSizes.sm} color={colors.inkSecondary} />
          <AppText variant="label" tone="secondary">
            Filter
          </AppText>
        </Pressable>
      </View>
    );

  const renderEmpty = () => {
    if (!draft.origin || !draft.destination) {
      return <EmptyState icon="route" title="Where are you heading?" message="Choose a departure and destination station to see trains." />;
    }
    if (search.isLoading) {
      return (
        <View style={styles.cards}>
          <Skeleton height={sizes.skeletonCard} radius={layout.heroCardRadius} inverse />
          <Skeleton height={sizes.skeletonCard} radius={layout.heroCardRadius} inverse />
        </View>
      );
    }
    if (search.error) return <ErrorState error={search.error} onRetry={search.refetch} />;
    return (
      <EmptyState
        icon="calendar"
        title="No trains on this day"
        message={`There are no more ${draft.origin.city} → ${draft.destination.city} departures on ${formatDateKey(draft.departDate)}.`}
        actionLabel="Try the next day"
        onAction={() => setDepartDate(addDays(draft.departDate, ui.dayStep))}
      />
    );
  };

  return (
    <Screen scroll={false} bleed>
      <FlatList
        data={tab === 'ARCHIVE' || !draft.origin || !draft.destination ? [] : (search.data ?? [])}
        keyExtractor={(journey) => journey.id}
        renderItem={({ item }) => (
          <View style={styles.cardWrap}>
            <JourneyCard journey={item} passengers={draft.passengerCount} onSelectClass={selectClass} />
          </View>
        )}
        ListHeaderComponent={
          <>
            {header}
            {dateStrip}
            {resultsHeader}
          </>
        }
        ListEmptyComponent={
          tab === 'ARCHIVE' ? (
            <ArchiveList
              onBookAgain={bookAgain}
              onOpen={(booking) => router.push({ pathname: '/tickets/[id]', params: { id: booking.id } })}
            />
          ) : (
            renderEmpty()
          )
        }
        ItemSeparatorComponent={ListSeparator}
        refreshing={search.isRefreshing}
        onRefresh={tab === 'ARCHIVE' ? undefined : search.refetch}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.listContent}
      />
    </Screen>
  );
}

const ListSeparator = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  listContent: { paddingBottom: layout.screenBottomPadding },
  header: { paddingHorizontal: layout.screenGutter, gap: layout.blockGap, paddingTop: spacing.md },
  welcomeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  welcomeText: { flex: 1 },
  title: { marginTop: spacing.xs },
  legToggle: { flexDirection: 'row', gap: spacing.sm },
  legChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderRadius: radii.pill,
    borderWidth: borderWidths.hairline,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  dateStrip: { marginTop: layout.blockGap },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenGutter,
    marginTop: layout.sectionGap,
    marginBottom: layout.blockGap,
  },
  sectionTitle: { paddingHorizontal: layout.screenGutter, marginTop: layout.sectionGap, marginBottom: layout.blockGap },
  filter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderRadius: radii.pill,
    borderWidth: borderWidths.hairline,
    paddingHorizontal: spacing.md,
    minHeight: sizes.filterButtonHeight,
  },
  cards: { gap: layout.listGap, paddingHorizontal: layout.screenGutter },
  cardWrap: { paddingHorizontal: layout.screenGutter },
  separator: { height: layout.listGap },
});
