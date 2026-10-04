// DELIBERATELY FLAWED – teaching example, not used by the apps.
// Problem: fetching, formatting, filtering, rendering and styling are all mixed into one component.

import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

type Journey = { id: string; origin: string; destination: string; departureAt: string; fareCents: number };

export function GodBookingScreen({ api }: { api: { journeys(): Promise<Journey[]> } }) {
  const [items, setItems] = useState<Journey[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    void api.journeys().then(setItems).catch(() => setItems([]));
  }, [api]);

  return (
    <View style={{ padding: 17, backgroundColor: '#eee' }}>
      {items
        .filter((journey) => `${journey.origin}${journey.destination}`.toLowerCase().includes(query.toLowerCase()))
        .map((journey) => (
          <Pressable key={journey.id} style={{ marginBottom: 11, borderRadius: 21, padding: 18, backgroundColor: '#fff' }}>
            <Text>{journey.origin} → {journey.destination}</Text>
            <Text>{new Date(journey.departureAt).toLocaleTimeString()} · GHS {(journey.fareCents / 100).toFixed(2)}</Text>
          </Pressable>
        ))}
    </View>
  );
}
