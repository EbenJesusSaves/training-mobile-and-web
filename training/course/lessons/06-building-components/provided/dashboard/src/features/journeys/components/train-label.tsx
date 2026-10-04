import { Badge, Group, Text } from '@mantine/core';

import { componentSizeKeys, fontWeights, spacingKeys, textSizes, themeColorNames } from '../../../shared/constants';
import type { JourneyDto } from '../types';

interface TrainLabelProps {
  journey: Pick<JourneyDto, 'serviceCode' | 'trainNumber' | 'trainName'>;
  mutedName?: boolean;
}

export function TrainLabel({ journey, mutedName = false }: TrainLabelProps) {
  return (
    <Group gap={spacingKeys.xs} align="center" wrap="wrap">
      <Badge color={themeColorNames.rail} variant="light" size={componentSizeKeys.xs}>
        {journey.serviceCode}
      </Badge>
      <Text
        size={mutedName ? textSizes.sm : undefined}
        c={mutedName ? themeColorNames.dimmed : undefined}
        fw={mutedName ? fontWeights.bold : fontWeights.extraBold}
      >
        {journey.trainNumber} · {journey.trainName}
      </Text>
    </Group>
  );
}
