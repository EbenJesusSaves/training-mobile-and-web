import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { AppText } from '@/components/atomic/app-text';
import { HeaderBar } from '@/components/layout/header-bar';
import { Screen } from '@/components/layout/screen';
import { useTheme } from '@/components/theme/theme-provider';
import { InlineAlert } from '@/components/ui/feedback/inline-alert';
import { EmptyState } from '@/components/ui/feedback/state-views';
import { TextField } from '@/components/ui/inputs/text-field';
import { Skeleton } from '@/components/ui/loaders/skeleton';
import { PriceBar } from '@/features/booking/price-bar';

import { invalidateQueries, useApiQuery } from '@/hooks/use-api-query';
import { useAsyncAction } from '@/hooks/use-async-action';
import { validateEmail, validateFullName } from '@/hooks/use-form';

import { bookingsApi } from '@/api/bookings-api';
import { classLabel, formatDateTime, formatMoney, formatTime } from '@/libs/format';
import { buildBookingRequest, type SegmentDraft, useBookingDraftStore } from '@/store/booking-draft-store';
import { useSessionStore } from '@/store/session-store';

import { borderWidths } from '@/constants/borders';
import { layout } from '@/constants/layout';
import { sizes } from '@/constants/sizes';
import { spacing } from '@/constants/spacing';

import type { Booking, Direction, SeatRef } from '@/api/types';

type ConflictSeat = SeatRef & { direction: Direction; journeyId: string };

export default function CheckoutScreen() {
  // hooks
  const { colors } = useTheme();
  const user = useSessionStore((state) => state.user);
  const tripType = useBookingDraftStore((state) => state.tripType);
  const outbound = useBookingDraftStore((state) => state.outbound);
  const inbound = useBookingDraftStore((state) => state.inbound);
  const addOns = useBookingDraftStore((state) => state.addOns);
  const passengerCount = useBookingDraftStore((state) => state.passengerCount);
  const [names, setNames] = useState<string[]>(() =>
    Array.from({ length: passengerCount }, (_, index) => (index === 0 ? (user?.fullName ?? '') : '')),
  );
  const [email, setEmail] = useState(user?.email ?? '');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // derived state
  const request = useMemo(() => buildBookingRequest({ tripType, outbound, inbound, addOns }), [addOns, inbound, outbound, tripType]);
  // The server is the source of truth for prices: the review screen always shows its quote.
  const quote = useApiQuery(request ? `quote:${JSON.stringify(request)}` : null, () => bookingsApi.quote(request!));
  const segments = [outbound, tripType === 'ROUND_TRIP' ? inbound : null].filter((segment): segment is SegmentDraft => Boolean(segment));

  const submit = useAsyncAction(async () => {
    const booking: Booking = await bookingsApi.create({
      ...request!,
      passengers: names.map((fullName) => ({ fullName: fullName.trim() })),
      contactEmail: email.trim() || undefined,
    });
    // Other screens now hold stale availability and trip lists.
    invalidateQueries('bookings:');
    invalidateQueries('seats:');
    invalidateQueries('journeys:');
    useBookingDraftStore.getState().startNewBooking();
    router.replace({ pathname: '/booking-confirmed/[id]', params: { id: booking.id } });
  });

  // handlers
  const confirm = async () => {
    const errors: Record<string, string> = {};
    names.forEach((name, index) => {
      if (validateFullName(name)) errors[`passengers.${index}.fullName`] = 'Enter the passenger’s full name.';
    });
    const emailError = email.trim() ? validateEmail(email) : null;
    if (emailError) errors.contactEmail = emailError;
    setFieldErrors(errors);
    if (Object.keys(errors).length === 0) await submit.run();
  };

  // Seats can be taken by someone else while this screen is open: the quote reports them up front,
  // and the create call reports them if two people confirm at the same moment.
  const conflictSeats: ConflictSeat[] =
    submit.error?.code === 'SEAT_TAKEN'
      ? ((submit.error.details as { unavailableSeats?: ConflictSeat[] })?.unavailableSeats ?? [])
      : (quote.data?.unavailableSeats ?? []);

  const chooseNewSeats = () => {
    const first = conflictSeats[0];
    if (!first) return router.back();
    const store = useBookingDraftStore.getState();
    for (const direction of ['OUTBOUND', 'RETURN'] as Direction[]) {
      store.removeSeats(
        direction,
        conflictSeats.filter((seat) => seat.direction === direction),
      );
    }
    invalidateQueries(`seats:${first.journeyId}`);
    submit.clearError();
    router.navigate({ pathname: '/journeys/[id]', params: { id: first.journeyId, direction: first.direction } });
  };

  // render
  if (!request) {
    return (
      <Screen>
        <HeaderBar title="Review & Pay" />
        <EmptyState
          icon="tickets"
          title="Nothing to book yet"
          message="Choose a journey and seats first."
          actionLabel="Back to Home"
          onAction={() => router.dismissAll()}
        />
      </Screen>
    );
  }

  const serverFieldErrors = { ...(submit.error?.fieldErrors ?? {}), ...fieldErrors };

  return (
    <Screen
      footer={
        <PriceBar
          totalCents={quote.data?.totalCents ?? 0}
          caption={quote.data ? 'Total incl. extras' : quote.isLoading ? 'Calculating…' : 'Total unavailable'}
          actionLabel="Confirm & Pay"
          onAction={confirm}
          loading={submit.isPending}
          disabled={!quote.data || conflictSeats.length > 0}
        />
      }
    >
      <HeaderBar title="Review & Pay" />

      <View style={styles.section}>
        {segments.map((segment, index) => (
          <TripSummary key={segment.journey.id} label={index === 0 ? 'Outbound' : 'Return'} segment={segment} />
        ))}
      </View>

      {conflictSeats.length > 0 ? (
        <View style={styles.section}>
          <InlineAlert
            kind="error"
            title="Seat just taken"
            message={
              submit.error?.message ??
              `${conflictSeats.map((seat) => `Car ${seat.carNumber} seat ${seat.seatNumber}`).join(', ')} is no longer available.`
            }
            actionLabel="Choose new seats"
            onAction={chooseNewSeats}
          />
        </View>
      ) : submit.error ? (
        <View style={styles.section}>
          <InlineAlert
            kind="error"
            title="Booking not completed"
            message={submit.error.message}
            actionLabel="Try again"
            onAction={confirm}
          />
        </View>
      ) : null}

      <AppText variant="subheading" accessibilityRole="header" style={styles.heading}>
        Passengers
      </AppText>
      <View style={styles.fields}>
        {names.map((name, index) => (
          <TextField
            key={index}
            label={`Passenger ${index + 1} · seat ${segments[0]?.seats[index]?.seatNumber ?? ''}`}
            icon="person"
            value={name}
            placeholder="Full name"
            autoCapitalize="words"
            textContentType={index === 0 ? 'name' : 'none'}
            error={serverFieldErrors[`passengers.${index}.fullName`]}
            onChangeText={(value) => setNames((previous) => previous.map((item, position) => (position === index ? value : item)))}
          />
        ))}
        <TextField
          label="Email for tickets"
          icon="mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          error={serverFieldErrors.contactEmail}
        />
      </View>

      <AppText variant="subheading" accessibilityRole="header" style={styles.heading}>
        Price
      </AppText>
      <View style={[styles.priceCard, { backgroundColor: colors.surfaceRaised }]}>
        {quote.isLoading ? (
          <>
            <Skeleton height={sizes.skeletonLine} />
            <Skeleton height={sizes.skeletonLine} width={sizes.skeletonWidthMedium} />
          </>
        ) : quote.error ? (
          <InlineAlert kind="error" message={quote.error.message} actionLabel="Retry" onAction={quote.refetch} />
        ) : quote.data ? (
          <>
            {quote.data.lines.map((line) => (
              <View key={line.label} style={styles.priceLine}>
                <AppText variant="label" tone="secondary" style={styles.flex}>
                  {line.label} × {line.quantity}
                </AppText>
                <AppText variant="bodyStrong">{formatMoney(line.totalCents)}</AppText>
              </View>
            ))}
            <View style={[styles.divider, { backgroundColor: colors.line }]} />
            <View style={styles.priceLine}>
              <AppText variant="subheading" style={styles.flex}>
                Total
              </AppText>
              <AppText variant="subheading">{formatMoney(quote.data.totalCents)}</AppText>
            </View>
          </>
        ) : null}
      </View>
    </Screen>
  );
}

