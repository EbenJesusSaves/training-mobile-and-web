# Lesson 4 — State management decisions in both frontends

**Estimated duration:** 90 minutes

## Learning objectives

Learners can:

- Separate client/session/UI state from server state.
- Explain why mobile uses Zustand plus a small query hook and dashboard uses Redux Toolkit plus TanStack Query.
- Use `persist`, `partialize`, selectors and `useShallow` safely.
- Identify stale-state risks when server data is copied into client stores.

## Relevant code paths

- `mobile/store/session-store.ts`
- `mobile/store/preferences-store.ts`
- `mobile/store/booking-draft-store.ts`
- `mobile/app/(app)/(tabs)/index.tsx`
- `mobile/hooks/use-api-query.ts`
- `dashboard/src/app/store.ts`
- `dashboard/src/features/auth/auth-slice.ts`
- `dashboard/src/features/ui/ui-slice.ts`
- `dashboard/src/app/query-client.ts`
- `dashboard/src/features/journeys/use-journeys.ts`

## Real snippets to read aloud

Mobile persists only what should survive restart:

```ts
partialize: ({ token, user, remember }) =>
  remember ? { token, user, remember } : { token: null, user: null, remember },
```

The booking draft deliberately persists only the last route:

```ts
partialize: ({ origin, destination }) => ({ origin, destination }),
```

Home subscribes to a narrow slice:

```tsx
const draft = useBookingDraftStore(
  useShallow((state) => ({
    tripType: state.tripType,
    origin: state.origin,
    destination: state.destination,
  })),
);
```

Dashboard mutations invalidate server-state caches instead of copying results into Redux:

```ts
queryClient.invalidateQueries({ queryKey: ['journeys'] });
queryClient.invalidateQueries({ queryKey: ['overview'] });
```

## What we chose / Why / Trade-offs / When we'd choose differently

| Topic                  | What we chose                                      | Why                                              | Trade-offs                                              | Choose differently when                                                                                      |
| ---------------------- | -------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Mobile stores          | Zustand for session, preferences and booking draft | Small API, selectors, persistence middleware     | Less structured than Redux for very large teams         | Complex cross-feature state transitions need reducers/devtools conventions                                   |
| Mobile server data     | `useApiQuery` cache and revalidation               | App needs are modest; easy to teach              | No pagination cache, mutations or dedupe sophistication | Adopt TanStack Query on mobile when server state grows, offline support matters, or mutations become complex |
| Dashboard client state | Redux Toolkit for auth/UI                          | Predictable persisted UI state and staff session | Boilerplate for simple flags                            | Local component state is enough for one-off controls                                                         |
| Dashboard server state | TanStack Query                                     | Caching, retry, invalidation, mutation status    | Query keys must be designed carefully                   | For a static page with one fetch, plain hooks may be enough                                                  |

## Do / Don't examples

### Do — store only durable client intent

```ts
setPassengerCount: (count) =>
  set((state) => {
    const passengerCount = Math.min(Math.max(count, 1), appConfig.maxPassengers);
    return { passengerCount };
  }),
```

### Don't — copy an API list into a global store just to render a screen

```ts
// Teaching anti-pattern.
setJourneys(await travelApi.searchJourneys(params));
// Later: forget to update this when a booking changes availability.
```

### Do — invalidate server caches after a successful mutation

```ts
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ['journeys'] });
  notifySuccess('Journey scheduled.');
},
```

## Live demonstration script

1. Open `mobile/store/session-store.ts`; show `remember` and `partialize`.
2. Open `mobile/store/booking-draft-store.ts`; trace `chooseJourney`, `toggleSeat`, `setPassengerCount`, `buildBookingRequest`.
3. Open `home-screen.tsx`; show selectors and `useShallow` preventing unrelated re-renders.
4. Open `dashboard/src/app/store.ts`; show persisted `auth` and `ui` slices.
5. Open `dashboard/src/features/journeys/use-journeys.ts`; identify `useQuery`, `useMutation`, invalidation and notifications.

## Discussion questions

- Why does the mobile draft not persist selected seats?
- Which state should survive app restart?
- What is the danger of saving `journeys` in Redux or Zustand?
- When would React Query on mobile be worth the dependency and conventions?

## Prediction exercise

**Question:** What happens if `booking-draft-store.ts` persists `outbound` and `inbound` seats across app launches?

**Facilitator notes / answer:** The UI may reopen with stale journey data and seats that another user has already booked. Checkout would catch conflicts, but the app would feel misleading. Persisting only origin/destination gives convenience without pretending old seat selections are still valid.

## Debugging task

A learner says: “Changing table density in the dashboard refetched all journeys.” Inspect Redux `ui-slice`, `DataTable` and query keys. The density value should affect only presentation and should not be included in server-state query keys.

## Code-review activity

Review state changes. Ask:

- Is this data produced by the server? If yes, why is it not in a query cache?
- Is this data private or sensitive? How is it persisted?
- Does the selector subscribe to only what the component renders?
- Does changing a local UI preference accidentally invalidate server data?
- Is there a clear invalidation path after mutation?

## Implementation challenge

**Task:** Add a draft preference for a journey search filter without duplicating search results.

**Acceptance criteria:**

- Filter intent lives in `booking-draft-store.ts` or screen local state.
- Search results still come from `useJourneySearch`.
- Query key includes every input that changes the fetched result.
- Removing the filter returns to the original result set without stale cached data.

## Expected outcomes

Learners can classify state before coding: durable client state, ephemeral component state, route state, server state or derived state.

## Facilitator guidance

- **Timing:** 30 min code trace, 20 min state classification exercise, 20 min debugging, 20 min challenge planning.
- **Common misconception:** “Global store means easier access.” Easy access often means stale data and unclear ownership.
- **How to run:** Use React DevTools to observe re-renders if available. Otherwise, reason from selectors and query keys.
