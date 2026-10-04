// Course version (lesson 11) — lesson 12 wires Remember me into the session store.
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { AppText } from '@/components/atomic/app-text';
import { useTheme } from '@/components/theme/theme-provider';
import { Button } from '@/components/ui/buttons/button';
import { InlineAlert } from '@/components/ui/feedback/inline-alert';
import { TextField } from '@/components/ui/inputs/text-field';
import { AuthShell } from '@/features/auth/auth-shell';
import { AuthFooterLink, RememberMe } from '@/features/auth/auth-widgets';

import { useAsyncAction } from '@/hooks/use-async-action';
import { useForm, validateEmail } from '@/hooks/use-form';

import { authApi } from '@/api/auth-api';
import { useSessionStore } from '@/store/session-store';

import { hitSlop, sizes } from '@/constants/sizes';

export default function SignInScreen() {
  const { scheme } = useTheme();
  const { notice } = useLocalSearchParams<{ notice?: string }>();
  const [remember, setRemember] = useState(true);
  const form = useForm({ email: '', password: '' }, { email: validateEmail, password: (value) => (value ? null : 'Enter your password.') });
  const signIn = useAsyncAction(async () => {
    const session = await authApi.signIn({ email: form.values.email.trim(), password: form.values.password });
    if (session.user.role !== 'PASSENGER') {
      throw new Error('This is a staff account. Please use the RailPass operations dashboard.');
    }
    // Updating the store is enough: the root layout's protected routes switch to the app.
    // Lesson 12 wires Remember me into the session store.
    useSessionStore.getState().signIn(session);
  });

  const submit = async () => {
    if (form.validate()) await signIn.run();
  };

  return (
    <AuthShell scene="station" sceneHeight={sizes.authSceneHeight} title="Login to Access Your" highlight="Travel Tickets">
      {notice === 'password-reset' ? <InlineAlert kind="success" message="Password updated. Sign in with your new password." /> : null}
      {signIn.error ? <InlineAlert kind="error" title="Couldn’t sign in" message={signIn.error.message} /> : null}
      <TextField
        label="Email"
        hideLabel
        icon="mail"
        placeholder="Enter your email"
        value={form.values.email}
        onChangeText={(value) => form.setValue('email', value)}
        error={form.errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        testID="email-input"
      />
      <TextField
        label="Password"
        hideLabel
        icon="lock"
        placeholder="Enter your password"
        secure
        value={form.values.password}
        onChangeText={(value) => form.setValue('password', value)}
        error={form.errors.password}
        autoComplete="current-password"
        textContentType="password"
        onSubmitEditing={submit}
        returnKeyType="go"
        testID="password-input"
      />
      <View style={styles.row}>
        <RememberMe value={remember} onChange={setRemember} />
        <Pressable accessibilityRole="link" hitSlop={hitSlop.md} onPress={() => router.push('/forgot-password')}>
          <AppText variant="labelStrong">Forgot password?</AppText>
        </Pressable>
      </View>
      <Button
        title="Login"
        variant={scheme === 'dark' ? 'primary' : 'dark'}
        onPress={submit}
        loading={signIn.isPending}
        testID="login-button"
      />
      <AuthFooterLink prompt="Don’t have an account?" action="Create an account" onPress={() => router.push('/sign-up')} />
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
