// Course version (lesson 10) — signs in the seeded demo passenger through the API; lesson 11 builds the RailPass form.
import { useState } from 'react';
import { router } from 'expo-router';

import { Button } from '@/components/ui/buttons/button';
import { InlineAlert } from '@/components/ui/feedback/inline-alert';

import { authApi } from '@/api/auth-api';
import { toApiError } from '@/api/errors';
import { PrototypeScreen } from '@/prototype/prototype-screen';
import { useSessionStore } from '@/store/session-store';

/** A demo account from the RailPass README. Lesson 11 replaces this button with the real form. */
const DEMO_PASSENGER = { email: 'ama@railpass.dev', password: 'Passenger#2026' };

export default function SignInPrototype() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async () => {
    setIsPending(true);
    setError(null);
    try {
      const session = await authApi.signIn(DEMO_PASSENGER);
      useSessionStore.getState().signIn(session);
    } catch (caught) {
      setError(toApiError(caught).message);
      setIsPending(false);
    }
  };

  return (
    <PrototypeScreen title="Sign in prototype" body="Signs in the demo passenger through the API client.">
      {error ? <InlineAlert kind="error" title="Couldn’t sign in" message={error} /> : null}
      <Button title="Sign in as Ama (demo passenger)" onPress={signIn} loading={isPending} />
      <Button title="Create an account" variant="ghost" onPress={() => router.push('/sign-up')} />
    </PrototypeScreen>
  );
}
