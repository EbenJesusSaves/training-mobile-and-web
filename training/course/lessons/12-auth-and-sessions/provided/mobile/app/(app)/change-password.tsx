import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { HeaderBar } from '@/components/layout/header-bar';
import { Screen } from '@/components/layout/screen';
import { Button } from '@/components/ui/buttons/button';
import { InlineAlert } from '@/components/ui/feedback/inline-alert';
import { TextField } from '@/components/ui/inputs/text-field';

import { useAsyncAction } from '@/hooks/use-async-action';
import { useForm, validatePassword } from '@/hooks/use-form';

import { authApi } from '@/api/auth-api';
import { ApiError } from '@/api/errors';

import { layout } from '@/constants/layout';

export default function ChangePasswordScreen() {
  const form = useForm(
    { currentPassword: '', newPassword: '', confirmPassword: '' },
    {
      currentPassword: (value) => (value ? null : 'Enter your current password.'),
      newPassword: validatePassword,
      confirmPassword: (value, values) => (value === values.newPassword ? null : 'Passwords don’t match.'),
    },
  );
  const save = useAsyncAction(async () => {
    try {
      await authApi.changePassword({
        currentPassword: form.values.currentPassword,
        newPassword: form.values.newPassword,
      });
      router.back();
    } catch (error) {
      if (error instanceof ApiError) form.applyServerErrors(error.fieldErrors);
      throw error;
    }
  });

  const submit = async () => {
    if (form.validate()) await save.run();
  };

  return (
    <Screen>
      <HeaderBar title="Change password" />
      <View style={styles.form}>
        {save.error && !Object.keys(save.error.fieldErrors).length ? <InlineAlert kind="error" message={save.error.message} /> : null}
        <TextField
          label="Current password"
          icon="lock"
          secure
          value={form.values.currentPassword}
          onChangeText={(value) => form.setValue('currentPassword', value)}
          error={form.errors.currentPassword}
          textContentType="password"
        />
        <TextField
          label="New password"
          icon="lock"
          secure
          value={form.values.newPassword}
          onChangeText={(value) => form.setValue('newPassword', value)}
          error={form.errors.newPassword}
          textContentType="newPassword"
        />
        <TextField
          label="Confirm new password"
          icon="lock"
          secure
          value={form.values.confirmPassword}
          onChangeText={(value) => form.setValue('confirmPassword', value)}
          error={form.errors.confirmPassword}
          onSubmitEditing={submit}
        />
        <Button title="Update password" onPress={submit} loading={save.isPending} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({ form: { gap: layout.blockGap } });
