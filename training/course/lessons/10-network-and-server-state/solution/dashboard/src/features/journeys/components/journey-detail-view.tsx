// Course version (lesson 10) — becomes the full RailPass version in lesson 18.
import { Button, Group, Skeleton, Tabs } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { Link } from 'react-router';

import { componentSizes, iconSizes, radiusKeys, spacingKeys } from '../../../shared/constants';
import { formatDateTime, formatDuration, formatPercent } from '../../../shared/lib/format';
import { DataTable } from '../../../shared/ui/data-table';
import { ErrorState } from '../../../shared/ui/error-state';
import { BookingStatusBadge } from '../../bookings/components/booking-status-badge';
import { useJourney } from '../api/journey-queries';
import { JourneyStatusBadge } from './journey-status-badge';
import { SeatOccupancyMap } from './seat-occupancy-map';
import { TrainLabel } from './train-label';

import styles from './journey-detail-view.module.css';

export function JourneyDetailView({ journeyId }: { journeyId: string }) {
  const journey = useJourney(journeyId);

  if (journey.isLoading) return <Skeleton height={componentSizes.skeletonDetailHeight} radius={radiusKeys.xl} />;
  if (journey.isError) return <ErrorState error={journey.error} onRetry={() => journey.refetch()} />;
  const data = journey.data;
  if (!data) return null;

  return (
    <>
      <Button component={Link} to="/journeys" variant="subtle" leftSection={<IconArrowLeft size={iconSizes.md} />} mb={spacingKeys.md}>
        Back to journeys
      </Button>
      <section className={styles.headerCard}>
        <div>
          <h1 className={styles.title}>
            {data.origin.city} → {data.destination.city}
          </h1>
          <Group gap={spacingKeys.xs}>
            <JourneyStatusBadge status={data.status} delayMinutes={data.delayMinutes} />
            <TrainLabel journey={data} mutedName />
          </Group>
          <div className={styles.metaGrid}>
            <div className={styles.meta}>
              <span>Departure</span>
              <strong>{formatDateTime(data.departureAt)}</strong>
            </div>
            <div className={styles.meta}>
              <span>Arrival</span>
              <strong>{formatDateTime(data.arrivalAt)}</strong>
            </div>
            <div className={styles.meta}>
              <span>Duration</span>
              <strong>{formatDuration(data.durationMinutes)}</strong>
            </div>
            <div className={styles.meta}>
              <span>Occupancy</span>
              <strong>
                {formatPercent(data.occupancy)} · {data.bookingCount} bookings
              </strong>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.stack}>
        <Tabs defaultValue="seats">
          <Tabs.List>
            <Tabs.Tab value="seats">Seat map</Tabs.Tab>
            <Tabs.Tab value="manifest">Passenger manifest</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="seats" pt={spacingKeys.md}>
            <SeatOccupancyMap journey={data} />
          </Tabs.Panel>
          <Tabs.Panel value="manifest" pt={spacingKeys.md}>
            <DataTable minWidth={820}>
              <DataTable.Head>
                <DataTable.Row>
                  <DataTable.Th>Passenger</DataTable.Th>
                  <DataTable.Th>Ticket</DataTable.Th>
                  <DataTable.Th>Seat</DataTable.Th>
                  <DataTable.Th>Booking</DataTable.Th>
                  <DataTable.Th>Status</DataTable.Th>
                </DataTable.Row>
              </DataTable.Head>
              <DataTable.Body>
                {data.manifest.map((item) => (
                  <DataTable.Row key={item.ticketId}>
                    <DataTable.Td>{item.passengerName}</DataTable.Td>
                    <DataTable.Td>{item.ticketCode}</DataTable.Td>
                    <DataTable.Td>
                      Car {item.carNumber}, Seat {item.seatNumber}
                    </DataTable.Td>
                    <DataTable.Td>{item.bookingReference}</DataTable.Td>
                    <DataTable.Td>
                      <BookingStatusBadge status={item.bookingStatus} />
                    </DataTable.Td>
                  </DataTable.Row>
                ))}
              </DataTable.Body>
            </DataTable>
          </Tabs.Panel>
        </Tabs>
      </div>
    </>
  );
}
