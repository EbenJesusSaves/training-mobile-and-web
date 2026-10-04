import { Alert, Button, Divider, Drawer, Group, LoadingOverlay, Stack, Text, Textarea } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';
import { useState } from 'react';
import { Link } from 'react-router';

import { componentSizeKeys, fontWeights, iconSizes, spacingKeys, textSizes, themeColorNames } from '../../../shared/constants';
import { formatDateTime, formatMoney } from '../../../shared/lib/format';
import { JourneyStatusBadge } from '../../journeys/components/journey-status-badge';
import { useBooking, useBookingStatusMutation } from '../api/booking-queries';
import { BookingStatusBadge } from './booking-status-badge';

import styles from './booking-detail-drawer.module.css';

interface BookingDetailDrawerProps {
  bookingId: string | null;
  onClose: () => void;
}

export function BookingDetailDrawer({ bookingId, onClose }: BookingDetailDrawerProps) {
  const booking = useBooking(bookingId);
  const statusMutation = useBookingStatusMutation();
  const [reason, setReason] = useState('');
  const data = booking.data;

  return (
    <Drawer
      opened={Boolean(bookingId)}
      onClose={onClose}
      position="right"
      size={componentSizeKeys.lg}
      title={data ? `Booking ${data.reference}` : 'Booking detail'}
    >
      <LoadingOverlay visible={booking.isLoading || statusMutation.isPending} />
      {booking.isError ? (
        <Alert color={themeColorNames.danger} icon={<IconAlertTriangle size={iconSizes.md} />}>
          Could not load booking.
        </Alert>
      ) : null}
      {data ? (
        <div className={styles.detail}>
          <Group justify="space-between">
            <div>
              <Text fw={fontWeights.black} size={textSizes.xl}>
                {data.reference}
              </Text>
              <Text c={themeColorNames.dimmed}>
                {data.customer.fullName} · {data.contactEmail}
              </Text>
            </div>
            <BookingStatusBadge status={data.status} />
          </Group>
          <div className={styles.card}>
            <Text fw={fontWeights.extraBold} mb={spacingKeys.xs}>
              Price breakdown
            </Text>
            <Group justify="space-between">
              <Text>Fares</Text>
              <Text fw={fontWeights.bold}>{formatMoney(data.fareTotalCents)}</Text>
            </Group>
            <Group justify="space-between">
              <Text>Add-ons</Text>
              <Text fw={fontWeights.bold}>{formatMoney(data.addOnTotalCents)}</Text>
            </Group>
            <Divider my="xs" />
            <Group justify="space-between">
              <Text fw={fontWeights.black}>Simulated total</Text>
              <Text fw={fontWeights.black}>{formatMoney(data.totalCents)}</Text>
            </Group>
          </div>

          <Stack gap={spacingKeys.sm}>
            <Text fw={fontWeights.extraBold}>Passengers</Text>
            {data.passengers.map((passenger) => (
              <Text key={passenger.id}>
                {passenger.position}. {passenger.fullName}
              </Text>
            ))}
          </Stack>

          <Stack gap={spacingKeys.sm}>
            <Text fw={fontWeights.extraBold}>Segments and seats</Text>
            {data.segments.map((segment) => (
              <div className={styles.segment} key={segment.id}>
                <Group justify="space-between">
                  <Text fw={fontWeights.extraBold}>
                    {segment.journey.origin.city} → {segment.journey.destination.city}
                  </Text>
                  <JourneyStatusBadge status={segment.journey.status} delayMinutes={segment.journey.delayMinutes} />
                </Group>
                <Text size={textSizes.sm} c={themeColorNames.dimmed}>
                  {formatDateTime(segment.journey.departureAt)} · {segment.travelClass}
                </Text>
                <div className={styles.ticketGrid}>
                  {segment.tickets.map((ticket) => (
                    <div className={styles.ticket} key={ticket.id}>
                      <Text fw={fontWeights.extraBold}>{ticket.passengerName}</Text>
                      <Text size={textSizes.sm}>
                        Car {ticket.carNumber}, Seat {ticket.seatNumber}
                      </Text>
                      <Text size={textSizes.xs} c={themeColorNames.dimmed}>
                        {ticket.ticketCode}
                      </Text>
                    </div>
                  ))}
                </div>
                <Button component={Link} to={`/journeys/${segment.journey.id}`} variant="subtle" size={componentSizeKeys.xs}>
                  Open journey
                </Button>
              </div>
            ))}
          </Stack>

          <div className={styles.card}>
            <Text fw={fontWeights.extraBold} mb={spacingKeys.sm}>
              Status timeline
            </Text>
            <div className={styles.timeline}>
              <div className={styles.timelineItem}>
                <span className={styles.dot} />
                <span>Created {formatDateTime(data.createdAt)}</span>
              </div>
              {data.checkedInAt ? (
                <div className={styles.timelineItem}>
                  <span className={styles.dot} />
                  <span>Checked in {formatDateTime(data.checkedInAt)}</span>
                </div>
              ) : null}
              {data.cancelledAt ? (
                <div className={styles.timelineItem}>
                  <span className={styles.dot} />
                  <span>
                    Cancelled {formatDateTime(data.cancelledAt)} · {data.cancellationReason}
                  </span>
                </div>
              ) : null}
            </div>
          </div>

          {data.addOns.length ? (
            <div className={styles.card}>
              <Text fw={fontWeights.extraBold} mb={spacingKeys.sm}>
                Extras
              </Text>
              {data.addOns.map((addOn) => (
                <Group key={addOn.code} justify="space-between">
                  <Text>
                    {addOn.name} × {addOn.quantity}
                  </Text>
                  <Text>{formatMoney(addOn.totalCents)}</Text>
                </Group>
              ))}
            </div>
          ) : null}

          {data.status !== 'CANCELLED' ? (
            <Stack>
              <Group grow>
                {data.status === 'CONFIRMED' ? (
                  <Button onClick={() => statusMutation.mutate({ id: data.id, status: 'CHECKED_IN' })}>Check in</Button>
                ) : (
                  <Button variant="light" onClick={() => statusMutation.mutate({ id: data.id, status: 'CONFIRMED' })}>
                    Undo check-in
                  </Button>
                )}
              </Group>
              <Textarea
                label="Cancellation reason"
                placeholder="Reason shown in the booking history"
                value={reason}
                onChange={(event) => setReason(event.currentTarget.value)}
              />
              <Button
                color={themeColorNames.danger}
                variant="outline"
                onClick={() => statusMutation.mutate({ id: data.id, status: 'CANCELLED', reason: reason || 'Cancelled by RailPass staff' })}
              >
                Cancel booking
              </Button>
            </Stack>
          ) : null}
        </div>
      ) : null}
    </Drawer>
  );
}
