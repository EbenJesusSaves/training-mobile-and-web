# Solution — Exercise 01: Add a mobile journey filter

## Corrected direction

Use filter intent as state, and include it in both request params and query key. If the backend does not yet support the filter, write the DTO/API change first instead of pretending client filtering is authoritative.

```ts
interface Params {
  originId?: string;
  destinationId?: string;
  date: DateKey;
  sort: JourneySort;
  passengers: number;
  firstClassOnly?: boolean;
}

const key = originId && destinationId
  ? `journeys:${originId}:${destinationId}:${date}:${sort}:${passengers}:${firstClassOnly ? 'first' : 'all'}`
  : null;
```

```ts
travelApi.searchJourneys({
  originId: originId!,
  destinationId: destinationId!,
  date,
  sort,
  passengers,
  ...(firstClassOnly ? { travelClass: 'FIRST' } : {}),
}, signal)
```

## Explanation

The filter is not a second copy of journeys. It is an input to server state. If a user toggles the filter, the response can change, so the cache key must change too. For a server-backed filter, update `backend/src/journeys/dto/search-journeys.dto.ts` and the API implementation before relying on it in the UI.

## Discussion points

- Why does local station filtering differ from journey availability filtering?
- What should the empty state say when filters are narrow?
- Would this filter belong in `booking-draft-store.ts` or screen local state? Persist only if it is useful across sessions.
