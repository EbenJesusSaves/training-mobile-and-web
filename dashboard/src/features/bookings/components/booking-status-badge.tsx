import { Badge } from '@mantine/core';
import { IconCheck, IconCircleCheck, IconX } from '@tabler/icons-react';

import { iconSizes, themeColorNames } from '../../../shared/constants';
import type { BookingStatus } from '../types';

const bookingConfig: Record<BookingStatus, { label: string; color: string; icon: typeof IconCheck }> = {
  CONFIRMED: { label: 'Confirmed', color: themeColorNames.rail, icon: IconCheck },
  CHECKED_IN: { label: 'Checked in', color: themeColorNames.teal, icon: IconCircleCheck },
  CANCELLED: { label: 'Cancelled', color: themeColorNames.gray, icon: IconX },
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const config = bookingConfig[status];
  const Icon = config.icon;
  return (
    <Badge variant="light" color={config.color} leftSection={<Icon size={iconSizes.xs} aria-hidden="true" />}>
      {config.label}
    </Badge>
  );
}
