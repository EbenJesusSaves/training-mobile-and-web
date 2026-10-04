# Solution — Duplicated server state store

## Corrected code

```ts
export function useJourneySearch(params: Params) {
  const key = params.originId && params.destinationId
    ? `journeys:${params.originId}:${params.destinationId}:${params.date}:${params.sort}:${params.passengers}`
    : null;
  return useApiQuery(key, (signal) => travelApi.searchJourneys(params as Required<Params>, signal), { refetchOnFocus: true });
}
```

## Explanation

Store search inputs and user intent, not server lists. Server data should be fetched, cached, invalidated and refreshed through the query layer.

## Discussion points

- What events make journey availability stale?
- What should be invalidated after booking?
