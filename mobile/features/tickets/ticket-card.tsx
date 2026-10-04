import { useMemo, useState } from 'react';
import { type LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { Canvas, DashPathEffect, Line, Path, PathOp, rect, rrect, Skia, vec } from '@shopify/react-native-skia';

import { AppText } from '@/components/atomic/app-text';
import { ThemeScope } from '@/components/theme/theme-provider';
import { JourneyTimeline } from '@/components/ui/display/journey-timeline';
import { type ChipKind, StatusChip } from '@/components/ui/display/status-chip';

import { formatDuration, formatTime } from '@/libs/format';

import { Barcode } from './barcode';

import { ticketColors } from '@/constants/colors';
import { ticketGeometry as geo } from '@/constants/drawing';
import { opacity } from '@/constants/opacity';
import { sizes } from '@/constants/sizes';
import { spacing } from '@/constants/spacing';

import type { Booking, BookingSegment, Ticket } from '@/api/types';

const STUB_HEIGHT = geo.barcodeHeight + geo.stubPadding;
const ORIGIN = 0;

interface TicketCardProps {
  booking: Booking;
  segment: BookingSegment;
  ticket: Ticket;
  width: number;
}

function statusFor(booking: Booking, segment: BookingSegment): ChipKind | null {
  if (booking.status === 'CANCELLED') return 'CANCELLED';
  if (segment.journey.status === 'CANCELLED') return 'JOURNEY_CANCELLED';
  if (segment.journey.status === 'DELAYED') return 'DELAYED';
  if (booking.status === 'CHECKED_IN') return 'CHECKED_IN';
  return null;
}

/**
 * The white ticket from the reference. Its silhouette (rounded corners with two notches at the
 * perforation) is a Skia path; the content is regular text so it stays selectable and accessible.
 * Tickets are black-on-white in both themes, which also keeps the barcode scannable.
 */
export function TicketCard({ booking, segment, ticket, width }: TicketCardProps) {
  const [height, setHeight] = useState(0);
  const { journey } = segment;
  const notchY = height - STUB_HEIGHT;

  const shape = useMemo(() => {
    if (!height) return null;
    const body = Skia.Path.Make();
    body.addRRect(rrect(rect(ORIGIN, ORIGIN, width, height), geo.radius, geo.radius));
    const notches = Skia.Path.Make();
    notches.addCircle(ORIGIN, notchY, geo.notchRadius);
    notches.addCircle(width, notchY, geo.notchRadius);
    return Skia.Path.MakeFromOp(body, notches, PathOp.Difference);
  }, [height, notchY, width]);

  const invalid = booking.status === 'CANCELLED' || !ticket.isActive;
  const chip = statusFor(booking, segment);
  const perforationStart = geo.notchRadius + geo.perforationInset;

  return (
    <View style={{ width }} onLayout={(event: LayoutChangeEvent) => setHeight(event.nativeEvent.layout.height)}>
      {shape ? (
        <Canvas style={StyleSheet.absoluteFill} accessible={false}>
          <Path path={shape} color={ticketColors.paper} />
          <Line
            p1={vec(perforationStart, notchY)}
            p2={vec(width - perforationStart, notchY)}
            color={ticketColors.perforation}
            strokeWidth={geo.perforationWidth}
          >
            <DashPathEffect intervals={[...geo.perforationDash]} />
          </Line>
        </Canvas>
      ) : null}

      <View style={styles.body}>
        <View style={styles.passengerRow}>
          <View style={styles.flex}>
            <AppText variant="label" color={ticketColors.muted}>
              Passenger
            </AppText>
            <AppText variant="title" color={ticketColors.ink} numberOfLines={1}>
              {ticket.passengerName}
            </AppText>
          </View>
          {chip ? (
            <ThemeScope scheme="light">
              <StatusChip kind={chip} suffix={chip === 'DELAYED' ? `+${journey.delayMinutes} min` : undefined} />
            </ThemeScope>
          ) : null}
        </View>

        <View>
          <View style={styles.timesRow}>
            <AppText variant="label" color={ticketColors.muted}>
              {formatTime(journey.departureAt)}
            </AppText>
            <AppText variant="labelBold" color={ticketColors.ink}>
              {formatDuration(journey.durationMinutes)}
            </AppText>
            <AppText variant="label" color={ticketColors.muted}>
              {formatTime(journey.arrivalAt)}
            </AppText>
          </View>
          <JourneyTimeline
            variant="ticket"
            lineColor={ticketColors.ink}
            dashColor={ticketColors.dash}
            trainColor={ticketColors.ink}
            backgroundColor={ticketColors.paper}
          />
        </View>

        <View style={styles.citiesRow}>
          <View style={styles.flex}>
            <AppText variant="title" color={ticketColors.ink} numberOfLines={1}>
              {journey.origin.city}
            </AppText>
            <AppText variant="label" color={ticketColors.muted} numberOfLines={1}>
              {journey.origin.name}
            </AppText>
          </View>
          <View style={[styles.flex, styles.alignEnd]}>
            <AppText variant="title" color={ticketColors.ink} numberOfLines={1}>
              {journey.destination.city}
            </AppText>
            <AppText variant="label" color={ticketColors.muted} numberOfLines={1}>
              {journey.destination.name}
            </AppText>
          </View>
        </View>

        <View>
          <AppText variant="label" color={ticketColors.muted}>
            Booking Reference
          </AppText>
          <AppText variant="title" color={ticketColors.ink} selectable>
            {booking.reference}
          </AppText>
        </View>

        <View style={styles.detailsRow}>
          {[
            ['Train Car', String(ticket.carNumber)],
            ['Train', journey.trainNumber.replace(' ', '')],
            ['Seat', String(ticket.seatNumber)],
          ].map(([label, value]) => (
            <View key={label} style={styles.detail} accessible accessibilityLabel={`${label} ${value}`}>
              <AppText variant="label" color={ticketColors.muted}>
                {label}
              </AppText>
              <AppText variant="title" color={ticketColors.ink}>
                {value}
              </AppText>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.stub}>
        {ticket.barcode ? (
          <View style={invalid ? styles.invalid : undefined}>
            <Barcode matrix={ticket.barcode} width={width - geo.sidePadding * 2} height={geo.barcodeHeight} />
          </View>
        ) : null}
        <AppText variant="code" color={invalid ? ticketColors.void : ticketColors.muted}>
          {invalid ? 'Not valid for travel' : ticket.ticketCode}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: geo.sidePadding, paddingTop: spacing.xxl, paddingBottom: spacing.xl, gap: spacing.lg },
  passengerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  flex: { flex: 1 },
  alignEnd: { alignItems: 'flex-end' },
  timesRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xxs },
  citiesRow: { flexDirection: 'row', gap: spacing.md },
  detailsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  detail: { alignItems: 'center', minWidth: sizes.cardRowMinHeight },
  stub: { height: STUB_HEIGHT, alignItems: 'center', justifyContent: 'center', gap: spacing.xs, paddingTop: spacing.md },
  invalid: { opacity: opacity.invalidBarcode },
});
