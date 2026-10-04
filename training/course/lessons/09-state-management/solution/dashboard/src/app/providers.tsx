// Course version (lesson 09) — becomes the full RailPass version in lesson 10.
import { MantineProvider } from '@mantine/core';
import { useEffect, useMemo, useState } from 'react';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router';

import { theme } from '../styles/theme';
import { useAppSelector } from './hooks';
import { router } from './router';
import { store } from './store';

function ColorAwareProviders() {
  const preference = useAppSelector((state) => state.preferences.colorScheme);
  const [systemScheme, setSystemScheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const update = () => setSystemScheme(query.matches ? 'dark' : 'light');
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  const resolvedScheme = useMemo<'light' | 'dark'>(() => (preference === 'auto' ? systemScheme : preference), [preference, systemScheme]);

  return (
    <MantineProvider theme={theme} forceColorScheme={resolvedScheme} defaultColorScheme="light">
      <RouterProvider router={router} />
    </MantineProvider>
  );
}

export function AppProviders() {
  return (
    <Provider store={store}>
      <ColorAwareProviders />
    </Provider>
  );
}
