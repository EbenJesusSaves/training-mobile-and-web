# Lesson 02 · Architecture & folder structure — 🖥️ Dashboard

## Goal
Learners can place future dashboard code in the right folder before implementation begins.

## What arrives
| Path | Status | Why |
|---|---|---|
| `src/app/README.md`, `src/app/layouts/README.md`, `src/app/routes/README.md` | course notes | Define app wiring, layout ownership, and route module responsibilities. |
| `src/features/README.md`; auth, bookings, journeys, network, overview, passengers, preferences README files | course notes | Explain each feature boundary, allowed imports, naming pattern, and arrival lesson. |
| `src/shared/README.md`; api, config, constants, hooks, lib, types, ui README files | course notes | Separate reusable infrastructure from feature screens. |
| `src/styles/README.md`, `src/testing/README.md` | course notes | Preview global styling and test helper folders. |
| `src/features/auth/types.ts` | RailPass | Session user and auth response contracts for slices, queries, and guards. |
| `src/features/bookings/types.ts` | RailPass | Booking list/detail contracts for lesson 10 tables and lesson 15 tests. |
| `src/features/journeys/types.ts` | RailPass | Journey, manifest, status, and schedule request contracts. |
| `src/features/network/types.ts` | RailPass | Station, route, fare, and add-on contracts for network pages. |
| `src/features/overview/types.ts` | RailPass | Metric and chart data contracts. |
| `src/features/passengers/types.ts` | RailPass | Passenger list/detail contracts. |
| `src/shared/types/pagination.ts` | RailPass | Shared paginated endpoint shape. |

## Talk through
- **`src/features/README.md` — import rules.** Ask: why can features share types and badges but not views? Answer: contracts are public; screens are orchestration internals.
- **`src/shared/README.md` — dependency direction.** Ask: what may `shared/` import? Answer: libraries and `shared/`, never feature or app code.
- **`src/features/journeys/types.ts` — DTOs first.** Ask: why type API shapes before fetching data? Answer: future UI compiles against the real contract.

## LIVE tasks
None.

## Checkpoint
The browser still shows the lesson 01 setup panel; no routes or feature UI have appeared yet. Learners inspect the new README notes and type files in the editor. Commands: `lesson status 02`, `yarn --cwd dashboard typecheck`, `yarn --cwd dashboard lint`, `yarn --cwd dashboard test`.
