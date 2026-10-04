// Course version (lesson 07) — prototype route; lesson 10 replaces it with the API-backed Home.
import { PrototypeScreen } from '@/prototype/prototype-screen';

export default function RoutePrototype() {
  // LIVE 07.1 — Link Home to /journeys/[id] with a typed href: a pathname plus params.
  return <PrototypeScreen title="Home prototype" body="Pick a journey and follow the route flow." />;
}
