import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/atomic/app-text';
import { Icon, type IconName } from '@/components/atomic/icon';
import { useTheme } from '@/components/theme/theme-provider';

import { borderWidths } from '@/constants/borders';
import { radii } from '@/constants/radii';
import { iconSizes, sizes } from '@/constants/sizes';
import { spacing } from '@/constants/spacing';

import type { ReactNode } from 'react';

interface OptionRowProps {
  icon: IconName;
  title: string;
  description: string;
  /** Right-hand content: a price, a stepper, etc. */
  trailing: ReactNode;
  selected?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
}

/** A row in "Additional Options" (Extra Luggage +GH₵35, passengers, …). */
export function OptionRow({ icon, title, description, trailing, selected = false, onPress, accessibilityLabel }: OptionRowProps) {
  const { colors } = useTheme();
  const content = (
    <>
      <View style={[styles.icon, { backgroundColor: selected ? colors.accentSoft : colors.transparent }]}>
        <Icon name={icon} size={iconSizes.xxl} color={colors.inkSecondary} />
      </View>
      <View style={styles.text}>
        <AppText variant="bodyStrong">{title}</AppText>
        <AppText variant="label" tone="muted">
          {description}
        </AppText>
      </View>
      <View style={styles.trailing}>{trailing}</View>
    </>
  );
  const style = [styles.row, { backgroundColor: colors.surfaceRaised, borderColor: selected ? colors.accentStrong : colors.transparent }];
  return onPress ? (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={style}
    >
      {content}
    </Pressable>
  ) : (
    <View style={style}>{content}</View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radii.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderWidth: borderWidths.medium,
    minHeight: sizes.cardRowMinHeight,
  },
  icon: { width: sizes.optionIcon, height: sizes.optionIcon, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center' },
  text: { flex: 1, gap: spacing.xxxs },
  trailing: { alignItems: 'flex-end', gap: spacing.xs },
});
