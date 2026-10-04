# Lesson 07 · Navigation & routing — 📱 Mobile

> By the end, RailPass Mobile has real Expo Router route groups, tabs, sheets, dynamic segments and a clickable booking-flow prototype. The screens are still mostly placeholders, but the route contract is real.

## What arrives

| File | Status | Why it's here |
| --- | --- | --- |
| `mobile/app/(app)/_layout.tsx`, `mobile/app/(auth)/_layout.tsx`, `mobile/app/(app)/(tabs)/_layout.tsx` | RailPass | Route-group layouts for app screens, auth screens and the tab shell. |
| `mobile/components/layout/app-tab-bar.tsx` | RailPass | The custom RailPass tab bar used by the tabs layout. |
| `mobile/prototype/prototype-screen.tsx` | course-only (removed in 18) | Shared placeholder screen with a typed `Href` for the route prototypes. |
| `mobile/app/(app)/(tabs)/index.tsx` | course version, LIVE 07.1 → RailPass in 10 | Home prototype. Its header says lesson 10 replaces it with the API-backed Home. |
| `mobile/app/(app)/journeys/[id].tsx` | course version, LIVE 07.2 → RailPass in 10 | Journey detail prototype with a dynamic segment. |
| `mobile/app/_layout.tsx` | course version, LIVE 07.3 → RailPass in 09 | Root layout with prototype route guards before the stores exist. |
| `mobile/app/onboarding.tsx`, `mobile/app/(auth)/sign-in.tsx`, `mobile/app/(app)/(tabs)/profile.tsx`, `mobile/app/(app)/sort.tsx` | course version → RailPass in 09 | Prototypes for the state-management screens. |
| `mobile/app/(app)/(tabs)/stations.tsx`, `mobile/app/(app)/(tabs)/tickets.tsx`, `mobile/app/(app)/booking-confirmed/[id].tsx`, `mobile/app/(app)/return-journeys.tsx`, `mobile/app/(app)/station-picker.tsx` | course version → RailPass in 10 | Prototypes for API-backed travel screens. |
| `mobile/app/(app)/checkout.tsx`, `mobile/app/(app)/tickets/[id].tsx`, `mobile/app/(auth)/sign-up.tsx` | course version → RailPass in 11 | Prototypes for checkout, ticket detail and account creation. |
| `mobile/app/(app)/change-password.tsx`, `mobile/app/(app)/edit-profile.tsx`, `mobile/app/(auth)/forgot-password.tsx`, `mobile/app/(auth)/reset-password.tsx` | course version → RailPass in 12 | Prototypes for account and password flows. |
| `mobile/app/(app)/stations/[id].tsx` | course version → RailPass in 17 | Station detail placeholder. |
| `mobile/app/(app)/updates.tsx` | course version → RailPass in 18 | Trip updates placeholder. |

## Talk through (together)

1. **`mobile/app/_layout.tsx`: guarded groups.** Ask: why protect groups instead of redirecting from every screen? Answer: screens that are not allowed do not exist in the tree, so one store change can swap whole areas of the app.
2. **`mobile/app/(app)/(tabs)/_layout.tsx`: tabs inside the app group.** Ask: why is the tabs layout nested under `(app)`? Answer: tabs should only exist for signed-in passengers.
3. **`mobile/prototype/prototype-screen.tsx`: typed `Href`.** Ask: why type the prototype links? Answer: even placeholders exercise the route names and params that later screens keep.
4. **`mobile/app/(app)/journeys/[id].tsx`: route boundary.** Ask: where should a route param be read? Answer: in the route file, then pass normal props or values deeper when the screen becomes real.

## Live tasks

### LIVE 07.1 — Link Home with a typed href (`mobile/app/(app)/(tabs)/index.tsx`)

**Why:** the Home prototype should click into the same dynamic route that the real Home uses in lesson 10.

1. Keep the `PrototypeScreen` title `Home prototype` and body `Pick a journey and follow the route flow.`
2. Replace the one-line return with a multi-line `PrototypeScreen`.
3. Add `href={{ pathname: '/journeys/[id]', params: { id: 'jrny_001' } }}`.
4. Do not use a string path. The object form proves the dynamic param is typed.

**Hint:** if TypeScript rejects the href, start or keep `yarn mobile` running so Expo regenerates `.expo/types/router.d.ts`.

**Done when:** tapping **Continue** on Home opens the journey detail prototype for `jrny_001`.

### LIVE 07.2 — Read the journey id param (`mobile/app/(app)/journeys/[id].tsx`)

**Why:** the route file owns the dynamic segment. Later API code will use the same id to fetch the journey and seat map.

1. Import `useLocalSearchParams` from `expo-router`.
2. Inside `RoutePrototype`, add `const { id } = useLocalSearchParams<{ id: string }>();`.
3. Change the body to ``Journey id: ${id ?? 'missing'}``.
4. Keep `href="/checkout"` so the prototype can continue to checkout.

**Hint:** the generic on `useLocalSearchParams` is the contract for this route's params.

**Done when:** Home → **Continue** shows `Journey id: jrny_001`, then **Continue** opens checkout.

### LIVE 07.3 — Protect the route groups (`mobile/app/_layout.tsx`)

**Why:** learners need to see how auth and onboarding gates shape the route tree before the stores arrive in lesson 09.

1. In `RootNavigator`, below `const { colors, scheme } = useTheme();`, add the prototype flags:
   `const isSignedIn = true;` and `const hasSeenOnboarding = true;`.
2. Wrap `(app)` in `<Stack.Protected guard={isSignedIn}>`.
3. Wrap `onboarding` in `<Stack.Protected guard={!isSignedIn && !hasSeenOnboarding}>`.
4. Wrap `(auth)` in `<Stack.Protected guard={!isSignedIn && hasSeenOnboarding}>`.
5. Flip the two flags while Metro is running to show each group, then put both back to `true` for the checkpoint.

**Hint:** the three guards are mutually exclusive: app, onboarding, or auth.

**Done when:** changing only the two flags lets you see the app tabs, onboarding screen and auth screens.

## Checkpoint

On the device, start at the app tabs. Tap Home **Continue** → journey detail shows `Journey id: jrny_001` → **Continue** opens checkout. Use the tabs for Stations, Tickets and Profile, and flip the prototype flags once to prove onboarding and auth are guarded.

Commands: `lesson status 07` shows no open mobile tasks, and `yarn run check` passes from the workspace root.

## Removed / replaced in this lesson

`lesson start 07` deletes `mobile/app/index.tsx`, `mobile/prototype/fixtures.ts`, `dashboard/src/app/course-playground.tsx` and `dashboard/src/prototype`. It overwrites the course-only playground with route groups, tab navigation, route prototypes and `mobile/prototype/prototype-screen.tsx`.
