# 0002 · TanStack Query for server state on the dashboard (Redux Toolkit for client state)

- **Status:** accepted
- **Applies to:** 🖥️ dashboard

## Context

The staff dashboard is mostly server data: paginated, searchable lists of journeys, bookings and passengers,
detail drawers, an overview that refreshes on its own, and mutations (create a journey, change its status, edit
capacity) that must refresh exactly the screens they affect. It also has a little client state: the session and the
colour-scheme preference.

## Options considered

| Option | For | Against |
| --- | --- | --- |
| `useEffect` + `fetch`/Axios in each view | No library | Loading, error, caching, retries and refetching are rewritten in every view |
| Store server data in Redux (thunks) | One library | We'd hand-write cache invalidation and staleness; data gets duplicated and goes stale |
| RTK Query | Same family as Redux, one devtools | Ties server state to the Redux store; we want the two kinds of state visibly separate |
| TanStack Query + Redux Toolkit | Each tool does one job | Two libraries to learn, and a boundary to respect |

## Chosen

TanStack Query 5 holds **all server state**. Each feature has `api/<x>-api.ts` (HTTP calls), `api/<x>-keys.ts`
(a query-key factory) and `api/<x>-queries.ts` (hooks such as `useJourneys`, `useUpdateJourney`). Shared defaults
live in `dashboard/src/app/query-client.ts` (`staleTime` from `queryTimings.staleMs`, no retry on 401).
Redux Toolkit holds **client state** only (`auth-slice.ts`, `preferences-slice.ts`). **Server data is never copied
into Redux.**

## Why

- Caching, deduplication, background refetching, refetch intervals and retries come for free.
- Key factories make invalidation targeted: after a journey changes, `useUpdateJourney` invalidates the journey and
  overview keys (`journeyKeys.all`, `overviewKeys.all`), not "everything".
- Views stay small: they call a hook and render loading, error, empty or data.

## Trade-offs

- Two state tools: every new piece of state needs the "server or client?" question answered (lesson 09).
- Query keys are an API of their own: a typo means a separate cache, which is why the factories exist.

## Choose differently when

- The app has a handful of simple reads: a small hook is enough. The mobile app's `hooks/use-api-query.ts`
  (about 140 lines: cache-then-revalidate, abort, ignore out-of-order responses, refetch on focus, polling) is that
  choice; compare the two in lesson 10.
- You use GraphQL: a GraphQL client (Apollo, urql, Relay) gives normalised caching.
- The team already uses Redux everywhere: RTK Query keeps one mental model.
