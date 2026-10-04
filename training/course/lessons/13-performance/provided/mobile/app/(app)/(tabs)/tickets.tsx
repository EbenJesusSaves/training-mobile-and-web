import { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { AppText } from '@/components/atomic/app-text';
import { Screen } from '@/components/layout/screen';
import { EmptyState, ErrorState } from '@/components/ui/feedback/state-views';
import { SegmentedTabs } from '@/components/ui/inputs/segmented-tabs';
import { Skeleton } from '@/components/ui/loaders/skeleton';
import { TripListItem } from '@/features/tickets/trip-list-item';

import { useApiQuery } from '@/hooks/use-api-query';

import { bookingsApi } from '@/api/bookings-api';

import { layout } from '@/constants/layout';
import { sizes } from '@/constants/sizes';
import { spacing } from '@/constants/spacing';
import { placeholderKeys, ui } from '@/constants/ui';

import type { Booking, BookingScope } from '@/api/types';

export default function TicketsScreen() {
  const [scope, setScope] = useState<BookingScope>('upcoming');
  const trips = useApiQuery(`bookings:${scope}`, (signal) => bookingsApi.list(scope, signal), { refetchOnFocus: true });
  const open = (booking: Booking) => router.push({ pathname: '/tickets/[id]', params: { id: booking.id } });

  return (
    <Screen scroll={false} bleed>
      <FlatList
        data={trips.data ?? []}
        // LIVE 13.1 — Key each row by its booking id, not its position in the list.
        keyExtractor={(_booking, index) => String(index)}
        renderItem={({ item }) => <TripListItem booking={item} onPress={open} />}
        ItemSeparatorComponent={ListSeparator}
        contentContainerStyle={styles.list}
        refreshing={trips.isRefreshing}
        onRefresh={trips.refetch}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        ListHeaderComponent={
          <View style={styles.header}>
            <AppText variant="display" accessibilityRole="header">
              My Tickets
            </AppText>
            <SegmentedTabs
              accessibilityLabel="Which trips"
              value={scope}
              onChange={setScope}
              options={[
                { value: 'upcoming', label: 'Upcoming' },
                { value: 'past', label: 'Past & cancelled' },
              ]}
            />
          </View>
        }
        ListEmptyComponent={
          trips.isLoading ? (
            <View style={styles.skeletons}>
              {placeholderKeys(ui.skeletonCount.list).map((key) => (
                <Skeleton key={key} height={sizes.skeletonListItem} radius={layout.cardRadius} />
              ))}
            </View>
          ) : trips.error ? (
            <ErrorState error={trips.error} onRetry={trips.refetch} />
          ) : scope === 'upcoming' ? (
            <EmptyState
              icon="tickets"
              title="No upcoming trips"
              message="Book a train and your tickets will appear here."
              actionLabel="Book a trip"
              onAction={() => router.navigate('/')}
            />
          ) : (
            <EmptyState icon="archive" title="Nothing here yet" message="Completed and cancelled trips will appear here." />
          )
        }
      />
    </Screen>
  );
}

const ListSeparator = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: layout.screenGutter,
    paddingBottom: layout.screenBottomPadding,
  },
  header: {
    gap: layout.blockGap,
    paddingTop: spacing.md,
    marginBottom: spacing.xl,
  },
  separator: { height: layout.listGap },
  skeletons: { gap: layout.listGap },
});
