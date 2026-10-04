// Course version (lesson 07) — becomes the full RailPass version in lesson 10.
import { Button, PasswordInput, Text, TextInput } from '@mantine/core';
import { Link } from 'react-router';

import { spacingKeys } from '../../../shared/constants';

export function LoginView() {
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
      <form style={{ width: 'min(420px, 100%)', display: 'grid', gap: 16 }}>
        <Text fw={800} size="xl">
          RailPass staff sign in
        </Text>
        <Text c="dimmed">Real authentication arrives in lesson 10.</Text>
        <TextInput label="Email" defaultValue="staff@railpass.dev" />
        <PasswordInput label="Password" placeholder="Staff#2026" />
        <Button component={Link} to="/">
          Enter prototype
        </Button>
        <Text size="sm" mt={spacingKeys.xs}>
          Use this placeholder to discuss the final auth flow before we wire it.
        </Text>
      </form>
    </main>
  );
}
