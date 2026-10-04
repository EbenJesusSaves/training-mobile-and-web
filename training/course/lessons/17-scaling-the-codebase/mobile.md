# Lesson 17 · Scaling the codebase — 📱 Mobile

> Learners add the station detail feature with the same playbook they can reuse for later work: route, params, data, existing components, states and navigation.

## What arrives

| File | Status | Why it's here |
| --- | --- | --- |
| `mobile/app/(app)/stations/[id].tsx` | RailPass, LIVE 17.1 | Starts as a small prototype with `useLocalSearchParams` and a LIVE marker; the solution is the full station detail screen. |

## Talk through (together)

1. **Route + params:** Ask: what owns the station id? Answer: the route file reads `useLocalSearchParams<{ id: string }>()` and keeps route knowledge at the edge.
2. **Data via an API module:** Ask: why call `travelApi.station(id)` through `useApiQuery`? Answer: screens use the existing query wrapper, refresh behaviour and error shape.
3. **Existing components first:** Ask: why use `HeaderBar`, `Screen`, `Button`, `StatusChip`, `Skeleton`, `EmptyState` and `ErrorState`? Answer: new features should compose proven pieces before inventing new UI.
4. **Navigation after state:** Ask: what does `bookFrom` do before `router.navigate('/')`? Answer: it writes `origin` and optionally `destination` into `useBookingDraftStore`.

## Live tasks

### LIVE 17.1 — Build station detail with the playbook (`mobile/app/(app)/stations/[id].tsx`)

**Why:** a repeatable add-feature order keeps new screens small, testable and consistent with the rest of the app.

1. Keep `const { id } = useLocalSearchParams<{ id: string }>();`, then add `useTheme()` and `useApiQuery(`station:${id}`, () => travelApi.station(id), { refetchOnFocus: true })`.
2. Pull `setStation` from `useBookingDraftStore.getState()` and write `bookFrom(destination?: Station)`: set the current station as `origin`, optionally set `destination`, then `router.navigate('/')`.
3. Wrap the screen as `<Screen refreshing={detail.isRefreshing} onRefresh={detail.refetch}>` with `<HeaderBar title="Station" />`.
4. Render states in order: `ErrorState` when there is an error and no data, a list of `Skeleton` rows while data is missing, then the content.
5. In the content, render the hero with `detail.data.code`, `detail.data.city`, `detail.data.name`, optional `detail.data.address`, and a `Button` titled `Book from this station`.
6. Render **Destinations** from `detail.data.destinations`. Each `Pressable` calls `bookFrom(destination.station)` and has `accessibilityLabel={`Book to ${destination.station.name}, from ${formatFare(destination.fromFareCents)}`}`.
7. Render **Next departures** from `detail.data.departures`. Show an `EmptyState` when there are none; otherwise show time, date, destination city, train number, duration, seats left and a `StatusChip` for delayed or cancelled journeys.
8. Add the styles from the solution: `skeletons`, `hero`, `address`, `heroButton`, `section`, `list`, `row`, `flex` and `time`, using the existing tokens.

**Hint:** build in the playbook order. Do not start with styles; first make the route, data and states correct.

**Done when:** opening a station shows its hero, destinations and next departures; tapping **Book from this station** returns Home with the origin filled.

## Checkpoint

Open a station from the app, pull to refresh, choose a destination, and confirm Home is prefilled from the station detail screen. Commands: `lesson status 17` shows no open mobile tasks, and `yarn run check` passes from the workspace root.

## Removed / replaced in this lesson

`lesson start 17` overwrites `mobile/app/(app)/stations/[id].tsx`, replacing the prototype station detail route. Nothing is deleted.
