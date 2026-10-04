// DELIBERATELY FLAWED – teaching example, not used by the apps.
// Problem: index keys and inline-heavy render work make reordering and large lists fragile.

import { FlatList, Pressable, Text } from 'react-native';

type Journey = { id: string; trainNumber: string; departureAt: string };

export function SlowJourneyList({ journeys, onOpen }: { journeys: Journey[]; onOpen: (id: string) => void }) {
  return (
    <FlatList
      data={journeys}
      keyExtractor={(_, index) => String(index)}
      renderItem={({ item }) => (
        <Pressable onPress={() => onOpen(item.id)}>
          <Text>{new Date(item.departureAt).toLocaleString()} · {item.trainNumber}</Text>
        </Pressable>
      )}
    />
  );
}
