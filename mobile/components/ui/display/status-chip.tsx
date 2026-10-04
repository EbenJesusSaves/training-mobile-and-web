import { StyleSheet, View } from 'react-native';

import { AppText, type TextTone } from '@/components/atomic/app-text';
import { Icon, type IconName } from '@/components/atomic/icon';
import { useTheme } from '@/components/theme/theme-provider';

import { radii } from '@/constants/radii';
import { iconSizes } from '@/constants/sizes';
import { spacing } from '@/constants/spacing';

import type { BookingStatus, JourneyStatus } from '@/api/types';

export type ChipKind = BookingStatus | JourneyStatus | 'COMPLETED' | 'JOURNEY_CANCELLED';
type ChipTone = 'neutral' | 'info' | 'warning' | 'muted' | 'danger';

const CHIPS: Record<ChipKind, { label: string; icon: IconName; tone: ChipTone }> = {
  CONFIRMED: { label: 'Confirmed', icon: 'check', tone: 'neutral' },
  CHECKED_IN: { label: 'Checked in', icon: 'checkedIn', tone: 'info' },
  CANCELLED: { label: 'Cancelled', icon: 'closeCircle', tone: 'muted' },
  COMPLETED: { label: 'Completed', icon: 'checkPlain', tone: 'muted' },
  SCHEDULED: { label: 'On time', icon: 'clock', tone: 'neutral' },
  DELAYED: { label: 'Delayed', icon: 'clock', tone: 'warning' },
  JOURNEY_CANCELLED: { label: 'Train cancelled', icon: 'ban', tone: 'danger' },
};

interface StatusChipProps {
  kind: ChipKind;
  /** Extra text, e.g. "+25 min" for a delay. */
  suffix?: string;
  onInverse?: boolean;
}

/** Status is always shown with an icon and a word, never by colour alone. */
export function StatusChip({ kind, suffix, onInverse = false }: StatusChipProps) {
  const { colors } = useTheme();
  const chip = CHIPS[kind];
  const palette: Record<ChipTone, { background: string; foreground: string; tone: TextTone }> = {
    neutral: {
      background: onInverse ? colors.onInverseGlass : colors.surface,
      foreground: onInverse ? colors.onInverse : colors.ink,
      tone: onInverse ? 'onInverse' : 'ink',
    },
    info: { background: colors.infoSoft, foreground: colors.info, tone: 'info' },
    warning: { background: colors.warningSoft, foreground: colors.warning, tone: 'warning' },
    muted: {
      background: onInverse ? colors.onInverseSubtle : colors.surface,
      foreground: onInverse ? colors.onInverseMuted : colors.inkMuted,
      tone: onInverse ? 'onInverseMuted' : 'muted',
    },
    danger: { background: colors.dangerSoft, foreground: colors.danger, tone: 'danger' },
  };
  const { background, foreground, tone } = palette[chip.tone];
  const text = suffix ? `${chip.label} ${suffix}` : chip.label;

  return (
    <View style={[styles.chip, { backgroundColor: background }]} accessible accessibilityLabel={text}>
      <Icon name={chip.icon} size={iconSizes.xs} color={foreground} />
      <AppText variant="captionStrong" tone={tone}>
        {text}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    alignSelf: 'flex-start',
  },
});
