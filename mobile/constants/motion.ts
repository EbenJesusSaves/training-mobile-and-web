export const durations = {
  press: 90,
  medium: 450,
  pulse: 650,
  pop: 700,
  timeline: 900,
  skeleton: 900,
  cloudDrift: 9000,
} as const;

export const delays = {
  successTick: 350,
} as const;

export const springs = {
  seat: { damping: 9, stiffness: 220 },
} as const;

export const scales = {
  rest: 1,
  pressed: 0.98,
  seatPress: 0.86,
  successOvershoot: 1.08,
} as const;

/** Easing strength passed to Easing.back() for the confirmation pop. */
export const easingBackOvershoot = 1.6;
