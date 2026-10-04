# Solution — Exercise 07: Debugging stale search results

## Root-cause checklist

1. Does the UI state update? Log or inspect the selected filter/search value.
2. Does debounce intentionally delay the request?
3. Does the hook receive the new value?
4. Does the query key include the new value?
5. Do request params include the new value?
6. Does the backend DTO accept the param?
7. Is rendering using `search.data`, or an old copied array?

## Minimal fix example

```ts
const key = originId && destinationId
  ? `journeys:${originId}:${destinationId}:${date}:${sort}:${passengers}:${departAfterNoon ? 'after-noon' : 'all-day'}`
  : null;
```

## Verification

- Toggle filter off: broad results return.
- Toggle filter on: filtered request is visible in the network inspector.
- Toggle back: original cache entry or refetch is used correctly.
- No global cache clear is required.

## Discussion points

- Why is “clear all cache” usually a symptom treatment?
- How do string keys and array keys differ in ergonomics?
- What test could catch a missing key segment?
