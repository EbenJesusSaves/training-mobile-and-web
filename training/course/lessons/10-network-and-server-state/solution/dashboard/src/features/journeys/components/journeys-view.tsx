// Course version (lesson 10) — becomes the full RailPass version in lesson 11.
import { Pagination, Progress, Select, Skeleton, Text, TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import { componentSizes, fontWeights, iconSizes, pageSizes, radiusKeys, textSizes, themeColorNames } from '../../../shared/constants';
import { useDebouncedValue } from '../../../shared/hooks/use-debounced-value';
import { formatDateTime, formatDuration, formatPercent } from '../../../shared/lib/format';
import { DataTable } from '../../../shared/ui/data-table';
import { EmptyState } from '../../../shared/ui/empty-state';
import { ErrorState } from '../../../shared/ui/error-state';
import { PageHeader } from '../../../shared/ui/page-header';
import { useJourneys } from '../api/journey-queries';
import type { JourneyStatus } from '../types';
import { JourneyStatusBadge } from './journey-status-badge';
import { TrainLabel } from './train-label';

import styles from './journeys-view.module.css';

export function JourneysView() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const debouncedSearch = useDebouncedValue(search);
  const journeys = useJourneys({
    page,
    pageSize: pageSizes.default,
    search: debouncedSearch,
    when: 'upcoming',
    status: (status || undefined) as JourneyStatus | undefined,
  });
  const totalPages = Math.max(1, Math.ceil((journeys.data?.total ?? 0) / pageSizes.default));

  return (
    <>
      <PageHeader title="Journeys" description="Search journeys from the API. The create form arrives in lesson 11." />
      <section className={styles.filters} aria-label="Journey filters">
        <TextInput
          label="Search"
          placeholder="Train, route, city"
          leftSection={<IconSearch size={iconSizes.sm} />}
          value={search}
          onChange={(event) => {
            setSearch(event.currentTarget.value);
            setPage(1);
          }}
        />
        <Select
          label="Status"
          value={status}
          onChange={(value) => {
            setStatus(value ?? '');
            setPage(1);
          }}
          data={[
            { value: '', label: 'All statuses' },
            { value: 'SCHEDULED', label: 'Scheduled' },
            { value: 'DELAYED', label: 'Delayed' },
            { value: 'CANCELLED', label: 'Cancelled' },
          ]}
        />
      </section>
      {journeys.isLoading ? (
        <Skeleton height={componentSizes.skeletonTableHeight} radius={radiusKeys.xl} />
      ) : journeys.isError ? (
        <ErrorState error={journeys.error} onRetry={() => journeys.refetch()} />
      ) : journeys.data?.items.length === 0 ? (
        <EmptyState title="No journeys found" description="Try loosening the filters." />
      ) : (
        <>
          <DataTable minWidth={componentSizes.tableJourneyMinWidth}>
            <DataTable.Head>
              <DataTable.Row>
                <DataTable.Th>Route</DataTable.Th>
                <DataTable.Th>Train</DataTable.Th>
                <DataTable.Th>Departure</DataTable.Th>
                <DataTable.Th>Duration</DataTable.Th>
                <DataTable.Th>Status</DataTable.Th>
                <DataTable.Th>Occupancy</DataTable.Th>
              </DataTable.Row>
            </DataTable.Head>
            <DataTable.Body>
              {journeys.data?.items.map((journey) => (
                <DataTable.Row key={journey.id} data-clickable="true" onClick={() => navigate(`/journeys/${journey.id}`)}>
                  <DataTable.Td>
                    <Text fw={fontWeights.extraBold}>
                      {journey.origin.city} → {journey.destination.city}
                    </Text>
                    <Text size={textSizes.xs} c={themeColorNames.dimmed}>
                      {journey.origin.code} · {journey.destination.code}
                    </Text>
                  </DataTable.Td>
                  <DataTable.Td>
                    <TrainLabel journey={journey} />
                  </DataTable.Td>
                  <DataTable.Td>{formatDateTime(journey.departureAt)}</DataTable.Td>
                  <DataTable.Td>{formatDuration(journey.durationMinutes)}</DataTable.Td>
                  <DataTable.Td>
                    <JourneyStatusBadge status={journey.status} delayMinutes={journey.delayMinutes} />
                  </DataTable.Td>
                  <DataTable.Td>
                    <Progress value={journey.occupancy * 100} w={componentSizes.progressWidth} /> {formatPercent(journey.occupancy)}
                  </DataTable.Td>
                </DataTable.Row>
              ))}
            </DataTable.Body>
          </DataTable>
          <div className={styles.actionsRow}>
            <Pagination value={page} total={totalPages} onChange={setPage} />
          </div>
        </>
      )}
    </>
  );
}
