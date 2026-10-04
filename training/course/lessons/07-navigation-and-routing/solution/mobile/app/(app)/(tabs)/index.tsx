// Course version (lesson 07) — prototype route; lesson 10 replaces it with the API-backed Home.
import { PrototypeScreen } from '@/prototype/prototype-screen';

export default function RoutePrototype() {
  return (
    <PrototypeScreen
      title="Home prototype"
      body="Pick a journey and follow the route flow."
      href={{ pathname: '/journeys/[id]', params: { id: 'jrny_001' } }}
    />
  );
}
