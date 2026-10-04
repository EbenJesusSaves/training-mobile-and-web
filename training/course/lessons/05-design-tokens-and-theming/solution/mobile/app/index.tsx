// Course-only playground (lesson 05) — lesson 07 deletes it when the real routes arrive.
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/atomic/app-text';
import { Screen } from '@/components/layout/screen';
import { useTheme } from '@/components/theme/theme-provider';

import { borderWidths } from '@/constants/borders';
import { radii } from '@/constants/radii';
import { spacing } from '@/constants/spacing';

export default function TokenShowcaseScreen() {
  const { colors } = useTheme();
  const swatches = [colors.accent, colors.ink, colors.surfaceRaised, colors.danger, colors.warning];
  return (
    <Screen>
      <View style={styles.stack}>
        <AppText variant="label" tone="accent">
          RailPass tokens
        </AppText>
        <AppText variant="display">Design tokens scale the UI.</AppText>
        <AppText tone="secondary">Change theme values once; every component follows.</AppText>
        <View style={styles.swatches}>
          {swatches.map((color) => (
            <View key={color} style={[styles.swatch, { backgroundColor: color, borderColor: colors.line }]} />
          ))}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  stack: { gap: spacing.lg },
  swatches: { flexDirection: 'row', gap: spacing.sm },
  swatch: { height: 56, width: 56, borderRadius: radii.lg, borderWidth: borderWidths.hairline },
});
