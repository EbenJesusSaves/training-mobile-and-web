# Lesson 08 · Data & business logic — 🖥️ Dashboard

## Goal
Pure formatting and journey helpers move out of React components and into tested functions.

## What arrives
| Path | Status | Why |
|---|---|---|
| `src/shared/lib/format.ts`, `format.test.ts` | RailPass with LIVE test gap | Formats money, times, dates, durations, and numbers for every table. |
| `src/features/journeys/utils.ts`, `utils.test.ts` | RailPass with LIVE gap | Converts column-numbered seats into row display order. |
| `src/features/journeys/components/seat-occupancy-map.tsx`, `.module.css` | RailPass | Uses seat helper output when journey detail data arrives. |
| `src/testing/render.tsx`, `src/testing/index.ts` | RailPass | Shared Testing Library wrapper for later component tests. |

## Talk through
- **`formatMoney` — integer pesewas.** Ask: why not store money as floats? Answer: integer minor units avoid rounding bugs.
- **`getCompartmentSeatOrder` — pure domain logic.** Ask: why test this outside a component? Answer: the rule is independent of React.
- **`testing/render.tsx` — common wrapper.** Ask: why centralize providers for tests? Answer: tests stay focused on behavior.

## LIVE 08.5 — seat order
Why: staff need row-by-row display even though seat ids are numbered down columns.
1. In `utils.ts`, compute the compartment's first seat from `railDomain` constants.
2. Build each visual row.
3. Return seat numbers in row-by-row order.
4. Keep `getCompartmentSeatOrder` exported.
Hint: first compartment order is `1, 4, 2, 5, 3, 6`.
Done when: `yarn --cwd dashboard test utils` is green.

## LIVE 08.6 — money-format test
Why: one regression test protects every fare and revenue display.
1. In `format.test.ts`, replace the TODO expectation.
2. Call `formatMoney(12345)`.
3. Assert that the formatted value represents 123.45 cedi.
Hint: avoid testing private `Intl` options.
Done when: `yarn --cwd dashboard test format` is green. The lesson starts with these two tests red.

## Checkpoint
The browser still shows routed placeholders, but pure helper tests now cover money formatting and journey seat display order; `yarn --cwd dashboard test` is green after the LIVE fixes. Commands: `lesson status 08`, `yarn --cwd dashboard typecheck`, `yarn --cwd dashboard lint`, `yarn --cwd dashboard test`.
