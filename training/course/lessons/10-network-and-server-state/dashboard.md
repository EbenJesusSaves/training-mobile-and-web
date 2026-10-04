# Lesson 10 · Network layer & server state — 🖥️ Dashboard

## Goal
The dashboard reads real API data through a shared Axios client, query keys, query hooks, and API-backed views.

## What arrives
| Path | Status | Why |
|---|---|---|
| `src/shared/api/client.ts`, `errors.ts` | RailPass with LIVE gap | Central Axios instance and API error parsing; LIVE 10.5 adds auth request headers. |
| `src/app/query-client.ts`, `src/app/store.ts`, `src/app/providers.tsx` | RailPass | TanStack Query setup, Provider wiring, and final store middleware. |
| `src/shared/hooks/use-query-notification.ts`, `use-debounced-value.ts` | RailPass | Shared query failure notification and delayed search input. |
| `src/shared/ui/error-state.tsx` | RailPass | Consistent API error surface. |
| `features/*/api/*-api.ts`, `*-keys.ts`, `*-queries.ts` except auth session queries | RailPass / course versions | Endpoint calls, key factories, and hooks for overview, bookings, journeys, network, passengers. |
| Overview, bookings, passengers, passenger detail, stations-routes, and login views with CSS | RailPass | First real API-backed screens. |
| `journeys-view.tsx`, `journey-detail-view.tsx`, `extras-view.tsx` | course version → RailPass in 11/18/17 | Omit create journey, status controls, and add-ons until those lessons. |

## Talk through
- **`shared/api/client.ts` — one HTTP policy.** Ask: why not create Axios clients in each feature? Answer: auth headers and error mapping stay consistent.
- **`journey-keys.ts` — key factory.** Ask: what breaks if teams spell keys differently? Answer: duplicate caches and missed invalidations.
- **`overview-queries.ts` — server state.** Ask: why Query instead of Redux for metrics? Answer: freshness, loading, errors, and cache invalidation are server concerns.

## LIVE 10.5 — auth request header
Why: every authenticated request should get its token through one interceptor.
1. In `shared/api/client.ts`, inside the request interceptor, call `authAccessors.getToken()`.
2. If a token exists, set `config.headers.Authorization` to a bearer token string.
3. Return `config`.
Hint: leave the 401 response handler untouched; it is the worked example.
Done when: logged-in API requests include the Authorization header and typecheck passes.

## LIVE 10.6 — journey key factory
Why: stable keys make cache reads and invalidations safe across screens.
1. In `journey-keys.ts`, keep `all` as the namespace root.
2. Add `lists`, `list(params)`, and `detail(id)` entries.
3. Build child keys from `journeyKeys.all` instead of repeating strings.
Hint: query keys should be readonly arrays.
Done when: journeys list and detail queries use the same key factory.

## LIVE 10.7 — create invalidation
Why: after creating a journey, affected lists and overview metrics must refresh without a full reload.
1. In `journey-queries.ts`, add `const queryClient = useQueryClient();` inside `useCreateJourney`.
2. In `onSuccess`, call `queryClient.invalidateQueries({ queryKey: journeyKeys.all })`.
3. Also invalidate `overviewKeys.all`.
Hint: this lesson does not add `useUpdateJourney`; that arrives in 18.
Done when: `lesson status 10` shows no open dashboard LIVE markers and `yarn --cwd dashboard typecheck` passes; in lesson 11, creating a journey refreshes the list and Overview without a reload, thanks to this invalidation.

## Checkpoint
The browser shows real API-backed Overview, Bookings, Passengers, passenger detail, Stations & routes, and Login screens; Journeys has read-only API data, while create journey, Extras add-ons, and status controls are still future work. Commands: `lesson status 10`, `yarn --cwd dashboard typecheck`, `yarn --cwd dashboard lint`, `yarn --cwd dashboard test`.
