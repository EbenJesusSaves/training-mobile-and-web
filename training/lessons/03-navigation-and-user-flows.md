# Lesson 3 — Navigation and complete user flows

**Estimated duration:** 75 minutes

## Learning objectives

Learners can:

- Trace a one-way and round-trip booking from home search through checkout and tickets.
- Explain Expo Router groups, `Stack.Protected` auth gating, the station picker page and deep-link parameters.
- Describe dashboard routes and the `RequireStaff` guard.
- Identify where navigation decisions belong versus where screen state belongs.

## Relevant code paths

- `mobile/app/_layout.tsx`
- `mobile/app/(app)/_layout.tsx`
- `mobile/app/(app)/(tabs)/_layout.tsx`
- `mobile/app/(app)/station-picker.tsx`
- `mobile/app/(app)/(tabs)/index.tsx`
- `mobile/app/(app)/return-journeys.tsx`
- `mobile/app/(app)/checkout.tsx`
- `mobile/app/(app)/(tabs)/tickets.tsx`
- `dashboard/src/app/router.tsx`
- `dashboard/src/features/auth/require-staff.tsx`

## Real snippets to read aloud

Signed-in screens are grouped and pushed over the tabs:

```tsx
<Stack.Screen name="(tabs)" />
<Stack.Screen name="station-picker" />
<Stack.Screen name="journeys/[id]" />
<Stack.Screen name="return-journeys" />
<Stack.Screen name="checkout" />
```

Home passes route params rather than global navigation state:

```tsx
router.push({ pathname: '/journeys/[id]', params: { id: journey.id, direction: 'OUTBOUND' } });
```

Dashboard staff pages sit behind one guard:

```tsx
{
  path: '/',
  element: (
    <RequireStaff>
      <AppShellLayout />
    </RequireStaff>
  ),
}
```

## What we chose / Why / Trade-offs / When we'd choose differently

| Topic           | What we chose                                                    | Why                                                                 | Trade-offs                                            | Choose differently when                                               |
| --------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------- | ----------------------------------------------------- | --------------------------------------------------------------------- |
| Auth gating     | `Stack.Protected` in the root layout                             | Screens do not check auth individually                              | Requires stores to hydrate before rendering           | Per-screen permissions may need nested guards                         |
| Station picker  | Stack page with `field` param                                    | Same UI chooses origin or destination; returns with `router.back()` | Param must be validated defensively                   | A short list that should keep home in view might be a form sheet      |
| Booking flow    | Draft in Zustand plus route params for current journey/direction | Survives route changes and supports deep links                      | Draft can become stale and must reconcile server data | A server-side hold flow could reduce client draft complexity          |
| Dashboard guard | `RequireStaff` wraps the shell                                   | Staff-only routes stay consistent                                   | Initial `/auth/me` loading state must be handled      | Fine-grained roles would need route metadata or permission components |

## Do / Don't examples

### Do — parametrize the picker route

```tsx
const { field } = useLocalSearchParams<{ field: 'origin' | 'destination' }>();
```

### Don't — create two almost-identical station pickers

```tsx
// Teaching anti-pattern.
router.push('/origin-station-picker');
router.push('/destination-station-picker');
```

### Do — guard the route tree, not every staff page

```tsx
if (!token) return <Navigate to="/login" replace />;
if (user?.role === 'STAFF') return <>{children}</>;
```

## Live demonstration script

1. Start with the home screen and select origin/destination. Show the station picker page and `field` route param.
2. Book one-way: home → journey card → class → seat → checkout → booking confirmed → tickets.
3. Book round-trip: home tab → outbound seat → return journey → return seat → checkout.
4. Open `mobile/app/(app)/journeys/[id].tsx`; show `directionParam` normalization.
5. Sign into the dashboard with a passenger account and show refusal, then sign in with `staff@railpass.dev`.

## Discussion questions

- Which state should be in route params, and which should be in the booking draft store?
- How does file-based routing help deep links like `/journeys/[id]`?
- What user experience should happen when an unauthenticated user opens a ticket deep link?
- Why should dashboard passenger refusal happen before rendering the staff shell?

## Prediction exercise

**Question:** What happens if `Stack.Protected guard={isSignedIn}` is removed around `(app)`?

**Facilitator notes / answer:** The signed-in route group becomes reachable even without a valid session. Individual screens may still fail when API calls return 401, but the navigation invariant is broken. The current design signs out on 401 and relies on the root layout to move the user back to auth screens.

## Debugging task

A learner reports: “After choosing a return seat, checkout only shows the outbound trip.” Walk through `home-screen.tsx`, `return-journeys-screen.tsx`, `seat-selection-screen.tsx` and `booking-draft-store.ts` to verify that inbound is set with direction `RETURN` and that the checkout `segments` array includes inbound for `ROUND_TRIP`.

## Code-review activity

Review a flow PR. Check:

- Navigation actions are close to user events and use typed params.
- No feature screen imports dashboard code or backend code.
- Modal vs push presentation is intentional.
- Back/replace behavior matches user expectations after confirmation.
- Guarding happens once at the boundary.

## Implementation challenge

**Task:** Add a deep-linkable read-only journey details view or extend an existing one with a “book this journey” action.

**Acceptance criteria:**

- The route uses `[id]` params.
- The feature screen fetches by ID and handles loading/error states.
- The booking draft is updated only when the user chooses to book.
- The screen remains reachable after app restart with just the route param.

## Expected outcomes

Learners can draw the passenger and staff navigation trees and explain where each major user decision is stored.

## Facilitator guidance

- **Timing:** 25 min live flow, 20 min trace code, 15 min prediction/debugging, 15 min review.
- **Common misconception:** Route params are a state store. They are for addressable location and minimal context; drafts and selections live in stores.
- **How to run:** Use seeded data. If dates are stale, run `yarn --cwd backend db:reset` before class.
