import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { HeaderBar } from '@/components/layout/header-bar';
import { Screen } from '@/components/layout/screen';
import { Button } from '@/components/ui/buttons/button';
import { InlineAlert } from '@/components/ui/feedback/inline-alert';
import { TextField } from '@/components/ui/inputs/text-field';

import { useAsyncAction } from '@/hooks/use-async-action';
import { useForm, validateFullName } from '@/hooks/use-form';

import { authApi } from '@/api/auth-api';
import { ApiError } from '@/api/errors';
import { appConfig } from '@/config/app-config';
import { useSessionStore } from '@/store/session-store';

import { layout } from '@/constants/layout';

export default function EditProfileScreen() {
  const user = useSessionStore((state) => state.user);
  const form = useForm(
    { fullName: user?.fullName ?? '', phone: user?.phone ?? '' },
    {
      fullName: validateFullName,
      phone: (value) =>
        appConfig.validation.phonePattern.test(value.trim()) ? null : 'Enter a valid phone number, e.g. +233 24 123 4567.',
    },
  );
  const save = useAsyncAction(async () => {
    try {
      const updated = await authApi.updateProfile({
        fullName: form.values.fullName.trim(),
        phone: form.values.phone.trim(),
      });
      useSessionStore.getState().updateUser(updated);
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
      <HeaderBar title="Edit profile" />
      <View style={styles.form}>
        {save.error ? <InlineAlert kind="error" message={save.error.message} /> : null}
        <TextField
          label="Full name"
          icon="person"
          value={form.values.fullName}
          onChangeText={(value) => form.setValue('fullName', value)}
          error={form.errors.fullName}
          autoCapitalize="words"
        />
        <TextField
          label="Phone (optional)"
          icon="phone"
          value={form.values.phone}
          onChangeText={(value) => form.setValue('phone', value)}
          error={form.errors.phone}
          keyboardType="phone-pad"
          placeholder="+233 24 123 4567"
        />
        <Button title="Save changes" onPress={submit} loading={save.isPending} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({ form: { gap: layout.blockGap } });
