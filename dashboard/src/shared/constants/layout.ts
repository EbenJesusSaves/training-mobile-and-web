export const lineWidths = {
  base: '1px',
  strong: '2px',
  focus: '3px',
  artRail: '4px',
  trainWheel: '5px',
} as const;

export const layout = {
  fullViewportHeight: '100vh',
  full: '100%',
  fullMinusMobilePanelGutter: 'calc(100% - var(--rp-space-xxl))',
  bodyMinWidth: '320px',
  contentMeasure: '68ch',
  stateMeasure: '44ch',
  heroTitleMeasure: '11ch',
  heroTextMeasure: '48ch',
  overviewKpiColumns: '4',
  routeGridColumns: '4',
  trainWindows: '4',
  heroLeftRatio: '1.05fr',
  heroRightRatio: '0.95fr',
  overviewMainRatio: '1.55fr',
  overviewAsideRatio: '0.9fr',
  journeyFilterSearchRatio: '1.4fr',
  formColumns: '2',
  carEditorFirst: '0.7fr',
  carEditorSecond: '1fr',
  carEditorThird: '0.9fr',
  trainRotate: '-7deg',
  canvasAccentY: '30%',
} as const;

export const mixAmounts = {
  surfaceGlass: '92%',
  headerCanvas: '86%',
  accentSoftHover: '42%',
  onAccentLine: '75%',
  heroInverse: '98%',
  heroInverseRaised: '92%',
  heroGlow: '55%',
  accentOrb: '50%',
  railBorder: '72%',
  trainBody: '10%',
  panelGlass: '94%',
  stateSurface: '78%',
  canvasGlow: '38%',
  canvasAccent: '16%',
  takenSeat: '80%',
  buttonHover: '92%',
} as const;

export const opacity = {
  heroGlow: '0.75',
  secondaryTrack: '0.45',
} as const;

export const blur = {
  sm: '14px',
  md: '16px',
  glow: '18px',
  hero: '20px',
} as const;
