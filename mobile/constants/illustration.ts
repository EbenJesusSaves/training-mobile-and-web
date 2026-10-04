// Flat travel illustration used on the authentication screens.
// Keeps the reference concept (traveller with backpack and suitcase, mountains, clouds, a stop sign),
// recoloured to the app palette: greens in light mode, reds in dark mode. The sky is a flat colour.

const light = {
  sky: '#EAF0F6',
  cloud: '#FFFFFF',
  mountainBack: '#A9D6B5',
  mountainFront: '#7FBF91',
  ground: '#E3EBE3',
  tree: '#5FAE76',
  trunk: '#3E5E47',
  skin: '#8D5A3B',
  hair: '#1E1410',
  jacket: '#17301D',
  skirt: '#2F4A37',
  backpack: '#7EE6A0',
  suitcase: '#7EE6A0',
  suitcaseStripe: '#4FCB7B',
  shoes: '#0B120D',
  signPost: '#0B120D',
  signBoard: '#7EE6A0',
  signIcon: '#0B120D',
  path: '#5F6A62',
  hat: '#4FCB7B',
  sparkle: '#4FCB7B',
} as const;

export type IllustrationPalette = Record<keyof typeof light, string>;

const dark: IllustrationPalette = {
  sky: '#141212',
  cloud: '#2B2626',
  mountainBack: '#3A1C1F',
  mountainFront: '#2A1416',
  ground: '#171515',
  tree: '#5A2A2E',
  trunk: '#2A1416',
  skin: '#8D5A3B',
  hair: '#0E0808',
  jacket: '#3B3434',
  skirt: '#2A2626',
  backpack: '#FF4D5A',
  suitcase: '#FF4D5A',
  suitcaseStripe: '#FF6B76',
  shoes: '#050404',
  signPost: '#B9B1B1',
  signBoard: '#FF4D5A',
  signIcon: '#140405',
  path: '#847B7B',
  hat: '#FF6B76',
  sparkle: '#FF6B76',
};

export const illustrationPalettes = { light: light as IllustrationPalette, dark } as const;

/** Scene coordinate space; the canvas scales it to the available width. */
export const sceneSize = { width: 360, height: 280 } as const;

export const scenePaths = {
  mountainBack: 'M0 200 L60 128 L112 172 L172 100 L242 178 L292 136 L360 182 V280 H0 Z',
  mountainFront: 'M0 226 L84 172 L152 214 L232 166 L302 210 L360 190 V280 H0 Z',
  ground: 'M0 236 H360 V280 H0 Z',
  // Traveller (origin at her feet, facing right, waving).
  skirt: 'M-16 -76 H16 L22 -44 H-22 Z',
  jacket: 'M-14 -128 Q0 -134 14 -128 L20 -74 Q0 -68 -20 -74 Z',
  backpack: 'M-30 -124 H-12 V-80 H-30 Q-34 -80 -34 -86 V-118 Q-34 -124 -30 -124 Z',
  wavingArm: 'M12 -124 Q30 -134 44 -154',
  lowerArm: 'M-12 -122 Q-22 -100 -28 -78',
  hair: 'M-14 -148 Q-14 -166 2 -166 Q16 -166 16 -150 Q10 -158 -2 -156 Q-6 -146 -14 -140 Z',
  bun: 'M-18 -150 m-6 0 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0',
  hat: 'M-20 -158 H22 Q24 -154 18 -152 H-16 Q-22 -154 -20 -158 Z M-10 -158 Q-8 -172 4 -172 Q14 -172 14 -158 Z',
  // Bus/train stop sign.
  signPost: 'M286 100 H292 V238 H286 Z',
  trainFront: 'M-9 -8 Q-9 -12 -5 -12 H5 Q9 -12 9 -8 V6 Q9 9 6 9 H-6 Q-9 9 -9 6 Z',
  trainWindow: 'M-6 -9 H6 V-1 H-6 Z',
  // Dashed flight path on the forgot-password scene.
  journeyPath: 'M300 54 Q236 70 250 124 Q262 170 210 196',
  plane: 'M0 0 L18 -6 L22 -2 L8 2 L12 12 L8 12 L2 4 L-6 6 L-8 2 Z',
} as const;

export const sceneLayout = {
  clouds: [
    { x: 46, y: 46, scale: 1 },
    { x: 268, y: 34, scale: 0.8 },
    { x: 318, y: 150, scale: 0.7 },
  ],
  cloudPuffs: [
    { dx: 0, dy: 0, r: 14 },
    { dx: 16, dy: -8, r: 18 },
    { dx: 36, dy: 0, r: 14 },
  ],
  cloudBase: { dx: -10, dy: 2, width: 58, height: 14, radius: 7 },
  cloudDrift: 10,
  tree: { trunkX: 318, trunkY: 176, trunkWidth: 6, trunkHeight: 62, canopyX: 321, canopyY: 160, canopyRx: 20, canopyRy: 34 },
  traveller: { x: 172, y: 238 },
  travellerForgot: { x: 150, y: 244 },
  head: { dx: 0, dy: -144, r: 15 },
  neck: { dx: -4, dy: -132, width: 8, height: 8 },
  legs: [
    { dx: -10, dy: -46, width: 7, height: 44 },
    { dx: 4, dy: -46, width: 7, height: 44 },
  ],
  shoes: [
    { dx: -8, dy: -2, rx: 8, ry: 4 },
    { dx: 9, dy: -2, rx: 8, ry: 4 },
  ],
  hands: [
    { dx: 46, dy: -157, r: 5 },
    { dx: -28, dy: -76, r: 5 },
  ],
  armWidth: 9,
  suitcase: {
    dx: -66,
    dy: -58,
    width: 34,
    height: 54,
    radius: 6,
    handleDx: -51,
    handleDy: -76,
    handleWidth: 4,
    handleHeight: 20,
    stripeDy: -36,
    stripeHeight: 4,
    wheelR: 3,
  },
  sign: { boardX: 264, boardY: 70, size: 50, radius: 10, innerInset: 7, innerRadius: 7, iconX: 289, iconY: 95, iconScale: 1.3 },
  plane: { x: 304, y: 46, rotate: -0.35 },
  sparkles: [
    { x: 236, y: 44, r: 4 },
    { x: 330, y: 214, r: 5 },
  ],
  pathDash: [6, 7],
  pathWidth: 1.6,
} as const;
