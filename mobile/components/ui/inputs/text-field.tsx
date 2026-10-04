import { forwardRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, type TextInputProps, View } from 'react-native';

import { AppText } from '@/components/atomic/app-text';
import { Icon, type IconName } from '@/components/atomic/icon';
import { useTheme } from '@/components/theme/theme-provider';

import { borderWidths } from '@/constants/borders';
import { radii } from '@/constants/radii';
import { hitSlop, iconSizes, sizes } from '@/constants/sizes';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

interface TextFieldProps extends Omit<TextInputProps, 'style'> {
  label: string;
  icon?: IconName;
  error?: string;
  secure?: boolean;
  /** Visually hide the label (screen readers still announce it), as in the pill inputs of the auth designs. */
  hideLabel?: boolean;
}

export const TextField = forwardRef<TextInput, TextFieldProps>(function TextField(
  { label, icon, error, secure = false, hideLabel = false, ...inputProps },
  ref,
) {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isHidden, setIsHidden] = useState(secure);
  const borderColor = error ? colors.danger : isFocused ? colors.accentStrong : colors.line;

  return (
    <View style={styles.wrapper}>
      {hideLabel ? null : (
        <AppText variant="label" tone="secondary" style={styles.label}>
          {label}
        </AppText>
      )}
      <View style={[styles.field, { backgroundColor: colors.surfaceRaised, borderColor }]}>
        {icon ? <Icon name={icon} size={iconSizes.md} color={colors.inkMuted} /> : null}
        <TextInput
          ref={ref}
          accessibilityLabel={label}
          placeholderTextColor={colors.inkMuted}
          secureTextEntry={isHidden}
          onFocus={(event) => {
            setIsFocused(true);
            inputProps.onFocus?.(event);
          }}
          onBlur={(event) => {
            setIsFocused(false);
            inputProps.onBlur?.(event);
          }}
          {...inputProps}
          style={[styles.input, { color: colors.ink }]}
        />
        {secure ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isHidden ? 'Show password' : 'Hide password'}
            hitSlop={hitSlop.md}
            onPress={() => setIsHidden((value) => !value)}
          >
            <Icon name={isHidden ? 'eyeOff' : 'eye'} size={iconSizes.md} color={colors.inkMuted} />
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <View style={styles.errorRow} accessibilityLiveRegion="polite">
          <Icon name="alert" size={iconSizes.xs} color={colors.danger} />
          <AppText variant="caption" tone="danger" style={styles.errorText}>
            {error}
          </AppText>
        </View>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: { gap: spacing.xs },
  label: { marginLeft: spacing.xxs },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: sizes.inputHeight,
    borderRadius: radii.pill,
    borderWidth: borderWidths.thin,
    paddingHorizontal: spacing.lg,
  },
  input: { ...typography.input, flex: 1, paddingVertical: spacing.md },
  errorRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginLeft: spacing.xs },
  errorText: { flex: 1 },
});
