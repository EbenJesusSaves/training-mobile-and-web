import { useMemo, useRef, useState } from 'react';
import {
  FlatList,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import LottieView, { type AnimationObject } from 'lottie-react-native';

import { AppText } from '@/components/atomic/app-text';
import { useTheme } from '@/components/theme/theme-provider';
import { Button } from '@/components/ui/buttons/button';

import { swapNeutralColors } from '@/libs/lottie';
import { usePreferencesStore } from '@/store/preferences-store';

import { layout } from '@/constants/layout';
import { radii } from '@/constants/radii';
import { hitSlop, sizes } from '@/constants/sizes';
import { spacing } from '@/constants/spacing';

interface Slide {
  key: string;
  animation: AnimationObject;
  title: string;
  highlight: string;
  body: string;
}

// Animations from LottieFiles (Lottie Simple License): #1511463, #1026491, #136718.
const SLIDES: Slide[] = [
  {
    key: 'search',
    animation: require('../assets/lottie/train.json'),
    title: 'Intercity trains,',
    highlight: 'booked in seconds',
    body: 'Search departures across the network, compare fares and see how many seats are left.',
  },
  {
    key: 'seat',
    animation: require('../assets/lottie/seat-selection.json'),
    title: 'Pick the seat',
    highlight: 'that suits you',
    body: 'Choose your class, car and seat on a live seat map. Add luggage or extra passengers as you go.',
  },
  {
    key: 'ticket',
    animation: require('../assets/lottie/ticket.json'),
    title: 'Your ticket,',
    highlight: 'always with you',
    body: 'Show the barcode at the gate or download a PDF. Trip changes appear in your updates.',
  },
];

const FIRST_SLIDE = 0;
const NEXT = 1;

export default function OnboardingScreen() {
  const { colors, scheme } = useTheme();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(FIRST_SLIDE);
  const listRef = useRef<FlatList<Slide>>(null);
  const completeOnboarding = usePreferencesStore((state) => state.completeOnboarding);
  const isLast = index === SLIDES.length - NEXT;
  // The illustrations are drawn for light backgrounds; flip their black/white parts in dark mode.
  const animations = useMemo(
    () =>
      SLIDES.map((slide) =>
        scheme === 'dark' ? swapNeutralColors(slide.animation, { dark: colors.ink, light: colors.surfaceRaised }) : slide.animation,
      ),
    [scheme, colors.ink, colors.surfaceRaised],
  );
  const animationSize = Math.min(width - layout.screenGutter * 2, sizes.onboardingAnimation);

  const onScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => setIndex(Math.round(event.nativeEvent.contentOffset.x / width));
  const next = () => {
    if (isLast) completeOnboarding();
    else listRef.current?.scrollToIndex({ index: index + NEXT, animated: true });
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.canvas, paddingTop: insets.top }]}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <View style={styles.topBar}>
        <AppText variant="labelStrong">RailPass</AppText>
        {isLast ? null : (
          <Pressable accessibilityRole="button" hitSlop={hitSlop.md} onPress={completeOnboarding}>
            <AppText variant="labelStrong" tone="secondary">
              Skip
            </AppText>
          </Pressable>
        )}
      </View>
      <FlatList
        ref={listRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(slide) => slide.key}
        onMomentumScrollEnd={onScrollEnd}
        getItemLayout={(_, itemIndex) => ({ length: width, offset: width * itemIndex, index: itemIndex })}
        renderItem={({ item, index: slideIndex }) => (
          <View style={[styles.slide, { width }]}>
            <View style={styles.art} accessible={false} importantForAccessibility="no-hide-descendants">
              <LottieView source={animations[slideIndex]} autoPlay loop style={{ width: animationSize, height: animationSize }} />
            </View>
            <View style={styles.textBlock}>
              <AppText variant="display" align="center" accessibilityRole="header">
                {item.title}
                {'\n'}
                <AppText variant="display" tone="accent">
                  {item.highlight}
                </AppText>
              </AppText>
              <AppText variant="body" tone="secondary" align="center">
                {item.body}
              </AppText>
            </View>
          </View>
        )}
      />
      <View style={[styles.footer, { paddingBottom: insets.bottom + layout.sectionGap }]}>
        <View style={styles.dots} accessible accessibilityLabel={`Step ${index + NEXT} of ${SLIDES.length}`}>
          {SLIDES.map((slide, slideIndex) => (
            <View
              key={slide.key}
              style={[
                styles.dot,
                slideIndex === index && styles.dotActive,
                { backgroundColor: slideIndex === index ? colors.ink : colors.line },
              ]}
            />
          ))}
        </View>
        <Button title={isLast ? 'Get started' : 'Continue'} variant={scheme === 'dark' ? 'primary' : 'dark'} onPress={next} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenGutter,
    minHeight: sizes.touchTarget,
  },
  slide: { flex: 1, justifyContent: 'center', gap: layout.sectionGap },
  art: { alignItems: 'center', justifyContent: 'center' },
  textBlock: { paddingHorizontal: layout.screenGutter, gap: spacing.md },
  footer: { paddingHorizontal: layout.screenGutter, gap: layout.sectionGap },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: spacing.xs },
  dot: { width: sizes.pagerDot, height: sizes.pagerDot, borderRadius: radii.pill },
  dotActive: { width: sizes.pagerDotActive },
});
