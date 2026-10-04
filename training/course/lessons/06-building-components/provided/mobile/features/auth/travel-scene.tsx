import { memo, useEffect } from 'react';
import { useWindowDimensions } from 'react-native';
import { Easing, useDerivedValue, useReducedMotion, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { Canvas, Circle, DashPathEffect, Group, Oval, Path, Rect, RoundedRect } from '@shopify/react-native-skia';

import { useTheme } from '@/components/theme/theme-provider';

import {
  type IllustrationPalette,
  illustrationPalettes,
  sceneLayout as layout,
  scenePaths as paths,
  sceneSize,
} from '@/constants/illustration';
import { durations } from '@/constants/motion';

export type SceneVariant = 'station' | 'journey' | 'clouds';

interface TravelSceneProps {
  variant: SceneVariant;
  /** Canvas height in points; the scene is scaled to the screen width and anchored to the bottom. */
  height: number;
}

const REPEAT_FOREVER = -1;
const ORIGIN = 0;

/**
 * Illustrated travel scene for the sign-in screens, drawn with Skia from the shapes in
 * constants/illustration.ts. Clouds drift slowly (static when reduced motion is on).
 */
export const TravelScene = memo(function TravelScene({ variant, height }: TravelSceneProps) {
  const { scheme } = useTheme();
  const { width } = useWindowDimensions();
  const palette = illustrationPalettes[scheme];
  const reduceMotion = useReducedMotion();
  const drift = useSharedValue(ORIGIN);

  useEffect(() => {
    if (reduceMotion) return;
    drift.value = withRepeat(
      withTiming(layout.cloudDrift, { duration: durations.cloudDrift, easing: Easing.inOut(Easing.sin) }),
      REPEAT_FOREVER,
      true,
    );
  }, [drift, reduceMotion]);

  const scale = width / sceneSize.width;
  const offsetY = height - sceneSize.height * scale;
  const cloudTransform = useDerivedValue(() => [{ translateX: drift.value }]);

  return (
    <Canvas style={{ width, height }} accessible={false}>
      <Rect x={ORIGIN} y={ORIGIN} width={width} height={height} color={palette.sky} />
      <Group transform={[{ translateY: offsetY }, { scale }]}>
        <Group transform={cloudTransform}>
          {layout.clouds.map((cloud) => (
            <Cloud key={`${cloud.x}-${cloud.y}`} x={cloud.x} y={cloud.y} scale={cloud.scale} color={palette.cloud} />
          ))}
        </Group>
        {variant === 'clouds' ? null : (
          <>
            <Path path={paths.mountainBack} color={palette.mountainBack} />
            <Path path={paths.mountainFront} color={palette.mountainFront} />
            <Path path={paths.ground} color={palette.ground} />
            <Tree palette={palette} />
            {variant === 'station' ? <StopSign palette={palette} /> : <JourneyPath palette={palette} />}
            <Suitcase palette={palette} at={variant === 'station' ? layout.traveller : layout.travellerForgot} />
            <Traveller
              palette={palette}
              at={variant === 'station' ? layout.traveller : layout.travellerForgot}
              withHat={variant === 'journey'}
            />
          </>
        )}
      </Group>
    </Canvas>
  );
});

function Cloud({ x, y, scale, color }: { x: number; y: number; scale: number; color: string }) {
  const { cloudPuffs, cloudBase } = layout;
  return (
    <Group transform={[{ translateX: x }, { translateY: y }, { scale }]}>
      {cloudPuffs.map((puff) => (
        <Circle key={`${puff.dx}-${puff.dy}`} cx={puff.dx} cy={puff.dy} r={puff.r} color={color} />
      ))}
      <RoundedRect x={cloudBase.dx} y={cloudBase.dy} width={cloudBase.width} height={cloudBase.height} r={cloudBase.radius} color={color} />
    </Group>
  );
}

function Tree({ palette }: { palette: IllustrationPalette }) {
  const { tree } = layout;
  return (
    <>
      <Rect x={tree.trunkX} y={tree.trunkY} width={tree.trunkWidth} height={tree.trunkHeight} color={palette.trunk} />
      <Oval
        x={tree.canopyX - tree.canopyRx}
        y={tree.canopyY - tree.canopyRy}
        width={tree.canopyRx * 2}
        height={tree.canopyRy * 2}
        color={palette.tree}
      />
    </>
  );
}

function StopSign({ palette }: { palette: IllustrationPalette }) {
  const { sign } = layout;
  return (
    <>
      <Path path={paths.signPost} color={palette.signPost} />
      <RoundedRect x={sign.boardX} y={sign.boardY} width={sign.size} height={sign.size} r={sign.radius} color={palette.signBoard} />
      <RoundedRect
        x={sign.boardX + sign.innerInset}
        y={sign.boardY + sign.innerInset}
        width={sign.size - sign.innerInset * 2}
        height={sign.size - sign.innerInset * 2}
        r={sign.innerRadius}
        color={palette.signIcon}
      />
      <Group transform={[{ translateX: sign.iconX }, { translateY: sign.iconY }, { scale: sign.iconScale }]}>
        <Path path={paths.trainFront} color={palette.signBoard} />
        <Path path={paths.trainWindow} color={palette.signIcon} />
      </Group>
    </>
  );
}

function JourneyPath({ palette }: { palette: IllustrationPalette }) {
  return (
    <>
      <Path path={paths.journeyPath} color={palette.path} style="stroke" strokeWidth={layout.pathWidth}>
        <DashPathEffect intervals={[...layout.pathDash]} />
      </Path>
      <Group transform={[{ translateX: layout.plane.x }, { translateY: layout.plane.y }, { rotate: layout.plane.rotate }]}>
        <Path path={paths.plane} color={palette.path} />
      </Group>
      {layout.sparkles.map((sparkle) => (
        <Circle
          key={`${sparkle.x}-${sparkle.y}`}
          cx={sparkle.x}
          cy={sparkle.y}
          r={sparkle.r}
          color={palette.sparkle}
          style="stroke"
          strokeWidth={layout.pathWidth}
        />
      ))}
    </>
  );
}

function Suitcase({ palette, at }: { palette: IllustrationPalette; at: { x: number; y: number } }) {
  const { suitcase } = layout;
  return (
    <Group transform={[{ translateX: at.x }, { translateY: at.y }]}>
      <Rect x={suitcase.handleDx} y={suitcase.handleDy} width={suitcase.handleWidth} height={suitcase.handleHeight} color={palette.shoes} />
      <RoundedRect
        x={suitcase.dx}
        y={suitcase.dy}
        width={suitcase.width}
        height={suitcase.height}
        r={suitcase.radius}
        color={palette.suitcase}
      />
      <Rect x={suitcase.dx} y={suitcase.stripeDy} width={suitcase.width} height={suitcase.stripeHeight} color={palette.suitcaseStripe} />
      <Circle cx={suitcase.dx + suitcase.wheelR * 2} cy={suitcase.dy + suitcase.height} r={suitcase.wheelR} color={palette.shoes} />
      <Circle
        cx={suitcase.dx + suitcase.width - suitcase.wheelR * 2}
        cy={suitcase.dy + suitcase.height}
        r={suitcase.wheelR}
        color={palette.shoes}
      />
    </Group>
  );
}

function Traveller({ palette, at, withHat }: { palette: IllustrationPalette; at: { x: number; y: number }; withHat: boolean }) {
  const { head, neck, legs, shoes, hands, armWidth } = layout;
  return (
    <Group transform={[{ translateX: at.x }, { translateY: at.y }]}>
      {legs.map((leg) => (
        <Rect key={leg.dx} x={leg.dx} y={leg.dy} width={leg.width} height={leg.height} color={palette.skin} />
      ))}
      {shoes.map((shoe) => (
        <Oval key={shoe.dx} x={shoe.dx - shoe.rx} y={shoe.dy - shoe.ry} width={shoe.rx * 2} height={shoe.ry * 2} color={palette.shoes} />
      ))}
      <Path path={paths.skirt} color={palette.skirt} />
      <Path path={paths.backpack} color={palette.backpack} />
      <Path path={paths.jacket} color={palette.jacket} />
      <Path path={paths.lowerArm} color={palette.jacket} style="stroke" strokeWidth={armWidth} strokeCap="round" />
      <Path path={paths.wavingArm} color={palette.jacket} style="stroke" strokeWidth={armWidth} strokeCap="round" />
      {hands.map((hand) => (
        <Circle key={hand.dx} cx={hand.dx} cy={hand.dy} r={hand.r} color={palette.skin} />
      ))}
      <Rect x={neck.dx} y={neck.dy} width={neck.width} height={neck.height} color={palette.skin} />
      <Circle cx={head.dx} cy={head.dy} r={head.r} color={palette.skin} />
      <Path path={paths.hair} color={palette.hair} />
      {withHat ? <Path path={paths.hat} color={palette.hat} /> : <Path path={paths.bun} color={palette.hair} />}
    </Group>
  );
}
