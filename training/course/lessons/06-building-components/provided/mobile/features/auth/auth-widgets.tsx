import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/atomic/app-text';
import { Icon } from '@/components/atomic/icon';
import { useTheme } from '@/components/theme/theme-provider';

import { borderWidths } from '@/constants/borders';
import { radii } from '@/constants/radii';
import { hitSlop, iconSizes, sizes } from '@/constants/sizes';
import { spacing } from '@/constants/spacing';

export function RememberMe({ value, onChange }: { value: boolean; onChange: (value: boolean) => void }) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: value }}
      hitSlop={hitSlop.sm}
      onPress={() => onChange(!value)}
      style={styles.remember}
    >
      <View
        style={[
          styles.checkbox,
          { borderColor: value ? colors.ink : colors.inkMuted, backgroundColor: value ? colors.ink : colors.transparent },
        ]}
      >
        {value ? <Icon name="checkPlain" size={iconSizes.xs} color={colors.surfaceRaised} /> : null}
      </View>
      <AppText variant="label" tone="secondary">
        Remember me
      </AppText>
    </Pressable>
  );
}

/** "Don't have an account? Create an account" style footer link. */
export function AuthFooterLink({ prompt, action, onPress }: { prompt: string; action: string; onPress: () => void }) {
  return (
    <View style={styles.footer}>
      <AppText variant="label" tone="muted">
        {prompt}
      </AppText>
      <Pressable accessibilityRole="link" hitSlop={hitSlop.md} onPress={onPress}>
        <AppText variant="labelStrong">{action}</AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  remember: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, minHeight: sizes.touchTarget },
  checkbox: {
    width: sizes.checkbox,
    height: sizes.checkbox,
    borderRadius: radii.xs,
    borderWidth: borderWidths.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: spacing.xxs, flexWrap: 'wrap' },
});
