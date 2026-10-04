# Lesson A · Motion & graphics with Skia and Reanimated — 🖥️ Dashboard

## Goal
Learners critique how motion could support the dashboard without adding animation for its own sake.

## What arrives
| Path | Status | Why |
|---|---|---|
| `kata/dashboard/exercise.md`, `kata/dashboard/answer-key.md` | kata | Optional extension for motion review using existing dashboard files. |

## Talk through
- **`src/shared/constants/motion.ts` — durations.** Ask: what motion should be tokenized? Answer: reusable timing/easing, not one-off surprises.
- **`src/shared/ui/error-state.tsx` — calm feedback.** Ask: where could motion help? Answer: state transitions, not critical text itself.
- **`src/app/layouts/dashboard-layout.tsx` — navigation.** Ask: what should never be hidden behind animation? Answer: current location and keyboard access.

## LIVE tasks
None. Use the kata for discussion or homework.

## Checkpoint
The browser remains the completed dashboard; learners use the kata to inspect where restrained motion could support loading, navigation, and state transitions. Commands: `lesson status A`, `yarn run check`.
