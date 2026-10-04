import { router } from 'expo-router';

import { AppText } from '@/components/atomic/app-text';
import { useTheme } from '@/components/theme/theme-provider';
import { Button } from '@/components/ui/buttons/button';
import { InlineAlert } from '@/components/ui/feedback/inline-alert';
import { TextField } from '@/components/ui/inputs/text-field';
import { AuthShell } from '@/features/auth/auth-shell';

import { useAsyncAction } from '@/hooks/use-async-action';
import { useForm, validateEmail } from '@/hooks/use-form';

import { authApi } from '@/api/auth-api';

import { sizes } from '@/constants/sizes';

export default function ForgotPasswordScreen() {
  const { scheme } = useTheme();
  const form = useForm({ email: '' }, { email: validateEmail });
  const request = useAsyncAction(async () => {
    const email = form.values.email.trim();
    await authApi.requestPasswordReset(email);
    router.push({ pathname: '/reset-password', params: { email } });
  });

  const submit = async () => {
    if (form.validate()) await request.run();
  };

  return (
    <AuthShell scene="journey" sceneHeight={sizes.authSceneHeight} showBack title="Forgot Password? Reset" highlight="Your Access Here">
      {request.error ? <InlineAlert kind="error" message={request.error.message} /> : null}
      <AppText variant="label" tone="secondary" align="center">
        Enter the email you signed up with and we’ll send you a 6-digit reset code.
      </AppText>
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
        textContentType="emailAddress"
        onSubmitEditing={submit}
      />
      <Button title="Submit" variant={scheme === 'dark' ? 'primary' : 'dark'} onPress={submit} loading={request.isPending} />
      {__DEV__ ? (
        <InlineAlert
          kind="info"
          title="Development email"
          message="Reset emails are delivered to the Mailpit inbox (port 8025 on the API machine) and printed in the API log."
        />
      ) : null}
    </AuthShell>
  );
}
