# Exercise 02 — Correct stale seat availability

## Context

A passenger can linger on the seat-selection screen while another passenger books the same seat. RailPass already has polling and final `SEAT_TAKEN` recovery; this exercise asks you to reason about and harden that path.

## Starting point

Read:

- `mobile/app/(app)/journeys/[id].tsx`
- `mobile/features/booking/seat-map.tsx`
- `mobile/hooks/use-api-query.ts`
- `mobile/store/booking-draft-store.ts`
- `mobile/app/(app)/checkout.tsx`

## Task

Make sure stale selected seats are removed from the draft when the seat map refreshes, and that the user gets a clear warning.

## Acceptance criteria

- Seat map refetches on focus and at `appConfig.seatRefreshMs` while visible.
- If a selected seat appears in `takenSeats`, it is removed with `removeSeats`.
- The warning names the seat numbers and is dismissible.
- Checkout still handles `SEAT_TAKEN` as a final guard.
- No selected/taken state is communicated by colour alone.

## Hints

- Look for the effect that compares `segment.seats` with `seatMap.data.cars`.
- Invalidate `seats:` queries after a successful booking.
- Test with two users, or inspect network responses from `GET /journeys/:id/seats`.
