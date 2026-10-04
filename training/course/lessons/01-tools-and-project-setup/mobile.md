# Lesson 01 · Tools & project setup — 📱 Mobile

> You create the Expo workspace, install the whole course toolchain once, and prove the app can reach the facilitator API. The screen is small on purpose: setup problems should be obvious before feature work begins.

## What arrives

| File | Status | Why it's here |
| --- | --- | --- |
| `mobile/package.json`, `mobile/yarn.lock` | RailPass | Pins Expo SDK 57, React Native, Expo Router, Jest, ESLint, Zustand, Axios, SecureStore, Lottie, Skia, Reanimated and every dependency used later. Lesson 01 is the only install lesson. |
| `mobile/app.json` | RailPass | App identity, scheme `railpass`, typed routes, splash/icon config, Expo plugins and `./plugins/with-local-network-api`. |
| `mobile/tsconfig.json`, `mobile/expo-env.d.ts` | RailPass | Strict TypeScript, Jest types, Expo route types and the `@/` path alias. |
| `mobile/eslint.config.js` | course version → RailPass in 03 | Lets lint run now; lesson 03 adds the import-order rule. |
| `mobile/.env.example` | course version | Documents `EXPO_PUBLIC_API_URL` for localhost, Android emulator, iOS simulator and physical phones. |
| `mobile/_gitignore` | RailPass | Copied as `.gitignore` so dependencies, build output and local env files stay out of Git. |
| `mobile/assets/**` | RailPass | Final icons, splash art, city photos, Lottie JSON and Plus Jakarta Sans fonts. |
| `mobile/plugins/with-local-network-api.js`, `mobile/plugins/with-scene-lifecycle.js` | RailPass | Native Expo config plugins used by the final app. |
| `mobile/config/app-config.ts` | RailPass, LIVE 01.1 | Central runtime config. LIVE 01.1 completes the API URL fallback chain. |
| `mobile/app/_layout.tsx` | course version → RailPass in 09 | Minimal root stack so the setup screen can render before routes and stores exist. |
| `mobile/app/index.tsx` | course-only (removed in 07) | Setup playground. LIVE 01.2 calls `/health` and shows the result. |

## Talk through (together)

1. **`mobile/package.json`: one dependency moment.** Ask: why does lesson 01 install SecureStore, Lottie and Axios before their lessons? Answer: the class installs once with `yarn install:all`; later lessons add files, not packages.
2. **`mobile/app.json`: app identity.** Ask: what do `typedRoutes`, `scheme: "railpass"` and the local-network plugin buy us? Answer: safer route hrefs, deep-link identity and phone-to-laptop networking during development.
3. **`mobile/config/app-config.ts`: one API seam.** Ask: why not read `process.env` in every screen? Answer: API fallback, developer overrides and health checks need one source of truth.
4. **Root workspace files.** Ask: why do `.nvmrc`, `.prettierrc.json`, `.vscode/`, `.husky/`, root `package.json`, `scripts/check-all.sh` and root `_gitignore` arrive now? Answer: every app uses the same Node, formatting, hooks and `yarn run check` workflow from the first commit.

## Live tasks

### LIVE 01.1 — Resolve the API URL fallback chain (`mobile/config/app-config.ts`)

**Why:** every later API call depends on `defaultApiUrl`, so physical phones, simulators and classroom API addresses must resolve predictably.

1. Import `Constants` from `expo-constants`.
2. Add `function metroHostApiUrl(): string | undefined { … }` above `defaultApiUrl`.
3. Inside it, read `const host = Constants.expoConfig?.hostUri?.split(':')[0];`.
4. Return `host ? `http://${host}:3000/api` : undefined`.
5. Replace `defaultApiUrl` with `process.env.EXPO_PUBLIC_API_URL || metroHostApiUrl() || 'http://localhost:3000/api'`.
6. Leave the existing `appConfig` values in place; later lessons use `seatRefreshMs`, `requestTimeoutMs` and validation limits.

**Hint:** `.env` wins. The Metro host fallback is for the common case where the phone and laptop are on the same Wi-Fi.

**Done when:** the setup screen shows the expected API URL for the device you are using.

### LIVE 01.2 — Fetch `/health` from the setup screen (`mobile/app/index.tsx`)

**Why:** learners need visible proof that Expo, env config and the facilitator API are connected.

1. In `checkHealth`, replace the marker with `const response = await fetch(`${defaultApiUrl}/health`);`.
2. Add `if (!response.ok) throw new Error(`HTTP ${response.status}`);`.
3. On success, keep `setState('ok')` and set the message to `API: ok`.
4. Leave the catch block alone so network errors and bad hosts show on the card.
5. Tap **Check again** after changing `mobile/.env`.

**Hint:** build the endpoint from `defaultApiUrl`; do not hard-code the facilitator IP in the screen.

**Done when:** **Hello RailPass** shows `API: ok`, or a useful HTTP/network error that points to the bad URL.

## Checkpoint

From `~/my-railpass`: `git init`, `lesson start 01`, `yarn install:all`, copy `mobile/.env.example` to `mobile/.env` and `dashboard/.env.example` to `dashboard/.env`, then `yarn mobile`. The device shows **Hello RailPass**, the resolved API URL and a health result. If the phone shows the red **Could not connect to development server** screen, fix Wi-Fi, guest-network isolation or the Metro host before moving on.

Commands: `lesson status 01` shows no open mobile tasks, and `yarn run check` passes from the workspace root.

## Removed / replaced in this lesson

Nothing is removed. This lesson creates the root workspace files and the first mobile app skeleton. Later lessons overwrite the course-version `mobile/eslint.config.js`, `mobile/app/_layout.tsx` and the course-only playground `mobile/app/index.tsx`.
