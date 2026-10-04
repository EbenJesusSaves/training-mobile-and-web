import { Button, Group, Modal, Pagination, Progress, Select, Skeleton, Text, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import {
  componentSizeKeys,
  componentSizes,
  fontWeights,
  iconSizes,
  pageSizes,
  radiusKeys,
  spacingKeys,
  textSizes,
  themeColorNames,
} from '../../../shared/constants';
import { useDebouncedValue } from '../../../shared/hooks/use-debounced-value';
import { formatDateTime, formatDuration, formatPercent } from '../../../shared/lib/format';
import { DataTable } from '../../../shared/ui/data-table';
import { EmptyState } from '../../../shared/ui/empty-state';
import { ErrorState } from '../../../shared/ui/error-state';
import { PageHeader } from '../../../shared/ui/page-header';
import { useRoutes, useStations } from '../../network/api/network-queries';
import { useCreateJourney, useJourneys } from '../api/journey-queries';
import type { JourneyDto, JourneyStatus } from '../types';
import { JourneyForm } from './journey-form';
import { JourneyStatusBadge } from './journey-status-badge';
import { TrainLabel } from './train-label';

import styles from './journeys-view.module.css';

export function JourneysView() {
  const navigate = useNavigate();
  const [opened, modal] = useDisclosure(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [when, setWhen] = useState<'upcoming' | 'past' | 'all'>('upcoming');
  const [status, setStatus] = useState('');
  const [routeId, setRouteId] = useState('');
  const [stationId, setStationId] = useState('');
  const debouncedSearch = useDebouncedValue(search);
  const routes = useRoutes();
  const stations = useStations();
  const createJourney = useCreateJourney();
  const journeys = useJourneys({
    page,
    pageSize: pageSizes.default,
    search: debouncedSearch,
    when,
    status: (status || undefined) as JourneyStatus | undefined,
    routeId: routeId || undefined,
    stationId: stationId || undefined,
  });
  const totalPages = Math.max(1, Math.ceil((journeys.data?.total ?? 0) / pageSizes.default));

  const routeOptions = [
    { value: '', label: 'All routes' },
    ...(routes.data ?? []).map((route) => ({ value: route.id, label: `${route.origin.city} → ${route.destination.city}` })),
  ];
  const stationOptions = [
    { value: '', label: 'All stations' },
    ...(stations.data ?? []).map((station) => ({ value: station.id, label: `${station.code} · ${station.name}` })),
  ];

  return (
    <>
      <PageHeader
        title="Journeys"
        description="Search, schedule, and manage capacity for every RailPass service."
        actions={
          <Button leftSection={<IconPlus size={iconSizes.md} />} onClick={modal.open}>
            Create journey
          </Button>
        }
      />
      <section className={styles.filters} aria-label="Journey filters">
        <TextInput
          leftSection={<IconSearch size={iconSizes.sm} />}
          label="Search"
          placeholder="Train, route, city"
          value={search}
          onChange={(event) => {
            setSearch(event.currentTarget.value);
            setPage(1);
          }}
        />
        <Select
          label="When"
          value={when}
          onChange={(value) => {
            setWhen((value ?? 'upcoming') as 'upcoming' | 'past' | 'all');
            setPage(1);
          }}
          data={[
            { value: 'upcoming', label: 'Upcoming' },
            { value: 'past', label: 'Past' },
            { value: 'all', label: 'All' },
          ]}
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
        <Select
          label="Route"
          searchable
          value={routeId}
          onChange={(value) => {
            setRouteId(value ?? '');
            setPage(1);
          }}
          data={routeOptions}
        />
        <Select
          label="Station"
          searchable
          value={stationId}
          onChange={(value) => {
            setStationId(value ?? '');
            setPage(1);
          }}
          data={stationOptions}
        />
      </section>

      {journeys.isLoading ? (
        <Skeleton height={componentSizes.skeletonTableHeight} radius={radiusKeys.xl} />
      ) : journeys.isError ? (
        <ErrorState error={journeys.error} onRetry={() => journeys.refetch()} />
      ) : journeys.data?.items.length === 0 ? (
        <EmptyState title="No journeys found" description="Try loosening the filters or schedule a new service." />
      ) : (
        <>
          <DataTable minWidth={componentSizes.tableJourneyMinWidth}>
            <TableHead />
            <TableBody items={journeys.data?.items ?? []} onOpen={(id) => navigate(`/journeys/${id}`)} />
          </DataTable>
          <div className={styles.actionsRow}>
            <Pagination value={page} total={totalPages} onChange={setPage} />
          </div>
        </>
      )}

      <Modal
        opened={opened}
        onClose={modal.close}
        size={componentSizeKeys.xl}
        title="Create journey"
        closeOnClickOutside={!createJourney.isPending}
      >
        <JourneyForm
          routes={routes.data ?? []}
          loading={createJourney.isPending}
          onCancel={modal.close}
          onSubmit={(payload) => {
            // LIVE 11.6 — Await mutateAsync so JourneyForm can catch API field errors before closing.
            createJourney.mutate(payload);
          }}
        />
      </Modal>
    </>
  );
}

function TableHead() {
  return (
    <DataTable.Head>
      <DataTable.Row>
        <DataTable.Th>Route</DataTable.Th>
        <DataTable.Th>Train</DataTable.Th>
        <DataTable.Th>Departure</DataTable.Th>
        <DataTable.Th>Duration</DataTable.Th>
        <DataTable.Th>Status</DataTable.Th>
        <DataTable.Th>Occupancy</DataTable.Th>
        <DataTable.Th>Seats</DataTable.Th>
      </DataTable.Row>
    </DataTable.Head>
  );
}

function TableBody({ items, onOpen }: { items: JourneyDto[]; onOpen: (id: string) => void }) {
  return (
    <DataTable.Body>
      {items.map((journey) => (
        <DataTable.Row key={journey.id} data-clickable="true" onClick={() => onOpen(journey.id)}>
          <DataTable.Td>
            <div className={styles.routeCell}>
              <Text fw={fontWeights.extraBold}>
                {journey.origin.city} → {journey.destination.city}
              </Text>
              <Text size={textSizes.xs} c={themeColorNames.dimmed}>
                {journey.origin.code} · {journey.destination.code}
              </Text>
            </div>
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
            <Group gap={spacingKeys.xs}>
              <Progress
                value={journey.occupancy * 100}
                w={componentSizes.progressWidth}
                color={themeColorNames.rail}
                radius={radiusKeys.xl}
              />
              <Text size={textSizes.sm} fw={fontWeights.extraBold}>
                {formatPercent(journey.occupancy)}
              </Text>
            </Group>
          </DataTable.Td>
          <DataTable.Td>
            {journey.availableSeats}/{journey.totalSeats}
          </DataTable.Td>
        </DataTable.Row>
      ))}
    </DataTable.Body>
  );
}
