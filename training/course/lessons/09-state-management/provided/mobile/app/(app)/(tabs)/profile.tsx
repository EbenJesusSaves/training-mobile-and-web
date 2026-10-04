// Course version (lesson 09) — prototype profile wired to the stores; lesson 12 replaces it with the RailPass screen.
import { Button } from '@/components/ui/buttons/button';
import { SegmentedTabs } from '@/components/ui/inputs/segmented-tabs';

import { PrototypeScreen } from '@/prototype/prototype-screen';
import { type ThemeMode, usePreferencesStore } from '@/store/preferences-store';
import { useSessionStore } from '@/store/session-store';

const THEME_OPTIONS: { value: ThemeMode; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

export default function ProfilePrototype() {
  const user = useSessionStore((state) => state.user);
  const themeMode = usePreferencesStore((state) => state.themeMode);
  const setThemeMode = usePreferencesStore((state) => state.setThemeMode);

  return (
    <PrototypeScreen
      title="Profile prototype"
      body={user ? `Signed in as ${user.fullName} (${user.email}).` : 'Signed out.'}
      href="/edit-profile"
    >
      <SegmentedTabs options={THEME_OPTIONS} value={themeMode} onChange={setThemeMode} accessibilityLabel="Theme" />
      <Button title="Sign out" variant="danger" onPress={() => useSessionStore.getState().signOut()} />
    </PrototypeScreen>
  );
}
