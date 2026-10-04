// Course-only playground (lesson 06) — lesson 07 deletes it when the real routes arrive.
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/atomic/app-text';
import { Screen } from '@/components/layout/screen';
import { Button } from '@/components/ui/buttons/button';
import { StatusChip } from '@/components/ui/display/status-chip';

import { spacing } from '@/constants/spacing';

export default function ComponentPlaygroundScreen() {
  return (
    <Screen>
      <View style={styles.stack}>
        <AppText variant="label" tone="accent">
          Component system
        </AppText>
        <AppText variant="display">Compose small pieces into product UI.</AppText>
        <StatusChip kind="SCHEDULED" />
        <Button title="Primary action" onPress={() => undefined} />
        {/* LIVE 06.3 — Render prototype journeys with JourneyCard. */}
        <AppText tone="secondary">Journey cards arrive here during the live build.</AppText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({ stack: { gap: spacing.lg } });
