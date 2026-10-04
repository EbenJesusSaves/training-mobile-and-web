# 07 · Navigation & routing

**Notes:** `/courses/scalable-mobile-and-web-apps/navigation-and-routing` on the course website · **Time:** 25 min ·
**Workspace changes:** `lesson start 07` adds 26 mobile and 22 dashboard files (LIVE 07.1–07.3, 07.5–07.7) and removes the playground/prototype fixture folders

## Goal

Turn isolated playgrounds into routed apps. Mobile gains Expo Router groups, tabs and guarded route prototypes; the dashboard gains a lazy React Router shell.

## What happens

1. **Concept and map (about 4 min):** route groups, layouts, dynamic params, lazy modules and URL-owned state.
2. **Talk-through (about 5 min):** compare the mobile root layout, prototype links and dashboard route tree.
3. **Mobile LIVE tasks (about 7 min):** LIVE 07.1 typed Home href (📱), LIVE 07.2 journey param (📱), LIVE 07.3 `Stack.Protected` guards (📱).
4. **Dashboard LIVE tasks (about 6 min):** LIVE 07.5 detail route (🖥️), LIVE 07.6 active navigation (🖥️), LIVE 07.7 route param (🖥️).
5. **Checkpoint and compare (about 3 min):** click both prototypes, run `lesson diff mobile`, then `lesson diff dashboard`.

## LIVE tasks

| Task | App | File | What you write |
| --- | --- | --- | --- |
| LIVE 07.1 typed href | 📱 | `mobile/app/(app)/(tabs)/index.tsx` | Pass `href={{ pathname: '/journeys/[id]', params: { id: 'jrny_001' } }}` to `PrototypeScreen`. |
| LIVE 07.2 journey param | 📱 | `mobile/app/(app)/journeys/[id].tsx` | Import `useLocalSearchParams`, read `{ id }` with `{ id: string }`, and show `Journey id: ${id ?? 'missing'}`. |
| LIVE 07.3 protected groups | 📱 | `mobile/app/_layout.tsx` | Add `isSignedIn` and `hasSeenOnboarding` prototype flags, then wrap `(app)`, `onboarding` and `(auth)` in three `Stack.Protected` guards. |
| LIVE 07.5 detail route | 🖥️ | `dashboard/src/app/router.tsx` | Add the lazy child route `{ path: 'journeys/:journeyId', lazy: () => import('./routes/journey-detail-route') }`. |
| LIVE 07.6 active navigation | 🖥️ | `dashboard/src/app/layouts/dashboard-layout.tsx` | Use `useLocation()`, add `isActivePath`, and mark nav items active from `location.pathname`. |
| LIVE 07.7 route param | 🖥️ | `dashboard/src/app/routes/journey-detail-route.tsx` | Use `useParams()`, read `journeyId`, and render `JourneyDetailView` only when it exists. |

## Checkpoint

- 📱 Home **Continue** opens `Journey id: jrny_001`, then checkout; flipping the two prototype flags shows app, onboarding and auth groups.
- 🖥️ The dashboard shell renders lazy placeholder pages, and `/journeys/demo` keeps Journeys active.
- `yarn run check` passes. Keep `yarn mobile` running after route files arrive so Expo regenerates `.expo/types/router.d.ts`.

## Common problems

- **Typed href errors:** start `yarn mobile` once after `lesson start 07`; Expo writes `.expo/types/router.d.ts` while Metro runs.
- **Auth screen will not show:** set `isSignedIn = false` and `hasSeenOnboarding = true` together.
- **Onboarding will not show:** set both flags to `false`.
- **Dashboard nav not active on detail pages:** nested paths need `current.startsWith(path)`, while `/` must be exact.

## Facilitator notes

- Demo route groups visually: collapse `(app)` and `(auth)` in the file tree.
- Keep the prototype flags in code until everyone has seen all three route groups.
- If short on time, pair learners for the dashboard route tasks; the mobile guards are the key concept.

**Next:** lesson 08 extracts data rules into tested pure functions.
