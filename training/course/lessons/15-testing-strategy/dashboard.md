# Lesson 15 · Testing strategy — 🖥️ Dashboard

## Goal
Learners add focused slice, component, and error parser tests that protect real dashboard behavior.

## What arrives
| Path | Status | Why |
|---|---|---|
| `src/features/auth/auth-slice.test.ts` | RailPass with LIVE gap | LIVE 15.5 asserts logout clears auth state. |
| `src/features/bookings/components/booking-status-badge.test.tsx` | RailPass with LIVE gap | LIVE 15.6 checks the visible checked-in label. |
| `src/shared/api/errors.test.ts` | RailPass | Worked example for parsing API validation field errors. |

## Talk through
- **`auth-slice.test.ts` — reducer test.** Ask: why test a reducer without React? Answer: state transitions are pure and fast.
- **`booking-status-badge.test.tsx` — user-facing assertion.** Ask: why query text instead of CSS class? Answer: users and assistive tech care about the label.
- **`errors.test.ts` — parser edge cases.** Ask: why test error parsing? Answer: every form depends on consistent `VALIDATION_FAILED` handling.

## LIVE 15.5 — logout assertion
Why: session cleanup is security-sensitive and should not regress.
1. In `auth-slice.test.ts`, import `logout` from `./auth-slice`.
2. Dispatch `logout()` against the signed-in state with `authReducer(signedIn, logout())`.
3. Assert `token` is `null`: `expect(authReducer(signedIn, logout()).token).toBeNull();`.
4. Optional stretch: also assert `user` is `null`. The solution keeps the single token assertion.
Hint: do not edit the existing sign-in assertions.
Done when: the auth slice test proves both sign-in and logout behavior.

## LIVE 15.6 — badge label assertion
Why: component tests should check what staff can perceive.
1. In `booking-status-badge.test.tsx`, import `expect` from `vitest` and `screen` from `../../../testing`.
2. Render `<BookingStatusBadge status="CHECKED_IN" />`.
3. Assert `screen.getByText('Checked in')` is in the document.
Hint: use a positive assertion, not an inverted placeholder.
Done when: `yarn --cwd dashboard test booking-status-badge auth-slice` passes.

## Checkpoint
The browser still shows the API-backed dashboard from lesson 14; this lesson changes the test suite. At the start, `yarn --cwd dashboard test` is intentionally red until LIVE 15.5 and LIVE 15.6 are done; after the fixes, reducer, badge, and API-error tests pass. Commands: `lesson status 15`, `yarn --cwd dashboard typecheck`, `yarn --cwd dashboard lint`, `yarn --cwd dashboard test`.
