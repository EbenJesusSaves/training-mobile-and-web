# Lesson 07 · Navigation & routing — 🖥️ Dashboard

## Goal
The dashboard gains a routed shell with lazy route modules and placeholder pages.

## What arrives
| Path | Status | Why |
|---|---|---|
| `src/app/router.tsx` | course version → RailPass in 12 | Browser route tree without the staff guard until auth is taught. |
| `src/app/layouts/dashboard-layout.tsx`, `.module.css` | course version → RailPass in 12 | Sidebar, header, active nav, and `<Outlet />`. |
| `src/app/routes/bookings-route.tsx`, `extras-route.tsx`, `journey-detail-route.tsx`, `journeys-route.tsx`, `login-route.tsx`, `network-route.tsx`, `overview-route.tsx`, `passenger-detail-route.tsx`, `passengers-route.tsx` | RailPass | Thin `Component` exports for React Router lazy loading. |
| `features/*/components/*-view.tsx` placeholders | course version → RailPass in 10/11/17/18 | `PageHeader` and `EmptyState` pages until data arrives. |
| `src/app/providers.tsx` | course version → RailPass in 10 | Switches from playground to `RouterProvider`. |
| `src/app/course-playground.tsx`, `src/prototype/` | removed | The routed pages replace the playground, and nothing else imports the fixtures. |

## Talk through
- **`router.tsx` — lazy routes.** Ask: what happens when every page is imported eagerly? Answer: the first bundle grows with screens users may not visit.
- **`dashboard-layout.tsx` — URL-derived active state.** Ask: why avoid local nav state? Answer: refresh and deep links stay accurate.
- **`routes/journey-detail-route.tsx` — param handoff.** Ask: where should URL parsing stop? Answer: at the route boundary.

## LIVE 07.5 — detail route
Why: deep linking is part of the app contract, not an afterthought.
1. In `router.tsx`, add the child route `path: 'journeys/:journeyId'`.
2. Set `lazy: () => import('./routes/journey-detail-route')`.
3. Keep route modules code-split with `lazy`.
Hint: place it next to the journeys list route.
Done when: `/journeys/demo` opens the detail placeholder.

## LIVE 07.6 — active navigation
Why: the sidebar should reflect the URL after refreshes and direct links.
1. In `dashboard-layout.tsx`, use `useLocation()`.
2. Compare each nav item with `location.pathname`.
3. Mark exact `/` and nested section matches active.
Hint: nested pages such as `/journeys/abc` should keep Journeys active.
Done when: the active nav item follows navigation and refresh.

## LIVE 07.7 — route param
Why: feature views should receive typed inputs from the route layer.
1. In `journey-detail-route.tsx`, import `useParams` from `react-router`.
2. Read `useParams<{ journeyId: string }>()`.
3. Pass `journeyId ?? ''` to `JourneyDetailView`.
Hint: keep the export named `Component`.
Done when: the placeholder header shows the id from the URL.

## Checkpoint
The browser shows the dashboard sidebar/header shell; Overview, Journeys, detail, Network, Extras, Bookings, Passengers, passenger detail, and Login render placeholder pages. Commands: `lesson status 07`, `yarn --cwd dashboard typecheck`, `yarn --cwd dashboard lint`, `yarn --cwd dashboard test`.
