# Lesson 11 · Forms, validation & failure UX — 🖥️ Dashboard

## Goal
Staff can create journeys through a Mantine form that keeps client and server validation visible.

## What arrives
| Path | Status | Why |
|---|---|---|
| `src/features/journeys/components/journey-form.tsx`, `.module.css` | RailPass with LIVE gap | Form fields, validation, and API field-error mapping; LIVE 11.5 adds client validation. |
| `src/features/journeys/components/journeys-view.tsx` | RailPass with LIVE gap | Adds create modal; LIVE 11.6 awaits `mutateAsync` before closing and navigating. |

## Talk through
- **`journey-form.tsx` — `form.setErrors`.** Ask: where do `VALIDATION_FAILED` field errors belong? Answer: on the form fields that caused them.
- **`journeys-view.tsx` — modal lifecycle.** Ask: when should the modal close? Answer: only after the mutation resolves successfully.
- **`journeys-api.ts` — request payload.** Ask: why map form values before sending? Answer: UI field names and API contracts can evolve separately.

## LIVE 11.5 — form validation
Why: fast client checks reduce round trips while the server remains authoritative.
1. In `journey-form.tsx`, add `validate` rules to `useForm`.
2. Require a route, train number, train name and departure time; arrival must be after departure, and the journey needs at least one car (validators for `routeId`, `trainNumber`, `trainName`, `departureAt`, `arrivalAt` and `cars`).
3. Keep server `ApiError` handling with `form.setErrors(parsed.fieldErrors)`.
Hint: return field-specific messages from Mantine validators.
Done when: blank submissions show field messages before a network call.

## LIVE 11.6 — await creation
Why: `mutate` does not throw to the form, so API field errors are missed unless the promise is awaited.
1. In `journeys-view.tsx`, make the `onSubmit` callback `async` and call `const result = await createJourney.mutateAsync(payload)`.
2. Close the modal only after the await succeeds.
3. Navigate to `` `/journeys/${result.journey.id}` ``; the API returns the new journey inside `{ createdIds, journey }`.
Hint: don't add a `try` here. `JourneyForm` already awaits `onSubmit` inside its own `try`, so a rejected promise reaches `form.setErrors` and the modal stays open.
Done when: successful create opens the new journey detail page, and server field errors stay in the form.

## Checkpoint
The browser Journeys page shows live journeys, opens the create modal, validates inputs, submits to the API, and navigates to the new detail page on success. Commands: `lesson status 11`, `yarn --cwd dashboard typecheck`, `yarn --cwd dashboard lint`, `yarn --cwd dashboard test`.
