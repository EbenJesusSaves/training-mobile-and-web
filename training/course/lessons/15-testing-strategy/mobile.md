# Lesson 15 · Testing strategy — 📱 Mobile

> The mobile test suite now covers a store rule, an accessible component label and the Lottie colour wrapper. Optional Maestro flows show how the same accessibility labels drive an end-to-end booking.

## What arrives

| File | Status | Why it's here |
| --- | --- | --- |
| `mobile/__tests__/booking-draft-store.test.ts` | RailPass, LIVE 15.1 | Store tests for seat replacement, passenger trimming and API requests without prices. The first test starts red on purpose. |
| `mobile/__tests__/status-chip.test.tsx` | RailPass, LIVE 15.2 | Component test for the delayed status chip. The accessibility-label assertion starts as a `throw` placeholder. |
| `mobile/__tests__/lottie.test.ts` | RailPass | Worked example for `swapNeutralColors`, including animated colour keyframes. |
| `mobile/e2e/maestro/README.md` | RailPass | How to run the optional Maestro flows against Expo Go, the API and a simulator/dev build. |
| `mobile/e2e/maestro/open-app.yaml`, `mobile/e2e/maestro/sign-in.yaml`, `mobile/e2e/maestro/book-one-way.yaml` | RailPass | Optional end-to-end flows for opening Expo, signing in and booking a one-way trip. |

## Talk through (together)

1. **`booking-draft-store.test.ts`: store rules.** Ask: why test the store without rendering screens? Answer: seat limits are pure state transitions and should fail fast.
2. **`status-chip.test.tsx`: user-facing assertions.** Ask: why query the accessible label? Answer: colour is not enough; the announced text is behaviour.
3. **`e2e/maestro`: end-to-end cost.** Ask: why is Maestro optional? Answer: it needs the Maestro CLI plus a running simulator/dev build, so it protects a critical journey rather than every branch.

## Live tasks

### LIVE 15.1 — Assert the replacement seat (`mobile/__tests__/booking-draft-store.test.ts`)

**Why:** lesson 09's seat rule needs a regression test: one passenger can keep only one selected seat.

1. In `replaces the seat when one passenger taps another seat`, keep the setup that chooses seat 6 and then seat 7.
2. Replace the `throw` with `expect(useBookingDraftStore.getState().outbound?.seats).toEqual([{ carNumber: 1, seatNumber: 7 }]);`.
3. Leave the passenger trimming and API request tests unchanged.

**Hint:** read from `useBookingDraftStore.getState()` after the second tap so the assertion checks current store state.

**Done when:** `yarn --cwd mobile test booking-draft-store` passes.

### LIVE 15.2 — Assert the announced status (`mobile/__tests__/status-chip.test.tsx`)

**Why:** the component must expose the delayed status to assistive technology, not only to sighted users.

1. Keep the rendered `<StatusChip kind="DELAYED" suffix="+25 min" />`.
2. Add `expect(await screen.findByLabelText('Delayed +25 min')).toBeTruthy();` before the visible text assertion.
3. Delete the `throw` placeholder.
4. Keep `expect(screen.getByText('Delayed +25 min')).toBeTruthy();`.

**Hint:** use `findByLabelText`, not `getByLabelText`, because the helper renders through the theme provider asynchronously.

**Done when:** `yarn --cwd mobile test status-chip` passes.

## Checkpoint

Run the two focused Jest commands, then read `mobile/e2e/maestro/README.md` if you want to try the optional booking flow. Maestro needs the Maestro CLI, Metro, the API and a simulator or development build. Commands: `lesson status 15` shows no open mobile tasks, and `yarn run check` passes from the workspace root. The lesson starts with red tests on purpose; Git hooks still lint and type-check, so commits can work before the test tasks are finished.

## Removed / replaced in this lesson

`lesson start 15` adds mobile tests and optional Maestro flows. Nothing is deleted.
