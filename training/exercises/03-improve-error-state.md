# Exercise 03 — Improve an error state

## Context

RailPass normalizes API errors with `ApiError`. A good UI should distinguish network failures, validation errors, authorization failures and conflicts.

## Starting point

Read:

- `mobile/api/errors.ts`
- `mobile/components/ui/feedback/inline-alert.tsx`
- `mobile/components/ui/feedback/state-views.tsx`
- `mobile/app/(app)/checkout.tsx`
- `dashboard/src/api/errors.ts`
- `dashboard/src/components/ui/error-state.tsx`

## Task

Choose one screen and improve how it presents a failure. Keep the behavior realistic; do not hide errors.

## Acceptance criteria

- The message/action matches the failure type.
- The user can retry or recover where appropriate.
- Server field errors appear next to fields when possible.
- Loading/error/empty states remain mutually understandable.
- Implementation uses existing UI components and tokens.

## Hints

- `ApiError.isNetworkError` exists on mobile.
- `ApiError.fieldErrors` exists on both mobile and dashboard error types.
- For `SEAT_TAKEN`, recovery is not “try again”; it is “choose new seats.”
