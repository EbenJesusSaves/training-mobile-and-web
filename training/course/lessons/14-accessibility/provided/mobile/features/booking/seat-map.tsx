import { memo, useEffect, useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useDerivedValue,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Canvas, Circle, Group, Line, Oval, Path, rect, RoundedRect, rrect, Skia, vec } from '@shopify/react-native-skia';

import { AppText } from '@/components/atomic/app-text';
import { useTheme } from '@/components/theme/theme-provider';

import { type SeatPosition, seatPositions } from '@/libs/seat-layout';

import { borderWidths } from '@/constants/borders';
import { seatMapGeometry as geo } from '@/constants/drawing';
import { layout } from '@/constants/layout';
import { durations, scales, springs } from '@/constants/motion';
import { opacity } from '@/constants/opacity';

import type { SeatMapCar, SeatRef } from '@/api/types';

const OFFSCREEN = -geo.seat * 2;
const PULSE_START = 0;
const PULSE_END = 1;
const HALF = 0.5;

const compartmentX = (index: number) => geo.noseWidth + geo.noseInset + index * (geo.compartmentWidth + geo.compartmentGap);
const seatOrigin = (seat: SeatPosition) => ({
  x: compartmentX(seat.compartment) + geo.paddingX + seat.column * (geo.seat + geo.columnGap),
  y: geo.top + geo.paddingY + seat.row * geo.rowPitch,
});
const windshieldRect = rect(geo.windshield.x, geo.height / 2 - geo.windshield.offsetY, geo.windshield.width, geo.windshield.height);

interface SeatMapProps {
  car: SeatMapCar;
  selected: SeatRef[];
  onToggle: (seat: SeatRef) => void;
}

/**
 * Drawing (car body, compartments, hatched unavailable seats, selection pulse) is Skia.
 * Seats you can interact with are native Pressables on top, so they keep screen-reader labels,
 * focus and hit areas. Unavailable seats are shown by shape (hatching, no number), not colour.
 */
export const SeatMap = memo(function SeatMap({ car, selected, onToggle }: SeatMapProps) {
  const { colors } = useTheme();
  const reduceMotion = useReducedMotion();
  const seats = useMemo(() => seatPositions(car.compartments), [car.compartments]);
  const taken = useMemo(() => new Set(car.takenSeats), [car.takenSeats]);
  const selectedInCar = useMemo(() => selected.filter((seat) => seat.carNumber === car.carNumber), [car.carNumber, selected]);
  const selectedNumbers = useMemo(() => new Set(selectedInCar.map((seat) => seat.seatNumber)), [selectedInCar]);
  const width = compartmentX(car.compartments) + geo.tail;

  const body = useMemo(() => carBodyPath(width, geo.height, 0), [width]);
  const interior = useMemo(() => carBodyPath(width, geo.height, geo.bodyInset), [width]);
  const windshieldClip = useMemo(() => {
    const path = Skia.Path.Make();
    path.addOval(windshieldRect);
    return path;
  }, []);

  // Pulse ring around the most recently selected seat.
  const lastSelected = selectedInCar.at(-1);
  const pulseSeat = lastSelected ? seats.find((seat) => seat.seatNumber === lastSelected.seatNumber) : undefined;
  const pulse = useSharedValue(PULSE_END);
  useEffect(() => {
    if (!pulseSeat || reduceMotion) return;
    pulse.value = PULSE_START;
    pulse.value = withTiming(PULSE_END, { duration: durations.pulse, easing: Easing.out(Easing.quad) });
  }, [pulse, pulseSeat, reduceMotion]);
  const pulseCenter = pulseSeat ? seatOrigin(pulseSeat) : { x: OFFSCREEN, y: OFFSCREEN };
  const pulseRadius = useDerivedValue(() => geo.seat * HALF + pulse.value * geo.pulseGrowth);
  const pulseOpacity = useDerivedValue(() => (PULSE_END - pulse.value) * opacity.pulse);

  const { windshield } = geo;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scroll}
      accessibilityLabel={`Seat map for car ${car.carNumber}`}
    >
      <View style={{ width, height: geo.height }}>
        <Canvas style={{ width, height: geo.height }} accessible={false}>
          <Path path={body} color={colors.carBody} />
          <Path path={interior} color={colors.carInterior} />
          <Group clip={windshieldClip}>
            <Oval rect={windshieldRect} color={colors.seatHatchBackground} />
            {Array.from({ length: windshield.lines }, (_, index) => (
              <Line
                key={index}
                p1={vec(
                  windshield.lineStartX,
                  geo.height / 2 - windshield.offsetY - windshield.lineRise / 2 + index * windshield.lineSpacing,
                )}
                p2={vec(
                  windshield.lineEndX,
                  geo.height / 2 - windshield.offsetY - windshield.lineRise * 1.5 + index * windshield.lineSpacing,
                )}
                color={colors.seatHatch}
                strokeWidth={windshield.lineWidth}
              />
            ))}
          </Group>
          {Array.from({ length: car.compartments }, (_, index) => {
            const box = rrect(
              rect(compartmentX(index), geo.top, geo.compartmentWidth, geo.compartmentHeight),
              geo.compartmentRadius,
              geo.compartmentRadius,
            );
            return (
              <Group key={index}>
                <RoundedRect rect={box} color={colors.seatCompartment} />
                <RoundedRect rect={box} color={colors.line} style="stroke" strokeWidth={borderWidths.thin} />
              </Group>
            );
          })}
          <RoundedRect
            rect={rrect(
              rect(
                compartmentX(0),
                geo.top + geo.compartmentHeight + geo.corridorGap,
                width - compartmentX(0) - geo.corridorEndInset,
                geo.corridorHeight,
              ),
              geo.corridorRadius,
              geo.corridorRadius,
            )}
            color={colors.seatTaken}
          />
          {seats
            .filter((seat) => taken.has(seat.seatNumber))
            .map((seat) => (
              <HatchedSeat key={seat.seatNumber} seat={seat} color={colors.seatHatch} background={colors.seatHatchBackground} />
            ))}
          {pulseSeat ? (
            <Circle
              cx={pulseCenter.x + geo.seat * HALF}
              cy={pulseCenter.y + geo.seat * HALF}
              r={pulseRadius}
              color={colors.accentStrong}
              style="stroke"
              strokeWidth={geo.pulseStroke}
              opacity={pulseOpacity}
            />
          ) : null}
        </Canvas>

        {seats.map((seat) => (
          <SeatButton
            key={seat.seatNumber}
            seat={seat}
            isTaken={taken.has(seat.seatNumber)}
            isSelected={selectedNumbers.has(seat.seatNumber)}
            colors={{
              available: colors.accent,
              availableText: colors.onAccent,
              selected: colors.seatSelected,
              selectedText: colors.onSeatSelected,
            }}
            onPress={() => onToggle({ carNumber: car.carNumber, seatNumber: seat.seatNumber })}
          />
        ))}
      </View>
    </ScrollView>
  );
});

