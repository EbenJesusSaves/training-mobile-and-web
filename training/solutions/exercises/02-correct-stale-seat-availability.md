# Solution — Exercise 02: Correct stale seat availability

## Corrected code shape

`mobile/app/(app)/journeys/[id].tsx` already contains the right pattern:

```tsx
const seatMap = useApiQuery(`seats:${id}`, (signal) => travelApi.seatMap(id, signal), {
  refetchOnFocus: true,
  refetchIntervalMs: appConfig.seatRefreshMs,
});
```

```tsx
useEffect(() => {
  if (!seatMap.data || !segment) return;
  const lost = segment.seats.filter((seat) =>
    seatMap.data!.cars.find((car) => car.carNumber === seat.carNumber)?.takenSeats.includes(seat.seatNumber),
  );
  if (lost.length > 0) {
    removeSeats(direction, lost);
    setNotice(`${lost.map((seat) => `Seat ${seat.seatNumber}`).join(', ')} was just booked by someone else. Please pick another.`);
  }
}, [direction, removeSeats, seatMap.data, segment]);
```

## Explanation

Polling reduces stale UI, focus refetch catches changes after returning from another screen, and reconciliation removes seats from the client draft. Checkout still needs `SEAT_TAKEN` because another request can win after the last poll.

## Discussion points

- Why not disable checkout until the next poll completes?
- What API load does polling create in a classroom?
- How would temporary holds change the UX and backend model?
