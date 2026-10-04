# 13 · Performance

**Notes:** `/courses/scalable-mobile-and-web-apps/performance` on the course website · **Time:** 15 min ·
**Workspace changes:** `lesson start 13` adds 1 mobile and 2 dashboard files (LIVE 13.1, 13.5–13.6)

## Goal

Learners fix real performance regressions: stable mobile list keys, debounced dashboard search, and lazy dashboard routes.

## What happens

1. **Concept, about 3 min:** measure first; fix identity, request churn and bundle loading before reaching for broad rewrites.
2. **Mobile LIVE 13.1, about 3 min:** key the tickets `FlatList` by `booking.id`.
3. **Dashboard LIVE 13.5, about 3 min:** debounce the bookings search before it becomes query params.
4. **Dashboard LIVE 13.6, about 3 min:** restore lazy route modules for overview, journeys and bookings.
5. **Checkpoint and compare, about 3 min:** run checks and use `lesson diff mobile` / `lesson diff dashboard`.

## LIVE tasks

| Task | App | File | What you write |
| --- | --- | --- | --- |
| LIVE 13.1 key tickets | 📱 | `mobile/app/(app)/(tabs)/tickets.tsx` | Change `keyExtractor` to `keyExtractor={(booking) => booking.id}`. |
| LIVE 13.5 debounce search | 🖥️ | `dashboard/src/features/bookings/components/bookings-view.tsx` | Import `useDebouncedValue` and use it for the search sent to `useBookings`. |
| LIVE 13.6 lazy routes | 🖥️ | `dashboard/src/app/router.tsx` | Remove eager route imports and use `lazy: () => import(...)` for overview, journeys and bookings. |

## Checkpoint

- 📱 Tickets still load, refresh and switch scopes; row keys are booking ids.
- 🖥️ Bookings search waits briefly before refetching, and route chunks are lazy again.
- `yarn run check` passes.

## Common problems

- If the tickets task feels too small, keep it small. This lesson does not ask for row memoisation.
- If dashboard search does not refetch, check that the query params use the debounced value.
- If route lazy loading fails type-check, keep the route module paths exactly as `./routes/overview-route`, `./routes/journeys-route`, and `./routes/bookings-route`.

## Facilitator notes

- Show how index keys fail with insertion or re-ordering before learners edit.
- Keep the memoisation discussion evidence-based: no profile, no broad memo pass.
- If short on time, skip bundle-output comparison and rely on typecheck plus code review.

**Next:** lesson 14 makes the same UI usable with screen readers and keyboard navigation.
