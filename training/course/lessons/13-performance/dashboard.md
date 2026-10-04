# Lesson 13 · Performance — 🖥️ Dashboard

## Goal
Learners keep the dashboard responsive by debouncing query input and preserving route-level code splitting.

## What arrives
| Path | Status | Why |
|---|---|---|
| `src/features/bookings/components/bookings-view.tsx` | RailPass with LIVE gap | Search field regression; LIVE 13.5 debounces before query keys change. |
| `src/app/router.tsx` | RailPass with LIVE gap | Eager route regression; LIVE 13.6 restores lazy overview, journeys, and bookings routes. |

## Talk through
- **`bookings-view.tsx` — query key churn.** Ask: what happens when every keystroke changes the key? Answer: unnecessary requests and cache entries.
- **`use-debounced-value.ts` — reusable delay.** Ask: why put this in `shared/hooks`? Answer: search fields across features need the same behavior.
- **`router.tsx` — chunks.** Ask: why compare build output? Answer: route laziness is visible in the generated chunk list.

## LIVE 13.5 — debounce booking search
Why: users can type freely without creating a request per character.
1. In `bookings-view.tsx`, keep immediate input state for the text box.
2. Call `const debouncedSearch = useDebouncedValue(search);`. The shared hook already defaults to `queryTimings.debounceMs`, so there is no delay to pass.
3. Use the debounced value in query params.
4. Leave pagination and status filters unchanged.
Hint: the input should feel instant; the network waits briefly.
Done when: typing pauses before bookings refetch.

## LIVE 13.6 — restore lazy route modules
Why: page code should load when the user visits the page, not at startup.
1. In `router.tsx`, remove eager `Component` imports for overview, journeys, and bookings.
2. Replace those route entries with `lazy: () => import('./routes/overview-route')`, `journeys-route`, and `bookings-route`.
3. Keep `hydrateFallbackElement` provided.
4. Compare `yarn --cwd dashboard build` chunk output before and after if time allows.
Hint: only the three eager regressions need changing.
Done when: build output shows separate route chunks; `lesson status 13` shows no open dashboard LIVE markers and `yarn --cwd dashboard typecheck` passes.

## Checkpoint
The browser Bookings page still shows real data; search waits for the debounce before refetching, and navigating between pages still loads routed screens normally. Commands: `lesson status 13`, `yarn --cwd dashboard typecheck`, `yarn --cwd dashboard lint`, `yarn --cwd dashboard test`, optionally `yarn --cwd dashboard build`.
