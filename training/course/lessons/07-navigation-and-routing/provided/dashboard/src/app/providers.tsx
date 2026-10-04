// Course version (lesson 07) — becomes the full RailPass version in lesson 09.
import { MantineProvider } from '@mantine/core';
import { RouterProvider } from 'react-router';

import { theme } from '../styles/theme';
import { router } from './router';

export function AppProviders() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <RouterProvider router={router} />
    </MantineProvider>
  );
}
