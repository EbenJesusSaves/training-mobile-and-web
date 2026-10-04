import type { IconName } from '@/components/atomic/icon';

/** Maps an add-on's API `icon` value to an app icon; unknown values get a generic one. */
export const addOnIcon = (icon: string): IconName =>
  icon === 'bicycle' ? 'bicycle' : icon === 'meal' ? 'meal' : icon === 'luggage' ? 'luggage' : 'sparkles';
