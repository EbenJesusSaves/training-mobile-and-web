# Solution — Stale seat map

## Corrected code

```tsx
const seatMap = useApiQuery(`seats:${journeyId}`, (signal) => travelApi.seatMap(journeyId, signal), {
  refetchOnFocus: true,
  refetchIntervalMs: appConfig.seatRefreshMs,
});
```

## Explanation

Seat maps are volatile. Fetching once on mount is not enough. Tie refetching to focus and interval, abort old requests, and reconcile selected seats with new `takenSeats`.

## Discussion points

- Why still handle `SEAT_TAKEN` at checkout?
- When would push updates be better than polling?
