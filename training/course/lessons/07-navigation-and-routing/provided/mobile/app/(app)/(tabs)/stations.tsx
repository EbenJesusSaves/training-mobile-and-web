// Course version (lesson 07) — prototype route; lesson 10 replaces it with the RailPass screen.
import { PrototypeScreen } from '@/prototype/prototype-screen';

export default function RoutePrototype() {
  return <PrototypeScreen title="Stations prototype" body="Browse stations before the live API arrives." href="/stations/accra" />;
}
