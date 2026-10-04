# 15 · Testing strategy

**Notes:** `/courses/scalable-mobile-and-web-apps/testing-strategy` on the course website · **Time:** 15 min ·
**Workspace changes:** `lesson start 15` adds 7 mobile and 3 dashboard files (LIVE 15.1–15.2, 15.5–15.6)

## Goal

Learners choose the right test level and replace intentional red placeholders with focused assertions.

## What happens

1. **Concept, about 3 min:** test rules where they live: stores, components, parsers and critical journeys.
2. **Mobile LIVE 15.1, about 3 min:** assert the booking draft keeps only seat 7 for one passenger.
3. **Mobile LIVE 15.2, about 3 min:** assert `findByLabelText('Delayed +25 min')` for `StatusChip`.
4. **Dashboard LIVE 15.5–15.6, about 4 min:** add an auth logout token assertion and a booking badge assertion.
5. **Checkpoint, about 2 min:** run focused tests, then `yarn run check`.

## LIVE tasks

| Task | App | File | What you write |
| --- | --- | --- | --- |
| LIVE 15.1 seat replacement | 📱 | `mobile/__tests__/booking-draft-store.test.ts` | Replace the throw with `expect(...outbound?.seats).toEqual([{ carNumber: 1, seatNumber: 7 }])`. |
| LIVE 15.2 status label | 📱 | `mobile/__tests__/status-chip.test.tsx` | Add `expect(await screen.findByLabelText('Delayed +25 min')).toBeTruthy()` and remove the throw. |
| LIVE 15.5 logout assertion | 🖥️ | `dashboard/src/features/auth/auth-slice.test.ts` | Import `logout` and assert `authReducer(signedIn, logout()).token` is `null`. |
| LIVE 15.6 badge assertion | 🖥️ | `dashboard/src/features/bookings/components/booking-status-badge.test.tsx` | Import `expect` and `screen`, then assert `Checked in` is visible. |

## Checkpoint

- 📱 Store, status chip and Lottie tests are present; Maestro flows are available under `mobile/e2e/maestro/`.
- 🖥️ Auth slice token, booking badge and API error parser tests run.
- `yarn run check` passes after the LIVE placeholders are replaced. The lesson starts with red tests on purpose; Git hooks only lint and type-check.

## Common problems

- A `throw new Error('Write this assertion...')` means the test is intentionally red, not that setup is broken.
- Maestro is optional and external: install its CLI and run it with Metro, a simulator/dev build and the API running.
- Query accessible text when the behaviour is accessibility; do not assert implementation details like colours.

## Facilitator notes

- Keep the tests tiny. Each one protects one decision.
- Use the red start as a teaching moment: failing tests can be a useful TODO when hooks do not run them.
- Do not spend core time installing Maestro unless the room is already ready.

**Next:** lesson 16 uses code review and a PR checklist to keep quality shared across the team.
