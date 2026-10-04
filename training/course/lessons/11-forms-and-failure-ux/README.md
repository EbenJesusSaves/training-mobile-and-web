# 11 · Forms, validation & failure UX

**Notes:** `/courses/scalable-mobile-and-web-apps/forms-and-failure-ux` on the course website · **Time:** 20 min ·
**Workspace changes:** `lesson start 11` adds 9 mobile and 3 dashboard files (LIVE 11.1–11.3, 11.5–11.6)

## Goal

Make writes safe and understandable. Learners add client validation, map API field errors inline, and recover from seat conflicts without losing the booking draft.

## What happens

1. **Concept (about 3 min):** client validation for speed, server validation for truth, and submit helpers that rethrow.
2. **Talk-through (about 4 min):** inspect `use-form`, `use-async-action`, mobile checkout and the dashboard journey form.
3. **Mobile LIVE tasks (about 6 min):** LIVE 11.1 sign-in validators (📱), LIVE 11.2 sign-up server errors (📱), LIVE 11.3 `SEAT_TAKEN` recovery (📱).
4. **Dashboard LIVE tasks (about 4 min):** LIVE 11.5 journey form validation (🖥️), LIVE 11.6 await create (🖥️).
5. **Checkpoint and compare (about 3 min):** submit invalid forms, create data successfully, then run diffs.

## LIVE tasks

| Task | App | File | What you write |
| --- | --- | --- | --- |
| LIVE 11.1 sign-in validators | 📱 | `mobile/app/(auth)/sign-in.tsx` | Import `validateEmail` and pass validators for email and required password into `useForm`. |
| LIVE 11.2 sign-up server errors | 📱 | `mobile/app/(auth)/sign-up.tsx` | Import `ApiError`, wrap register in `try/catch`, call `form.applyServerErrors(error.fieldErrors)`, then rethrow. |
| LIVE 11.3 choose new seats | 📱 | `mobile/app/(app)/checkout.tsx` | For each direction, `removeSeats` matching conflict seats, invalidate ``seats:${first.journeyId}``, clear the error and navigate back to that journey. |
| LIVE 11.5 journey validation | 🖥️ | `dashboard/src/features/journeys/components/journey-form.tsx` | Validate `routeId`, `trainNumber`, `trainName`, `departureAt`, `arrivalAt` after departure, and at least one car. |
| LIVE 11.6 await creation | 🖥️ | `dashboard/src/features/journeys/components/journeys-view.tsx` | Await `createJourney.mutateAsync(payload)`, close the modal, then navigate to ``/journeys/${result.journey.id}``. |

## Checkpoint

- 📱 The RailPass sign-in form calls `signIn(session)` and therefore always remembers until lesson 12. Sign-up shows API field errors inline; checkout can confirm bookings and recover from `SEAT_TAKEN`.
- 🖥️ Blank journey creation shows client errors; successful creation opens the new journey detail page; server field errors stay in the modal.
- `yarn run check` passes.

## Common problems

- **Remember me seems ignored on mobile:** correct for this lesson. LIVE 12.2 passes the checkbox to the store.
- **Duplicate email only shows a banner:** ensure `ApiError.fieldErrors` is applied before rethrowing.
- **Seat conflict loops:** invalidate the specific `seats:${first.journeyId}` key after removing unavailable seats.
- **Dashboard modal closes on server error:** use `mutateAsync`; `mutate` will not throw to the form.

## Facilitator notes

- Trigger at least one invalid submit before writing validators.
- Explain `409 EMAIL_IN_USE` and `VALIDATION_FAILED` as different codes with the same field-error shape.
- Keep learners from trusting client prices; checkout displays the server quote.

**Next:** lesson 12 finishes auth, sessions and role guards.
