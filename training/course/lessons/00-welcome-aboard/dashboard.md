# Lesson 00 · Welcome aboard RailPass — 🖥️ Dashboard

## Goal
Learners understand the staff dashboard destination and the reason it grows in reviewable layers.

## What arrives
| Path | Status | Why |
|---|---|---|
| No dashboard files | reading tour | Keep the opening conversation about product shape, boundaries, and course workflow. |

## Talk through
- **`src/app/router.tsx` — route ownership.** Ask: why should route modules stay thin? Answer: routing selects screens; feature folders own behavior.
- **`src/features/journeys/components/journeys-view.tsx` — feature boundary.** Ask: what would make this hard for another team to change? Answer: importing unrelated feature internals.
- **`src/shared/ui/data-table.tsx` — shared primitive.** Ask: when does UI belong in `shared`? Answer: when several features need the same behavior and styling contract.

## LIVE tasks
None.

## Checkpoint
The browser is not part of this lesson yet; learners preview the finished dashboard in discussion and leave with the route, feature, and shared-layer map in mind.
