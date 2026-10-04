// Course version (lesson 07) — prototype route; lesson 12 replaces it with the RailPass screen.
import { PrototypeScreen } from '@/prototype/prototype-screen';

export default function RoutePrototype() {
  return <PrototypeScreen title="Reset password prototype" body="The code flow arrives with auth sessions." href="/sign-in" />;
}
