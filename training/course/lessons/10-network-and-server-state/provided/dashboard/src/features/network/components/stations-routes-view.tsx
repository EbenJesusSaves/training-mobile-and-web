import { Badge, Button, Checkbox, Group, Modal, NumberInput, Select, Skeleton, Switch, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';

import { parseApiError } from '../../../shared/api/errors';
import {
  componentSizeKeys,
  componentSizes,
  fieldLimits,
  fontWeights,
  iconSizes,
  spacingKeys,
  textSizes,
  themeColorNames,
} from '../../../shared/constants';
import { centsFromGhs, formatMoney, ghsFromCents } from '../../../shared/lib/format';
import { DataTable } from '../../../shared/ui/data-table';
import { EmptyState } from '../../../shared/ui/empty-state';
import { ErrorState } from '../../../shared/ui/error-state';
import { PageHeader } from '../../../shared/ui/page-header';
import { useRouteMutations, useRoutes, useStationMutations, useStations } from '../api/network-queries';
import type { RouteDto, StationDto } from '../types';

import styles from './stations-routes-view.module.css';

export function StationsRoutesView() {
  const stations = useStations();
  const routes = useRoutes();
  const stationMutations = useStationMutations();
  const routeMutations = useRouteMutations();
  const [stationModal, stationControls] = useDisclosure(false);
  const [routeModal, routeControls] = useDisclosure(false);
  const [editingStation, setEditingStation] = useState<StationDto | null>(null);
  const [editingRoute, setEditingRoute] = useState<RouteDto | null>(null);

  const openStation = (station?: StationDto) => {
    setEditingStation(station ?? null);
    stationControls.open();
  };
  const openRoute = (route?: RouteDto) => {
    setEditingRoute(route ?? null);
    routeControls.open();
  };

  return (
    <>
      <PageHeader title="Stations & routes" description="Maintain the rail network used by booking and scheduling flows." />
      <div className={styles.grid}>
        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <Text fw={fontWeights.extraBold} size={componentSizeKeys.lg}>
              Stations
            </Text>
            <Button leftSection={<IconPlus size={iconSizes.md} />} onClick={() => openStation()}>
              New station
            </Button>
          </div>
          {stations.isLoading ? (
            <Skeleton height={componentSizes.skeletonNetworkHeight} />
          ) : stations.isError ? (
            <ErrorState error={stations.error} onRetry={() => stations.refetch()} />
          ) : stations.data?.length === 0 ? (
            <EmptyState title="No stations" description="Create the first station to build routes." />
          ) : (
            <DataTable>
              <DataTable.Head>
                <DataTable.Row>
                  <DataTable.Th>Code</DataTable.Th>
                  <DataTable.Th>Name</DataTable.Th>
                  <DataTable.Th>City</DataTable.Th>
                  <DataTable.Th>Routes</DataTable.Th>
                  <DataTable.Th>Status</DataTable.Th>
                  <DataTable.Th>Actions</DataTable.Th>
                </DataTable.Row>
              </DataTable.Head>
              <DataTable.Body>
                {stations.data?.map((station) => (
                  <DataTable.Row key={station.id}>
                    <DataTable.Td>
                      <Text fw={fontWeights.extraBold}>{station.code}</Text>
                    </DataTable.Td>
                    <DataTable.Td>{station.name}</DataTable.Td>
                    <DataTable.Td>{station.city}</DataTable.Td>
                    <DataTable.Td>{station.routeCount ?? 0}</DataTable.Td>
                    <DataTable.Td>
                      <Badge color={station.isActive ? themeColorNames.rail : themeColorNames.gray}>
                        {station.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </DataTable.Td>
                    <DataTable.Td>
                      <Group gap={spacingKeys.xs}>
                        <Button size={componentSizeKeys.xs} variant="light" onClick={() => openStation(station)}>
                          Edit
                        </Button>
                        <Switch
                          aria-label={`Toggle ${station.name}`}
                          checked={station.isActive}
                          onChange={(event) =>
                            stationMutations.update.mutate({ id: station.id, payload: { isActive: event.currentTarget.checked } })
                          }
                        />
                      </Group>
                    </DataTable.Td>
                  </DataTable.Row>
                ))}
              </DataTable.Body>
            </DataTable>
          )}
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <Text fw={fontWeights.extraBold} size={componentSizeKeys.lg}>
              Routes
            </Text>
            <Button leftSection={<IconPlus size={iconSizes.md} />} onClick={() => openRoute()}>
              New route
            </Button>
          </div>
          {routes.isLoading ? (
            <Skeleton height={componentSizes.skeletonRoutesHeight} />
          ) : routes.isError ? (
            <ErrorState error={routes.error} onRetry={() => routes.refetch()} />
          ) : (
            <DataTable minWidth={920}>
              <DataTable.Head>
                <DataTable.Row>
                  <DataTable.Th>Route</DataTable.Th>
                  <DataTable.Th>Distance</DataTable.Th>
                  <DataTable.Th>Default fares</DataTable.Th>
                  <DataTable.Th>Upcoming</DataTable.Th>
                  <DataTable.Th>Status</DataTable.Th>
                  <DataTable.Th>Actions</DataTable.Th>
                </DataTable.Row>
              </DataTable.Head>
              <DataTable.Body>
                {routes.data?.map((route) => (
                  <DataTable.Row key={route.id}>
                    <DataTable.Td>
                      <Text fw={fontWeights.extraBold}>
                        {route.origin.city} → {route.destination.city}
                      </Text>
                      <Text size={textSizes.xs} c={themeColorNames.dimmed}>
                        {route.origin.code} · {route.destination.code}
                      </Text>
                    </DataTable.Td>
                    <DataTable.Td>{route.distanceKm} km</DataTable.Td>
                    <DataTable.Td>
                      First {formatMoney(route.defaultFirstClassFareCents)}
                      <br />
                      Second {formatMoney(route.defaultSecondClassFareCents)}
                    </DataTable.Td>
                    <DataTable.Td>{route.upcomingJourneys}</DataTable.Td>
                    <DataTable.Td>
                      <Badge color={route.isActive ? themeColorNames.rail : themeColorNames.gray}>
                        {route.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </DataTable.Td>
                    <DataTable.Td>
                      <Group gap={spacingKeys.xs}>
                        <Button size={componentSizeKeys.xs} variant="light" onClick={() => openRoute(route)}>
                          Edit
                        </Button>
                        <Switch
                          aria-label={`Toggle route ${route.origin.code} to ${route.destination.code}`}
                          checked={route.isActive}
                          onChange={(event) =>
                            routeMutations.update.mutate({ id: route.id, payload: { isActive: event.currentTarget.checked } })
                          }
                        />
                      </Group>
                    </DataTable.Td>
                  </DataTable.Row>
                ))}
              </DataTable.Body>
            </DataTable>
          )}
        </section>
      </div>

      <Modal opened={stationModal} onClose={stationControls.close} title={editingStation ? 'Edit station' : 'Create station'}>
        <StationForm
          station={editingStation}
          loading={stationMutations.create.isPending || stationMutations.update.isPending}
          onSubmit={async (payload) => {
            if (editingStation) await stationMutations.update.mutateAsync({ id: editingStation.id, payload });
            else await stationMutations.create.mutateAsync(payload);
            stationControls.close();
          }}
        />
      </Modal>
      <Modal
        opened={routeModal}
        onClose={routeControls.close}
        title={editingRoute ? 'Edit route' : 'Create route'}
        size={componentSizeKeys.lg}
      >
        <RouteForm
          route={editingRoute}
          stations={stations.data ?? []}
          loading={routeMutations.create.isPending || routeMutations.update.isPending}
          onSubmit={async (payload) => {
            if (editingRoute) await routeMutations.update.mutateAsync({ id: editingRoute.id, payload });
            else await routeMutations.create.mutateAsync(payload as any);
            routeControls.close();
          }}
        />
      </Modal>
    </>
  );
}

function StationForm({
  station,
  onSubmit,
  loading,
}: {
  station: StationDto | null;
  onSubmit: (payload: { code: string; name: string; city: string; address?: string; isActive?: boolean }) => Promise<void>;
  loading: boolean;
}) {
  const form = useForm({
    initialValues: {
      code: station?.code ?? '',
      name: station?.name ?? '',
      city: station?.city ?? '',
      address: station?.address ?? '',
      isActive: station?.isActive ?? true,
    },
  });
  return (
    <form
      onSubmit={form.onSubmit(async (values) => {
        try {
          await onSubmit(values);
        } catch (error) {
          form.setErrors(parseApiError(error).fieldErrors);
        }
      })}
    >
      <div className={styles.formGrid}>
        <TextInput label="Code" maxLength={fieldLimits.stationCodeLength} {...form.getInputProps('code')} />
        <TextInput label="Name" {...form.getInputProps('name')} />
        <TextInput label="City" {...form.getInputProps('city')} />
        <TextInput label="Address" {...form.getInputProps('address')} />
        <Switch label="Active" {...form.getInputProps('isActive', { type: 'checkbox' })} />
      </div>
      <Group justify="flex-end" mt={spacingKeys.md}>
        <Button type="submit" loading={loading}>
          Save station
        </Button>
      </Group>
    </form>
  );
}

function RouteForm({
  route,
  stations,
  onSubmit,
  loading,
}: {
  route: RouteDto | null;
  stations: StationDto[];
  onSubmit: (payload: any) => Promise<void>;
  loading: boolean;
}) {
  const form = useForm({
    initialValues: {
      originId: route?.origin.id ?? '',
      destinationId: route?.destination.id ?? '',
      distanceKm: route?.distanceKm ?? 1,
      defaultFirstClassFare: route ? ghsFromCents(route.defaultFirstClassFareCents) : '80.00',
      defaultSecondClassFare: route ? ghsFromCents(route.defaultSecondClassFareCents) : '45.00',
      isActive: route?.isActive ?? true,
      createReturnRoute: true,
    },
  });
  const stationOptions = stations.map((station) => ({ value: station.id, label: `${station.code} · ${station.name}` }));
  return (
    <form
      onSubmit={form.onSubmit(async (values) => {
        await onSubmit({
          originId: values.originId,
          destinationId: values.destinationId,
          distanceKm: Number(values.distanceKm),
          defaultFirstClassFareCents: centsFromGhs(values.defaultFirstClassFare),
          defaultSecondClassFareCents: centsFromGhs(values.defaultSecondClassFare),
          isActive: values.isActive,
          createReturnRoute: values.createReturnRoute,
        });
      })}
    >
      <div className={styles.formGrid}>
        {!route ? (
          <>
            <Select label="Origin" searchable data={stationOptions} {...form.getInputProps('originId')} />
            <Select label="Destination" searchable data={stationOptions} {...form.getInputProps('destinationId')} />
          </>
        ) : null}
        <NumberInput
          label="Distance km"
          min={fieldLimits.routeDistanceMin}
          max={fieldLimits.routeDistanceMax}
          {...form.getInputProps('distanceKm')}
        />
        <TextInput label="First class fare GH₵" {...form.getInputProps('defaultFirstClassFare')} />
        <TextInput label="Second class fare GH₵" {...form.getInputProps('defaultSecondClassFare')} />
        <Switch label="Active" {...form.getInputProps('isActive', { type: 'checkbox' })} />
        {!route ? <Checkbox label="Create return route" {...form.getInputProps('createReturnRoute', { type: 'checkbox' })} /> : null}
      </div>
      <Group justify="flex-end" mt={spacingKeys.md}>
        <Button type="submit" loading={loading}>
          Save route
        </Button>
      </Group>
    </form>
  );
}
