import { ActionIcon, Button, Checkbox, Fieldset, Group, NativeSelect, NumberInput, Select, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { useMemo } from 'react';

import { parseApiError } from '../../../shared/api/errors';
import { fieldLimits, fontWeights, iconSizes, railDomain, spacingKeys, themeColorNames } from '../../../shared/constants';
import { centsFromGhs, datetimeLocalToIso, formatMoney, ghsFromCents } from '../../../shared/lib/format';
import type { RouteDto } from '../../network/types';
import type { CreateJourneyPayload, JourneyCarDto, TravelClass } from '../types';

import styles from './journey-form.module.css';

interface JourneyFormValues {
  routeId: string;
  serviceCode: string;
  trainNumber: string;
  trainName: string;
  departureAt: string;
  arrivalAt: string;
  firstClassFare: string;
  secondClassFare: string;
  repeatDays: number;
  cars: JourneyCarDto[];
}

interface JourneyFormProps {
  routes: RouteDto[];
  onSubmit: (payload: CreateJourneyPayload) => Promise<unknown> | void;
  onCancel?: () => void;
  loading?: boolean;
}

const serviceCodes = [
  { value: 'IC', label: 'IC · InterCity' },
  { value: 'IC+', label: 'IC+ · Premium InterCity' },
  { value: 'R', label: 'R · Regional' },
];

export function JourneyForm({ routes, onSubmit, onCancel, loading }: JourneyFormProps) {
  const firstRoute = routes[0];
  const form = useForm<JourneyFormValues>({
    initialValues: {
      routeId: firstRoute?.id ?? '',
      serviceCode: 'IC',
      trainNumber: 'IC 7777',
      trainName: 'Training Express',
      departureAt: '',
      arrivalAt: '',
      firstClassFare: firstRoute ? ghsFromCents(firstRoute.defaultFirstClassFareCents) : '',
      secondClassFare: firstRoute ? ghsFromCents(firstRoute.defaultSecondClassFareCents) : '',
      repeatDays: 1,
      cars: [
        { carNumber: 1, travelClass: 'FIRST', compartments: 4, airConditioned: true },
        { carNumber: 2, travelClass: 'SECOND', compartments: railDomain.seatsPerCompartment, airConditioned: true },
      ],
    },
    // LIVE 11.5 — Add Mantine form validation before sending a schedule request.
  });

  const routeOptions = routes.map((route) => ({
    value: route.id,
    label: `${route.origin.city} (${route.origin.code}) → ${route.destination.city} (${route.destination.code})`,
  }));
  const selectedRoute = routes.find((route) => route.id === form.values.routeId);
  const totalSeats = useMemo(
    () => form.values.cars.reduce((sum, car) => sum + car.compartments * railDomain.seatsPerCompartment, 0),
    [form.values.cars],
  );

  const syncRouteFares = (routeId: string | null) => {
    const route = routes.find((item) => item.id === routeId);
    form.setFieldValue('routeId', routeId ?? '');
    if (route) {
      form.setFieldValue('firstClassFare', ghsFromCents(route.defaultFirstClassFareCents));
      form.setFieldValue('secondClassFare', ghsFromCents(route.defaultSecondClassFareCents));
    }
  };

  const handleSubmit = form.onSubmit(async (values) => {
    try {
      await onSubmit({
        routeId: values.routeId,
        serviceCode: values.serviceCode,
        trainNumber: values.trainNumber.trim(),
        trainName: values.trainName.trim(),
        departureAt: datetimeLocalToIso(values.departureAt),
        arrivalAt: datetimeLocalToIso(values.arrivalAt),
        firstClassFareCents: centsFromGhs(values.firstClassFare),
        secondClassFareCents: centsFromGhs(values.secondClassFare),
        repeatDays: values.repeatDays,
        cars: values.cars.map((car) => ({
          carNumber: Number(car.carNumber),
          travelClass: car.travelClass,
          compartments: Number(car.compartments),
          airConditioned: Boolean(car.airConditioned),
        })),
      });
    } catch (error) {
      const parsed = parseApiError(error);
      form.setErrors(parsed.fieldErrors);
    }
  });

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Select
        label="Route"
        data={routeOptions}
        searchable
        value={form.values.routeId}
        onChange={syncRouteFares}
        error={form.errors.routeId}
      />
      {selectedRoute ? (
        <div className={styles.summary}>
          Default fares: First {formatMoney(selectedRoute.defaultFirstClassFareCents)} · Second{' '}
          {formatMoney(selectedRoute.defaultSecondClassFareCents)}
        </div>
      ) : null}
      <div className={styles.grid2}>
        <Select label="Service code" data={serviceCodes} {...form.getInputProps('serviceCode')} />
        <TextInput label="Train number" {...form.getInputProps('trainNumber')} />
        <TextInput label="Train name" {...form.getInputProps('trainName')} />
        <NumberInput
          label="Repeat for N days"
          min={fieldLimits.repeatDaysMin}
          max={fieldLimits.repeatDaysMax}
          {...form.getInputProps('repeatDays')}
        />
      </div>
      <div className={styles.grid2}>
        <TextInput label="Departure time (GMT)" type="datetime-local" {...form.getInputProps('departureAt')} />
        <TextInput label="Arrival time (GMT)" type="datetime-local" {...form.getInputProps('arrivalAt')} />
        <TextInput label="First class fare (GH₵)" inputMode="decimal" {...form.getInputProps('firstClassFare')} />
        <TextInput label="Second class fare (GH₵)" inputMode="decimal" {...form.getInputProps('secondClassFare')} />
      </div>
      <Fieldset legend="Car composition">
        <div className={styles.carList}>
          {form.values.cars.map((car, index) => (
            <div className={styles.carRow} key={`${car.carNumber}-${index}`}>
              <NumberInput
                label="Car"
                min={fieldLimits.carNumberMin}
                max={fieldLimits.carNumberMax}
                {...form.getInputProps(`cars.${index}.carNumber`)}
              />
              <NativeSelect
                label="Class"
                data={[
                  { value: 'FIRST', label: 'First' },
                  { value: 'SECOND', label: 'Second' },
                ]}
                value={car.travelClass}
                onChange={(event) => form.setFieldValue(`cars.${index}.travelClass`, event.currentTarget.value as TravelClass)}
              />
              <NumberInput
                label="Compartments"
                min={fieldLimits.compartmentMin}
                max={fieldLimits.compartmentMax}
                {...form.getInputProps(`cars.${index}.compartments`)}
              />
              <Checkbox
                label="A/C"
                checked={car.airConditioned}
                onChange={(event) => form.setFieldValue(`cars.${index}.airConditioned`, event.currentTarget.checked)}
              />
              <ActionIcon
                aria-label="Remove car"
                variant="subtle"
                color={themeColorNames.danger}
                onClick={() => form.removeListItem('cars', index)}
                disabled={form.values.cars.length === 1}
              >
                <IconTrash size={iconSizes.md} />
              </ActionIcon>
            </div>
          ))}
        </div>
        <Group mt={spacingKeys.md} justify="space-between">
          <Button
            type="button"
            variant="light"
            leftSection={<IconPlus size={iconSizes.md} />}
            onClick={() =>
              form.insertListItem('cars', {
                carNumber: form.values.cars.length + 1,
                travelClass: 'SECOND',
                compartments: railDomain.seatsPerCompartment,
                airConditioned: true,
              })
            }
          >
            Add car
          </Button>
          <Text fw={fontWeights.extraBold}>{totalSeats} computed seats</Text>
        </Group>
      </Fieldset>
      <Group justify="flex-end">
        {onCancel ? (
          <Button type="button" variant="default" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
        <Button type="submit" loading={loading}>
          Create journey
        </Button>
      </Group>
    </form>
  );
}
