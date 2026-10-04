import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, type TextTone } from '@/components/atomic/app-text';
import { Icon, type IconName } from '@/components/atomic/icon';
import { useTheme } from '@/components/theme/theme-provider';

import { radii } from '@/constants/radii';
import { iconSizes, sizes } from '@/constants/sizes';
import { spacing } from '@/constants/spacing';

import type { ReactNode } from 'react';

interface SettingsRowProps {
  icon: IconName;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  tone?: TextTone;
  trailing?: ReactNode;
}

export function SettingsRow({ icon, title, subtitle, onPress, tone = 'ink', trailing }: SettingsRowProps) {
  const { colors } = useTheme();
  const iconColor = tone === 'danger' ? colors.danger : colors.ink;
  const content = (
    <>
      <View style={[styles.icon, { backgroundColor: tone === 'danger' ? colors.dangerSoft : colors.surface }]}>
        <Icon name={icon} size={iconSizes.lg} color={iconColor} />
      </View>
      <View style={styles.text}>
        <AppText variant="bodyStrong" tone={tone}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="label" tone="muted">
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {trailing ?? (onPress ? <Icon name="forward" size={iconSizes.md} color={colors.inkMuted} /> : null)}
    </>
  );
  return onPress ? (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.row}>
      {content}
    </Pressable>
  ) : (
    <View style={styles.row}>{content}</View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md, minHeight: sizes.rowMinHeight },
  icon: { width: sizes.optionIcon, height: sizes.optionIcon, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center' },
  text: { flex: 1, gap: spacing.xxxs },
});
