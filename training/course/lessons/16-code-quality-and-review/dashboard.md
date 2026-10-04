# Lesson 16 · Code quality, readability & review — 🖥️ Dashboard

## Goal
Learners practice reviewing the dashboard for clear ownership, small diffs, and maintainable interfaces.

## What arrives
| Path | Status | Why |
|---|---|---|
| No dashboard files | reading guide | Pause for review habits before the final feature additions. |

## Talk through
- **`journeys-view.tsx` — orchestration size.** Ask: which logic could move to a hook if it grew? Answer: URL/query-state coordination, not display-only rows.
- **`shared/ui/data-table.tsx` — API shape.** Ask: what makes a shared component hard to change? Answer: too many feature-specific props.
- **`shared/api/errors.ts` — error boundary.** Ask: why keep parsing in one module? Answer: every form gets the same behavior when the API changes.

## LIVE tasks
None. Run a short review: each pair names one dependency direction they would protect in a PR.

## Checkpoint
The browser remains the API-backed staff dashboard from lesson 15; learners use it while reviewing boundaries, naming, loading states, and shared component APIs. Commands: `lesson status 16`, `yarn --cwd dashboard typecheck`, `yarn --cwd dashboard lint`, `yarn --cwd dashboard test`.
