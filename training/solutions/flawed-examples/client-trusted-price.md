# Solution — Client-trusted price

## Corrected code

```ts
export function buildBookingRequest(state: Pick<BookingDraftState, 'tripType' | 'outbound' | 'inbound' | 'addOns'>): BookingRequest | null {
  return {
    tripType: state.tripType,
    segments: segments.map(({ direction, draft }) => ({
      journeyId: draft.journey.id,
      travelClass: draft.travelClass,
      direction,
      seats: draft.seats,
    })),
    addOns: Object.entries(state.addOns).map(([code, quantity]) => ({ code, quantity })),
  };
}
```

## Explanation

The client sends selections. The backend calculates totals in `backend/src/bookings/pricing.ts` for both quote and create. A tampered `totalCents` should never be trusted.

## Discussion points

- Which totals can be shown as estimates?
- How does the checkout copy set user expectations?
