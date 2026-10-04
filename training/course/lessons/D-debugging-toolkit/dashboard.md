# Lesson D · Debugging toolkit — 🖥️ Dashboard

## Goal
Learners practice a repeatable debugging path for dashboard issues using types, tests, network traces, and query cache reasoning.

## What arrives
| Path | Status | Why |
|---|---|---|
| `kata/dashboard/exercise.md`, `kata/dashboard/answer-key.md` | kata | Optional debugging scenarios using completed RailPass code. |

## Talk through
- **`journey-keys.ts` — cache inspection.** Ask: what is the first clue for stale UI? Answer: query key mismatch or missing invalidation.
- **`errors.ts` — failed forms.** Ask: how do we tell validation from generic errors? Answer: parse the API code and field errors.
- **`testing/render.tsx` — reproduction.** Ask: when should a bug become a test? Answer: once the failing behavior is understood and repeatable.

## LIVE tasks
None. Run the kata as a debugging drill.

## Checkpoint
The browser remains the completed dashboard; learners use the kata to trace symptoms through query keys, API errors, tests, and targeted fixes. Commands: `lesson status D`, `yarn run check`.
