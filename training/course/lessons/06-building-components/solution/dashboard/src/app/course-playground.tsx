// Course version (lesson 06) — removed before routing in lesson 07.
import { Stack, Text, Title } from '@mantine/core';

import { JourneyStatusBadge } from '../features/journeys/components/journey-status-badge';
import { TrainLabel } from '../features/journeys/components/train-label';
import { prototypeJourneys } from '../prototype/fixtures';
import { spacingKeys } from '../shared/constants';
import { DataTable } from '../shared/ui/data-table';
import { EmptyState } from '../shared/ui/empty-state';
import { PageHeader } from '../shared/ui/page-header';

export function CoursePlayground() {
  return (
    <Stack p={spacingKeys.xl} gap={spacingKeys.lg}>
      <PageHeader title="Component playground" description="Shared table, badges, labels and empty states before routing arrives." />
      <Title order={2}>Prototype journeys</Title>
      <DataTable>
        <DataTable.Head>
          <DataTable.Row>
            <DataTable.Th>Route</DataTable.Th>
            <DataTable.Th>Train</DataTable.Th>
            <DataTable.Th>Status</DataTable.Th>
          </DataTable.Row>
        </DataTable.Head>
        <DataTable.Body>
          {prototypeJourneys.map((journey) => (
            <DataTable.Row key={journey.id}>
              <DataTable.Td>
                {journey.origin.city} → {journey.destination.city}
              </DataTable.Td>
              <DataTable.Td>
                <TrainLabel journey={journey} />
              </DataTable.Td>
              <DataTable.Td>
                <JourneyStatusBadge status={journey.status} delayMinutes={journey.delayMinutes} />
              </DataTable.Td>
            </DataTable.Row>
          ))}
        </DataTable.Body>
      </DataTable>
      <EmptyState title="No filters applied" description="Empty states use one shared component across features." />
      <Text size="sm">1 prototype row(s) are enough to teach composition without the API.</Text>
    </Stack>
  );
}
