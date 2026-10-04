import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { AppText } from '@/components/atomic/app-text';
import { HeaderBar } from '@/components/layout/header-bar';
import { Screen } from '@/components/layout/screen';
import { useTheme } from '@/components/theme/theme-provider';
import { StatusChip } from '@/components/ui/display/status-chip';
import { InlineAlert } from '@/components/ui/feedback/inline-alert';
import { ErrorState } from '@/components/ui/feedback/state-views';
import { Stepper } from '@/components/ui/inputs/stepper';
import { Skeleton } from '@/components/ui/loaders/skeleton';
import { addOnIcon } from '@/features/booking/add-on-icon';
import { CarSelector } from '@/features/booking/car-selector';
import { ClassPicker } from '@/features/booking/class-picker';
import { OptionRow } from '@/features/booking/option-row';
import { PriceBar } from '@/features/booking/price-bar';
import { SeatMap } from '@/features/booking/seat-map';

import { useApiQuery } from '@/hooks/use-api-query';

import { travelApi } from '@/api/travel-api';
import { appConfig } from '@/config/app-config';
import { formatDateTime, formatFare, pluralize } from '@/libs/format';
import { fareFor, useBookingDraftStore } from '@/store/booking-draft-store';

import { layout } from '@/constants/layout';
import { opacity } from '@/constants/opacity';
import { radii } from '@/constants/radii';
import { sizes } from '@/constants/sizes';
import { spacing } from '@/constants/spacing';

import type { Direction, TravelClass } from '@/api/types';

