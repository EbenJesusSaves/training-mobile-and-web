import { Text } from '@mantine/core';

import { fontWeights, textSizes, themeColorNames } from '../../../shared/constants';
import type { JourneyDto } from '../../journeys/types';
import type { RouteDto } from '../types';

export function RouteLabel({ item }: { item: JourneyDto | RouteDto }) {
  return (
    <div>
      <Text fw={fontWeights.extraBold}>
        {item.origin.city} → {item.destination.city}
      </Text>
      <Text size={textSizes.xs} c={themeColorNames.dimmed}>
        {item.origin.code} {item.origin.name} · {item.destination.code} {item.destination.name}
      </Text>
    </div>
  );
}
