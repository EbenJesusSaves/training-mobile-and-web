# Lesson C · Dashboard operations patterns — 📱 Mobile

> There is no mobile build in this dashboard-focused extension. Mobile learners pair with a dashboard learner and compare passenger UI constraints with staff operations patterns.

## What arrives

Nothing. This extension copies no mobile files.

## Talk through (together)

1. **Passenger vs staff authority.** Ask: what should mobile borrow from operations screens? Answer: clear loading, empty, error and retry states.
2. **What mobile should not borrow.** Ask: what stays dashboard-only? Answer: staff-only authority checks, operational forms and bulk workflows.
3. **`mobile/hooks/use-trip-updates.ts`: a shared pattern.** Ask: what does mobile share with dashboard operations? Answer: derive from server state and refresh through queries instead of copying data into stores.

## Live tasks

There is no mobile LIVE task. Pair with someone reading the dashboard guide, then use `kata/mobile/operations-patterns-kata.md` as a short comparison exercise.

## Checkpoint

Name one dashboard pattern mobile should borrow and one it should not. Commands: `lesson status C` shows no open mobile tasks, and `yarn run check` passes from the workspace root.

## Removed / replaced in this lesson

Nothing.
