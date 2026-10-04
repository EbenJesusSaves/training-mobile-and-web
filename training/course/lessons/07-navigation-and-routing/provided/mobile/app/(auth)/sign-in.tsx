// Course version (lesson 07) — prototype route; lesson 09 connects it to the session store.
import { router } from 'expo-router';

import { Button } from '@/components/ui/buttons/button';

import { PrototypeScreen } from '@/prototype/prototype-screen';

export default function RoutePrototype() {
  return (
    <PrototypeScreen
      title="Sign in prototype"
      body="Guarded: reachable only while signed out. Lesson 09 signs in through the session store."
    >
      <Button title="Create an account" variant="secondary" onPress={() => router.push('/sign-up')} />
      <Button title="Forgot password?" variant="ghost" onPress={() => router.push('/forgot-password')} />
    </PrototypeScreen>
  );
}
