import { Button, Pagination, Skeleton, Text, TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import { componentSizeKeys, componentSizes, fontWeights, iconSizes, pageSizes, spacingKeys } from '../../../shared/constants';
import { useDebouncedValue } from '../../../shared/hooks/use-debounced-value';
import { formatDateTime, formatMoney } from '../../../shared/lib/format';
import { DataTable } from '../../../shared/ui/data-table';
import { EmptyState } from '../../../shared/ui/empty-state';
import { ErrorState } from '../../../shared/ui/error-state';
import { PageHeader } from '../../../shared/ui/page-header';
import { usePassengers } from '../api/passenger-queries';

export function PassengersView() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search);
  const passengers = usePassengers({ page, pageSize: pageSizes.default, search: debouncedSearch });
  const totalPages = Math.max(1, Math.ceil((passengers.data?.total ?? 0) / pageSizes.default));

  return (
    <>
      <PageHeader title="Passengers" description="Find passenger profiles, booking history, and total simulated spend." />
      <TextInput
        mb={spacingKeys.md}
        maw={componentSizes.searchInputMaxWidth}
        label="Search passengers"
        placeholder="Name, email, phone"
        leftSection={<IconSearch size={iconSizes.sm} />}
        value={search}
        onChange={(event) => {
          setSearch(event.currentTarget.value);
          setPage(1);
        }}
      />
      {passengers.isLoading ? (
        <Skeleton height={componentSizes.skeletonTableHeight} />
      ) : passengers.isError ? (
        <ErrorState error={passengers.error} onRetry={() => passengers.refetch()} />
      ) : passengers.data?.items.length === 0 ? (
        <EmptyState title="No passengers found" description="Try another name, email, or phone number." />
      ) : (
        <>
          <DataTable>
            <DataTable.Head>
              <DataTable.Row>
                <DataTable.Th>Name</DataTable.Th>
                <DataTable.Th>Email</DataTable.Th>
                <DataTable.Th>Phone</DataTable.Th>
                <DataTable.Th>Bookings</DataTable.Th>
                <DataTable.Th>Total spent</DataTable.Th>
                <DataTable.Th>Joined</DataTable.Th>
                <DataTable.Th />
              </DataTable.Row>
            </DataTable.Head>
            <DataTable.Body>
              {passengers.data?.items.map((passenger) => (
                <DataTable.Row key={passenger.id}>
                  <DataTable.Td>
                    <Text fw={fontWeights.extraBold}>{passenger.fullName}</Text>
                  </DataTable.Td>
                  <DataTable.Td>{passenger.email}</DataTable.Td>
                  <DataTable.Td>{passenger.phone ?? '—'}</DataTable.Td>
                  <DataTable.Td>{passenger.bookingCount}</DataTable.Td>
                  <DataTable.Td>{formatMoney(passenger.totalSpentCents)}</DataTable.Td>
                  <DataTable.Td>{formatDateTime(passenger.createdAt)}</DataTable.Td>
                  <DataTable.Td>
                    <Button size={componentSizeKeys.xs} variant="light" onClick={() => navigate(`/passengers/${passenger.id}`)}>
                      Open
                    </Button>
                  </DataTable.Td>
                </DataTable.Row>
              ))}
            </DataTable.Body>
          </DataTable>
          <Pagination mt={spacingKeys.md} value={page} total={totalPages} onChange={setPage} />
        </>
      )}
    </>
  );
}
