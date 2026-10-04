// DELIBERATELY FLAWED – teaching example, not used by the apps.
// Problem: hard-coded colours, spacing, radii and font sizes bypass RailPass tokens.

import { Pressable, Text, View } from 'react-native';

export function HardCodedJourneyCard() {
  return (
    <Pressable style={{ backgroundColor: '#FF4D5A', borderRadius: 27, padding: 19, margin: 13 }}>
      <View style={{ borderBottomWidth: 1, borderBottomColor: '#222', paddingBottom: 7 }}>
        <Text style={{ color: '#fff', fontSize: 22, fontWeight: '700' }}>Accra → Kumasi</Text>
      </View>
      <Text style={{ color: '#fff', opacity: 0.7, fontSize: 11 }}>Leaves 12:00</Text>
    </Pressable>
  );
}