function HatchedSeat({ seat, color, background }: { seat: SeatPosition; color: string; background: string }) {
  const { x, y } = seatOrigin(seat);
  const { hatch } = geo;
  const clip = useMemo(() => rrect(rect(x, y, geo.seat, geo.seat), geo.seatRadius, geo.seatRadius), [x, y]);
  return (
    <Group clip={clip}>
      <RoundedRect rect={clip} color={background} />
      {Array.from({ length: hatch.lines }, (_, index) => (
        <Line
          key={index}
          p1={vec(x - hatch.spacing + index * hatch.spacing, y + geo.seat + hatch.overshoot)}
          p2={vec(x + hatch.rise - hatch.spacing + index * hatch.spacing, y - hatch.overshoot)}
          color={color}
          strokeWidth={hatch.lineWidth}
        />
      ))}
    </Group>
  );
}

interface SeatButtonProps {
  seat: SeatPosition;
  isTaken: boolean;
  isSelected: boolean;
  colors: { available: string; availableText: string; selected: string; selectedText: string };
  onPress: () => void;
}

const SeatButton = memo(function SeatButton({ seat, isTaken, isSelected, colors, onPress }: SeatButtonProps) {
  const { x, y } = seatOrigin(seat);
  const reduceMotion = useReducedMotion();
  const scale = useSharedValue<number>(scales.rest);

  useEffect(() => {
    if (isSelected && !reduceMotion) {
      scale.value = withSequence(withTiming(scales.seatPress, { duration: durations.press }), withSpring(scales.rest, springs.seat));
    }
  }, [isSelected, reduceMotion, scale]);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  // LIVE 14.1 — Add accessible labels, roles, state and hitSlop to seat buttons.
  const position = { left: x, top: y };
  if (isTaken) {
    return <View style={[styles.seat, position]} />;
  }

  const background = isSelected ? colors.selected : colors.available;
  // The backrest sits on the outer side of each facing pair, as in the reference.
  const backrestLeft = seat.column === 0 ? x - geo.backrestWidth - geo.backrestGap : x + geo.seat + geo.backrestGap;
  return (
    <>
      <View style={[styles.backrest, { left: backrestLeft, top: y + (geo.seat - geo.backrestHeight) / 2, backgroundColor: background }]} />
      <Animated.View style={[styles.seat, position, animatedStyle]}>
        <Pressable onPress={onPress} style={[styles.seatInner, { backgroundColor: background }]}>
          <AppText variant="labelStrong" color={isSelected ? colors.selectedText : colors.availableText}>
            {seat.seatNumber}
          </AppText>
        </Pressable>
      </Animated.View>
    </>
  );
});

/** Train-car outline with a rounded bullet nose on the left. `inset` draws the inner panel. */
function carBodyPath(width: number, height: number, inset: number) {
  const path = Skia.Path.Make();
  const top = inset;
  const bottom = height - inset;
  const right = width - inset;
  const left = inset;
  const nose = geo.noseWidth - inset * geo.noseShoulder * 2;
  const corner = geo.bodyCorner - inset;
  const middle = height / 2;
  path.moveTo(nose, top);
  path.lineTo(right - corner, top);
  path.quadTo(right, top, right, top + corner);
  path.lineTo(right, bottom - corner);
  path.quadTo(right, bottom, right - corner, bottom);
  path.lineTo(nose, bottom);
  path.cubicTo(left + nose * geo.noseCurve, bottom, left, height * (1 - geo.noseShoulder), left, middle);
  path.cubicTo(left, height * geo.noseShoulder, left + nose * geo.noseCurve, top, nose, top);
  path.close();
  return path;
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: layout.screenGutter },
  seat: { position: 'absolute', width: geo.seat, height: geo.seat },
  seatInner: { flex: 1, borderRadius: geo.seatRadius, alignItems: 'center', justifyContent: 'center' },
  backrest: { position: 'absolute', width: geo.backrestWidth, height: geo.backrestHeight, borderRadius: geo.backrestWidth / 2 },
});
