// Course version (lesson 07) — prototype route; lesson 10 replaces it with the RailPass journey screen.
import { useLocalSearchParams } from 'expo-router';

import { PrototypeScreen } from '@/prototype/prototype-screen';

export default function RoutePrototype() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <PrototypeScreen title="Journey detail" body={`Journey id: ${id ?? 'missing'}`} href="/checkout" />;
}
