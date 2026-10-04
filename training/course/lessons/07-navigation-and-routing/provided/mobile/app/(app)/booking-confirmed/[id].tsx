// Course version (lesson 07) — prototype route; lesson 10 replaces it with the RailPass screen.
import { PrototypeScreen } from '@/prototype/prototype-screen';

export default function RoutePrototype() {
  return <PrototypeScreen title="Booking confirmed" body="The success screen links into the ticket." href="/tickets/demo" />;
}
