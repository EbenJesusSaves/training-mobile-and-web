import { Alert, Button, PasswordInput, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertTriangle, IconMail, IconTrain } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { Navigate, useNavigate } from 'react-router';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { parseApiError } from '../../../shared/api/errors';
import { componentSizeKeys, fontWeights, iconSizes, spacingKeys, textSizes, themeColorNames } from '../../../shared/constants';
import { login } from '../api/auth-api';
import { setSession } from '../auth-slice';

import styles from './login-view.module.css';

export function LoginView() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const token = useAppSelector((state) => state.auth.token);
  const user = useAppSelector((state) => state.auth.user);
  const form = useForm({
    initialValues: { email: 'staff@railpass.dev', password: '' },
    validate: {
      email: (value) => (/^\S+@\S+\.\S+$/.test(value) ? null : 'Enter a valid email address.'),
      password: (value) => (value ? null : 'Enter your password.'),
    },
  });

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      if (data.user.role !== 'STAFF') {
        form.setFieldError('email', 'Passenger accounts cannot access RailPass Ops. Sign in with a staff account.');
        return;
      }
      dispatch(setSession({ token: data.accessToken, user: data.user }));
      navigate('/', { replace: true });
    },
    onError: (error) => {
      const parsed = parseApiError(error);
      if (Object.keys(parsed.fieldErrors).length > 0) form.setErrors(parsed.fieldErrors);
      else form.setFieldError('password', parsed.message || 'Sign-in failed. Check your credentials.');
    },
  });

  if (token && user?.role === 'STAFF') return <Navigate to="/" replace />;

  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-label="RailPass operations dashboard">
        <div className={styles.heroTop}>
          <div className={styles.logo}>
            <div className={styles.logoMark}>
              <IconTrain size={iconSizes.logo} />
            </div>
            <Text fw={fontWeights.extraBold} size={textSizes.lg}>
              RailPass Ops
            </Text>
          </div>
          <h1 className={styles.heroTitle}>Staff operations, on time.</h1>
          <p className={styles.heroText}>
            Monitor Ghana intercity departures, manage capacity, and support passengers from one polished training dashboard.
          </p>
        </div>
        <div className={styles.railArt} aria-hidden="true">
          <div className={styles.train}>
            <div className={styles.windows}>
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
          <div className={styles.trackAlt} />
          <div className={styles.track} />
        </div>
      </section>

      <section className={styles.panelWrap} aria-label="Staff sign in">
        <div className={styles.panel}>
          <h1>Welcome back</h1>
          <p className={styles.panelLead}>Use your staff credentials. Passenger accounts are intentionally blocked here.</p>
          {import.meta.env.DEV ? (
            <Text size={textSizes.sm} c={themeColorNames.dimmed}>
              Demo accounts: staff@railpass.dev / Staff#2026
            </Text>
          ) : null}
          {form.errors.email?.toString().includes('Passenger') ? (
            <Alert
              mb={spacingKeys.md}
              color={themeColorNames.danger}
              icon={<IconAlertTriangle size={iconSizes.lg} />}
              title="Staff access required"
            >
              {form.errors.email}
            </Alert>
          ) : null}
          <form className={styles.form} onSubmit={form.onSubmit((values) => mutation.mutate(values))} noValidate>
            <TextInput
              label="Email"
              placeholder="staff@railpass.dev"
              leftSection={<IconMail size={iconSizes.md} />}
              autoComplete="email"
              {...form.getInputProps('email')}
            />
            <PasswordInput
              label="Password"
              placeholder="Enter staff password"
              autoComplete="current-password"
              {...form.getInputProps('password')}
            />
            <Button type="submit" loading={mutation.isPending} size={componentSizeKeys.lg}>
              Sign in to operations
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}
