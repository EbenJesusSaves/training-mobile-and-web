import { useEffect } from 'react';
import { Easing, useDerivedValue, useReducedMotion, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { Canvas, Circle, Path, Skia } from '@shopify/react-native-skia';

import { useTheme } from '@/components/theme/theme-provider';

import { successMarkGeometry as geo } from '@/constants/drawing';
import { delays, durations, easingBackOvershoot, scales } from '@/constants/motion';
import { opacity } from '@/constants/opacity';

const CENTER = geo.size / 2;
const { tick } = geo;
const CHECK = Skia.Path.MakeFromSVGString(
  `M ${CENTER + tick.startX} ${CENTER + tick.startY} L ${CENTER + tick.midX} ${CENTER + tick.midY} L ${CENTER + tick.endX} ${CENTER + tick.endY}`,
)!;
const DONE = 1;
const NOT_STARTED = 0;

/** Booking-confirmed animation: rings ripple out, the badge pops in and the tick draws itself. */
export function SuccessMark() {
  const { colors } = useTheme();
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(reduceMotion ? DONE : NOT_STARTED);
  const tickProgress = useSharedValue(reduceMotion ? DONE : NOT_STARTED);

  useEffect(() => {
    if (reduceMotion) return;
    progress.value = withTiming(DONE, { duration: durations.pop, easing: Easing.out(Easing.back(easingBackOvershoot)) });
    tickProgress.value = withDelay(delays.successTick, withTiming(DONE, { duration: durations.medium, easing: Easing.out(Easing.cubic) }));
  }, [progress, reduceMotion, tickProgress]);

  const badgeRadius = useDerivedValue(() => geo.badgeRadius * Math.min(progress.value, scales.successOvershoot));
  const rippleRadius = useDerivedValue(() => geo.badgeRadius + progress.value * geo.rippleGrowth);
  const rippleOpacity = useDerivedValue(() => opacity.rippleFade * (DONE - Math.min(progress.value, DONE)) + opacity.rippleRest);
  const haloRadius = useDerivedValue(() => geo.badgeRadius + progress.value * geo.haloGrowth);

  return (
    <Canvas style={{ width: geo.size, height: geo.size }} accessible accessibilityLabel="Booking confirmed" accessibilityRole="image">
      <Circle cx={CENTER} cy={CENTER} r={rippleRadius} color={colors.accent} opacity={rippleOpacity} />
      <Circle cx={CENTER} cy={CENTER} r={haloRadius} color={colors.accent} opacity={opacity.glowFaint} />
      <Circle cx={CENTER} cy={CENTER} r={badgeRadius} color={colors.accent} />
      <Path
        path={CHECK}
        color={colors.onAccent}
        style="stroke"
        strokeWidth={geo.tickStroke}
        strokeCap="round"
        strokeJoin="round"
        start={NOT_STARTED}
        end={tickProgress}
      />
    </Canvas>
  );
}
