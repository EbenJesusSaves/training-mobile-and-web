# Exercise 01 — Add a mobile journey filter

## Context

Passengers can currently sort journeys by fastest, earliest or cheapest in `mobile/features/booking/filter-sheet.tsx`. Product wants an optional filter such as “First class only” or “Departs after 12:00”.

## Starting point

Read:

- `mobile/app/(app)/(tabs)/index.tsx`
- `mobile/features/booking/filter-sheet.tsx`
- `mobile/hooks/use-journey-search.ts`
- `mobile/api/travel-api.ts`
- `mobile/store/booking-draft-store.ts`
- `backend/src/journeys/dto/search-journeys.dto.ts`

## Task

Design and implement one new journey filter. Prefer a server-backed filter if the API already supports it; otherwise describe the backend DTO/API change needed and implement the frontend shape in a way that will be easy to connect.

## Acceptance criteria

- Filter control appears in the existing filter sheet or a clearly justified adjacent UI.
- Filter state is stored as intent, not as copied search results.
- `useJourneySearch` query key includes the new filter input when it changes server results.
- Request params include the filter only when active.
- Empty state still makes sense when filters are too narrow.
- All spacing, sizes and colours use constants/tokens.

## Hints

- Every server input must be represented in the query key.
- The existing station search filters locally because the list is short; journey availability is server state.
- If you choose “First class only,” inspect `Journey.classes` in `mobile/api/types.ts`.
- If you choose “Departs after 12:00,” decide whether the server or client should own time filtering.
