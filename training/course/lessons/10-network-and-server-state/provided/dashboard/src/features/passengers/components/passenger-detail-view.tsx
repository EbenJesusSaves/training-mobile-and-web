import { Button, Group, Skeleton, Text } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { Link } from 'react-router';

import { componentSizeKeys, componentSizes, fontWeights, iconSizes, spacingKeys } from '../../../shared/constants';
import { formatDateTime, formatMoney } from '../../../shared/lib/format';
import { DataTable } from '../../../shared/ui/data-table';
import { ErrorState } from '../../../shared/ui/error-state';
import { PageHeader } from '../../../shared/ui/page-header';
import { BookingStatusBadge } from '../../bookings/components/booking-status-badge';
import { usePassenger } from '../api/passenger-queries';

export function PassengerDetailView({ passengerId }: { passengerId: string }) {
  const passenger = usePassenger(passengerId);
  if (passenger.isLoading) return <Skeleton height={componentSizes.skeletonTableHeight} />;
  if (passenger.isError) return <ErrorState error={passenger.error} onRetry={() => passenger.refetch()} />;
  const data = passenger.data;
  if (!data) return null;
  return (
    <>
      <Button component={Link} to="/passengers" variant="subtle" leftSection={<IconArrowLeft size={iconSizes.md} />} mb={spacingKeys.md}>
        Back to passengers
      </Button>
      <PageHeader title={data.fullName} description={`${data.email}${data.phone ? ` · ${data.phone}` : ''}`} />
      <DataTable minWidth={920}>
        <DataTable.Head>
          <DataTable.Row>
            <DataTable.Th>Reference</DataTable.Th>
            <DataTable.Th>Route</DataTable.Th>
            <DataTable.Th>Departure</DataTable.Th>
            <DataTable.Th>Status</DataTable.Th>
            <DataTable.Th>Total</DataTable.Th>
            <DataTable.Th />
          </DataTable.Row>
        </DataTable.Head>
        <DataTable.Body>
          {data.bookings.map((booking) => (
            <DataTable.Row key={booking.id}>
              <DataTable.Td>
                <Text fw={fontWeights.extraBold}>{booking.reference}</Text>
              </DataTable.Td>
              <DataTable.Td>
                {booking.segments[0]?.journey.origin.city} → {booking.segments.at(-1)?.journey.destination.city}
              </DataTable.Td>
              <DataTable.Td>{formatDateTime(booking.firstDepartureAt)}</DataTable.Td>
              <DataTable.Td>
                <BookingStatusBadge status={booking.status} />
              </DataTable.Td>
              <DataTable.Td>{formatMoney(booking.totalCents)}</DataTable.Td>
              <DataTable.Td>
                <Group>
                  <Button component={Link} to={`/bookings?booking=${booking.id}`} size={componentSizeKeys.xs} variant="light">
                    Open booking
                  </Button>
                </Group>
              </DataTable.Td>
            </DataTable.Row>
          ))}
        </DataTable.Body>
      </DataTable>
    </>
  );
}
