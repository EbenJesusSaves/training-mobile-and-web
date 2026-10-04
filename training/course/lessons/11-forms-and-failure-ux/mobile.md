# Lesson 11 · Forms, validation & failure UX — 📱 Mobile

> By the end, RailPass Mobile has real auth forms, real checkout, inline validation and seat-conflict recovery. Remember me is visible, but sign-in still stores the session as remembered until lesson 12.

## What arrives

| File | Status | Why it's here |
| --- | --- | --- |
| `mobile/hooks/use-form.ts` | RailPass | Small form helper with client validators and `applyServerErrors`. |
| `mobile/hooks/use-async-action.ts` | RailPass | Shared pending/error wrapper for submit actions. |
| `mobile/app/(auth)/sign-in.tsx` | course version, LIVE 11.1 → RailPass in 12 | RailPass sign-in form. It calls `signIn(session)` until lesson 12 wires Remember me. |
| `mobile/app/(auth)/sign-up.tsx` | RailPass, LIVE 11.2 | Registration form with server field errors beside fields. |
| `mobile/app/(app)/checkout.tsx` | RailPass, LIVE 11.3 | Quote, passenger details, booking creation and seat-conflict recovery. |
| `mobile/app/(app)/tickets/[id].tsx` | RailPass | Ticket detail screen. |
| `mobile/features/tickets/barcode.tsx`, `mobile/features/tickets/ticket-card.tsx`, `mobile/features/tickets/ticket-pdf.ts` | RailPass | Ticket display, PDF417 barcode and PDF export helpers. |

## Talk through (together)

1. **`mobile/hooks/use-form.ts`: client and server errors.** Ask: why keep `applyServerErrors` in the hook? Answer: screens can map API field errors without inventing per-form state shapes.
2. **`mobile/hooks/use-async-action.ts`: rethrowing matters.** Ask: why should submit helpers not swallow errors? Answer: callers such as forms need the rejection to keep modals open or show field errors.
3. **`mobile/app/(app)/checkout.tsx`: server prices.** Ask: why does checkout quote before create? Answer: clients send selections, never trusted prices.
4. **`mobile/app/(auth)/sign-in.tsx`: Remember me gap.** Ask: what does the checkbox do right now? Answer: the UI is present, but `signIn(session)` always remembers until LIVE 12.2.

## Live tasks

### LIVE 11.1 — Add sign-in validators (`mobile/app/(auth)/sign-in.tsx`)

**Why:** empty or invalid credentials should fail before a network call.

1. Change the import to `import { useForm, validateEmail } from '@/hooks/use-form';`.
2. Replace `useForm({ email: '', password: '' })` with `useForm({ email: '', password: '' }, { … })`.
3. Set `email` to `validateEmail`.
4. Set `password` to `(value) => (value ? null : 'Enter your password.')`.
5. Keep the passenger-role check after `authApi.signIn`.

**Hint:** validators return `null` when the field is valid.

**Done when:** tapping **Login** with blank fields shows field messages and does not call the API.

### LIVE 11.2 — Apply API field errors (`mobile/app/(auth)/sign-up.tsx`)

**Why:** server validation is authoritative. A duplicate email should appear next to the email field, not only as a banner.

1. Import `ApiError` from `@/api/errors`.
2. Wrap the `authApi.register` call and `signIn(session, remember)` in `try { … }`.
3. In `catch (error)`, check `error instanceof ApiError && Object.keys(error.fieldErrors).length`.
4. When true, call `form.applyServerErrors(error.fieldErrors)`.
5. Rethrow the error so `useAsyncAction` still exposes the failure.

**Hint:** the API returns `409 EMAIL_IN_USE` with `details.fieldErrors.email`, and `VALIDATION_FAILED` with `details.fieldErrors`.

**Done when:** trying an existing email leaves the form open and shows the email error beside the field.

### LIVE 11.3 — Drop seats that were just taken (`mobile/app/(app)/checkout.tsx`)

**Why:** another passenger can take a seat while checkout is open. The app should remove only unavailable seats and send the learner back to the right journey.

1. In `chooseNewSeats`, keep `const first = conflictSeats[0];` and the `router.back()` fallback.
2. Add `const store = useBookingDraftStore.getState();`.
3. Loop `for (const direction of ['OUTBOUND', 'RETURN'] as Direction[])`.
4. For each direction, call `store.removeSeats(direction, conflictSeats.filter((seat) => seat.direction === direction));`.
5. Call ``invalidateQueries(`seats:${first.journeyId}`);`` before clearing the submit error.
6. Keep the existing `router.navigate({ pathname: '/journeys/[id]', params: { id: first.journeyId, direction: first.direction } });`.

**Hint:** `removeSeats` accepts the same `SeatRef` shape that the conflict list extends.

**Done when:** a `409 SEAT_TAKEN` clears the unavailable seats from the draft and returns to that journey's seat map.

## Checkpoint

Sign in with the RailPass form as `ama@railpass.dev` / `Passenger#2026`. The form looks final, but it still calls `signIn(session)` and therefore always remembers until lesson 12. Search a journey, choose seats, open checkout, validate passenger fields, and confirm a booking. If a seat conflict appears, **Choose new seats** removes the unavailable selections and returns to the seat map.

Commands: `lesson status 11` shows no open mobile tasks, and `yarn run check` passes from the workspace root.

## Removed / replaced in this lesson

`lesson start 11` overwrites the lesson 10 checkout prototype and sign-in demo, plus the lesson 07 sign-up and ticket-detail prototypes. Nothing is deleted.
