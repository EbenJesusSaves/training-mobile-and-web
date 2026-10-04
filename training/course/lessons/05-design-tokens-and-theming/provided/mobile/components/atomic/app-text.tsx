import { Text, type TextProps } from 'react-native';

import { useTheme } from '@/components/theme/theme-provider';

import { maxFontSizeMultiplier, typography, type TypographyVariant } from '@/constants/typography';

import type { ColorToken } from '@/constants/colors';

export type TextTone =
  'ink' | 'secondary' | 'muted' | 'onInverse' | 'onInverseMuted' | 'onAccent' | 'accent' | 'danger' | 'warning' | 'info';

const toneColor: Record<TextTone, ColorToken> = {
  ink: 'ink',
  secondary: 'inkSecondary',
  muted: 'inkMuted',
  onInverse: 'onInverse',
  onInverseMuted: 'onInverseMuted',
  onAccent: 'onAccent',
  accent: 'accentText',
  danger: 'danger',
  warning: 'warning',
  info: 'info',
};

interface AppTextProps extends TextProps {
  variant?: TypographyVariant;
  tone?: TextTone;
  /** Overrides `tone` with a raw colour, for surfaces that never change with the theme (the paper ticket). */
  color?: string;
  align?: 'left' | 'center' | 'right';
}

/** All text goes through this component so typography stays on the design scale. */
export function AppText({ variant = 'body', tone = 'ink', color, align, style, ...rest }: AppTextProps) {
  const { colors } = useTheme();
  return (
    <Text
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      {...rest}
      style={[typography[variant], { color: color ?? colors[toneColor[tone]], textAlign: align }, style]}
    />
  );
}
