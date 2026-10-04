import { useEffect, useState } from 'react';
import { type LayoutChangeEvent, View } from 'react-native';
import { Easing, useDerivedValue, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';
import { Canvas, Circle, DashPathEffect, Group, Line, Path, RoundedRect, Skia, vec } from '@shopify/react-native-skia';

import { borderWidths } from '@/constants/borders';
import { timelineGeometry as geo } from '@/constants/drawing';
import { durations } from '@/constants/motion';

interface JourneyTimelineProps {
  /** Where the train sits along the line, 0…1. */
  progress?: number;
  lineColor: string;
  dashColor: string;
  trainColor: string;
  /** Colour cut out of the train glyph for its window and stripe. */
  backgroundColor: string;
  /** "card": hollow start dot (journey card). "ticket": solid start, hollow end (ticket). */
  variant?: 'card' | 'ticket';
  animate?: boolean;
}

const MIDPOINT = 0.5;
const START = 0;
const CANVAS_HEIGHT = geo.height + borderWidths.thick;
const TRAIN = Skia.Path.MakeFromSVGString(geo.trainPath)!;
const WINDOW = Skia.Path.MakeFromSVGString(geo.windowPath)!;

/**
 * The departure → arrival line with a train glyph, drawn with Skia. On first render the train
 * glides into place (skipped when the user prefers reduced motion).
 */
export function JourneyTimeline({
  progress = MIDPOINT,
  lineColor,
  dashColor,
  trainColor,
  backgroundColor,
  variant = 'card',
  animate = true,
}: JourneyTimelineProps) {
  const [width, setWidth] = useState(0);
  const reduceMotion = useReducedMotion();
  const shouldAnimate = animate && !reduceMotion;
  const position = useSharedValue(shouldAnimate ? START : progress);

  useEffect(() => {
    position.value = shouldAnimate ? withTiming(progress, { duration: durations.timeline, easing: Easing.out(Easing.cubic) }) : progress;
  }, [position, progress, shouldAnimate]);

  const start = geo.dotRadius + borderWidths.thin;
  const end = Math.max(width - geo.dotRadius - borderWidths.thin, start);
  const y = CANVAS_HEIGHT / 2;
  const trainX = useDerivedValue(() => start + (end - start - geo.trainWidth) * position.value);
  const solidEnd = useDerivedValue(() => vec(trainX.value + geo.trainLeadIn, y));
  const dashStart = useDerivedValue(() => vec(trainX.value + geo.trainWidth, y));
  const trainTransform = useDerivedValue(() => [{ translateX: trainX.value }, { translateY: y - geo.trainYOffset }]);

  return (
    <View
      style={{ height: CANVAS_HEIGHT }}
      onLayout={(event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width)}
      accessible={false}
    >
      {width > 0 ? (
        <Canvas style={{ width, height: CANVAS_HEIGHT }}>
          <Line p1={vec(start, y)} p2={solidEnd} color={lineColor} strokeWidth={geo.lineWidth} />
          <Line p1={dashStart} p2={vec(end, y)} color={dashColor} strokeWidth={geo.dashWidth}>
            <DashPathEffect intervals={[...geo.dashPattern]} />
          </Line>
          {variant === 'card' ? (
            <>
              <Circle cx={start} cy={y} r={geo.dotRadius} color={lineColor} style="stroke" strokeWidth={borderWidths.heavy} />
              <Circle cx={end} cy={y} r={geo.dotRadius} color={lineColor} />
            </>
          ) : (
            <>
              <Circle cx={start} cy={y} r={geo.dotRadius - borderWidths.thin} color={lineColor} />
              <Circle cx={end} cy={y} r={geo.dotRadius - borderWidths.thin} color={dashColor} style="stroke" strokeWidth={geo.dashWidth} />
            </>
          )}
          <Group transform={trainTransform}>
            <Path path={TRAIN} color={trainColor} />
            <Path path={WINDOW} color={backgroundColor} />
            <RoundedRect
              x={geo.stripe.x}
              y={geo.stripe.y}
              width={geo.stripe.width}
              height={geo.stripe.height}
              r={geo.stripe.radius}
              color={backgroundColor}
            />
          </Group>
        </Canvas>
      ) : null}
    </View>
  );
}
