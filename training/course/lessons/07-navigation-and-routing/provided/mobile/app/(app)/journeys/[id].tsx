// Course version (lesson 07) — prototype route; lesson 10 replaces it with the RailPass journey screen.
import { PrototypeScreen } from '@/prototype/prototype-screen';

export default function RoutePrototype() {
  // LIVE 07.2 — Read the typed id param with useLocalSearchParams and show it in the body.
  return <PrototypeScreen title="Journey detail" body="Read the route id, then move toward checkout." href="/checkout" />;
}
