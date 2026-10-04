# Lesson 06 · Components: building & structuring — 🖥️ Dashboard

## Goal
Learners compose shared UI primitives and first feature badges before pages fetch real data.

## What arrives
| Path | Status | Why |
|---|---|---|
| `src/shared/ui/data-table.tsx`, `data-table.module.css` | RailPass | Shared table shell for later feature lists. |
| `src/shared/ui/page-header.tsx`, `page-header.module.css` | RailPass | Consistent page title and actions layout. |
| `src/shared/ui/empty-state.tsx`, `states.module.css` | RailPass | Reusable empty/loading surfaces for placeholders and API screens. |
| `src/features/bookings/components/booking-status-badge.tsx` | RailPass | Booking status presentation reused in tables and tests. |
| `src/features/journeys/components/journey-status-badge.tsx` | RailPass with LIVE gap | LIVE 06.5 fills the status map. |
| `src/features/journeys/components/train-label.tsx` | RailPass | Compact train label for journey rows. |
| `src/features/network/components/route-label.tsx` | RailPass | Route label shared by network and extras views. |
| `src/prototype/fixtures.ts` | course-only (removed in 07) | Static data for the playground while API queries are not available. |
| `src/app/course-playground.tsx` | course-only (removed in 07) | LIVE 06.6 renders prototype rows in `DataTable`. |

## Talk through
- **`DataTable` slots.** Ask: why expose table parts instead of a huge config prop? Answer: feature views own content while sharing structure.
- **`JourneyStatusBadge` map.** Ask: why centralize label/color? Answer: the same status appears in multiple places.
- **`prototype/fixtures.ts`.** Ask: when should it disappear? Answer: as soon as real pages exist. Lesson 07 deletes it together with the playground, and lesson 10 brings the API data.

## LIVE 06.5 — status badge map
Why: domain labels should have one source of truth.
1. Open `src/features/journeys/components/journey-status-badge.tsx`.
2. In `journeyConfig`, replace the copied `DELAYED` and `CANCELLED` entries: `Delayed` uses `themeColorNames.yellow` with `IconClockExclamation`, and `Journey cancelled` uses `themeColorNames.gray` with `IconBan`.
3. Add both icons to the `@tabler/icons-react` import.
4. Leave the render alone: it already reads `label`, `color` and `icon` from the map and adds the delay suffix.
Hint: `Record<JourneyStatus, …>` makes TypeScript complain when a status is missing, but not when an entry is a copy. That is why the placeholder compiles.
Done when: each journey status renders its own label, colour and icon.

## LIVE 06.6 — prototype journey table
Why: learners practice composing shared cells before the API arrives.
1. Open `src/app/course-playground.tsx`.
2. Map `prototypeJourneys` to `DataTable.Row`.
3. Use `TrainLabel` for the train cell.
4. Add origin/destination text and `JourneyStatusBadge`.
5. Use the journey id as the row key.
Hint: replace only the marked body placeholder.
Done when: the playground shows prototype journey rows; `lesson status 06` shows no open dashboard LIVE markers and `yarn --cwd dashboard typecheck` passes.

## Checkpoint
The browser playground demonstrates shared tables, status badges, train labels, route labels, and empty states using prototype data. Commands: `lesson status 06`, `yarn --cwd dashboard typecheck`, `yarn --cwd dashboard lint`, `yarn --cwd dashboard test`.
