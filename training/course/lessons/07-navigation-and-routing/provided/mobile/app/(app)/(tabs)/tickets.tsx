// Course version (lesson 07) — prototype route; lesson 10 replaces it with the RailPass screen.
import { PrototypeScreen } from '@/prototype/prototype-screen';

export default function RoutePrototype() {
  return (
    <PrototypeScreen title="Tickets prototype" body="Booked trips will appear here once checkout is wired." href="/tickets/ticket_001" />
  );
}
