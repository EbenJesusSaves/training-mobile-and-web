// Course version (lesson 06) — removed before routing in lesson 07.
import { Stack, Text, Title } from '@mantine/core';

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
          {/* LIVE 06.6 — Map prototypeJourneys into DataTable.Row cells with TrainLabel and JourneyStatusBadge. */}
          <DataTable.Row>
            <DataTable.Td colSpan={3}>Prototype rows arrive during the live build.</DataTable.Td>
          </DataTable.Row>
        </DataTable.Body>
      </DataTable>
      <EmptyState title="No filters applied" description="Empty states use one shared component across features." />
      <Text size="sm">Use the prototype fixtures to practice table composition before API data arrives.</Text>
    </Stack>
  );
}
