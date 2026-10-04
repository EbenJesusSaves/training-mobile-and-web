// Course version (lesson 07) — prototype route; lesson 17 replaces it with the RailPass screen.
import { PrototypeScreen } from '@/prototype/prototype-screen';

export default function RoutePrototype() {
  return (
    <PrototypeScreen
      title="Station detail prototype"
      body="The add-a-feature playbook in lesson 17 completes this screen."
      href="/station-picker"
    />
  );
}
