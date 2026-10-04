// Course version (lesson 05) — becomes the full RailPass version in lesson 10.
import { MantineProvider } from '@mantine/core';

import { theme } from '../styles/theme';
import { CoursePlayground } from './course-playground';

export function AppProviders() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <CoursePlayground />
    </MantineProvider>
  );
}
