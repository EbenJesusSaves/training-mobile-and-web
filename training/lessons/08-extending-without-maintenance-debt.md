# Lesson 8 — Extending the apps without making code hard to maintain

**Estimated duration:** 75 minutes

## Learning objectives

Learners can:

- Add a feature end-to-end while preserving boundaries.
- Decide when to abstract and when to keep code feature-local.
- Avoid duplicated responsibilities between UI, store, API and backend.
- Write acceptance criteria that include state, API, tokens, accessibility and tests.

## Relevant code paths

- `mobile/hooks/use-journey-search.ts`
- `mobile/features/booking/filter-sheet.tsx`
- `mobile/app/(app)/(tabs)/index.tsx`
- `mobile/api/travel-api.ts`
- `mobile/store/booking-draft-store.ts`
- `dashboard/src/features/journeys/components/journeys-view.tsx`
- `dashboard/src/features/journeys/api/journey-queries.ts`
- `dashboard/src/features/journeys/api/journeys-api.ts`
- `backend/src/journeys/dto/search-journeys.dto.ts`
- `docs/architecture.md`

## Real snippets to read aloud

Search hook owns the query key and fetcher boundary:

```ts
const key = originId && destinationId ? `journeys:${originId}:${destinationId}:${date}:${sort}:${passengers}` : null;
return useApiQuery(
  key,
  (signal) => travelApi.searchJourneys({ originId: originId!, destinationId: destinationId!, date, sort, passengers }, signal),
  { refetchOnFocus: true },
);
```

The dashboard journey page keeps filters as input state and lets the hook fetch server data:

```tsx
const journeys = useJourneys({
  page,
  pageSize: pageSizes.default,
  search: debouncedSearch,
  when,
  status: (status || undefined) as JourneyStatus | undefined,
  routeId: routeId || undefined,
  stationId: stationId || undefined,
});
```

The mobile filter sheet is feature-local because it only speaks booking-sort language:

```tsx
export const SORT_TITLES: Record<JourneySort, string> = {
  fastest: 'The Fastest',
  earliest: 'Earliest First',
  cheapest: 'The Cheapest',
};
```

## What we chose / Why / Trade-offs / When we'd choose differently

| Topic             | What we chose                                            | Why                                    | Trade-offs                                           | Choose differently when                                                  |
| ----------------- | -------------------------------------------------------- | -------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------ |
| Feature extension | Start feature-local, promote later                       | Avoid premature abstraction            | Some duplication may exist briefly                   | Promote when two features need identical behavior and wording is generic |
| Filters           | Store intent, fetch results through hooks                | Query keys remain explicit             | Every new filter must update DTO, API params and key | Local-only filters are okay for tiny static lists                        |
| API contract      | Backend DTO defines allowed params                       | Frontend cannot invent server behavior | Requires backend change for server filtering         | Client filtering is fine for small already-fetched lists like stations   |
| Review criteria   | Include tokens, accessibility, state ownership and tests | Maintains quality across apps          | More upfront thinking                                | Hackathon/prototype code may accept narrower criteria                    |

## Do / Don't examples

### Do — add new server inputs to the hook key

```ts
const key = originId && destinationId ? `journeys:${originId}:${destinationId}:${date}:${sort}:${passengers}` : null;
```

### Don't — filter server results after fetching if the backend can do it authoritatively

```ts
// Teaching anti-pattern for journey availability.
const firstClassOnly = (search.data ?? []).filter((journey) => journey.classes.some((item) => item.travelClass === 'FIRST'));
```

### Do — keep a feature-specific sheet in the feature folder

```tsx
import { FilterSheet, SORT_TITLES } from '@/features/booking/filter-sheet';
```

## Live demonstration script

1. Pick a hypothetical change: “first class only” journey filter.
2. Ask learners to list every layer touched: API DTO, API module type, `useJourneySearch` params/key, draft/screen state, filter UI, empty state, tests.
3. Compare with dashboard filters in `journeys-view.tsx` and `journey-queries.ts`.
4. Open `backend/src/journeys/dto/search-journeys.dto.ts` to show the backend contract boundary.
5. Write acceptance criteria before code.

## Discussion questions

- When is client-side filtering acceptable?
- What makes a component reusable rather than merely shared?
- How can a query key bug look like a UI bug?
- What should a PR include when it changes both mobile and dashboard behavior?

## Prediction exercise

**Question:** What happens if you add a new `firstClassOnly` param to `travelApi.searchJourneys()` but forget to include it in `useJourneySearch`’s cache key?

**Facilitator notes / answer:** The hook can reuse cached results for a different filter state. The UI may show unfiltered journeys while the filter appears selected. Every server-input that changes the response must be represented in the query key.

## Debugging task

A dashboard filter appears selected but results do not change. Check the input state, debounced value, `useJourneys` params, `listJourneys` API function, query key and backend DTO. Do not start by changing table rendering.

## Code-review activity

Review an “add journey filter” PR. Check:

- Server and client agree on param names and semantics.
- Query key includes new input.
- Filter UI is accessible and tokenized.
- Empty state explains when filters may be too narrow.
- No duplicate result arrays are stored in Redux/Zustand.
- Tests cover the request params or filtering behavior.

## Implementation challenge

**Task:** Add a small feature end-to-end, such as “departs after 12:00” or “first class only” search.

**Acceptance criteria:**

- The UI exposes the filter in the existing filter surface.
- The request includes the filter only when active.
- The cache key changes with the filter.
- Empty/error/loading states still work.
- The implementation stays inside appropriate feature/API/store files.

## Expected outcomes

Learners can plan a change across layers without creating god components, duplicated state or token violations.

## Facilitator guidance

- **Timing:** 20 min extension map, 20 min query-key exercise, 20 min review, 15 min recap.
- **Common misconception:** “A component used twice is reusable.” Reusability requires stable semantics and no hidden feature assumptions.
- **How to run:** Use the learner exercises as practice. Keep changes small and reviewable.
