/** 4-point spacing scale (2 and 6 exist for fine optical adjustments). */
export const spacing = {
  none: 0,
  xxxs: 2,
  xxs: 4,
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  huge: 32,
  giant: 40,
} as const;

export type SpacingToken = keyof typeof spacing;
