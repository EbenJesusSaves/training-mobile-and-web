# Lesson 1 — Project organisation, naming, imports and feature boundaries

**Estimated duration:** 60 minutes

## Learning objectives

By the end, learners can:

- Explain why `mobile/app/` contains thin Expo Router entries while implementation lives in `mobile/features/*/screens/`.
- Place new screens, components, hooks, API functions, constants and config in the right layer.
- Apply naming conventions: kebab-case files, PascalCase components, `useX` hooks, grouped imports.
- Distinguish design constants from runtime configuration.

## Relevant code paths

- `mobile/app/_layout.tsx`
- `mobile/app/(app)/_layout.tsx`
- `mobile/app/(auth)/sign-in.tsx`
- `mobile/app/(app)/station-picker.tsx`
- `mobile/app/(app)/(tabs)/index.tsx`
- `mobile/config/app-config.ts`
- `mobile/constants/spacing.ts`
- `dashboard/src/app/router.tsx`
- `dashboard/src/features/journeys/components/journeys-view.tsx`
- `docs/architecture.md`

## Real snippets to read aloud

Route files are intentionally thin:

```tsx
import { SignInScreen } from '@/features/auth/screens/sign-in-screen';

export default SignInScreen;
```

`mobile/app/(auth)/sign-in.tsx` exports a screen from the feature layer. It does not fetch, format, style or validate.

The root layout owns cross-cutting bootstrapping and route gating:

```tsx
<Stack.Protected guard={isSignedIn}>
  <Stack.Screen name="(app)" />
</Stack.Protected>
<Stack.Protected guard={!isSignedIn && hasSeenOnboarding}>
  <Stack.Screen name="(auth)" />
</Stack.Protected>
```

`mobile/config/app-config.ts` is runtime configuration, not styling:

```ts
export const appConfig = {
  currencySymbol: 'GH₵',
  maxPassengers: 6,
  seatRefreshMs: 20_000,
  requestTimeoutMs: 15_000,
} as const;
```

## What we chose / Why / Trade-offs / When we'd choose differently

| Topic               | What we chose                                                                           | Why                                                                  | Trade-offs                                                          | Choose differently when                                                                           |
| ------------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Mobile routing      | Expo Router route files under `mobile/app/`                                             | File-based routes keep navigation discoverable and deep-linkable     | New hires may put implementation into route files                   | A tiny prototype may keep screen code inline; a large app should keep this split                  |
| Feature structure   | `mobile/features/<feature>/{screens,components,hooks}`                                  | Keeps booking, tickets, stations, profile and auth independent       | Shared code must be carefully promoted to `components/` or `hooks/` | A component is used by two features and has no feature-specific language                          |
| Config vs constants | `mobile/config/app-config.ts` for runtime rules, `mobile/constants/*` for design values | Prevents hidden magic numbers and supports facilitator API overrides | More imports at first                                               | A value changes by deployment or environment: config; a value changes by design system: constants |
| Dashboard routing   | Central `dashboard/src/app/router.tsx` with feature pages                               | React Router routes are explicit and guarded at the app boundary     | Less file-system automation than Expo Router                        | File-based routing becomes valuable only if dashboard grows much larger                           |

## Do / Don't examples

### Do — route delegates to a feature screen

```tsx
import { StationPickerScreen } from '@/features/booking/screens/station-picker-screen';

export default StationPickerScreen;
```

### Don't — route becomes a god file

```tsx
// Teaching anti-pattern: do not copy into app routes.
export default function StationPickerRoute() {
  // fetch stations, manage form state, render FlatList, style rows, and mutate the draft here
  return null;
}
```

### Do — import groups follow the project convention

```tsx
import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { AppText } from '@/components/atomic/app-text';
import { Screen } from '@/components/layout/screen';
```

## Live demonstration script

1. Open `mobile/app/_layout.tsx` and identify the app-wide responsibilities: font loading, store hydration, theme provider, protected route groups.
2. Open `mobile/app/(app)/station-picker.tsx`.
3. Ask learners where they would add a new passenger-facing “Trip updates” screen. Compare their answer with `mobile/app/(app)/updates.tsx`.
4. Open `dashboard/src/app/router.tsx`; point out that the guarded staff shell wraps feature pages.
5. Contrast `mobile/constants/spacing.ts` with `mobile/config/app-config.ts`.

## Discussion questions

- What breaks if screen implementation lives directly in `mobile/app/`?
- Why is a runtime API URL not a design token?
- Which layer should own a reusable “empty state” component?
- How would this structure help or hinder a future white-label app?

## Prediction exercise

**Question:** What will happen if `mobile/app/(auth)/sign-in.tsx` starts importing `useSessionStore`, calling the login API, styling the form and rendering all controls itself?

**Facilitator notes / answer:** The app may still run, but the route file stops being a navigation entry. It becomes hard to reuse the sign-in screen, hard to test in isolation, and inconsistent with other routes. Auth flow changes now require editing routing and implementation together, which increases merge conflicts and encourages duplicate form logic.

## Debugging task

A learner adds a hypothetical journey-filter route with full UI implementation inside the route. Ask them to refactor it so local reusable rows move into `mobile/features/booking/`.

## Code-review activity

Review a small PR that adds a new screen. Check:

- Route file is thin.
- Feature-specific components stay inside the feature.
- Shared components are genuinely reusable and free of feature business language.
- Imports are grouped external → components → hooks → utilities/API/store → constants → types/assets.
- Runtime settings go to config; styling values go to constants.

## Implementation challenge

**Task:** Add a learner-only “How this works” static screen to the mobile app without wiring it into production navigation.

**Acceptance criteria:**

- New feature screen lives under a feature folder, not directly in `mobile/app/`.
- Any route file is a two-line delegate like the existing auth routes.
- All spacing/radii/typography values come from constants.
- The screen has at least one header and one paragraph using `AppText`.

## Expected outcomes

Learners should be able to point at any new requirement and state: route entry, feature screen, component, hook, API module, store, constant or config.

## Facilitator guidance

- **Timing:** 20 min walkthrough, 15 min group placement exercise, 15 min review, 10 min recap.
- **Common misconception:** “`app/` means application code.” In Expo Router, `app/` means route entries.
- **How to run:** No stack is required for the lesson; use editor search and file tree. If running, start mobile with `yarn --cwd mobile start`.
