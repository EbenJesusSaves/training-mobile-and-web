// Course version (lesson 09) — prototype sign-in through the session store; lesson 10 signs in through the API.
import { router } from 'expo-router';

import { Button } from '@/components/ui/buttons/button';

import { PrototypeScreen } from '@/prototype/prototype-screen';
import { useSessionStore } from '@/store/session-store';

import type { Session } from '@/api/types';

/** A made-up session: enough for the route guards, but the API rejects its token. Lesson 10 signs in for real. */
const PROTOTYPE_SESSION: Session = {
  accessToken: 'prototype-token',
  user: {
    id: 'prototype-passenger',
    email: 'ama@railpass.dev',
    fullName: 'Ama Prototype',
    phone: null,
    role: 'PASSENGER',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
};

export default function SignInPrototype() {
  // LIVE 09.2 — Sign in through the session store: pass PROTOTYPE_SESSION and the remember flag to signIn.
  const signIn = (remember: boolean) => undefined;

  return (
    <PrototypeScreen title="Sign in prototype" body="Pick how long the session lasts, then reload the app to see what survives.">
      <Button title="Sign in and remember me" onPress={() => signIn(true)} />
      <Button title="Sign in for this session only" variant="secondary" onPress={() => signIn(false)} />
      <Button title="Create an account" variant="ghost" onPress={() => router.push('/sign-up')} />
    </PrototypeScreen>
  );
}
