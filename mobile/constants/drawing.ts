// Geometry for custom Skia drawings. Proportions follow the reference screens.
import { radii } from './radii';
import { spacing } from './spacing';

export const timelineGeometry = {
  height: 18,
  trainWidth: 30,
  dotRadius: 5,
  lineWidth: 2,
  dashWidth: 1.6,
  dashPattern: [4, 5],
  trainYOffset: 7,
  trainLeadIn: 4,
  // Side view of a high-speed train nose (30×13, pointing right) and its window.
  trainPath: 'M3 1 H17 C23 1 27.5 5 30 10.5 V12 H3 Q1 12 1 10 V3 Q1 1 3 1 Z',
  windowPath: 'M18.5 3.2 H21 C23 3.6 24.6 4.8 25.6 6.3 H18.5 Z',
  stripe: { x: 4, y: 8, width: 14, height: 1.6, radius: 0.8 },
} as const;

const seat = 38;
const columnGap = 30;
const rowPitch = 54;
const paddingX = 22;
const paddingY = 16;
const compartmentWidth = paddingX * 2 + seat * 2 + columnGap;
const compartmentHeight = paddingY * 2 + seat + rowPitch * 2;
const top = 30;
const corridorHeight = 30;
const corridorGap = spacing.md;
const bottom = 26;

export const seatMapGeometry = {
  seat,
  seatRadius: radii.md,
  backrestWidth: 5,
  backrestHeight: 28,
  backrestGap: spacing.xxs,
  columnGap,
  rowPitch,
  paddingX,
  paddingY,
  compartmentWidth,
  compartmentHeight,
  compartmentRadius: radii.xl,
  compartmentGap: spacing.md,
  noseWidth: 116,
  noseInset: 14,
  tail: 28,
  top,
  corridorHeight,
  corridorGap,
  corridorRadius: corridorHeight / 2,
  corridorEndInset: 18,
  height: top + compartmentHeight + corridorGap + corridorHeight + bottom,
  bodyCorner: 34,
  bodyInset: 9,
  noseCurve: 0.18,
  noseShoulder: 0.2,
  windshield: {
    x: 34,
    offsetY: 66,
    width: 44,
    height: 120,
    lines: 18,
    lineSpacing: 10,
    lineStartX: 20,
    lineEndX: 100,
    lineRise: 40,
    lineWidth: 3,
  },
  hatch: { lines: 8, spacing: 8, rise: 24, overshoot: 4, lineWidth: 2.6 },
  pulseGrowth: 16,
  pulseStroke: 2,
} as const;

export const ticketGeometry = {
  radius: radii.xxl,
  notchRadius: 17,
  perforationInset: spacing.sm,
  perforationDash: [6, 6],
  perforationWidth: 1.4,
  barcodeHeight: 74,
  stubPadding: 48,
  sidePadding: spacing.xxxl,
  stackInset: 22,
  stackOverlap: spacing.sm,
} as const;

export const successMarkGeometry = {
  size: 168,
  badgeRadius: 40,
  rippleGrowth: 38,
  haloGrowth: 24,
  tickStroke: 7,
  // Tick drawn relative to the centre point.
  tick: { startX: -22, startY: 1, midX: -6, midY: 17, endX: 24, endY: -15 },
} as const;

/** PDF417 rows are drawn taller than modules are wide; this pads rows to avoid hairline gaps. */
export const barcodeRowBleed = 0.5;

/** Precision of coordinates written into generated SVG (smaller PDFs, no visible difference). */
export const svgCoordinateDecimals = 2;

/** Printed ticket (CSS px). The barcode is wider than on screen so print scanners read it easily. */
export const pdfTicketGeometry = {
  barcodeWidth: 300,
  barcodeHeight: ticketGeometry.barcodeHeight,
  maxWidth: 420,
} as const;
