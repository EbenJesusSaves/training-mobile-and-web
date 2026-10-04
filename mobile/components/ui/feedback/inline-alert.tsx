import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/atomic/app-text';
import { Icon, type IconName } from '@/components/atomic/icon';
import { useTheme } from '@/components/theme/theme-provider';
import { Button } from '@/components/ui/buttons/button';

import { borderWidths } from '@/constants/borders';
import { radii } from '@/constants/radii';
import { iconSizes } from '@/constants/sizes';
import { spacing } from '@/constants/spacing';

type AlertKind = 'error' | 'warning' | 'info' | 'success';

interface InlineAlertProps {
  kind: AlertKind;
  title?: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function InlineAlert({ kind, title, message, actionLabel, onAction }: InlineAlertProps) {
  const { colors } = useTheme();
  const config: Record<AlertKind, { icon: IconName; background: string; foreground: string }> = {
    error: { icon: 'alert', background: colors.dangerSoft, foreground: colors.danger },
    warning: { icon: 'clock', background: colors.warningSoft, foreground: colors.warning },
    info: { icon: 'info', background: colors.infoSoft, foreground: colors.info },
    success: { icon: 'check', background: colors.accentSoft, foreground: colors.ink },
  };
  const { icon, background, foreground } = config[kind];

  return (
    <View
      style={[styles.box, { backgroundColor: background, borderColor: foreground }]}
      accessibilityRole={kind === 'error' ? 'alert' : undefined}
      accessibilityLiveRegion="polite"
    >
      <Icon name={icon} size={iconSizes.lg} color={foreground} />
      <View style={styles.body}>
        {title ? <AppText variant="bodyStrong">{title}</AppText> : null}
        <AppText variant="label" tone="secondary">
          {message}
        </AppText>
        {actionLabel && onAction ? (
          <Button title={actionLabel} onPress={onAction} variant="secondary" size="compact" style={styles.action} />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flexDirection: 'row', gap: spacing.md, padding: spacing.lg, borderRadius: radii.xl, borderWidth: borderWidths.hairline },
  body: { flex: 1, gap: spacing.xxs },
  action: { alignSelf: 'flex-start', marginTop: spacing.sm },
});
