import { useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { AppText } from '@/components/atomic/app-text';
import { Icon } from '@/components/atomic/icon';
import { HeaderBar } from '@/components/layout/header-bar';
import { Screen } from '@/components/layout/screen';
import { useTheme } from '@/components/theme/theme-provider';
import { Button } from '@/components/ui/buttons/button';
import { InlineAlert } from '@/components/ui/feedback/inline-alert';
import { ErrorState } from '@/components/ui/feedback/state-views';
import { Skeleton } from '@/components/ui/loaders/skeleton';
import { TicketCard } from '@/features/tickets/ticket-card';
import { shareTicketPdf } from '@/features/tickets/ticket-pdf';

import { invalidateQueries, useApiQuery } from '@/hooks/use-api-query';
import { useAsyncAction } from '@/hooks/use-async-action';

import { bookingsApi } from '@/api/bookings-api';
import { formatDateTime } from '@/libs/format';

import { ticketGeometry } from '@/constants/drawing';
import { layout } from '@/constants/layout';
import { radii } from '@/constants/radii';
import { iconSizes, sizes } from '@/constants/sizes';
import { spacing } from '@/constants/spacing';

import type { BookingSegment, Ticket } from '@/api/types';

const SIDE = layout.screenGutter;

export default function TicketScreen() {
  // hooks
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const booking = useApiQuery(`booking:${id}`, (signal) => bookingsApi.get(id, signal), { refetchOnFocus: true });
  const [page, setPage] = useState(0);
  const download = useAsyncAction(() => shareTicketPdf(booking.data!));
  const cancel = useAsyncAction(async () => {
    await bookingsApi.cancel(id);
    invalidateQueries('bookings:');
    invalidateQueries('seats:');
    await booking.refetch();
  });

  // derived state
  const cardWidth = width - SIDE * 2;
  const pages = useMemo<{ segment: BookingSegment; ticket: Ticket }[]>(
    () => (booking.data?.segments ?? []).flatMap((segment) => segment.tickets.map((ticket) => ({ segment, ticket }))),
    [booking.data],
  );
  const current = pages[Math.min(page, pages.length - 1)];
  const title = !booking.data
    ? 'Ticket'
    : booking.data.status === 'CANCELLED'
      ? 'Cancelled Trip'
      : booking.data.isUpcoming
        ? 'Upcoming Trips'
        : 'Past Trip';

  // handlers
  const confirmCancel = () =>
    Alert.alert('Cancel this booking?', 'All tickets in this booking will be cancelled and the seats released. This cannot be undone.', [
      { text: 'Keep booking', style: 'cancel' },
      { text: 'Cancel booking', style: 'destructive', onPress: () => void cancel.run() },
    ]);

  // render
  return (
    <Screen tone="ticket" bleed contentStyle={styles.content}>
      <View style={styles.padded}>
        <HeaderBar title={title} onInverse />
        {current ? (
          <View style={styles.summary}>
            <AppText variant="label" tone="onInverseMuted">
              {formatDateTime(current.segment.journey.departureAt)}
              {pages.length > 1
                ? ` · ${current.segment.direction === 'RETURN' ? 'Return' : 'Outbound'} · ticket ${page + 1} of ${pages.length}`
                : ''}
            </AppText>
            <AppText variant="title" tone="onInverse" accessibilityRole="header">
              {current.segment.journey.origin.city}-{current.segment.journey.destination.city}
            </AppText>
          </View>
        ) : null}
      </View>

      {booking.error && !booking.data ? (
        <ErrorState error={booking.error} onRetry={booking.refetch} onInverse />
      ) : !booking.data ? (
        <View style={styles.padded}>
          <Skeleton height={sizes.skeletonTicket} radius={ticketGeometry.radius} inverse />
        </View>
      ) : (
        <>
          <View style={[styles.stack, { backgroundColor: colors.ticketStack }]} />
          <FlatList
            horizontal
            pagingEnabled
            data={pages}
            keyExtractor={(item) => item.ticket.id}
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => setPage(Math.round(event.nativeEvent.contentOffset.x / width))}
            renderItem={({ item }) => (
              <View style={{ width, paddingHorizontal: SIDE }}>
                <TicketCard booking={booking.data!} segment={item.segment} ticket={item.ticket} width={cardWidth} />
              </View>
            )}
          />
          {pages.length > 1 ? (
            <View style={styles.dots} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
              {pages.map((item, index) => (
                <View
                  key={item.ticket.id}
                  style={[
                    styles.dot,
                    index === page ? styles.dotActive : null,
                    { backgroundColor: index === page ? colors.accent : colors.onInverseTrack },
                  ]}
                />
              ))}
            </View>
          ) : null}

          <View style={[styles.padded, styles.actions]}>
            {download.error ? <InlineAlert kind="error" title="Couldn’t create the PDF" message={download.error.message} /> : null}
            {cancel.error ? <InlineAlert kind="error" title="Couldn’t cancel" message={cancel.error.message} /> : null}
            <Button
              title="Download PDF"
              icon="download"
              onPress={() => void download.run()}
              loading={download.isPending}
              style={styles.download}
            />
            {booking.data.canCancel ? (
              <Pressable
                accessibilityRole="button"
                accessibilityHint="Asks for confirmation first"
                onPress={confirmCancel}
                style={styles.cancel}
                disabled={cancel.isPending}
              >
                <Icon name="trash" size={iconSizes.sm} color={colors.danger} />
                <AppText variant="label" tone="danger">
                  {cancel.isPending ? 'Cancelling…' : 'Cancel booking'}
                </AppText>
              </Pressable>
            ) : null}
          </View>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: layout.screenBottomPadding },
  padded: { paddingHorizontal: SIDE },
  summary: { gap: spacing.xxs, marginBottom: layout.sectionGap },
  stack: {
    height: sizes.ticketStackHeight,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    marginHorizontal: SIDE + ticketGeometry.stackInset,
    marginBottom: -ticketGeometry.stackOverlap,
  },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: spacing.xs, marginTop: spacing.lg },
  dot: { width: sizes.pagerDot, height: sizes.pagerDot, borderRadius: radii.pill },
  dotActive: { width: sizes.pagerDotActive },
  actions: { alignItems: 'center', gap: spacing.md, marginTop: layout.sectionGap },
  download: { minWidth: sizes.buttonWideMinWidth },
  cancel: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingVertical: spacing.md, paddingHorizontal: spacing.lg },
});
