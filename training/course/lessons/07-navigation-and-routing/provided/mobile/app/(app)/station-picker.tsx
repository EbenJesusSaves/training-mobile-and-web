// Course version (lesson 07) — prototype route; lesson 10 replaces it with the RailPass screen.
import { PrototypeScreen } from '@/prototype/prototype-screen';

export default function RoutePrototype() {
  return <PrototypeScreen title="Station picker" body="Typed routes keep this pushed screen connected to Home." href="/sort" />;
}
