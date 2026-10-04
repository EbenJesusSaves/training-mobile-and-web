# Extension C — API contracts, concurrency and end-to-end thinking

**Estimated duration:** 75 minutes

## Learning objectives

Learners can connect frontend UX decisions to backend guarantees: validation error shape, server pricing, unique seat reservations and e2e tests.

## Relevant code paths

- `backend/src/common/filters/api-exception.filter.ts`
- `backend/src/bookings/pricing.ts`
- `backend/prisma/schema.prisma`
- `backend/test/booking-flow.e2e-spec.ts`
- `mobile/app/(app)/checkout.tsx`
- `mobile/hooks/use-api-query.ts`

## Real snippets to read aloud

Server pricing is pure and authoritative:

```ts
export function calculatePrice(passengerCount: number, segments: PricedSegment[], addOns: PricedAddOn[]): PriceBreakdown {
  const fareLines: PriceLine[] = segments.map((segment) => ({
    quantity: passengerCount,
    unitPriceCents: segment.unitFareCents,
    totalCents: segment.unitFareCents * passengerCount,
  }));
```

The database prevents double booking:

```prisma
model SeatReservation {
  journeyId  String
  carNumber  Int
  seatNumber Int

  @@unique([journeyId, carNumber, seatNumber])
}
```

## What we chose / Why / Trade-offs / When we'd choose differently

| What | Why | Trade-off | Choose differently when |
| --- | --- | --- | --- |
| Unique DB index | Correct under concurrency | Conflicts happen at final submit | Temporary holds improve UX for high-demand seats |
| Backend e2e | Tests the actual contract frontends rely on | Slower than unit tests | Unit tests still cover pure frontend logic |
| Unknown fields rejected | Client cannot sneak totals into create | Requires DTO upkeep | Flexible metadata endpoints may allow whitelisted custom fields |

## Activities

- **Demo:** Run `yarn --cwd backend test:e2e` if database setup allows; otherwise read the concurrency test.
- **Prediction:** If two users submit the same seat simultaneously, exactly one receives 201 and one receives 409.
- **Debugging:** The UI shows available but checkout returns `SEAT_TAKEN`; explain why this is not necessarily a bug.
- **Code review:** Frontend changes must respect backend authority for price and availability.
- **Challenge:** Draft a product brief for temporary seat holds, including API and frontend changes.

## Facilitator guidance

This extension is valuable for frontend engineers because it explains why “perfect UI state” is impossible in concurrent systems. The right UI is optimistic, fresh enough, and resilient to authoritative server conflicts.
