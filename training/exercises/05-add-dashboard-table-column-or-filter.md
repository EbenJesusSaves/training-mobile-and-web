# Exercise 05 — Add a dashboard table column or filter

## Context

Staff tables are server-driven and styled with Mantine plus CSS Modules. Product wants a small table enhancement such as a new journeys column, a bookings status filter, or a passenger search refinement.

## Starting point

Read:

- `dashboard/src/features/journeys/components/journeys-view.tsx`
- `dashboard/src/features/journeys/api/journey-queries.ts`
- `dashboard/src/features/journeys/api/journeys-api.ts`
- `dashboard/src/shared/ui/data-table.tsx`
- `dashboard/src/features/bookings/components/bookings-view.tsx`

## Task

Add one dashboard column or filter using the existing patterns.

## Acceptance criteria

- Server data remains in TanStack Query, not Redux.
- Query key includes all server inputs.
- Any CSS uses `--rp-*`, Mantine variables or exported constants.
- Loading, error and empty states still render correctly.
- Column header and cell labels are clear for staff.

## Hints

- Many DTOs already include useful fields like `availableSeats`, `totalSeats`, `occupancy`, `status` and station codes.
- Query invalidation usually belongs in the hook next to the mutation.
- UI-only preferences like table density should not be query keys.
