# Solution — Exercise 03: Improve an error state

## Corrected code pattern

Map error types to recovery actions instead of one generic message:

```tsx
if (error?.code === 'SEAT_TAKEN') {
  return <InlineAlert kind="error" title="Seat just taken" message={error.message} actionLabel="Choose new seats" onAction={chooseNewSeats} />;
}

if (error?.isNetworkError) {
  return <InlineAlert kind="warning" title="Connection problem" message={error.message} actionLabel="Retry" onAction={retry} />;
}

return <InlineAlert kind="error" title="Request failed" message={error.message} actionLabel="Try again" onAction={retry} />;
```

## Explanation

The normalized error gives the screen enough information to choose a recovery path. Field errors should be shown beside inputs; conflicts should guide users to fix the conflicting selection; network errors should invite retry.

## Discussion points

- Which errors deserve a blocking alert versus inline field copy?
- Why should 401 sign-out stay in `mobile/api/client.ts` and `dashboard/src/shared/api/client.ts`?
- What should be logged for developers but hidden from passengers?
