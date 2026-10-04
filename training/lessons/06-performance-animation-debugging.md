# Lesson 6 — Performance, list rendering, animation and debugging

**Estimated duration:** 90 minutes

## Learning objectives

Learners can:

- Identify the performance-sensitive parts of the mobile app: FlatLists, seat map, Skia drawing and polling.
- Explain why interactive seats are native `Pressable`s layered over Skia drawings.
- Respect reduced motion and avoid unnecessary re-renders.
- Debug stale seat maps and understand polling cost.
- Recognize dashboard table performance patterns.

## Relevant code paths

- `mobile/app/(app)/(tabs)/index.tsx`
- `mobile/app/(app)/journeys/[id].tsx`
- `mobile/features/booking/seat-map.tsx`
- `mobile/components/ui/display/journey-timeline.tsx`
- `mobile/hooks/use-api-query.ts`
- `mobile/libs/seat-layout.ts`
- `dashboard/src/components/ui/data-table.tsx`
- `dashboard/src/features/journeys/journeys-page.tsx`
- `backend/src/journeys/journey-availability.service.ts`

## Real snippets to read aloud

Home uses stable keys and pull-to-refresh for the FlatList:

```tsx
<FlatList
  data={tab === 'ARCHIVE' || !draft.origin || !draft.destination ? [] : (search.data ?? [])}
  keyExtractor={(journey) => journey.id}
  refreshing={search.isRefreshing}
  onRefresh={tab === 'ARCHIVE' ? undefined : search.refetch}
/>
```

Seat map drawing and accessibility are deliberately split:

```tsx
<Canvas style={{ width, height: geo.height }} accessible={false}>
  <Path path={body} color={colors.carBody} />
</Canvas>

<Pressable
  accessibilityRole="button"
  accessibilityLabel={label}
  accessibilityState={{ selected: isSelected }}
/>
```

`useApiQuery` aborts stale requests and polls only while focused:

```ts
controllerRef.current?.abort();
const controller = new AbortController();
controllerRef.current = controller;
```

## What we chose / Why / Trade-offs / When we'd choose differently

| Topic     | What we chose                                                      | Why                                                   | Trade-offs                                        | Choose differently when                                       |
| --------- | ------------------------------------------------------------------ | ----------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------- |
| Seat map  | Skia for drawing, native Pressables for interaction                | Smooth visuals plus screen-reader labels and hit slop | More layering complexity                          | Pure native views may be enough for a simple grid             |
| Animation | Reanimated shared values and `useReducedMotion`                    | Runs on UI thread and respects user preference        | More concepts for new hires                       | CSS/web-only animations on dashboard can remain simpler       |
| Polling   | Seat map polls every `appConfig.seatRefreshMs` while focused       | Reduces stale choices during booking                  | Adds API traffic                                  | WebSocket or server-sent events fit high-frequency operations |
| Lists     | FlatList/DataTable with stable keys and memoized rows where needed | Predictable rendering                                 | Must avoid inline-heavy render work as lists grow | Virtualization libraries may be needed for thousands of rows  |

## Do / Don't examples

### Do — compute expensive sets with memoization

```tsx
const taken = useMemo(() => new Set(car.takenSeats), [car.takenSeats]);
const selectedNumbers = useMemo(() => new Set(selectedInCar.map((seat) => seat.seatNumber)), [selectedInCar]);
```

### Don't — allocate and search repeatedly in every seat render

```tsx
// Teaching anti-pattern.
const isTaken = car.takenSeats.includes(seat.seatNumber);
const isSelected = selected.map((seat) => seat.seatNumber).includes(seat.seatNumber);
```

### Do — skip motion when requested

```tsx
const reduceMotion = useReducedMotion();
if (!pulseSeat || reduceMotion) return;
```

## Live demonstration script

1. Open `seat-map.tsx` and identify Skia-only elements: car body, compartments, hatching, pulse ring.
2. Identify native elements: `SeatButton`, `Pressable`, labels, disabled taken seats.
3. Toggle a seat and watch selected seat replacement with one passenger.
4. Open `use-api-query.ts`; trace focus refetch and interval cleanup.
5. Open `dashboard/src/components/ui/data-table.tsx`; show density from Redux and min-width CSS variable.
6. Use Expo dev menu or React DevTools to inspect re-renders if available.

## Discussion questions

- Why not make each seat a Skia touch target?
- What is the real cost of a 20-second polling interval in a classroom with 20 phones?
- Which values should be memoized, and which are premature optimization?
- What backend response shape helps avoid N+1 fetching in the frontend?

## Prediction exercise

**Question:** What will happen if `useApiQuery` keeps its interval running after the seat-selection screen loses focus?

**Facilitator notes / answer:** Hidden screens continue calling the API, battery and network usage grow, and stale responses may update components the user no longer sees. The current `useFocusEffect` returns `clearInterval(timer)`, so polling is tied to screen focus.

## Debugging task

The stale seat map exercise: simulate a seat being booked by another user while the first user stays on seat selection. Ask learners to find why a selected seat should be dropped in the effect that checks `takenSeats`, and what happens if the query key omits the journey ID.

## Code-review activity

Review a performance-sensitive component. Check:

- Stable keys and no index keys for reorderable data.
- Derived sets/maps are memoized where they prevent repeated O(n) work.
- Network polling is scoped and cancellable.
- Animations respect reduced motion.
- Accessibility was not sacrificed for custom drawing.

## Implementation challenge

**Task:** Correct a stale seat-availability display.

**Acceptance criteria:**

- Seat map refetches on focus and on an interval while visible.
- Selected seats that become taken are removed from the draft.
- The user sees a warning that names the seat(s).
- Checkout still handles final `SEAT_TAKEN` conflicts.

## Expected outcomes

Learners can debug perceived UI staleness by checking query keys, focus/polling, cache invalidation, reconciliation effects and final server conflict handling.

## Facilitator guidance

- **Timing:** 25 min seat-map trace, 20 min polling/cache walkthrough, 20 min debugging, 25 min challenge/review.
- **Common misconception:** “Skia is faster, so make everything Skia.” Accessibility and input semantics still belong to native controls.
- **How to run:** Use two accounts or Swagger to book a conflicting seat. React DevTools and Expo Network Inspector are useful but not required.
