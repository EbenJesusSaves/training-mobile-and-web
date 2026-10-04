import { useEffect } from 'react';
import { type DimensionValue, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { useTheme } from '@/components/theme/theme-provider';

import { durations } from '@/constants/motion';
import { opacity as opacityTokens } from '@/constants/opacity';
import { radii } from '@/constants/radii';

const REPEAT_FOREVER = -1;

interface SkeletonProps {
  height: number;
  width?: DimensionValue;
  radius?: number;
  inverse?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Placeholder block that gently pulses (static when the user prefers reduced motion). */
export function Skeleton({ height, width = '100%', radius = radii.lg, inverse = false, style }: SkeletonProps) {
  const { colors } = useTheme();
  const reduceMotion = useReducedMotion();
  const opacity = useSharedValue<number>(opacityTokens.skeletonMin);

  useEffect(() => {
    if (!reduceMotion) opacity.value = withRepeat(withTiming(opacityTokens.full, { duration: durations.skeleton }), REPEAT_FOREVER, true);
  }, [opacity, reduceMotion]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        { height, width, borderRadius: radius, backgroundColor: inverse ? colors.inverseRaised : colors.surfaceRaised },
        animatedStyle,
        style,
      ]}
    />
  );
}
