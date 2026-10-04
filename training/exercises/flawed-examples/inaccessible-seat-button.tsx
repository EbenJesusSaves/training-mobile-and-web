// DELIBERATELY FLAWED – teaching example, not used by the apps.
// Problem: colour-only state, tiny target, no role, no label, no selected/disabled state.

import { Pressable, Text } from 'react-native';

export function InaccessibleSeatButton({ seatNumber, selected, taken, onPress }: { seatNumber: number; selected: boolean; taken: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={taken ? undefined : onPress} style={{ width: 28, height: 28, backgroundColor: taken ? '#ccc' : selected ? '#000' : '#0f0' }}>
      <Text>{taken ? '' : seatNumber}</Text>
    </Pressable>
  );
}
