# Lesson 13 · Performance — 📱 Mobile

> The tickets list keeps its identity stable as bookings change. You fix the one list-key regression that can make rows reuse the wrong ticket during insertions or re-ordering.

## What arrives

| File | Status | Why it's here |
| --- | --- | --- |
| `mobile/app/(app)/(tabs)/tickets.tsx` | RailPass, LIVE 13.1 | The real tickets list, with a deliberate key regression for the performance discussion. |

## Talk through (together)

1. **`mobile/app/(app)/(tabs)/tickets.tsx`: list identity.** Ask: what does React Native use `keyExtractor` for? Answer: it keeps row instances tied to the same booking as data changes.
2. **`bookings:${scope}`: cache scope.** Ask: why is the booking scope part of the query key? Answer: upcoming and past trips are different server-state lists.
3. **`TripListItem`: don't optimise blindly.** Ask: do we need to memoise this row in the LIVE task? Answer: no. The task fixes identity first; memoisation only pays after profiling shows wasted renders.

## Live tasks

### LIVE 13.1 — Key tickets by booking id (`mobile/app/(app)/(tabs)/tickets.tsx`)

**Why:** index keys are unstable. If a booking is inserted, removed or re-ordered, React can reuse the wrong row instance and show stale row state.

1. Find the `FlatList` in `TicketsScreen`.
2. Replace `keyExtractor={(_booking, index) => String(index)}` with `keyExtractor={(booking) => booking.id}`.
3. Leave `renderItem`, `ItemSeparatorComponent`, refresh and empty-state logic unchanged.
4. Do not add memoisation here. This task is about stable identity for the list.

**Hint:** the API booking id is already stable across upcoming and past scopes.

**Done when:** switching between **Upcoming** and **Past & cancelled** still renders tickets, and `lesson status 13` no longer lists LIVE 13.1.

## Checkpoint

Open **My Tickets**, switch between upcoming and past trips, and pull to refresh. Rows keep the same booking identity even if the server returns a different order. Commands: `lesson status 13` shows no open mobile tasks, and `yarn run check` passes from the workspace root.

## Removed / replaced in this lesson

`lesson start 13` overwrites `mobile/app/(app)/(tabs)/tickets.tsx` with the keyed-list exercise. Nothing is deleted.
