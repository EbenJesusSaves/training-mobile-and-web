import { Image, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/atomic/app-text';
import { Icon } from '@/components/atomic/icon';
import { useTheme } from '@/components/theme/theme-provider';
import { cityImages } from '@/features/booking/city-images';

import { borderWidths } from '@/constants/borders';
import { layout } from '@/constants/layout';
import { opacity } from '@/constants/opacity';
import { radii } from '@/constants/radii';
import { iconSizes } from '@/constants/sizes';
import { spacing } from '@/constants/spacing';

import type { Station } from '@/api/types';

interface CityCardProps {
  station: Station;
  width: number;
  selected: boolean;
  /** The station already chosen for the other end of the trip; picking it swaps the two. */
  isOtherEnd: boolean;
  onPress: () => void;
}

export function CityCard({ station, width, selected, isOtherEnd, onPress }: CityCardProps) {
  const { colors } = useTheme();
  const image = cityImages[station.code];
  const detail = station.name !== station.city ? station.name : (station.address ?? station.name);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`${station.name}, ${station.city}${isOtherEnd ? ', currently the other end of your trip' : ''}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          width,
          backgroundColor: colors.surfaceRaised,
          borderColor: selected ? colors.accentStrong : colors.transparent,
          opacity: pressed ? opacity.pressed : opacity.full,
        },
      ]}
    >
      <View style={[styles.media, { backgroundColor: colors.surface }]}>
        {image ? <Image source={image} style={styles.image} resizeMode="cover" accessibilityIgnoresInvertColors /> : null}
        <View style={styles.badges}>
          <View style={[styles.chip, { backgroundColor: colors.surfaceRaised }]}>
            <AppText variant="labelStrong">{station.code}</AppText>
          </View>
          {selected ? (
            <View style={[styles.chip, { backgroundColor: colors.accent }]}>
              <Icon name="checkPlain" size={iconSizes.sm} color={colors.onAccent} />
            </View>
          ) : isOtherEnd ? (
            <View style={[styles.chip, { backgroundColor: colors.surfaceRaised }]}>
              <Icon name="swap" size={iconSizes.xs} color={colors.ink} />
              <AppText variant="caption">Will swap</AppText>
            </View>
          ) : null}
        </View>
      </View>
      <View style={styles.text}>
        <AppText variant="bodyStrong" numberOfLines={1}>
          {station.city}
        </AppText>
        <AppText variant="label" tone="muted" numberOfLines={1}>
          {detail}
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: layout.cardRadius, borderWidth: borderWidths.thick, overflow: 'hidden' },
  media: { aspectRatio: layout.cityImageAspectRatio },
  image: { width: '100%', height: '100%' },
  badges: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    right: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
  },
  text: { gap: spacing.xxxs, paddingHorizontal: spacing.md, paddingVertical: spacing.md },
});
