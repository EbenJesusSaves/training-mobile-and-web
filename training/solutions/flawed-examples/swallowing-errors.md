# Solution — Swallowing errors

## Corrected code

```ts
try {
  return await api.createBooking();
} catch (caught) {
  throw toApiError(caught);
}
```

## Explanation

Screens need errors to show retry, field validation and conflict recovery. Swallowing errors creates silent failure and makes telemetry/debugging harder.

## Discussion points

- Where should error normalization happen?
- Which errors should be recoverable in-place?