export default function SeatSelectionScreen() {
  // hooks
  const { id, direction: directionParam } = useLocalSearchParams<{ id: string; direction?: Direction }>();
  const direction: Direction = directionParam === 'RETURN' ? 'RETURN' : 'OUTBOUND';
  const tripType = useBookingDraftStore((state) => state.tripType);
  const segment = useBookingDraftStore((state) => (direction === 'OUTBOUND' ? state.outbound : state.inbound));
  const outbound = useBookingDraftStore((state) => state.outbound);
  const passengerCount = useBookingDraftStore((state) => state.passengerCount);
  const addOnQuantities = useBookingDraftStore((state) => state.addOns);
  const { setTravelClass, toggleSeat, setPassengerCount, setAddOnQuantity } = useBookingDraftStore.getState();
  const [carNumber, setCarNumber] = useState<number | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Polling keeps availability fresh while the passenger is deciding. Each fresh seat map is
  // reconciled with the selection in onSuccess (an event), rather than in an effect.
  const seatMap = useApiQuery(`seats:${id}`, (signal) => travelApi.seatMap(id, signal), {
    refetchOnFocus: true,
    // LIVE 10.3 — Refresh the seat map with appConfig.seatRefreshMs.
    refetchIntervalMs: undefined,
    onSuccess: (map) => {
      const store = useBookingDraftStore.getState();
      const current = direction === 'OUTBOUND' ? store.outbound : store.inbound;
      // Deep link or app restart: rebuild the segment from the journey we just loaded.
      if (current?.journey.id !== id) {
        const firstClass = map.journey.classes.find((item) => item.availableSeats > 0) ?? map.journey.classes[0];
        if (firstClass) store.chooseJourney(direction, map.journey, firstClass.travelClass);
        return;
      }
      // If someone else booked a seat we had selected, drop it and say so instead of failing at checkout.
      const lost = current.seats.filter((seat) =>
        map.cars.find((car) => car.carNumber === seat.carNumber)?.takenSeats.includes(seat.seatNumber),
      );
      if (lost.length > 0) {
        store.removeSeats(direction, lost);
        setNotice(`${lost.map((seat) => `Seat ${seat.seatNumber}`).join(', ')} was just booked by someone else. Please pick another.`);
      }
    },
  });
  const addOns = useApiQuery(direction === 'OUTBOUND' ? 'add-ons' : null, () => travelApi.addOns());

  // derived state
  const journey = seatMap.data?.journey ?? segment?.journey;
  const travelClass: TravelClass = segment?.travelClass ?? 'SECOND';
  const carsInClass = useMemo(
    () => (seatMap.data?.cars ?? []).filter((car) => car.travelClass === travelClass),
    [seatMap.data, travelClass],
  );
  const activeCar =
    carsInClass.find((car) => car.carNumber === carNumber) ?? carsInClass.find((car) => car.availableSeats > 0) ?? carsInClass[0];
  const selectedSeats = segment?.seats ?? [];
  const seatsMissing = passengerCount - selectedSeats.length;
  const fareCents = segment ? fareFor(segment) : 0;
  const addOnTotal = (addOns.data ?? []).reduce((sum, addOn) => sum + addOn.priceCents * (addOnQuantities[addOn.code] ?? 0), 0);
  const previousLegs = direction === 'RETURN' && outbound ? fareFor(outbound) * passengerCount : 0;
  const totalCents = fareCents * passengerCount + previousLegs + addOnTotal;
  const seatList = selectedSeats
    .map((seat) => (carsInClass.length > 1 ? `${seat.carNumber}/${seat.seatNumber}` : seat.seatNumber))
    .join(', ');
  const caption = selectedSeats.length
    ? `${pluralize(passengerCount, 'Ticket')} (${selectedSeats.length === 1 ? 'Seat' : 'Seats'} ${seatList})`
    : `Choose ${pluralize(passengerCount, 'seat')}`;
  const actionLabel = direction === 'OUTBOUND' && tripType === 'ROUND_TRIP' ? 'Choose Return' : 'Buy Ticket';

  // handlers
  const continueBooking = () => {
    if (direction === 'OUTBOUND' && tripType === 'ROUND_TRIP') router.push('/return-journeys');
    else router.push('/checkout');
  };

  // render
  return (
    <Screen
      footer={
        <PriceBar
          totalCents={totalCents}
          caption={seatsMissing > 0 && selectedSeats.length ? `Select ${pluralize(seatsMissing, 'more seat')}` : caption}
          actionLabel={actionLabel}
          onAction={continueBooking}
          disabled={!segment || seatsMissing !== 0}
        />
      }
    >
      <HeaderBar title={direction === 'RETURN' ? 'Choose Return Seat' : 'Choose a Seat'} />

      {journey ? (
        <View style={styles.summary}>
          <AppText variant="label" tone="muted">
            {formatDateTime(journey.departureAt)} · {journey.trainNumber}
          </AppText>
          <AppText variant="title" accessibilityRole="header">
            {journey.origin.city}-{journey.destination.city}
          </AppText>
          {journey.status === 'DELAYED' ? <StatusChip kind="DELAYED" suffix={`+${journey.delayMinutes} min`} /> : null}
        </View>
      ) : (
        <Skeleton height={sizes.skeletonSummary} width={sizes.skeletonWidthMedium} style={styles.summary} />
      )}

      {seatMap.error && !seatMap.data ? (
        <ErrorState error={seatMap.error} onRetry={seatMap.refetch} />
      ) : !seatMap.data || !segment ? (
        <View style={styles.loading}>
          <Skeleton height={sizes.cardRowMinHeight} />
          <Skeleton height={sizes.carPill} width={sizes.skeletonWidthShort} />
          <Skeleton height={sizes.skeletonSeatMap} radius={layout.heroCardRadius} />
        </View>
      ) : (
        <>
          <ClassPicker
            classes={seatMap.data.journey.classes}
            value={travelClass}
            onChange={(next) => {
              setTravelClass(direction, next);
              setCarNumber(null);
            }}
          />

          {notice ? (
            <View style={styles.notice}>
              <InlineAlert
                kind="warning"
                title="Seat no longer available"
                message={notice}
                actionLabel="OK"
                onAction={() => setNotice(null)}
              />
            </View>
          ) : null}

          {activeCar ? (
            <>
              <View style={styles.car}>
                <CarSelector cars={carsInClass} value={activeCar.carNumber} onChange={setCarNumber} />
              </View>
              <View style={styles.mapBleed}>
                <SeatMap car={activeCar} selected={selectedSeats} onToggle={(seat) => toggleSeat(direction, seat)} />
              </View>
              <SeatLegend />
            </>
          ) : null}

          <AppText variant="subheading" accessibilityRole="header" style={styles.optionsTitle}>
            {direction === 'OUTBOUND' ? 'Additional Options' : 'Passengers'}
          </AppText>
          <View style={styles.options}>
            {direction === 'OUTBOUND' ? (
              <OptionRow
                icon="people"
                title="Passengers"
                description="Pick one seat for each passenger"
                trailing={
                  <Stepper label="passengers" value={passengerCount} min={1} max={appConfig.maxPassengers} onChange={setPassengerCount} />
                }
              />
            ) : (
              <AppText variant="label" tone="muted">
                Choose {pluralize(passengerCount, 'seat')} for your return journey, one per passenger.
              </AppText>
            )}
            {direction === 'OUTBOUND'
              ? (addOns.data ?? []).map((addOn) => {
                  const quantity = addOnQuantities[addOn.code] ?? 0;
                  return (
                    <OptionRow
                      key={addOn.code}
                      icon={addOnIcon(addOn.icon)}
                      title={addOn.name}
                      description={addOn.description}
                      selected={quantity > 0}
                      onPress={passengerCount === 1 ? () => setAddOnQuantity(addOn.code, quantity > 0 ? 0 : 1) : undefined}
                      accessibilityLabel={`${addOn.name}, ${formatFare(addOn.priceCents, { sign: true })}${quantity ? ', added' : ''}`}
                      trailing={
                        <>
                          <AppText variant="subheading">{formatFare(addOn.priceCents, { sign: true })}</AppText>
                          {passengerCount > 1 ? (
                            <Stepper
                              label={addOn.name}
                              value={quantity}
                              min={0}
                              max={passengerCount}
                              onChange={(next) => setAddOnQuantity(addOn.code, next)}
                            />
                          ) : null}
                        </>
                      }
                    />
                  );
                })
              : null}
          </View>
          <AppText variant="caption" tone="muted" style={styles.footnote}>
            Prices are confirmed at checkout. Seat availability refreshes automatically.
          </AppText>
        </>
      )}
    </Screen>
  );
}

