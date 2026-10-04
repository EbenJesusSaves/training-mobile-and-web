# Lesson 10 · Network layer & server state — 📱 Mobile

> By the end, the passenger app signs in through the facilitator API, searches real journeys, opens a real seat map and keeps availability fresh. Checkout is still a prototype until lesson 11.

## What arrives

| File | Status | Why it's here |
| --- | --- | --- |
| `mobile/api/auth-api.ts`, `mobile/api/bookings-api.ts`, `mobile/api/travel-api.ts`, `mobile/api/errors.ts` | RailPass | Typed API modules and one `ApiError` shape for auth, bookings and travel. |
| `mobile/api/client.ts` | course version, LIVE 10.1 → RailPass in 12 | Shared Axios client. This lesson adds base URL and bearer token; lesson 12 adds sign-out on 401. |
| `mobile/hooks/use-api-query.ts` | RailPass, LIVE 10.2 | Tiny server-state cache with cancellation, refresh and invalidation. |
| `mobile/hooks/use-journey-search.ts` | RailPass | Fetches journey results from the current booking draft. |
| `mobile/components/ui/feedback/state-views.tsx`, `mobile/features/booking/archive-list.tsx` | RailPass | Consistent empty/error states and the previous-trips list used by Home. |
| `mobile/app/(app)/(tabs)/index.tsx` | course version → RailPass in 18 | Real Home search and archive, but trip updates stay off with `const hasUpdates = false;`. |
| `mobile/app/(auth)/sign-in.tsx` | course version → RailPass in 11 | One-button API sign-in for `ama@railpass.dev` / `Passenger#2026`. |
| `mobile/app/(app)/checkout.tsx` | course version → RailPass in 11 | Checkout placeholder; no booking confirmation yet. |
| `mobile/app/(app)/(tabs)/stations.tsx`, `mobile/app/(app)/(tabs)/tickets.tsx`, `mobile/app/(app)/booking-confirmed/[id].tsx`, `mobile/app/(app)/return-journeys.tsx`, `mobile/app/(app)/station-picker.tsx` | RailPass | Real API-backed screens that replace lesson 07 prototypes. |
| `mobile/app/(app)/journeys/[id].tsx` | RailPass, LIVE 10.3 | Real journey detail and seat map with polling availability. |

## Talk through (together)

1. **`mobile/api/client.ts`: one network policy.** Ask: why attach base URL and token in an interceptor? Answer: every API module gets the same address, auth and error behaviour.
2. **`mobile/hooks/use-api-query.ts`: server state is not Zustand.** Ask: why not copy journeys into the booking draft store? Answer: journeys are server-owned and need freshness, cancellation and invalidation.
3. **`mobile/app/(app)/(tabs)/index.tsx`: course version.** Ask: why is `hasUpdates` hard-coded false? Answer: trip updates are derived from upcoming bookings in lesson 18, not from this search screen.
4. **`mobile/app/(auth)/sign-in.tsx`: prototype token cleanup.** Ask: what happens if lesson 09 remembered `prototype-token`? Answer: the API rejects it and lesson 12 has not added 401 sign-out yet, so sign out first.

## Live tasks

### LIVE 10.1 — Attach the base URL and bearer token (`mobile/api/client.ts`)

**Why:** all API calls need the facilitator API address and the current passenger token without each feature knowing storage details.

1. In the request interceptor, set `config.baseURL = getApiBaseUrl();`.
2. Read `const token = useSessionStore.getState().token;`.
3. If there is a token, set `config.headers.Authorization` to `'Bearer ' + token` (or the equivalent template string).
4. Return `config`.
5. Leave the response interceptor's lesson 12 comment alone.

**Hint:** `getApiBaseUrl()` already chooses the preferences override or `defaultApiUrl`.

**Done when:** API requests go to the configured course API and authenticated calls include an `Authorization` header.

### LIVE 10.2 — Cancel stale requests (`mobile/hooks/use-api-query.ts`)

**Why:** fast route or date changes should not let an older response overwrite newer data.

1. At the start of `fetchQuery`, call `getEntry(key).controller?.abort();`.
2. Create the new `AbortController` and store it as the entry's `controller`.
3. After `await fetcher(controller.signal)`, return `undefined` if `controller.signal.aborted`.
4. Only store an error when `!controller.signal.aborted`.
5. Keep `isFetching`, `updatedAt`, `controller` and `fetcher` updates in the existing entry shape.

**Hint:** aborting is not an error state for the UI; it means a newer request won.

**Done when:** changing search inputs quickly does not flash stale results or stale errors.

### LIVE 10.3 — Poll seat availability (`mobile/app/(app)/journeys/[id].tsx`)

**Why:** seats can sell while a passenger is deciding. The screen needs fresh availability without a manual refresh.

1. Find the `useApiQuery` call for ``seats:${id}``.
2. Keep `refetchOnFocus: true`.
3. Replace `refetchIntervalMs: undefined` with `refetchIntervalMs: appConfig.seatRefreshMs`.
4. Leave the `onSuccess` reconciliation code unchanged.

**Hint:** this file already imports `appConfig`.

**Done when:** the seat map refetches on the configured interval while the journey screen is open.

## Checkpoint

If you used **Sign in and remember me** in lesson 09, go to Profile and tap **Sign out** first; the remembered `prototype-token` is not accepted by the API, and automatic 401 sign-out arrives in lesson 12. Then sign in with **Sign in as Ama (demo passenger)**. On Home, choose Accra Central → Kumasi Central, pick a date, select a journey class, and see the real seat map. LIVE 09.1's seat toggle is visible here. Checkout still shows the lesson 10 prototype, so there is no real booking confirmation yet.

Commands: `lesson status 10` shows no open mobile tasks, and `yarn run check` passes from the workspace root.

## Removed / replaced in this lesson

`lesson start 10` overwrites the lesson 07 prototypes for Home, Stations, Tickets, booking confirmation, journey detail, return journeys and station picker. It also replaces the lesson 09 sign-in prototype with an API demo sign-in. Nothing is deleted.
