# Lesson 01 · Tools & project setup — 🖥️ Dashboard

## Goal
The dashboard workspace installs, compiles, reads `VITE_API_URL`, and proves the browser can call `/health`.

## What arrives
| Path | Status | Why |
|---|---|---|
| `.env.example` | course | Uses `http://localhost:3000/api`; reminds facilitators that `VITE_` values are public. |
| `.gitignore` | RailPass | Keeps dependencies, build output, local env files, and tsbuildinfo out of source. |
| `.oxlintrc.json` | course version → RailPass in 03 | Lets lint run before import-sort is taught. |
| `index.html` | RailPass | Provides the Vite mount point and icon sprite reference. |
| `package.json`, `yarn.lock` | RailPass | Pins the React, Vite, Mantine, Router, Query, Redux, lint, and test toolchain. |
| `postcss.config.cjs`, `src/shared/constants/breakpoints.cjs` | RailPass / provided early | PostCSS needs breakpoints now; the constants are studied in 05. |
| `public/favicon.svg`, `public/icons.svg` | RailPass | Browser icon and SVG symbols used by the final shell. |
| `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `src/vite-env.d.ts`, `vite.config.ts` | RailPass | TypeScript, Vite, and Vitest baseline configuration. |
| `src/testing/setup.ts` | RailPass / provided early | Vitest setup path must exist before testing is taught in 15. |
| `src/shared/config/env.ts` | RailPass with LIVE gap | Central browser config reader; LIVE 01.5 adds validation. |
| `src/main.tsx` | course-only | Setup panel; LIVE 01.6 renders URL and health status. |

## Talk through
- **`package.json` scripts — shared commands.** Ask: which commands should every pair use? Answer: `typecheck`, `lint`, `test`, and `build` through `yarn --cwd dashboard`.
- **`src/shared/config/env.ts` — public config.** Ask: why no secrets? Answer: Vite embeds `VITE_` values in the browser bundle.
- **`vite.config.ts` — setup files.** Ask: why does a testing setup file arrive now? Answer: the config references it from the first verification run.

## LIVE 01.5 — validate the API URL
Why: bad classroom configuration should fail clearly before feature work starts.
1. In `src/shared/config/env.ts`, read `import.meta.env.VITE_API_URL` into `apiUrl`.
2. Use `URL.canParse(apiUrl)` for validation.
3. Throw `new Error('VITE_API_URL must be a valid URL')` when invalid.
4. Export `env = { apiUrl }`.
Hint: keep the exported name `env`.
Done when: `yarn --cwd dashboard typecheck` passes and an invalid URL throws a clear error.

## LIVE 01.6 — render health feedback
Why: learners need a visible proof that the frontend can reach the class API.
1. In `src/main.tsx`, keep the `createRoot(...).render(...)` entry point.
2. Add state for the health message.
3. In `useEffect`, call `fetch(`${env.apiUrl}/health`)`.
4. Render `env.apiUrl` and the result or a friendly failure message.
Hint: build the endpoint from `env.apiUrl`; do not hard-code a host.
Done when: the page shows the API URL plus a health result; `yarn --cwd dashboard typecheck` passes.

## Checkpoint
The browser shows a small setup panel, not the dashboard shell, with the API URL and health result visible. Commands: `yarn --cwd dashboard install`, `lesson status 01`, `yarn --cwd dashboard typecheck`, `yarn --cwd dashboard lint`, `yarn --cwd dashboard test`.
