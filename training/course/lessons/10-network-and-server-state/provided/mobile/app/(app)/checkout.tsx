// Course version (lesson 10) — still a prototype; lesson 11 replaces it with the RailPass checkout.
import { PrototypeScreen } from '@/prototype/prototype-screen';

export default function RoutePrototype() {
  return (
    <PrototypeScreen
      title="Checkout prototype"
      body="Your journey and seats are in the booking draft store. Lesson 11 sends them to the API as a booking."
    />
  );
}
