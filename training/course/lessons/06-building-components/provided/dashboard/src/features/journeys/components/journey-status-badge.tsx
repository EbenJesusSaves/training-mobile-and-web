import { Badge } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';

import { iconSizes, themeColorNames } from '../../../shared/constants';
import type { JourneyStatus } from '../types';

const journeyConfig: Record<JourneyStatus, { label: string; color: string; icon: typeof IconCheck }> = {
  SCHEDULED: { label: 'Scheduled', color: themeColorNames.rail, icon: IconCheck },
  // LIVE 06.5 — Complete the status-to-colour and label mapping before using the badge in tables.
  DELAYED: { label: 'Scheduled', color: themeColorNames.rail, icon: IconCheck },
  CANCELLED: { label: 'Scheduled', color: themeColorNames.rail, icon: IconCheck },
};

export function JourneyStatusBadge({ status, delayMinutes }: { status: JourneyStatus; delayMinutes?: number }) {
  const config = journeyConfig[status];
  const Icon = config.icon;
  const suffix = status === 'DELAYED' && delayMinutes ? ` · ${delayMinutes}m` : '';
  return (
    <Badge variant="light" color={config.color} leftSection={<Icon size={iconSizes.xs} aria-hidden="true" />}>
      {config.label}
      {suffix}
    </Badge>
  );
}
