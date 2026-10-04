# Lesson 09 · State management — 🖥️ Dashboard

## Goal
Redux Toolkit stores client-only preferences and auth session state while server data remains outside Redux.

## What arrives
| Path | Status | Why |
|---|---|---|
| `src/features/preferences/preferences-slice.ts` | RailPass with LIVE gap | Color scheme state; LIVE 09.5 writes through the Immer draft. |
| `src/features/auth/auth-slice.ts` | RailPass | Token and staff user session state for lesson 12. |
| `src/app/hooks.ts` | RailPass | Typed `useAppDispatch` and `useAppSelector`. |
| `src/app/store.ts` | course version → RailPass in 10 | Reducers and preference persistence before API middleware arrives. |
| `src/app/providers.tsx`, `src/app/layouts/dashboard-layout.tsx` | course version → RailPass in 10/12 | Redux Provider, color scheme sync, and theme toggle. |

## Talk through
- **`preferences-slice.ts` — Immer.** Ask: why is assignment safe? Answer: Redux Toolkit records draft mutations immutably.
- **`app/hooks.ts` — typed hooks.** Ask: why wrap React Redux hooks? Answer: app types travel with every selector and dispatch.
- **`store.ts` — persistence.** Ask: what state should survive reloads? Answer: preferences, not API responses.

## LIVE 09.5 — reducer assignment
Why: reducers should say exactly which field changes.
1. Open `preferences-slice.ts`.
2. In `setColorScheme`, write `state.colorScheme = action.payload`.
3. Keep the action exported from the slice.
Hint: do not spread or return a new object.
Done when: theme toggling updates the page.

## LIVE 09.7 — preference persistence
Why: narrow persistence avoids stale server data and accidental session leakage.
1. In `store.ts`, preload preferences from `preferencesPersistence.load()`.
2. Subscribe to `store` changes.
3. Save `store.getState().preferences` with `preferencesPersistence.save(...)`.
4. Leave `auth` unpersisted.
Hint: persist one slice, not the whole store.
Done when: color scheme survives refresh; `lesson status 09` shows no open dashboard LIVE markers and `yarn --cwd dashboard typecheck` passes.

## Checkpoint
The browser shows the routed shell with placeholder pages and a Redux-backed theme toggle that survives refresh. Commands: `lesson status 09`, `yarn --cwd dashboard typecheck`, `yarn --cwd dashboard lint`, `yarn --cwd dashboard test`.