function TripSummary({ label, segment }: { label: string; segment: SegmentDraft }) {
  const { colors } = useTheme();
  const { journey } = segment;
  return (
    <View style={[styles.trip, { backgroundColor: colors.inverse }]}>
      <AppText variant="caption" tone="onInverseMuted">
        {label} · {formatDateTime(journey.departureAt)}
      </AppText>
      <AppText variant="subheading" tone="onInverse">
        {journey.origin.city} → {journey.destination.city}
      </AppText>
      <AppText variant="label" tone="onInverseMuted">
        {formatTime(journey.departureAt)}–{formatTime(journey.arrivalAt)} · {journey.trainNumber} · {classLabel(segment.travelClass)} · Car{' '}
        {segment.seats[0]?.carNumber}, seat
        {segment.seats.length > 1 ? 's' : ''} {segment.seats.map((seat) => seat.seatNumber).join(', ')}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: spacing.sm, marginTop: spacing.xxs, marginBottom: spacing.xs },
  heading: { marginTop: spacing.xl, marginBottom: spacing.md },
  fields: { gap: spacing.md },
  priceCard: { borderRadius: layout.cardRadius, padding: spacing.lg, gap: spacing.sm },
  priceLine: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1 },
  divider: { height: borderWidths.hairline, marginVertical: spacing.xxs },
  trip: { borderRadius: layout.cardRadius, padding: spacing.lg, gap: spacing.xxs, marginBottom: spacing.xs },
});
