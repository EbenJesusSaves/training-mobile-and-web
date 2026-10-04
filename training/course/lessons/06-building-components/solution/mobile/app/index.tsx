// Course-only playground (lesson 06) — lesson 07 deletes it when the real routes arrive.
import { FlatList, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/atomic/app-text';
import { Screen } from '@/components/layout/screen';
import { Button } from '@/components/ui/buttons/button';
import { StatusChip } from '@/components/ui/display/status-chip';
import { JourneyCard } from '@/features/booking/journey-card';

import { prototypeJourneys } from '@/prototype/fixtures';

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
        <FlatList
          data={prototypeJourneys}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <JourneyCard journey={item} passengers={1} onSelectClass={() => undefined} />}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({ stack: { gap: spacing.lg } });
