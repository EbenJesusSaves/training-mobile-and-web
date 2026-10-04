import { router, useLocalSearchParams } from 'expo-router';

import { useTheme } from '@/components/theme/theme-provider';
import { Button } from '@/components/ui/buttons/button';
import { InlineAlert } from '@/components/ui/feedback/inline-alert';
import { TextField } from '@/components/ui/inputs/text-field';
import { AuthShell } from '@/features/auth/auth-shell';
import { AuthFooterLink } from '@/features/auth/auth-widgets';

import { useAsyncAction } from '@/hooks/use-async-action';
import { useForm, validatePassword } from '@/hooks/use-form';

import { authApi } from '@/api/auth-api';
import { appConfig } from '@/config/app-config';

import { sizes } from '@/constants/sizes';

const { resetCodeLength, resetCodeTtlMinutes } = appConfig.validation;
const RESET_CODE_PATTERN = new RegExp(`^\\d{${resetCodeLength}}$`);

export default function ResetPasswordScreen() {
  const { scheme } = useTheme();
  const { email = '' } = useLocalSearchParams<{ email?: string }>();
  const form = useForm(
    { code: '', password: '', confirmPassword: '' },
    {
      code: (value) => (RESET_CODE_PATTERN.test(value.trim()) ? null : `Enter the ${resetCodeLength}-digit code from the email.`),
      password: validatePassword,
      confirmPassword: (value, values) => (value === values.password ? null : 'Passwords don’t match.'),
    },
  );
  const reset = useAsyncAction(async () => {
    await authApi.resetPassword({ email, code: form.values.code.trim(), password: form.values.password });
    router.dismissTo({ pathname: '/sign-in', params: { notice: 'password-reset' } });
  });
  const resend = useAsyncAction(() => authApi.requestPasswordReset(email));

  const submit = async () => {
    if (form.validate()) await reset.run();
  };

  return (
    <AuthShell
      scene="clouds"
      sceneHeight={sizes.authSceneCompactHeight}
      showBack
      title="Check your email and"
      highlight="Choose a New Password"
    >
      <InlineAlert kind="info" message={`We sent a code to ${email || 'your email'}. It expires in ${resetCodeTtlMinutes} minutes.`} />
      {reset.error ? <InlineAlert kind="error" message={reset.error.message} /> : null}
      <TextField
        label="Reset code"
        hideLabel
        icon="key"
        placeholder={`${resetCodeLength}-digit code`}
        value={form.values.code}
        onChangeText={(value) => form.setValue('code', value)}
        error={form.errors.code}
        keyboardType="number-pad"
        maxLength={resetCodeLength}
        textContentType="oneTimeCode"
      />
      <TextField
        label="New password"
        hideLabel
        icon="lock"
        placeholder="New password"
        secure
        value={form.values.password}
        onChangeText={(value) => form.setValue('password', value)}
        error={form.errors.password}
        textContentType="newPassword"
      />
      <TextField
        label="Confirm new password"
        hideLabel
        icon="lock"
        placeholder="Confirm new password"
        secure
        value={form.values.confirmPassword}
        onChangeText={(value) => form.setValue('confirmPassword', value)}
        error={form.errors.confirmPassword}
        onSubmitEditing={submit}
      />
      <Button title="Update password" variant={scheme === 'dark' ? 'primary' : 'dark'} onPress={submit} loading={reset.isPending} />
      <AuthFooterLink
        prompt={resend.isPending ? 'Sending…' : 'Didn’t get it?'}
        action="Send a new code"
        onPress={() => void resend.run()}
      />
    </AuthShell>
  );
}
