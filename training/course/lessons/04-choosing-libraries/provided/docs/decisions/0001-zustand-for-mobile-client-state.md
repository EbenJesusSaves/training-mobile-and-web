# 0001 · Zustand for client state in the mobile app

- **Status:** accepted
- **Applies to:** 📱 mobile

## Context

The passenger app keeps a little state that is not server data and must outlive a screen: the session (token and
user), preferences (theme, onboarding seen, a developer API URL) and the booking draft (route, date, passengers,
seats and extras while you book). Some of it must survive an app restart. The required mobile stack lists Axios and
Zustand.

## Options considered

| Option | For | Against |
| --- | --- | --- |
| React Context + `useReducer` | Built in, no dependency | Every consumer re-renders on any change; persistence is hand-written |
| Redux Toolkit | Strict patterns, great devtools; the dashboard uses it | More ceremony (slices, store, provider, typed hooks) for three small stores |
| Zustand | Tiny, hook-based, selectors, `persist` middleware | Fewer guard rails: the team must agree how stores are shaped |

## Chosen

Zustand 5, one store per concern in `mobile/store/`: `session-store.ts`, `preferences-store.ts` and
`booking-draft-store.ts`. Each persists through the `persist` middleware into `mobile/libs/secure-storage.ts`,
and `partialize` decides what is saved (the session only when "Remember me" is on; the draft only keeps the route).

## Why

- Components subscribe with selectors (`useSessionStore((s) => s.user)`, or `useShallow` for several fields), so
  unrelated changes don't re-render them.
- No provider to mount, and stores can be read outside React (the API client reads the token with `getState()`).
- Persistence is a few lines of configuration instead of custom code.

## Trade-offs

- Freedom needs conventions: one store per concern, actions inside the store, no server data in stores.
- Less tooling than Redux DevTools out of the box.

## Choose differently when

- Many developers need the same strict structure and time-travel debugging: Redux Toolkit (as on the dashboard).
- Most of the "state" is really server data: use a server-state library (see 0002), not a bigger store.
