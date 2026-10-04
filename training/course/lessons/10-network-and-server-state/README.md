# 10 · Network layer & server state

**Notes:** `/courses/scalable-mobile-and-web-apps/network-and-server-state` on the course website · **Time:** 30 min ·
**Workspace changes:** `lesson start 10` adds 18 mobile and 45 dashboard files (LIVE 10.1–10.3, 10.5–10.7)

## Goal

Replace mock journeys with API-backed screens and shared network policy. Mobile uses a small `useApiQuery` cache; the dashboard uses TanStack Query keys and invalidation.

## What happens

1. **Concept (about 4 min):** API client, error shape, query keys, cache ownership and invalidation.
2. **Talk-through (about 6 min):** inspect the Axios clients, mobile `useApiQuery`, dashboard key factories and course-version screens.
3. **Mobile LIVE tasks (about 8 min):** LIVE 10.1 request interceptor (📱), LIVE 10.2 abort stale queries (📱), LIVE 10.3 seat polling (📱).
4. **Dashboard LIVE tasks (about 8 min):** LIVE 10.5 auth header (🖥️), LIVE 10.6 journey keys (🖥️), LIVE 10.7 create invalidation (🖥️).
5. **Checkpoint and compare (about 4 min):** sign out old prototype sessions, search real journeys, inspect dashboard API data, then run diffs.

## LIVE tasks

| Task | App | File | What you write |
| --- | --- | --- | --- |
| LIVE 10.1 request interceptor | 📱 | `mobile/api/client.ts` | Set `config.baseURL = getApiBaseUrl()`, read the session token, and set a bearer `Authorization` header when it exists. |
| LIVE 10.2 abort stale queries | 📱 | `mobile/hooks/use-api-query.ts` | Abort the previous controller for the key, ignore aborted results, and do not store errors from aborted requests. |
| LIVE 10.3 seat polling | 📱 | `mobile/app/(app)/journeys/[id].tsx` | Set `refetchIntervalMs: appConfig.seatRefreshMs` on the seat-map query. |
| LIVE 10.5 dashboard auth header | 🖥️ | `dashboard/src/shared/api/client.ts` | Read `authAccessors.getToken()` and set a bearer `Authorization` header when a token exists. |
| LIVE 10.6 journey keys | 🖥️ | `dashboard/src/features/journeys/api/journey-keys.ts` | Build `list(params)` and `detail(id)` keys from `journeyKeys.all`. |
| LIVE 10.7 create invalidation | 🖥️ | `dashboard/src/features/journeys/api/journey-queries.ts` | Use `useQueryClient()` and invalidate `journeyKeys.all` plus `overviewKeys.all` after create succeeds. |

## Checkpoint

- 📱 Sign out first if lesson 09 remembered `prototype-token`. Then use **Sign in as Ama (demo passenger)**, search real journeys, open a journey, and toggle seats on the real seat map. Checkout is still a prototype.
- 🖥️ Overview, Bookings, Passengers, passenger detail, Stations & routes, Login and read-only Journeys read from the API.
- `yarn run check` passes.

## Common problems

- **Immediate 401 on mobile:** sign out of the lesson 09 prototype session, then use the demo API sign-in.
- **Phone cannot reach API:** use the facilitator LAN address, not `localhost`, in the mobile API URL.
- **Stale search results flash:** make sure aborted mobile requests return without storing data or errors.
- **Dashboard create does not refresh later:** invalidations must target both `journeyKeys.all` and `overviewKeys.all`.

## Facilitator notes

- Show one network request before coding so learners see the base URL and bearer token.
- Keep checkout expectations clear: no real confirmation until lesson 11.
- Use the mobile app to show why seat polling matters.

**Next:** lesson 11 adds forms, validation, checkout and failure recovery.
