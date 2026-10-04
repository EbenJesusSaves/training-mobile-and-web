import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import Constants from 'expo-constants';
import { router } from 'expo-router';

import { AppText } from '@/components/atomic/app-text';
import { Screen } from '@/components/layout/screen';
import { useTheme } from '@/components/theme/theme-provider';
import { Button } from '@/components/ui/buttons/button';
import { Avatar } from '@/components/ui/display/avatar';
import { InlineAlert } from '@/components/ui/feedback/inline-alert';
import { SegmentedTabs } from '@/components/ui/inputs/segmented-tabs';
import { TextField } from '@/components/ui/inputs/text-field';
import { SettingsRow } from '@/features/profile/settings-row';

import { useAsyncAction } from '@/hooks/use-async-action';

import { getApiBaseUrl } from '@/api/client';
import { travelApi } from '@/api/travel-api';
import { defaultApiUrl } from '@/config/app-config';
import { type ThemeMode, usePreferencesStore } from '@/store/preferences-store';
import { useSessionStore } from '@/store/session-store';

import { layout } from '@/constants/layout';
import { spacing } from '@/constants/spacing';

const THEME_OPTIONS: { value: ThemeMode; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

export default function ProfileScreen() {
  const { colors } = useTheme();
  const user = useSessionStore((state) => state.user);
  const themeMode = usePreferencesStore((state) => state.themeMode);
  const setThemeMode = usePreferencesStore((state) => state.setThemeMode);

  const confirmSignOut = () =>
    Alert.alert('Sign out?', 'You’ll need your email and password to sign in again.', [
      { text: 'Stay signed in', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: () => useSessionStore.getState().signOut() },
    ]);

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="display" accessibilityRole="header">
          Profile
        </AppText>
      </View>

      <View style={[styles.card, styles.identity, { backgroundColor: colors.surfaceRaised }]}>
        <Avatar name={user?.fullName ?? ''} seed={user?.id} size="large" />
        <View style={styles.flex}>
          <AppText variant="heading">{user?.fullName}</AppText>
          <AppText variant="label" tone="muted">
            {user?.email}
          </AppText>
          <AppText variant="label" tone="muted">
            {user?.phone || 'No phone number'}
          </AppText>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: colors.surfaceRaised }]}>
        <SettingsRow icon="edit" title="Edit profile" subtitle="Name and phone number" onPress={() => router.push('/edit-profile')} />
        <SettingsRow icon="key" title="Change password" onPress={() => router.push('/change-password')} />
        <SettingsRow icon="tickets" title="My tickets" subtitle="Upcoming and past trips" onPress={() => router.navigate('/tickets')} />
      </View>

      <AppText variant="subheading" accessibilityRole="header" style={styles.section}>
        Appearance
      </AppText>
      <SegmentedTabs options={THEME_OPTIONS} value={themeMode} onChange={setThemeMode} accessibilityLabel="Theme" />

      {__DEV__ ? <DeveloperSettings /> : null}

      <View style={styles.section}>
        <Button title="Sign out" variant="danger" icon="logout" onPress={confirmSignOut} />
      </View>
      <AppText variant="caption" tone="muted" align="center" style={styles.version}>
        RailPass {Constants.expoConfig?.version}
      </AppText>
    </Screen>
  );
}

/** Lets learners point the app at a facilitator-hosted API without restarting Metro. */
function DeveloperSettings() {
  const { colors } = useTheme();
  const override = usePreferencesStore((state) => state.apiUrlOverride);
  const setOverride = usePreferencesStore((state) => state.setApiUrlOverride);
  const [value, setValue] = useState(override ?? '');
  const [status, setStatus] = useState<string | null>(null);
  const check = useAsyncAction(async (url: string) => {
    await travelApi.health(url);
    setStatus(`Connected to ${url}`);
  });

  const save = async () => {
    const url = value.trim().replace(/\/$/, '');
    setStatus(null);
    await check.run(url || defaultApiUrl);
    if (!check.error) setOverride(url || null);
  };

  return (
    <View style={[styles.card, styles.dev, { backgroundColor: colors.surfaceRaised }]}>
      <AppText variant="subheading" accessibilityRole="header">
        Developer settings
      </AppText>
      <AppText variant="label" tone="muted">
        Current API: {getApiBaseUrl()}
      </AppText>
      <TextField
        label="API base URL override"
        icon="server"
        placeholder={defaultApiUrl}
        value={value}
        onChangeText={setValue}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="url"
      />
      {check.error ? <InlineAlert kind="error" message={check.error.message} /> : null}
      {status ? <InlineAlert kind="success" message={status} /> : null}
      <Button title="Test & save" variant="secondary" size="compact" onPress={save} loading={check.isPending} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: spacing.md, marginBottom: spacing.xl },
  card: { borderRadius: layout.cardRadius, paddingHorizontal: spacing.lg, paddingVertical: spacing.xs, marginBottom: spacing.md },
  identity: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, paddingVertical: spacing.lg },
  flex: { flex: 1, gap: spacing.xxxs },
  section: { marginTop: spacing.xl, marginBottom: spacing.md },
  dev: { marginTop: layout.sectionGap, gap: spacing.md, paddingVertical: spacing.lg },
  version: { marginTop: spacing.lg },
});
