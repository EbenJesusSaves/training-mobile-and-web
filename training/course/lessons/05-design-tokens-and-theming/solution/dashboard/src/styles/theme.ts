import { Button, Card, createTheme, Input, Modal, NavLink, Paper, virtualColor } from '@mantine/core';

import {
  breakpoints,
  fontFamilies,
  fontSizes,
  fontWeights,
  lineHeights,
  radii,
  railDanger,
  railGreen,
  railRed,
  spacing,
} from '../shared/constants';

export const theme = createTheme({
  fontFamily: fontFamilies.primary,
  primaryColor: 'rail',
  defaultRadius: 'lg',
  fontSizes: {
    xs: fontSizes.caption,
    sm: fontSizes.captionLarge,
    md: fontSizes.body,
    lg: fontSizes.bodyStrong,
    xl: fontSizes.heading,
  },
  spacing: {
    xs: spacing.xs,
    sm: spacing.sm,
    md: spacing.md,
    lg: spacing.lg,
    xl: spacing.xl,
  },
  breakpoints: {
    xs: breakpoints.xs,
    sm: breakpoints.sm,
    md: breakpoints.md,
    lg: breakpoints.lg,
    xl: breakpoints.xl,
  },
  radius: {
    xs: radii.xs,
    sm: radii.sm,
    md: radii.md,
    lg: radii.lg,
    xl: radii.xl,
  },
  colors: {
    rail: virtualColor({ name: 'rail', light: 'railGreen', dark: 'railRed' }),
    railGreen,
    railRed,
    railDanger,
  },
  headings: {
    fontFamily: fontFamilies.primary,
    fontWeight: fontWeights.bold,
    sizes: {
      h1: { fontSize: fontSizes.display, lineHeight: lineHeights.display },
      h2: { fontSize: fontSizes.title, lineHeight: lineHeights.title },
      h3: { fontSize: fontSizes.heading, lineHeight: lineHeights.heading },
    },
  },
  components: {
    Button: Button.extend({ defaultProps: { radius: 'xl' } }),
    Card: Card.extend({ defaultProps: { radius: 'xl', withBorder: true } }),
    Paper: Paper.extend({ defaultProps: { radius: 'xl', withBorder: true } }),
    Modal: Modal.extend({ defaultProps: { radius: 'xl', centered: true } }),
    Input: Input.extend({ defaultProps: { radius: 'md' } }),
    NavLink: NavLink.extend({ defaultProps: { variant: 'subtle' } }),
  },
});
