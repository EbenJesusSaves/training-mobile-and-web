import { Button, Group, Progress, Skeleton, Text } from '@mantine/core';
import { IconRefresh } from '@tabler/icons-react';
import { Link } from 'react-router';

import {
  componentSizeKeys,
  componentSizes,
  fontWeights,
  iconSizes,
  radiusKeys,
  spacingKeys,
  textSizes,
  themeColorNames,
} from '../../../shared/constants';
import { formatDateTime, formatMoney, formatPercent } from '../../../shared/lib/format';
import { ErrorState } from '../../../shared/ui/error-state';
import { PageHeader } from '../../../shared/ui/page-header';
import { BookingStatusBadge } from '../../bookings/components/booking-status-badge';
import { JourneyStatusBadge } from '../../journeys/components/journey-status-badge';
import { TrainLabel } from '../../journeys/components/train-label';
import { RouteLabel } from '../../network/components/route-label';
import { useOverview } from '../api/overview-queries';
import { BookingsChart } from './bookings-chart';
import { BusiestJourneysChart } from './busiest-journeys-chart';

import styles from './overview-view.module.css';

export function OverviewView() {
  const overview = useOverview();

  if (overview.isLoading) {
    return (
      <>
        <PageHeader title="Operations overview" description="Loading current RailPass training data…" />
        <Skeleton height={componentSizes.skeletonPanelHeight} radius={radiusKeys.xl} />
        <Skeleton height={componentSizes.skeletonTallHeight} radius={radiusKeys.xl} mt={spacingKeys.md} />
      </>
    );
  }

  if (overview.isError) return <ErrorState error={overview.error} onRetry={() => overview.refetch()} />;
  const data = overview.data;
  if (!data) return null;

  return (
    <>
      <PageHeader
        title="Operations overview"
        description="Today’s network at a glance. Revenue figures are simulated; no real payments are taken."
        actions={
          <Button
            leftSection={<IconRefresh size={iconSizes.md} />}
            variant="light"
            onClick={() => overview.refetch()}
            loading={overview.isFetching}
          >
            Refresh
          </Button>
        }
      />

      <section className={styles.kpis} aria-label="Key performance indicators">
        <div className={styles.heroKpi}>
          <div className={styles.kpiLabel}>Simulated revenue today</div>
          <div className={styles.kpiValue}>{formatMoney(data.totals.revenueTodayCents)}</div>
          <p>
            {data.totals.bookingsToday} bookings today · {formatMoney(data.totals.revenueLast7DaysCents)} in the last 7 days
          </p>
        </div>
        <div className={styles.kpi}>
          <div className={styles.kpiLabel}>Upcoming journeys</div>
          <div className={styles.kpiValue}>{data.totals.upcomingJourneys}</div>
        </div>
        <div className={styles.kpi}>
          <div className={styles.kpiLabel}>Average occupancy</div>
          <div className={styles.kpiValue}>{formatPercent(data.totals.averageOccupancy)}</div>
        </div>
        <div className={styles.kpi}>
          <div className={styles.kpiLabel}>Passengers</div>
          <div className={styles.kpiValue}>{data.totals.passengers.toLocaleString()}</div>
        </div>
      </section>

      <div className={styles.grid}>
        <div className={styles.list}>
          <section className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2 className={styles.panelTitle}>Bookings and simulated revenue</h2>
            </div>
            <BookingsChart daily={data.daily} />
          </section>

          <section className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2 className={styles.panelTitle}>Next departures</h2>
              <Button component={Link} to="/journeys" variant="subtle" size={componentSizeKeys.xs}>
                View all
              </Button>
            </div>
            <div className={styles.list}>
              {data.nextDepartures.map((journey) => (
                <Link className={styles.departure} key={journey.id} to={`/journeys/${journey.id}`}>
                  <div className={styles.departureTop}>
                    <RouteLabel item={journey} />
                    <JourneyStatusBadge status={journey.status} delayMinutes={journey.delayMinutes} />
                  </div>
                  <Group justify="space-between" gap={spacingKeys.xs}>
                    <Group gap={spacingKeys.xs}>
                      <TrainLabel journey={journey} mutedName />
                      <Text size={textSizes.sm} c={themeColorNames.dimmed}>
                        · {formatDateTime(journey.departureAt)}
                      </Text>
                    </Group>
                    <Text size={textSizes.sm} fw={fontWeights.bold}>
                      {journey.availableSeats}/{journey.totalSeats} free
                    </Text>
                  </Group>
                  <Progress value={journey.occupancy * 100} color={themeColorNames.rail} radius={radiusKeys.xl} />
                </Link>
              ))}
            </div>
          </section>
        </div>

        <aside className={styles.list}>
          <section className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2 className={styles.panelTitle}>Busiest journeys</h2>
            </div>
            <BusiestJourneysChart journeys={data.busiestJourneys} />
          </section>

          <section className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2 className={styles.panelTitle}>Recent bookings</h2>
            </div>
            <div className={styles.list}>
              {data.recentBookings.map((booking) => (
                <Link className={styles.booking} key={booking.id} to={`/bookings?booking=${booking.id}`}>
                  <div className={styles.bookingTop}>
                    <div>
                      <Text fw={fontWeights.extraBold}>{booking.reference}</Text>
                      <Text size={textSizes.xs} c={themeColorNames.dimmed}>
                        {booking.customer.fullName}
                      </Text>
                    </div>
                    <BookingStatusBadge status={booking.status} />
                  </div>
                  <Group justify="space-between">
                    <Text size={textSizes.sm} c={themeColorNames.dimmed}>
                      {formatDateTime(booking.createdAt)}
                    </Text>
                    <Text size={textSizes.sm} fw={fontWeights.extraBold}>
                      {formatMoney(booking.totalCents)}
                    </Text>
                  </Group>
                </Link>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </>
  );
}
