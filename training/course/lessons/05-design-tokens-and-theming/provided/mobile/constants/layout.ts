import { radii } from './radii';
import { spacing } from './spacing';

/** Semantic layout values built on the spacing/radius scales, so screens share one rhythm. */
export const layout = {
  screenGutter: spacing.xl,
  sectionGap: spacing.xxl,
  blockGap: spacing.lg,
  listGap: spacing.md,
  cardPadding: spacing.xl,
  cardRadius: radii.xxl,
  heroCardRadius: radii.xxxl,
  headerTopPadding: spacing.sm,
  headerBottomPadding: spacing.lg,
  screenBottomPadding: spacing.huge,
  /** How far the auth form sheet overlaps the illustration above it. */
  sheetOverlap: radii.xxxl,
  cityImageAspectRatio: 4 / 3,
} as const;
