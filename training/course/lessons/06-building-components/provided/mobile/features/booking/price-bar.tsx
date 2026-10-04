import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/atomic/app-text';
import { useTheme } from '@/components/theme/theme-provider';
import { Button } from '@/components/ui/buttons/button';

import { formatMoney } from '@/libs/format';

import { borderWidths } from '@/constants/borders';
import { layout } from '@/constants/layout';
import { sizes } from '@/constants/sizes';
import { spacing } from '@/constants/spacing';

interface PriceBarProps {
  totalCents: number;
  caption: string;
  actionLabel: string;
  onAction: () => void;
  disabled?: boolean;
  loading?: boolean;
}

/** Sticky footer: running total on the left, primary action on the right. */
export function PriceBar({ totalCents, caption, actionLabel, onAction, disabled, loading }: PriceBarProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.bar,
        { backgroundColor: colors.surfaceRaised, borderTopColor: colors.line, paddingBottom: Math.max(insets.bottom, spacing.lg) },
      ]}
    >
      <View style={styles.price} accessible accessibilityLabel={`Total ${formatMoney(totalCents)}, ${caption}`}>
        <AppText variant="title">{formatMoney(totalCents)}</AppText>
        <AppText variant="label" tone="muted" numberOfLines={1}>
          {caption}
        </AppText>
      </View>
      <Button title={actionLabel} onPress={onAction} disabled={disabled} loading={loading} style={styles.button} />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: layout.screenGutter,
    paddingTop: spacing.lg,
    borderTopWidth: borderWidths.hairline,
  },
  price: { flex: 1 },
  button: { minWidth: sizes.buttonMinWidth },
});
