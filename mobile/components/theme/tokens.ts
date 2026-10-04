import { palettes, type ThemeColors } from '@/constants/colors';

export type ColorScheme = 'light' | 'dark';

/**
 * Only colours change between themes, so that is all the theme carries. Spacing, typography,
 * radii and sizes are static constants imported directly from `@/constants`.
 */
export interface AppTheme {
  scheme: ColorScheme;
  colors: ThemeColors;
}

export const createTheme = (scheme: ColorScheme): AppTheme => ({ scheme, colors: palettes[scheme] });
