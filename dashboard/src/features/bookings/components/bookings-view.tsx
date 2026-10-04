import { Button, Pagination, Select, Skeleton, Text, TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
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
import { formatDateTime, formatMoney } from '../../../shared/lib/format';
import { DataTable } from '../../../shared/ui/data-table';
import { EmptyState } from '../../../shared/ui/empty-state';
import { ErrorState } from '../../../shared/ui/error-state';
import { PageHeader } from '../../../shared/ui/page-header';
import { setSavedBookingSearch } from '../../preferences/preferences-slice';
import { useBookings } from '../api/booking-queries';
import type { BookingStatus } from '../types';
import { BookingDetailDrawer } from './booking-detail-drawer';
import { BookingStatusBadge } from './booking-status-badge';

import styles from './bookings-view.module.css';

export function BookingsView() {
  const dispatch = useAppDispatch();
  const savedSearch = useAppSelector((state) => state.preferences.savedBookingSearch);
  const [params, setParams] = useSearchParams();
  const [bookingId, setBookingId] = useState<string | null>(params.get('booking'));
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(savedSearch);
  const [status, setStatus] = useState('');
  const debouncedSearch = useDebouncedValue(search);
  const bookings = useBookings({
    page,
    pageSize: pageSizes.default,
    search: debouncedSearch,
    status: (status || undefined) as BookingStatus | undefined,
  });
  const totalPages = Math.max(1, Math.ceil((bookings.data?.total ?? 0) / pageSizes.default));

  useEffect(() => {
    dispatch(setSavedBookingSearch(debouncedSearch));
  }, [debouncedSearch, dispatch]);

  const openBooking = (id: string) => {
    setBookingId(id);
    setParams({ booking: id });
  };
  const closeBooking = () => {
    setBookingId(null);
    setParams({});
  };

  return (
    <>
      <PageHeader
        title="Bookings"
        description="Search references, ticket codes, passengers, and contacts. Status changes update journey occupancy after invalidation."
      />
      <section className={styles.filters} aria-label="Booking filters">
        <TextInput
          label="Search"
          placeholder="Ama, reference, ticket code"
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
            { value: 'CONFIRMED', label: 'Confirmed' },
            { value: 'CHECKED_IN', label: 'Checked in' },
            { value: 'CANCELLED', label: 'Cancelled' },
          ]}
        />
      </section>
      {bookings.isLoading ? (
        <Skeleton height={componentSizes.skeletonTableHeight} radius={radiusKeys.xl} />
      ) : bookings.isError ? (
        <ErrorState error={bookings.error} onRetry={() => bookings.refetch()} />
      ) : bookings.data?.items.length === 0 ? (
        <EmptyState title="No bookings found" description="Try another reference, passenger name, or status." />
      ) : (
        <>
          <DataTable minWidth={960}>
            <DataTable.Head>
              <DataTable.Row>
                <DataTable.Th>Reference</DataTable.Th>
                <DataTable.Th>Customer</DataTable.Th>
                <DataTable.Th>Trip</DataTable.Th>
                <DataTable.Th>Departure</DataTable.Th>
                <DataTable.Th>Status</DataTable.Th>
                <DataTable.Th>Total</DataTable.Th>
                <DataTable.Th>Actions</DataTable.Th>
              </DataTable.Row>
            </DataTable.Head>
            <DataTable.Body>
              {bookings.data?.items.map((booking) => (
                <DataTable.Row key={booking.id} data-clickable="true" onClick={() => openBooking(booking.id)}>
                  <DataTable.Td className={styles.referenceCell}>
                    <Text fw={fontWeights.extraBold}>{booking.reference}</Text>
                    <Text size={textSizes.xs} c={themeColorNames.dimmed}>
                      {booking.tripType.replace('_', ' ')}
                    </Text>
                  </DataTable.Td>
                  <DataTable.Td>
                    {booking.customer.fullName}
                    <Text size={textSizes.xs} c={themeColorNames.dimmed}>
                      {booking.contactEmail}
                    </Text>
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
                    <Button size={componentSizeKeys.xs} variant="light" onClick={() => openBooking(booking.id)}>
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
      <BookingDetailDrawer bookingId={bookingId} onClose={closeBooking} />
    </>
  );
}
