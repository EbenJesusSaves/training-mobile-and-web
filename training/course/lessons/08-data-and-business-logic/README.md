# 08 · Data & business logic

**Notes:** `/courses/scalable-mobile-and-web-apps/data-and-business-logic` on the course website · **Time:** 20 min ·
**Workspace changes:** `lesson start 08` adds 4 mobile and 8 dashboard files (LIVE 08.1–08.2, 08.5–08.6); mobile and dashboard tests start red on purpose

## Goal

Move business rules into pure, tested code. Learners pin money, date and seat-layout behaviour before API data depends on it.

## What happens

1. **Concept (about 3 min):** money as integer pesewas, UTC times and derived data.
2. **Talk-through (about 4 min):** read mobile `seat-layout`, mobile seat map and dashboard seat-order helpers.
3. **Mobile LIVE tasks (about 5 min):** LIVE 08.1 `seatPositions` (📱), LIVE 08.2 second-compartment test (📱).
4. **Dashboard LIVE tasks (about 5 min):** LIVE 08.5 row-by-row seat order (🖥️), LIVE 08.6 money-format test (🖥️).
5. **Checkpoint and compare (about 3 min):** run targeted tests, then compare with RailPass using `lesson diff mobile` and `lesson diff dashboard`.

## LIVE tasks

| Task | App | File | What you write |
| --- | --- | --- | --- |
| LIVE 08.1 `seatPositions` | 📱 | `mobile/libs/seat-layout.ts` | Loop compartments and six seats per compartment; compute `seatNumber`, `compartment`, `column` and `row`. |
| LIVE 08.2 seat 7 assertion | 📱 | `mobile/__tests__/dates-and-seats.test.ts` | Replace the `throw` with `expect(seats[6]).toEqual({ seatNumber: 7, compartment: 1, column: 0, row: 0 })`. |
| LIVE 08.5 seat order | 🖥️ | `dashboard/src/features/journeys/utils.ts` | Compute a compartment's first seat and return row-by-row order from `railDomain` rows and columns. |
| LIVE 08.6 money test | 🖥️ | `dashboard/src/shared/lib/format.test.ts` | Assert `formatMoney(12345)` represents `123.45` cedi. |

## Checkpoint

- 📱 `yarn --cwd mobile test dates-and-seats` is green; the routed prototype still runs.
- 🖥️ Dashboard helper tests are green; routed placeholders still render.
- `yarn run check` passes after fixing the intentionally red tests.

## Common problems

- **The first test run is red:** that is expected. The `throw` in LIVE 08.2 is the exercise marker.
- **Seat 7 is wrong:** reset the row with `index % 3`; do not keep counting rows across compartments.
- **Money test is brittle:** assert the value contains `123.45`, not private `Intl` formatting details.
- **Seat display order confusion:** seat ids are column-numbered, but staff read rows left-to-right.

## Facilitator notes

- Draw one six-seat compartment before anyone codes.
- Emphasize that derived rules stay outside components so they can be tested quickly.
- Let learners run targeted tests first; save `yarn run check` for the checkpoint.

**Next:** lesson 09 chooses the right home for client state.