function SeatLegend() {
  const { colors } = useTheme();
  const items = [
    { label: 'Available', color: colors.accent, hatched: false },
    { label: 'Selected', color: colors.seatSelected, hatched: false },
    { label: 'Unavailable', color: colors.seatTaken, hatched: true },
  ];
  return (
    <View style={styles.legend} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {items.map((item) => (
        <View key={item.label} style={styles.legendItem}>
          <View style={[styles.legendSwatch, { backgroundColor: item.color }]}>
            {item.hatched ? <View style={[styles.legendHatch, { backgroundColor: colors.inkMuted }]} /> : null}
          </View>
          <AppText variant="caption" tone="secondary">
            {item.label}
          </AppText>
        </View>
      ))}
    </View>
  );
}

const HATCH_ANGLE = '-45deg';

const styles = StyleSheet.create({
  summary: { gap: spacing.xxs, marginBottom: layout.blockGap },
  loading: { gap: layout.blockGap },
  notice: { marginTop: spacing.md },
  car: { marginTop: layout.sectionGap, marginBottom: spacing.md },
  mapBleed: { marginHorizontal: -layout.screenGutter },
  legend: { flexDirection: 'row', gap: spacing.lg, marginTop: spacing.md, flexWrap: 'wrap' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  legendSwatch: {
    width: sizes.legendSwatch,
    height: sizes.legendSwatch,
    borderRadius: radii.xs,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendHatch: {
    width: sizes.legendHatchWidth,
    height: sizes.legendHatchHeight,
    transform: [{ rotate: HATCH_ANGLE }],
    opacity: opacity.hatchLegend,
  },
  optionsTitle: { marginTop: layout.sectionGap, marginBottom: spacing.md },
  options: { gap: spacing.sm },
  footnote: { marginTop: spacing.md },
});
