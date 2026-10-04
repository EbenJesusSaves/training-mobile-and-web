import { fontFamilies } from './fonts';

export const fontSizes = {
  xs: 11,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 20,
  xxxl: 22,
  display: 28,
} as const;

export const fontWeights = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export const lineHeights = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 22,
  xl: 24,
  xxl: 26,
  xxxl: 28,
  display: 34,
} as const;

export const letterSpacings = {
  tighter: -0.6,
  tight: -0.4,
  snug: -0.3,
  slight: -0.2,
  normal: 0,
  wide: 1,
  wider: 1.5,
} as const;

/** Text styles used through <AppText variant="…">. */
export const typography = {
  display: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.display,
    lineHeight: lineHeights.display,
    letterSpacing: letterSpacings.tighter,
  },
  title: { fontFamily: fontFamilies.semibold, fontSize: fontSizes.xxxl, lineHeight: lineHeights.xxxl, letterSpacing: letterSpacings.tight },
  name: { fontFamily: fontFamilies.semibold, fontSize: fontSizes.xxl, lineHeight: lineHeights.xxl, letterSpacing: letterSpacings.snug },
  heading: { fontFamily: fontFamilies.semibold, fontSize: fontSizes.xl, lineHeight: lineHeights.xl, letterSpacing: letterSpacings.slight },
  dateDay: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.xxl,
    lineHeight: lineHeights.xxl,
    letterSpacing: letterSpacings.slight,
  },
  subheading: { fontFamily: fontFamilies.semibold, fontSize: fontSizes.lg, lineHeight: lineHeights.lg },
  bodyStrong: { fontFamily: fontFamilies.semibold, fontSize: fontSizes.md, lineHeight: lineHeights.md },
  body: { fontFamily: fontFamilies.medium, fontSize: fontSizes.md, lineHeight: lineHeights.md },
  bodyRegular: { fontFamily: fontFamilies.regular, fontSize: fontSizes.md, lineHeight: lineHeights.md },
  label: { fontFamily: fontFamilies.medium, fontSize: fontSizes.sm, lineHeight: lineHeights.sm },
  labelStrong: { fontFamily: fontFamilies.semibold, fontSize: fontSizes.sm, lineHeight: lineHeights.sm },
  labelBold: { fontFamily: fontFamilies.bold, fontSize: fontSizes.sm, lineHeight: lineHeights.sm },
  tab: { fontFamily: fontFamilies.medium, fontSize: fontSizes.xs, lineHeight: lineHeights.xs },
  tabActive: { fontFamily: fontFamilies.semibold, fontSize: fontSizes.xs, lineHeight: lineHeights.xs },
  caption: { fontFamily: fontFamilies.medium, fontSize: fontSizes.xs, lineHeight: lineHeights.xs },
  captionStrong: { fontFamily: fontFamilies.semibold, fontSize: fontSizes.xs, lineHeight: lineHeights.xs },
  code: { fontFamily: fontFamilies.medium, fontSize: fontSizes.xs, lineHeight: lineHeights.xs, letterSpacing: letterSpacings.wide },
  price: { fontFamily: fontFamilies.semibold, fontSize: fontSizes.xxxl, lineHeight: lineHeights.xxxl, letterSpacing: letterSpacings.tight },
  button: { fontFamily: fontFamilies.semibold, fontSize: fontSizes.md, lineHeight: lineHeights.md },
  input: { fontFamily: fontFamilies.medium, fontSize: fontSizes.md },
} as const;

export type TypographyVariant = keyof typeof typography;

/** Lets text grow with the system font size, but not so far that layouts break. */
export const maxFontSizeMultiplier = 1.6;
