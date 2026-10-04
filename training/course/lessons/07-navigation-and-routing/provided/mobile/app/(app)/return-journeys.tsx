// Course version (lesson 07) — prototype route; lesson 10 replaces it with the RailPass screen.
import { PrototypeScreen } from '@/prototype/prototype-screen';

export default function RoutePrototype() {
  return <PrototypeScreen title="Return journeys" body="Round trips reuse the same route shape." href="/checkout" />;
}
