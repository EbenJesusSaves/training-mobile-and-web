import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/atomic/app-text';
import { useTheme } from '@/components/theme/theme-provider';
import { IconButton } from '@/components/ui/buttons/icon-button';

import { borderWidths } from '@/constants/borders';
import { layout } from '@/constants/layout';
import { radii } from '@/constants/radii';
import { sizes } from '@/constants/sizes';
import { spacing } from '@/constants/spacing';
import { ui } from '@/constants/ui';

import type { Station } from '@/api/types';

interface RouteCardProps {
  origin: Station | null;
  destination: Station | null;
  onPickOrigin: () => void;
  onPickDestination: () => void;
  onSwap: () => void;
}

/** "From / To" card with the dotted connector and swap button from the reference. */
export function RouteCard({ origin, destination, onPickOrigin, onPickDestination, onSwap }: RouteCardProps) {
  const { colors } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: colors.surfaceRaised, borderColor: colors.line }]}>
      <View style={styles.connector} accessible={false}>
        <View style={[styles.ring, { borderColor: colors.accentStrong }]} />
        <View style={styles.dots}>
          {Array.from({ length: ui.routeConnectorDots }, (_, index) => (
            <View key={index} style={[styles.dot, { backgroundColor: colors.accentStrong }]} />
          ))}
        </View>
        <View style={[styles.solid, { backgroundColor: colors.accentStrong }]} />
      </View>
      <View style={styles.fields}>
        <StationField label="From" station={origin} placeholder="Choose departure" onPress={onPickOrigin} />
        <View style={[styles.divider, { backgroundColor: colors.line }]} />
        <StationField label="To" station={destination} placeholder="Choose destination" onPress={onPickDestination} />
      </View>
      <View style={styles.swap}>
        <IconButton icon="swap" label="Swap departure and destination" onPress={onSwap} />
      </View>
    </View>
  );
}

function StationField({
  label,
  station,
  placeholder,
  onPress,
}: {
  label: string;
  station: Station | null;
  placeholder: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${station?.name ?? 'not chosen'}`}
      accessibilityHint="Opens the station list"
      onPress={onPress}
      style={styles.field}
    >
      <AppText variant="label" tone="muted">
        {label}
      </AppText>
      <AppText variant="subheading" tone={station ? 'ink' : 'muted'} numberOfLines={1}>
        {station?.name ?? placeholder}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: layout.cardRadius,
    borderWidth: borderWidths.hairline,
    paddingVertical: spacing.md,
    paddingLeft: layout.cardPadding,
    paddingRight: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  connector: { width: sizes.routeConnectorWidth, alignItems: 'center', alignSelf: 'stretch', paddingVertical: spacing.xl },
  ring: { width: sizes.routeDot, height: sizes.routeDot, borderRadius: radii.pill, borderWidth: borderWidths.heavy },
  dots: { flex: 1, justifyContent: 'space-evenly', paddingVertical: spacing.xxs },
  dot: { width: sizes.routeDash, height: sizes.routeDash, borderRadius: radii.pill },
  solid: { width: sizes.routeDot, height: sizes.routeDot, borderRadius: radii.pill },
  fields: { flex: 1, marginLeft: spacing.md },
  field: { paddingVertical: spacing.sm, gap: spacing.xxxs, minHeight: sizes.routeFieldMinHeight, justifyContent: 'center' },
  divider: { height: borderWidths.hairline, marginRight: spacing.sm },
  swap: { marginLeft: spacing.xs },
});
