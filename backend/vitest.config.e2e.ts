import { existsSync } from 'node:fs';
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

if (existsSync('.env')) process.loadEnvFile('.env');

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
    // Point the app at the disposable test database before any module reads the config.
    env: { DATABASE_URL: process.env.TEST_DATABASE_URL ?? '', LOG_RESET_CODES: 'false' },
    fileParallelism: false,
    testTimeout: 30_000,
    hookTimeout: 60_000,
  },
});
