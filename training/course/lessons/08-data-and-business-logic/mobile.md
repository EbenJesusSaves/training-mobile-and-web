# Lesson 08 · Data & business logic — 📱 Mobile

> By the end, seat geometry, money and date rules live in pure code with tests. The seat map component can draw real car layouts once API data arrives.

## What arrives

| File | Status | Why it's here |
| --- | --- | --- |
| `mobile/libs/seat-layout.ts` | RailPass, LIVE 08.1 | Converts a car's compartment count into seat numbers, columns and rows. |
| `mobile/__tests__/dates-and-seats.test.ts` | RailPass, LIVE 08.2 | Pins date helpers and the second-compartment seat layout. Starts red on purpose. |
| `mobile/__tests__/format.test.ts` | RailPass | Protects money, time and class-label formatting. |
| `mobile/features/booking/seat-map.tsx` | RailPass | Draws the Skia car body and native pressable seats from `seatPositions`. |

## Talk through (together)

1. **`mobile/libs/seat-layout.ts`: pure rule.** Ask: why not calculate seat x/y in the component? Answer: the seat-number rule is domain logic; the component should only render positions.
2. **`mobile/features/booking/seat-map.tsx`: Skia plus Pressable.** Ask: why are seats native `Pressable`s on top of the drawing? Answer: the drawing can be rich while hit areas, labels and focus stay native.
3. **`mobile/__tests__/format.test.ts`: pesewas.** Ask: why do tests pass integer money values? Answer: the API and clients use integer minor units, so no float rounding enters fares.
4. **`mobile/__tests__/dates-and-seats.test.ts`: red first.** Ask: why does the lesson begin with a failing test? Answer: it makes the intended business rule executable before the UI depends on it.

## Live tasks

### LIVE 08.1 — Derive seat positions (`mobile/libs/seat-layout.ts`)

**Why:** every seat map must agree that each compartment has six seats: left column rows 0–2, then right column rows 0–2.

1. Rename the parameter to `compartments` and create `const seats: SeatPosition[] = [];`.
2. Loop `compartment` from `0` to `compartments - 1`.
3. Inside it, loop `index` from `0` to `SEATS_PER_COMPARTMENT - 1`.
4. Push an object with `seatNumber: compartment * SEATS_PER_COMPARTMENT + index + 1`, `compartment`, `column: index < 3 ? 0 : 1`, and `row: (index % 3) as 0 | 1 | 2`.
5. Return `seats`.

**Hint:** seat 1 and seat 4 are both row 0, but in different columns.

**Done when:** `seatPositions(2)` returns 12 positions and `yarn --cwd mobile test dates-and-seats` now fails only on LIVE 08.2.

### LIVE 08.2 — Pin the first seat of the second compartment (`mobile/__tests__/dates-and-seats.test.ts`)

**Why:** a test should lock the boundary where seat numbers move from compartment 0 to compartment 1.

1. Delete the `throw new Error('Write this assertion (task 08.2).');` line.
2. Add `expect(seats[6]).toEqual({ seatNumber: 7, compartment: 1, column: 0, row: 0 });`.
3. Keep the existing assertions for seats 2 and 6.

**Hint:** array index 6 is seat 7 because arrays are zero-based.

**Done when:** `yarn --cwd mobile test dates-and-seats` is green.

## Checkpoint

The app still shows lesson 07 prototypes, but the booking seat-map code now has real geometry. In the test output, seat 7 is the first seat in the second compartment: column 0, row 0.

Commands: `lesson status 08` shows no open mobile tasks, and `yarn run check` passes from the workspace root after you fix the intentionally red tests.

## Removed / replaced in this lesson

Nothing.
