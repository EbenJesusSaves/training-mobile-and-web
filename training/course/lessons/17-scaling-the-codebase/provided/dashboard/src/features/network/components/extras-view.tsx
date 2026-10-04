import { Button, Group, Modal, Skeleton, Switch, Text, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';

import { parseApiError } from '../../../shared/api/errors';
import { componentSizes, fontWeights, spacingKeys, textSizes } from '../../../shared/constants';
import { centsFromGhs, formatMoney, ghsFromCents } from '../../../shared/lib/format';
import { DataTable } from '../../../shared/ui/data-table';
import { ErrorState } from '../../../shared/ui/error-state';
import { PageHeader } from '../../../shared/ui/page-header';
import { useAddOnMutation, useRoutes } from '../api/network-queries';
import type { AddOnDto } from '../types';

export function ExtrasView() {
  const routes = useRoutes();
  const updateAddOn = useAddOnMutation();
  const [opened, modal] = useDisclosure(false);
  const [editing] = useState<AddOnDto | null>(null);

  return (
    <>
      <PageHeader
        title="Extras & fares"
        description="Edit add-on prices and review route default fares used when new journeys are scheduled."
      />
      {/* LIVE 17.6 — Use useAddOns(), setEditing and openEdit to render the editable add-ons table here. */}

      <Text fw={fontWeights.black} size={textSizes.lg} mt={spacingKeys.xl} mb={spacingKeys.md}>
        Route default fares
      </Text>
      {routes.isLoading ? (
        <Skeleton height={componentSizes.skeletonSmallTableHeight} />
      ) : routes.isError ? (
        <ErrorState error={routes.error} onRetry={() => routes.refetch()} />
      ) : (
        <DataTable>
          <DataTable.Head>
            <DataTable.Row>
              <DataTable.Th>Route</DataTable.Th>
              <DataTable.Th>First class</DataTable.Th>
              <DataTable.Th>Second class</DataTable.Th>
              <DataTable.Th>Upcoming journeys</DataTable.Th>
            </DataTable.Row>
          </DataTable.Head>
          <DataTable.Body>
            {routes.data?.map((route) => (
              <DataTable.Row key={route.id}>
                <DataTable.Td>
                  <Text fw={fontWeights.extraBold}>
                    {route.origin.city} → {route.destination.city}
                  </Text>
                </DataTable.Td>
                <DataTable.Td>{formatMoney(route.defaultFirstClassFareCents)}</DataTable.Td>
                <DataTable.Td>{formatMoney(route.defaultSecondClassFareCents)}</DataTable.Td>
                <DataTable.Td>{route.upcomingJourneys}</DataTable.Td>
              </DataTable.Row>
            ))}
          </DataTable.Body>
        </DataTable>
      )}

      <Modal opened={opened} onClose={modal.close} title="Edit add-on">
        {editing ? (
          <AddOnForm
            addOn={editing}
            loading={updateAddOn.isPending}
            onSubmit={async (payload) => {
              await updateAddOn.mutateAsync({ id: editing.id, payload });
              modal.close();
            }}
          />
        ) : null}
      </Modal>
    </>
  );
}

function AddOnForm({
  addOn,
  loading,
  onSubmit,
}: {
  addOn: AddOnDto;
  loading: boolean;
  onSubmit: (payload: Partial<AddOnDto>) => Promise<void>;
}) {
  const form = useForm({
    initialValues: { name: addOn.name, description: addOn.description, price: ghsFromCents(addOn.priceCents), isActive: addOn.isActive },
  });
  return (
    <form
      onSubmit={form.onSubmit(async (values) => {
        try {
          await onSubmit({
            name: values.name,
            description: values.description,
            priceCents: centsFromGhs(values.price),
            isActive: values.isActive,
          });
        } catch (error) {
          form.setErrors(parseApiError(error).fieldErrors);
        }
      })}
    >
      <TextInput label="Name" {...form.getInputProps('name')} />
      <Textarea mt={spacingKeys.sm} label="Description" {...form.getInputProps('description')} />
      <TextInput mt={spacingKeys.sm} label="Price GH₵" {...form.getInputProps('price')} />
      <Switch mt={spacingKeys.sm} label="Active" {...form.getInputProps('isActive', { type: 'checkbox' })} />
      <Group justify="flex-end" mt={spacingKeys.md}>
        <Button type="submit" loading={loading}>
          Save add-on
        </Button>
      </Group>
    </form>
  );
}
