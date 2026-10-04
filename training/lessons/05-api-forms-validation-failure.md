# Lesson 5 — API consumption, forms, validation and failure handling

**Estimated duration:** 90 minutes

## Learning objectives

Learners can:

- Explain the shared API error shape and how mobile/dashboard normalize Axios errors.
- Map server field errors to form controls.
- Trace checkout quote, simulated payment, server-side pricing and `SEAT_TAKEN` recovery.
- Understand 401 sign-out, retry and network/timeout messaging.

## Relevant code paths

- `mobile/api/client.ts`
- `mobile/api/errors.ts`
- `mobile/api/bookings-api.ts`
- `mobile/hooks/use-form.ts`
- `mobile/hooks/use-async-action.ts`
- `mobile/app/(app)/checkout.tsx`
- `dashboard/src/shared/api/client.ts`
- `dashboard/src/shared/api/errors.ts`
- `dashboard/src/shared/hooks/use-query-notification.ts`
- `backend/src/common/filters/api-exception.filter.ts`
- `backend/src/bookings/pricing.ts`

## Real snippets to read aloud

Mobile wraps every failure in one error type:

```ts
export class ApiError extends Error {
  constructor(
    message: string,
    readonly code: string,
    readonly status: number | null,
    readonly fieldErrors: Record<string, string> = {},
  ) {
    super(message);
  }
}
```

Checkout trusts the server quote:

```tsx
const quote = useApiQuery(request ? `quote:${JSON.stringify(request)}` : null, () => bookingsApi.quote(request!));
```

`SEAT_TAKEN` recovery removes conflict seats and navigates back to the affected seat map:

```tsx
if (submit.error.code === 'SEAT_TAKEN') {
  store.removeSeats(
    direction,
    conflictSeats.filter((seat) => seat.direction === direction),
  );
  invalidateQueries(`seats:${first.journeyId}`);
}
```

The backend documents the error body shape:

```ts
/** Response shape for every error: { statusCode, code, message, details? } */
export interface ApiErrorBody {
  statusCode: number;
  code: string;
  message: string;
  details?: unknown;
}
```

## What we chose / Why / Trade-offs / When we'd choose differently

| Topic          | What we chose                                       | Why                                                          | Trade-offs                                  | Choose differently when                                               |
| -------------- | --------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------- | --------------------------------------------------------------------- |
| Axios client   | One configured client per frontend                  | Central base URL, auth header and 401 behavior               | Requires API modules to use it consistently | GraphQL or generated clients may replace it in another product        |
| Error shape    | `{statusCode, code, message, details?.fieldErrors}` | Screens can handle errors without inspecting raw Axios       | Backend must keep contract stable           | Native platform APIs may need adapter-specific errors                 |
| Pricing        | Server quote and server create calculate totals     | Prevents tampered client totals and keeps fare rules central | Extra quote call before checkout            | Client-only carts are acceptable only for non-authoritative estimates |
| Seat conflicts | Polling plus 409 recovery                           | User gets early reconciliation and final correctness         | Race still possible at final submit         | Temporary seat holds would improve high-demand UX                     |

## Do / Don't examples

### Do — show server field errors inline

```tsx
<TextField label="Email for tickets" error={serverFieldErrors.contactEmail} onChangeText={setEmail} />
```

### Don't — swallow API errors

```ts
// Teaching anti-pattern.
try {
  await bookingsApi.create(payload);
} catch {
  return undefined;
}
```

### Do — send selections, not prices

```ts
return {
  tripType: state.tripType,
  segments: segments.map(({ direction, draft }) => ({
    journeyId: draft.journey.id,
    travelClass: draft.travelClass,
    direction,
    seats: draft.seats,
  })),
};
```

## Live demonstration script

1. Open Swagger at `http://localhost:3000/api/docs` and inspect `POST /bookings/quote` and `POST /bookings`.
2. In the mobile app, choose a seat and open checkout. Point to “Prices are confirmed at checkout.”
3. Open `checkout-screen.tsx`; follow `request`, `quote`, `submit`, `serverFieldErrors`, `chooseNewSeats`.
4. Trigger a validation error by clearing passenger name or entering an invalid email.
5. Optional: use two passenger accounts to race for the same seat and show `SEAT_TAKEN` recovery.

## Discussion questions

- Why is client-side validation still useful if the backend validates again?
- What should happen after a 401 response in a mobile app?
- Why does checkout invalidate `bookings:`, `seats:` and `journeys:` after booking?
- How should the UI behave differently for network errors vs validation errors?

## Prediction exercise

**Question:** What will happen if the checkout UI displays `fareFor(segment) * passengerCount` and never calls `bookingsApi.quote()`?

**Facilitator notes / answer:** The UI may show stale or incomplete totals, especially for add-ons, changed fares or backend rules. The create call would still calculate the real total, so the passenger could see one amount and book another. The current design makes the server quote the review screen’s source of truth.

## Debugging task

A learner reports: “The form shows a toast but does not highlight the invalid passenger name.” Trace the backend `details.fieldErrors` shape, `toApiError`, `submit.error.fieldErrors`, and the `TextField error` prop path `passengers.0.fullName`.

## Code-review activity

Review a form PR. Check:

- Local validation improves UX but does not replace server validation.
- Server `fieldErrors` are mapped by exact path.
- Loading and retry states are visible and accessible.
- No totals, availability or permission decisions are trusted from client-only code.
- 401 behavior is centralized in the client.

## Implementation challenge

**Task:** Improve an error state in one frontend screen.

**Acceptance criteria:**

- Network, timeout, validation and conflict errors get appropriate messages/actions.
- The user can retry without leaving the screen.
- Field errors appear next to fields when possible.
- No `catch {}` silently discards an error.

## Expected outcomes

Learners can trace a request from UI event to API module, normalized error, form display and recovery path.

## Facilitator guidance

- **Timing:** 25 min checkout trace, 20 min live failures, 20 min debugging, 25 min challenge/review.
- **Common misconception:** “If the client validates, the server can trust it.” RailPass always treats the server as authoritative.
- **How to run:** Use Mailpit for reset-code demos and Swagger for contract inspection.
