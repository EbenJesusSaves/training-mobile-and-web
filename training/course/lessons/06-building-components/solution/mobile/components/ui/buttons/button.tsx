import { ActivityIndicator, Pressable, type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';

import { AppText, type TextTone } from '@/components/atomic/app-text';
import { Icon, type IconName } from '@/components/atomic/icon';
import { useTheme } from '@/components/theme/theme-provider';

import { borderWidths } from '@/constants/borders';
import { scales } from '@/constants/motion';
import { opacity } from '@/constants/opacity';
import { radii } from '@/constants/radii';
import { iconSizes, sizes } from '@/constants/sizes';
import { spacing } from '@/constants/spacing';

type Variant = 'primary' | 'dark' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: Variant;
  icon?: IconName;
  loading?: boolean;
  disabled?: boolean;
  size?: 'compact' | 'regular';
  style?: StyleProp<ViewStyle>;
  accessibilityHint?: string;
  testID?: string;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  icon,
  loading = false,
  disabled = false,
  size = 'regular',
  style,
  accessibilityHint,
  testID,
}: ButtonProps) {
  const { colors } = useTheme();
  const palette: Record<Variant, { background: string; border: string; tone: TextTone; content: string }> = {
    primary: { background: colors.accent, border: colors.accent, tone: 'onAccent', content: colors.onAccent },
    dark: { background: colors.inverse, border: colors.inverse, tone: 'onInverse', content: colors.onInverse },
    secondary: { background: colors.surfaceRaised, border: colors.line, tone: 'ink', content: colors.ink },
    ghost: { background: colors.transparent, border: colors.transparent, tone: 'ink', content: colors.ink },
    // Destructive actions are outlined in the danger colour, so they never look like the brand accent.
    danger: { background: colors.dangerSoft, border: colors.danger, tone: 'danger', content: colors.danger },
  };
  const scheme = palette[variant];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        size === 'compact' ? styles.compact : styles.regular,
        {
          backgroundColor: scheme.background,
          borderColor: scheme.border,
          opacity: isDisabled ? opacity.disabled : pressed ? opacity.pressed : opacity.full,
          transform: [{ scale: pressed ? scales.pressed : scales.rest }],
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={scheme.content} />
      ) : (
        <View style={styles.content}>
          {icon ? <Icon name={icon} size={iconSizes.lg} color={scheme.content} /> : null}
          <AppText variant="button" tone={scheme.tone}>
            {title}
          </AppText>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
    borderWidth: borderWidths.thin,
    borderRadius: radii.pill,
  },
  regular: { minHeight: sizes.buttonHeight },
  compact: { minHeight: sizes.buttonHeightCompact },
  content: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
