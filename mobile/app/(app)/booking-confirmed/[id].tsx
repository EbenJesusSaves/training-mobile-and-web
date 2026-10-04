import { StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { AppText } from '@/components/atomic/app-text';
import { Screen } from '@/components/layout/screen';
import { useTheme } from '@/components/theme/theme-provider';
import { Button } from '@/components/ui/buttons/button';
import { ErrorState } from '@/components/ui/feedback/state-views';
import { Skeleton } from '@/components/ui/loaders/skeleton';
import { SuccessMark } from '@/features/booking/success-mark';

import { useApiQuery } from '@/hooks/use-api-query';

import { bookingsApi } from '@/api/bookings-api';
import { classLabel, formatDateTime, formatMoney, pluralize } from '@/libs/format';

import { borderWidths } from '@/constants/borders';
import { layout } from '@/constants/layout';
import { sizes } from '@/constants/sizes';
import { spacing } from '@/constants/spacing';

export default function BookingConfirmedScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const booking = useApiQuery(`booking:${id}`, (signal) => bookingsApi.get(id, signal));

  const goHome = () => router.dismissAll();
  const viewTicket = () => {
    router.dismissAll();
    router.push({ pathname: '/tickets/[id]', params: { id } });
  };

  return (
    <Screen contentStyle={styles.content}>
      <View style={styles.hero}>
        <SuccessMark />
        <AppText variant="display" align="center" accessibilityRole="header">
          You’re booked!
        </AppText>
        <AppText variant="body" tone="secondary" align="center">
          Your tickets are ready. Show the barcode at the gate.
        </AppText>
      </View>

      {booking.error && !booking.data ? (
        <ErrorState error={booking.error} onRetry={booking.refetch} />
      ) : !booking.data ? (
        <Skeleton height={sizes.skeletonConfirmation} radius={layout.cardRadius} />
      ) : (
        <View style={[styles.card, { backgroundColor: colors.surfaceRaised }]}>
          <AppText variant="label" tone="muted">
            Booking reference
          </AppText>
          <AppText variant="title" selectable>
            {booking.data.reference}
          </AppText>
          {booking.data.segments.map((segment) => (
            <View key={segment.id} style={[styles.segment, { borderTopColor: colors.line }]}>
              <AppText variant="bodyStrong">
                {segment.journey.origin.city} → {segment.journey.destination.city}
              </AppText>
              <AppText variant="label" tone="muted">
                {formatDateTime(segment.journey.departureAt)} · {segment.journey.trainNumber} · {classLabel(segment.travelClass)} ·{' '}
                {segment.tickets.map((ticket) => `Car ${ticket.carNumber} seat ${ticket.seatNumber}`).join(', ')}
              </AppText>
            </View>
          ))}
          <View style={[styles.segment, styles.total, { borderTopColor: colors.line }]}>
            <AppText variant="label" tone="secondary">
              {pluralize(booking.data.passengers.length, 'passenger')}
            </AppText>
            <AppText variant="subheading">{formatMoney(booking.data.totalCents)}</AppText>
          </View>
        </View>
      )}

      <View style={styles.actions}>
        <Button title="View ticket" icon="tickets" onPress={viewTicket} disabled={!booking.data} />
        <Button title="Back to Home" variant="secondary" onPress={goHome} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: spacing.xxl, gap: layout.sectionGap },
  hero: { alignItems: 'center', gap: spacing.sm },
  card: { borderRadius: layout.cardRadius, padding: layout.cardPadding, gap: spacing.xxs },
  segment: { borderTopWidth: borderWidths.hairline, paddingTop: spacing.md, marginTop: spacing.md, gap: spacing.xxxs },
  total: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  actions: { gap: spacing.md },
});
