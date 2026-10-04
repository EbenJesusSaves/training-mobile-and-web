// Course version (lesson 01) — becomes the full RailPass version in lesson 09.
import { Stack } from 'expo-router';

export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
