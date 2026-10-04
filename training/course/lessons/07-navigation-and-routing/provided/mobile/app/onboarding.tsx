// Course version (lesson 07) — prototype route; lesson 09 replaces it with the RailPass screen.
import { PrototypeScreen } from '@/prototype/prototype-screen';

export default function RoutePrototype() {
  return (
    <PrototypeScreen
      title="Onboarding prototype"
      body="Guarded: shown only until onboarding is complete. Lesson 09 keeps that flag in the preferences store."
    />
  );
}
