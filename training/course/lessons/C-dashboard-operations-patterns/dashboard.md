# Lesson C · Dashboard operations patterns — 🖥️ Dashboard

## Goal
Learners review operational UI patterns: loading, errors, retries, empty states, and stale data.

## What arrives
| Path | Status | Why |
|---|---|---|
| `kata/dashboard/exercise.md`, `kata/dashboard/answer-key.md` | kata | Optional operations review against the completed dashboard. |

## Talk through
- **`use-query-notification.ts` — repeated failures.** Ask: why centralize query notifications? Answer: every page gets consistent failure behavior.
- **`ErrorState` — recovery.** Ask: what should an error state offer? Answer: context and a retry path when possible.
- **`query-client.ts` — defaults.** Ask: why choose cache defaults deliberately? Answer: operations dashboards need predictable freshness.

## LIVE tasks
None.

## Checkpoint
The browser remains the completed dashboard; learners inspect real pages for loading, error, empty, retry, and stale-data behavior. Commands: `lesson status C`, `yarn run check`.
