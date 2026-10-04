// Course version (lesson 07) — prototype route; lesson 11 replaces it with the RailPass screen.
import { PrototypeScreen } from '@/prototype/prototype-screen';

export default function RoutePrototype() {
  return <PrototypeScreen title="Ticket detail" body="The boarding pass arrives with checkout in lesson 11." href="/updates" />;
}
