import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router';

import { zIndex } from '../shared/constants';
import { theme } from '../styles/theme';
import { useAppSelector } from './hooks';
import { queryClient } from './query-client';
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
      <Notifications position="top-right" zIndex={zIndex.notifications} />
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
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
