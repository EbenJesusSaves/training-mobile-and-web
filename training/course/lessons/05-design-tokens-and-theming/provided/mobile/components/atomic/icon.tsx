import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { iconSizes } from '@/constants/sizes';

import type { ComponentProps } from 'react';

type IonName = ComponentProps<typeof Ionicons>['name'];
type McName = ComponentProps<typeof MaterialCommunityIcons>['name'];

/** One semantic icon vocabulary for the app, mapped onto two bundled icon sets. */
const ICONS = {
  home: ['ion', 'home'],
  stations: ['mc', 'train'],
  tickets: ['mc', 'ticket-confirmation'],
  profile: ['ion', 'person-circle'],
  bell: ['ion', 'notifications-outline'],
  swap: ['mc', 'swap-vertical'],
  filter: ['ion', 'funnel-outline'],
  back: ['ion', 'chevron-back'],
  forward: ['ion', 'chevron-forward'],
  snowflake: ['mc', 'snowflake'],
  luggage: ['mc', 'bag-suitcase-outline'],
  bicycle: ['mc', 'bicycle'],
  meal: ['mc', 'food-outline'],
  download: ['ion', 'download-outline'],
  share: ['ion', 'share-outline'],
  mail: ['ion', 'mail-outline'],
  lock: ['ion', 'lock-closed-outline'],
  person: ['ion', 'person-outline'],
  eye: ['ion', 'eye-outline'],
  eyeOff: ['ion', 'eye-off-outline'],
  check: ['ion', 'checkmark-circle'],
  checkPlain: ['ion', 'checkmark'],
  checkedIn: ['ion', 'shield-checkmark'],
  alert: ['ion', 'alert-circle'],
  clock: ['ion', 'time-outline'],
  close: ['ion', 'close'],
  closeCircle: ['ion', 'close-circle'],
  ban: ['ion', 'ban'],
  search: ['ion', 'search'],
  location: ['ion', 'location-outline'],
  phone: ['ion', 'call-outline'],
  moon: ['ion', 'moon-outline'],
  sun: ['ion', 'sunny-outline'],
  system: ['ion', 'phone-portrait-outline'],
  logout: ['ion', 'log-out-outline'],
  trash: ['ion', 'trash-outline'],
  info: ['ion', 'information-circle-outline'],
  plus: ['ion', 'add'],
  minus: ['ion', 'remove'],
  calendar: ['ion', 'calendar-outline'],
  seat: ['mc', 'seat-passenger'],
  arrowRight: ['ion', 'arrow-forward'],
  refresh: ['ion', 'refresh'],
  server: ['mc', 'server-network'],
  archive: ['mc', 'archive-outline'],
  edit: ['ion', 'create-outline'],
  key: ['ion', 'key-outline'],
  people: ['ion', 'people-outline'],
  route: ['mc', 'map-marker-path'],
  wifiOff: ['ion', 'cloud-offline-outline'],
  sparkles: ['ion', 'sparkles-outline'],
  repeat: ['ion', 'repeat'],
} as const satisfies Record<string, readonly ['ion', IonName] | readonly ['mc', McName]>;

export type IconName = keyof typeof ICONS;

interface IconProps {
  name: IconName;
  size?: number;
  color: string;
}

export function Icon({ name, size = iconSizes.lg, color }: IconProps) {
  const [set, glyph] = ICONS[name];
  return set === 'ion' ? (
    <Ionicons name={glyph as IonName} size={size} color={color} accessible={false} />
  ) : (
    <MaterialCommunityIcons name={glyph as McName} size={size} color={color} accessible={false} />
  );
}
