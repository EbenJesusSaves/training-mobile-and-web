# Lesson 18 · Capstone: ship a feature end to end — 📱 Mobile

> Passengers see operational changes made in the dashboard. Upcoming delayed or cancelled trips light the Home bell and appear in a Trip updates screen.

## What arrives

| File | Status | Why it's here |
| --- | --- | --- |
| `mobile/hooks/use-trip-updates.ts` | RailPass, LIVE 18.1 | Derives delayed and cancelled trip updates from the upcoming-bookings query. |
| `mobile/app/(app)/updates.tsx` | RailPass, LIVE 18.2 | Renders the updates list with loading, empty, error and data states. |
| `mobile/app/(app)/(tabs)/index.tsx` | RailPass, LIVE 18.3 | Home replaces `const hasUpdates = false` with the derived update hook. |

## Talk through (together)

1. **`use-trip-updates.ts`: derive, don't store.** Ask: why not add a Zustand store for updates? Answer: updates are server state derived from `bookings:upcoming`.
2. **`flatMap`: one booking can have multiple affected segments.** Ask: what happens to round trips? Answer: every non-`SCHEDULED` segment becomes one `TripUpdate`.
3. **`updates.tsx`: state coverage.** Ask: what must the screen render besides data? Answer: skeleton, empty state, error with retry and pull-to-refresh.
4. **End-to-end flow:** Ask: who creates the signal? Answer: staff mark a journey delayed or cancelled in the dashboard; the passenger app reads upcoming bookings and shows the bell/card.

## Live tasks

### LIVE 18.1 — Derive trip updates (`mobile/hooks/use-trip-updates.ts`)

**Why:** Home and Updates need the same source of truth without copying server data into a client store.

1. Import `useMemo`, `useApiQuery` and `bookingsApi`.
2. Call `useApiQuery('bookings:upcoming', (signal) => bookingsApi.list('upcoming', signal), { refetchOnFocus: true })`.
3. Build `updates` with `useMemo<TripUpdate[]>(...)` from `(query.data ?? []).flatMap(...)`.
4. For each booking, filter `booking.segments` to segments where `segment.journey.status !== 'SCHEDULED'`.
5. Map each segment to `{ id: `${booking.id}-${segment.id}`, booking, journey: segment.journey, kind: segment.journey.status as 'DELAYED' | 'CANCELLED' }`.
6. Return `{ ...query, updates, hasUpdates: updates.length > 0 }`.

**Hint:** use the existing `TripUpdate` interface; do not create a new store.

**Done when:** the hook exposes query state plus `updates` and `hasUpdates`.

### LIVE 18.2 — Render trip updates (`mobile/app/(app)/updates.tsx`)

**Why:** passengers need one clear place to see delayed or cancelled trips and open the affected ticket.

1. Import `Pressable`, `View`, `router`, `AppText`, `Icon`, `useTheme`, `ErrorState`, `Skeleton`, `useTripUpdates`, `formatDateTime` and the token constants used in the solution.
2. Read `const { updates, isLoading, error, refetch, isRefreshing, data } = useTripUpdates();`.
3. Use `<Screen refreshing={isRefreshing} onRefresh={refetch}>` and `<HeaderBar title="Trip updates" />`.
4. Render a skeleton while loading, `ErrorState` when there is an error and no cached data, and an `EmptyState` titled `You’re all caught up` when `updates.length === 0`.
5. Map updates to `Pressable` cards. Each card pushes `{ pathname: '/tickets/[id]', params: { id: update.booking.id } }`.
6. Use cancelled cards for `update.kind === 'CANCELLED'`: `ban`, danger colours and copy `Train cancelled` / `Contact RailPass staff to rebook or arrange a refund.`.
7. Use delayed cards otherwise: `clock`, warning colours and copy `Delayed by ${update.journey.delayMinutes} min` / `Your seats are unchanged. Booking ${update.booking.reference}`.
8. Add the `list`, `item`, `icon` and `text` styles from the solution.

**Hint:** colour is not the only signal. The icon and text change too.

**Done when:** `/updates` shows loading, empty, error and update cards, and tapping a card opens its ticket.

### LIVE 18.3 — Show the Home update badge (`mobile/app/(app)/(tabs)/index.tsx`)

**Why:** passengers need a lightweight signal before they open the updates screen.

1. Import `useTripUpdates` from `@/hooks/use-trip-updates`.
2. Replace the marker and `const hasUpdates = false;` with `const { hasUpdates } = useTripUpdates();`.
3. Leave the existing bell UI and navigation unchanged.

**Hint:** the hook refetches on focus, so returning to Home is enough to refresh the badge.

**Done when:** after staff mark one of your upcoming journeys delayed or cancelled, returning to Home shows the bell badge.

## Checkpoint

Create or use a booking on a journey, then in the dashboard mark that journey **Delayed** and save. Return to mobile Home: the bell has a badge. Open **Trip updates**, read the delayed card, tap it and land on the ticket. Commands: `lesson status 18` shows no open mobile tasks, `lesson diff mobile` lists only the files where your version differs from RailPass (the folder README notes and `.env.example` always do), and `yarn run check` passes from the workspace root.

## Removed / replaced in this lesson

`lesson start 18` overwrites Home, `updates.tsx` and `use-trip-updates.ts`, and removes `mobile/prototype`. The old prototype screen is no longer used.
