// Course-only playground (lesson 05) — lesson 07 deletes it when the real routes arrive.
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/atomic/app-text';
import { Screen } from '@/components/layout/screen';
import { useTheme } from '@/components/theme/theme-provider';

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

// LIVE 05.2 — Replace the raw gap, radius and border numbers with spacing, radii and borderWidths tokens.
const styles = StyleSheet.create({
  stack: { gap: 24 },
  swatches: { flexDirection: 'row', gap: 8 },
  swatch: { height: 56, width: 56, borderRadius: 16, borderWidth: 1 },
});
