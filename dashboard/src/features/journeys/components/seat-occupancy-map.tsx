import { Badge, Popover, Text } from '@mantine/core';
import { useState } from 'react';

import { fontWeights, textSizes, themeColorNames } from '../../../shared/constants';
import type { JourneyDetailDto, JourneyManifestItem } from '../types';
import { getCompartmentSeatOrder } from '../utils';

import styles from './seat-occupancy-map.module.css';

interface SeatOccupancyMapProps {
  journey: JourneyDetailDto;
}

export function SeatOccupancyMap({ journey }: SeatOccupancyMapProps) {
  const [selected, setSelected] = useState<JourneyManifestItem | null>(null);

  return (
    <div className={styles.cars}>
      {journey.cars.map((car) => {
        const taken = new Set(car.takenSeats);
        return (
          <section className={styles.car} key={car.carNumber} aria-label={`Car ${car.carNumber} seat map`}>
            <div className={styles.carHeader}>
              <div>
                <Text fw={fontWeights.extraBold}>Car {car.carNumber}</Text>
                <Text size={textSizes.sm} c={themeColorNames.dimmed}>
                  {car.travelClass === 'FIRST' ? 'First class' : 'Second class'} · {car.compartments} compartments
                </Text>
              </div>
              <Badge color={themeColorNames.rail} variant="light">
                {car.availableSeats}/{car.totalSeats} free
              </Badge>
            </div>
            <div className={styles.compartments}>
              {Array.from({ length: car.compartments }, (_, compartmentIndex) => getCompartmentSeatOrder(compartmentIndex)).map(
                (compartmentSeats, compartmentIndex) => (
                  <div className={styles.compartment} key={compartmentIndex} aria-label={`Compartment ${compartmentIndex + 1}`}>
                    {compartmentSeats.map((seat) => {
                      const manifest = journey.manifest.find(
                        (item) => item.carNumber === car.carNumber && item.seatNumber === seat && item.holdsSeat,
                      );
                      return (
                        <Popover
                          key={seat}
                          opened={selected?.ticketId === manifest?.ticketId}
                          onChange={() => setSelected(null)}
                          position="top"
                          withArrow
                          shadow="md"
                        >
                          <Popover.Target>
                            <button
                              className={styles.seat}
                              type="button"
                              data-taken={taken.has(seat)}
                              aria-label={
                                taken.has(seat)
                                  ? `Seat ${seat} taken${manifest ? ` by ${manifest.passengerName}` : ''}`
                                  : `Seat ${seat} free`
                              }
                              onClick={() => setSelected(manifest ?? null)}
                            >
                              {taken.has(seat) ? '' : seat}
                            </button>
                          </Popover.Target>
                          {manifest ? (
                            <Popover.Dropdown>
                              <Text fw={fontWeights.extraBold}>{manifest.passengerName}</Text>
                              <Text size={textSizes.sm} c={themeColorNames.dimmed}>
                                {manifest.bookingReference} · {manifest.ticketCode}
                              </Text>
                            </Popover.Dropdown>
                          ) : null}
                        </Popover>
                      );
                    })}
                  </div>
                ),
              )}
            </div>
            <div className={styles.legend}>
              <span className={styles.key}>
                <span className={styles.swatch} /> Free
              </span>
              <span className={styles.key}>
                <span className={`${styles.swatch} ${styles.swatchTaken}`} /> Taken / unavailable
              </span>
            </div>
          </section>
        );
      })}
    </div>
  );
}
