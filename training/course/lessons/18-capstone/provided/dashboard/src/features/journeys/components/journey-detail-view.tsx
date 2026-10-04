import { ActionIcon, Alert, Button, Group, NativeSelect, NumberInput, Skeleton, Tabs, Text, TextInput } from '@mantine/core';
import { IconAlertTriangle, IconArrowLeft, IconPlus, IconTrash } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';

import { parseApiError } from '../../../shared/api/errors';
import {
  componentSizes,
  fieldLimits,
  fontWeights,
  iconSizes,
  radiusKeys,
  railDomain,
  spacingKeys,
  textSizes,
  themeColorNames,
} from '../../../shared/constants';
import {
  centsFromGhs,
  datetimeLocalToIso,
  formatDateTime,
  formatDuration,
  formatMoney,
  formatPercent,
  ghsFromCents,
  isoToDatetimeLocal,
} from '../../../shared/lib/format';
import { DataTable } from '../../../shared/ui/data-table';
import { ErrorState } from '../../../shared/ui/error-state';
import { BookingStatusBadge } from '../../bookings/components/booking-status-badge';
import { useJourney, useUpdateJourney } from '../api/journey-queries';
import type { JourneyCarDto, TravelClass } from '../types';
import { JourneyStatusBadge } from './journey-status-badge';
import { SeatOccupancyMap } from './seat-occupancy-map';
import { TrainLabel } from './train-label';

import styles from './journey-detail-view.module.css';

