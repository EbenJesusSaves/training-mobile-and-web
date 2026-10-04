// Course version (lesson 07) — prototype route; lesson 12 replaces it with the RailPass screen.
import { PrototypeScreen } from '@/prototype/prototype-screen';

export default function RoutePrototype() {
  return <PrototypeScreen title="Forgot password prototype" body="Reset flows arrive with auth sessions." href="/reset-password" />;
}
