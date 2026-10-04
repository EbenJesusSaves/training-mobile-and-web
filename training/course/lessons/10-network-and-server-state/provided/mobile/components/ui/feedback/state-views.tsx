import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/atomic/app-text';
import { Icon, type IconName } from '@/components/atomic/icon';
import { useTheme } from '@/components/theme/theme-provider';
import { Button } from '@/components/ui/buttons/button';

import { radii } from '@/constants/radii';
import { iconSizes, sizes } from '@/constants/sizes';
import { spacing } from '@/constants/spacing';

import type { ApiError } from '@/api/errors';

interface EmptyStateProps {
  icon: IconName;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  onInverse?: boolean;
}

export function EmptyState({ icon, title, message, actionLabel, onAction, onInverse = false }: EmptyStateProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <View style={[styles.iconWrap, { backgroundColor: onInverse ? colors.onInverseSubtle : colors.surfaceRaised }]}>
        <Icon name={icon} size={iconSizes.hero} color={onInverse ? colors.onInverse : colors.ink} />
      </View>
      <AppText variant="subheading" tone={onInverse ? 'onInverse' : 'ink'} align="center">
        {title}
      </AppText>
      <AppText variant="label" tone={onInverse ? 'onInverseMuted' : 'muted'} align="center" style={styles.message}>
        {message}
      </AppText>
      {actionLabel && onAction ? (
        <Button title={actionLabel} onPress={onAction} variant="dark" size="compact" style={styles.action} />
      ) : null}
    </View>
  );
}

/** Failed request with a retry. Network errors get a friendlier, specific message. */
export function ErrorState({ error, onRetry, onInverse = false }: { error: ApiError; onRetry: () => void; onInverse?: boolean }) {
  return (
    <EmptyState
      icon={error.isNetworkError ? 'wifiOff' : 'alert'}
      title={error.isNetworkError ? 'Can’t reach RailPass' : 'Something went wrong'}
      message={error.message}
      actionLabel="Try again"
      onAction={onRetry}
      onInverse={onInverse}
    />
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: spacing.huge, paddingHorizontal: spacing.xxl, gap: spacing.sm },
  iconWrap: {
    width: sizes.emptyStateIcon,
    height: sizes.emptyStateIcon,
    borderRadius: radii.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  message: { maxWidth: sizes.readableTextWidth },
  action: { marginTop: spacing.md, minWidth: sizes.buttonMinWidth },
});