export function JourneyDetailView({ journeyId }: { journeyId: string }) {
  const journey = useJourney(journeyId);
  const updateJourney = useUpdateJourney(journeyId);
  const [firstFare, setFirstFare] = useState('');
  const [secondFare, setSecondFare] = useState('');
  const [departureAt, setDepartureAt] = useState('');
  const [arrivalAt, setArrivalAt] = useState('');
  const [cars, setCars] = useState<JourneyCarDto[]>([]);
  const [capacityError, setCapacityError] = useState<string | null>(null);

  const data = journey.data;

  useEffect(() => {
    if (!data) return;
    setFirstFare(ghsFromCents(data.classes.find((item) => item.travelClass === 'FIRST')?.fareCents));
    setSecondFare(ghsFromCents(data.classes.find((item) => item.travelClass === 'SECOND')?.fareCents));
    setDepartureAt(isoToDatetimeLocal(data.departureAt));
    setArrivalAt(isoToDatetimeLocal(data.arrivalAt));
    setCars(
      data.cars.map((car) => ({
        carNumber: car.carNumber,
        travelClass: car.travelClass,
        compartments: car.compartments,
        airConditioned: car.airConditioned,
      })),
    );
  }, [data]);

  if (journey.isLoading) return <Skeleton height={componentSizes.skeletonDetailHeight} radius={radiusKeys.xl} />;
  if (journey.isError) return <ErrorState error={journey.error} onRetry={() => journey.refetch()} />;
  if (!data) return null;

  // LIVE 18.6 — Add saveStatus to persist SCHEDULED, DELAYED, or CANCELLED with delay minutes.

  const saveFaresAndTimes = async () => {
    await updateJourney.mutateAsync({
      firstClassFareCents: centsFromGhs(firstFare),
      secondClassFareCents: centsFromGhs(secondFare),
      departureAt: datetimeLocalToIso(departureAt),
      arrivalAt: datetimeLocalToIso(arrivalAt),
    });
  };

  const saveCapacity = async () => {
    setCapacityError(null);
    try {
      await updateJourney.mutateAsync({
        cars: cars.map((car) => ({
          carNumber: Number(car.carNumber),
          travelClass: car.travelClass,
          compartments: Number(car.compartments),
          airConditioned: Boolean(car.airConditioned),
        })),
      });
    } catch (error) {
      const parsed = parseApiError(error);
      if (parsed.code === 'CAPACITY_CONFLICT') setCapacityError(parsed.message);
      else throw error;
    }
  };

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
        <div className={styles.meta}>
          <span>Seats free</span>
          <strong>
            {data.availableSeats}/{data.totalSeats}
          </strong>
        </div>
      </section>

      <div className={styles.grid}>
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

        <aside className={styles.stack}>
          <section className={styles.panel}>
            <Text fw={fontWeights.extraBold} mb={spacingKeys.md}>
              Status controls
            </Text>
            {/* LIVE 18.7 — Render the Status Select, delayed-minutes NumberInput, and Save status Button here. */}
          </section>

          <section className={styles.panel}>
            <Text fw={fontWeights.extraBold} mb={spacingKeys.md}>
              Times and fares
            </Text>
            <div className={styles.formGrid}>
              <TextInput
                label="Departure (GMT)"
                type="datetime-local"
                value={departureAt}
                onChange={(event) => setDepartureAt(event.currentTarget.value)}
              />
              <TextInput
                label="Arrival (GMT)"
                type="datetime-local"
                value={arrivalAt}
                onChange={(event) => setArrivalAt(event.currentTarget.value)}
              />
              <TextInput label="First class GH₵" value={firstFare} onChange={(event) => setFirstFare(event.currentTarget.value)} />
              <TextInput label="Second class GH₵" value={secondFare} onChange={(event) => setSecondFare(event.currentTarget.value)} />
            </div>
            <Group justify="space-between" mt={spacingKeys.md}>
              <Text size={textSizes.sm} c={themeColorNames.dimmed}>
                Current fares: {formatMoney(centsFromGhs(firstFare))} / {formatMoney(centsFromGhs(secondFare))}
              </Text>
              <Button onClick={saveFaresAndTimes} loading={updateJourney.isPending}>
                Save
              </Button>
            </Group>
          </section>

          <section className={styles.panel}>
            <Text fw={fontWeights.extraBold} mb={spacingKeys.md}>
              Capacity editor
            </Text>
            {capacityError ? (
              <Alert mb={spacingKeys.sm} color={themeColorNames.danger} icon={<IconAlertTriangle size={iconSizes.md} />}>
                {capacityError}
              </Alert>
            ) : null}
            <div className={styles.carEdit}>
              {cars.map((car, index) => (
                <div className={styles.carEditRow} key={`${car.carNumber}-${index}`}>
                  <NumberInput
                    label="Car"
                    min={fieldLimits.carNumberMin}
                    max={fieldLimits.carNumberMax}
                    value={car.carNumber}
                    onChange={(value) =>
                      setCars((items) =>
                        items.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, carNumber: Number(value) || fieldLimits.carNumberMin } : item,
                        ),
                      )
                    }
                  />
                  <NativeSelect
                    label="Class"
                    data={[
                      { value: 'FIRST', label: 'First' },
                      { value: 'SECOND', label: 'Second' },
                    ]}
                    value={car.travelClass}
                    onChange={(event) =>
                      setCars((items) =>
                        items.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, travelClass: event.currentTarget.value as TravelClass } : item,
                        ),
                      )
                    }
                  />
                  <NumberInput
                    label="Compartments"
                    min={fieldLimits.compartmentMin}
                    max={fieldLimits.compartmentMax}
                    value={car.compartments}
                    onChange={(value) =>
                      setCars((items) =>
                        items.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, compartments: Number(value) || fieldLimits.compartmentMin } : item,
                        ),
                      )
                    }
                  />
                  <ActionIcon
                    aria-label="Remove car"
                    color={themeColorNames.danger}
                    variant="subtle"
                    disabled={cars.length === 1}
                    onClick={() => setCars((items) => items.filter((_, itemIndex) => itemIndex !== index))}
                  >
                    <IconTrash size={iconSizes.md} />
                  </ActionIcon>
                </div>
              ))}
            </div>
            <Group mt={spacingKeys.md} justify="space-between">
              <Button
                variant="light"
                leftSection={<IconPlus size={iconSizes.md} />}
                onClick={() =>
                  setCars((items) => [
                    ...items,
                    {
                      carNumber: items.length + 1,
                      travelClass: 'SECOND',
                      compartments: railDomain.seatsPerCompartment,
                      airConditioned: true,
                    },
                  ])
                }
              >
                Add car
              </Button>
              <Button onClick={saveCapacity} loading={updateJourney.isPending}>
                Save capacity
              </Button>
            </Group>
          </section>
        </aside>
      </div>
    </>
  );
}
