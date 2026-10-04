import { useState } from 'react';
import { router } from 'expo-router';

import { useTheme } from '@/components/theme/theme-provider';
import { Button } from '@/components/ui/buttons/button';
import { InlineAlert } from '@/components/ui/feedback/inline-alert';
import { TextField } from '@/components/ui/inputs/text-field';
import { AuthShell } from '@/features/auth/auth-shell';
import { AuthFooterLink, RememberMe } from '@/features/auth/auth-widgets';

import { useAsyncAction } from '@/hooks/use-async-action';
import { useForm, validateEmail, validateFullName, validatePassword } from '@/hooks/use-form';

import { authApi } from '@/api/auth-api';
import { useSessionStore } from '@/store/session-store';

import { sizes } from '@/constants/sizes';

export default function SignUpScreen() {
  const { scheme } = useTheme();
  const [remember, setRemember] = useState(true);
  const form = useForm(
    { fullName: '', email: '', password: '', confirmPassword: '' },
    {
      fullName: validateFullName,
      email: validateEmail,
      password: validatePassword,
      confirmPassword: (value, values) => (value === values.password ? null : 'Passwords don’t match.'),
    },
  );
  const register = useAsyncAction(async () => {
    const session = await authApi.register({
      fullName: form.values.fullName.trim(),
      email: form.values.email.trim(),
      password: form.values.password,
    });
    // LIVE 11.2 — Show the API's field errors (error.fieldErrors) next to their fields, then rethrow.
    useSessionStore.getState().signIn(session, remember);
  });

  const submit = async () => {
    if (form.validate()) await register.run();
  };

  return (
    <AuthShell scene="clouds" sceneHeight={sizes.authSceneCompactHeight} showBack title="Sign Up to Explore and" highlight="Book Tickets">
      {register.error && !Object.keys(register.error.fieldErrors).length ? (
        <InlineAlert kind="error" title="Couldn’t create your account" message={register.error.message} />
      ) : null}
      <TextField
        label="Full name"
        hideLabel
        icon="person"
        placeholder="Enter your name"
        value={form.values.fullName}
        onChangeText={(value) => form.setValue('fullName', value)}
        error={form.errors.fullName}
        autoCapitalize="words"
        textContentType="name"
      />
      <TextField
        label="Email"
        hideLabel
        icon="mail"
        placeholder="Enter your mail"
        value={form.values.email}
        onChangeText={(value) => form.setValue('email', value)}
        error={form.errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
        textContentType="emailAddress"
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
        textContentType="newPassword"
      />
      <TextField
        label="Confirm password"
        hideLabel
        icon="lock"
        placeholder="Confirm Password"
        secure
        value={form.values.confirmPassword}
        onChangeText={(value) => form.setValue('confirmPassword', value)}
        error={form.errors.confirmPassword}
        textContentType="newPassword"
        onSubmitEditing={submit}
      />
      <RememberMe value={remember} onChange={setRemember} />
      <Button title="Sign Up" variant={scheme === 'dark' ? 'primary' : 'dark'} onPress={submit} loading={register.isPending} />
      <AuthFooterLink
        prompt="Already have an account?"
        action="Login"
        onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
      />
    </AuthShell>
  );
}
