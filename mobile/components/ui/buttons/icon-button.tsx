import { Pressable, StyleSheet, View } from 'react-native';

import { Icon, type IconName } from '@/components/atomic/icon';
import { useTheme } from '@/components/theme/theme-provider';

import { borderWidths } from '@/constants/borders';
import { opacity } from '@/constants/opacity';
import { radii } from '@/constants/radii';
import { hitSlop, iconSizes, sizes } from '@/constants/sizes';
import { spacing } from '@/constants/spacing';

interface IconButtonProps {
  icon: IconName;
  label: string;
  onPress: () => void;
  tone?: 'light' | 'onInverse';
  badge?: boolean;
}

/** The rounded-square buttons from the references (back, bell, swap). Always 44pt+ for touch. */
export function IconButton({ icon, label, onPress, tone = 'light', badge = false }: IconButtonProps) {
  const { colors } = useTheme();
  const background = tone === 'onInverse' ? colors.onInverseGlass : colors.surfaceRaised;
  const border = tone === 'onInverse' ? colors.transparent : colors.line;
  const color = tone === 'onInverse' ? colors.onInverse : colors.ink;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={hitSlop.sm}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: background, borderColor: border, opacity: pressed ? opacity.pressedStrong : opacity.full },
      ]}
    >
      <Icon name={icon} size={iconSizes.lg} color={color} />
      {badge ? <View style={[styles.badge, { backgroundColor: colors.accentStrong, borderColor: background }]} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: sizes.iconButton,
    height: sizes.iconButton,
    borderRadius: radii.pill,
    borderWidth: borderWidths.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: sizes.badgeDot,
    height: sizes.badgeDot,
    borderRadius: radii.pill,
    borderWidth: borderWidths.medium,
  },
});
