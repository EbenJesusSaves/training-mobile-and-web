# Exercise 06 — Code-review exercise

## Context

You are reviewing a learner PR that adds a journey filter and tweaks the seat card. The PR compiles, but you must review maintainability.

## Starting point

Use these files as references:

- `training/exercises/flawed-examples/hard-coded-styles.tsx`
- `training/exercises/flawed-examples/duplicated-server-state-store.ts`
- `training/exercises/flawed-examples/inaccessible-seat-button.tsx`
- `mobile/features/booking/seat-map.tsx`
- `mobile/hooks/use-journey-search.ts`

## Task

Write review comments for at least five issues. Then propose a corrected direction.

## Acceptance criteria

- Comments cite the project convention they protect.
- At least one comment addresses tokens.
- At least one comment addresses state ownership.
- At least one comment addresses accessibility.
- At least one comment addresses query keys or stale data.
- Comments are actionable and respectful.

## Hints

- “This is wrong” is not a useful review comment.
- Prefer: “Could we move this value to `mobile/constants/sizes.ts` so dark/light and screenshots stay consistent?”
- Use the checklist from `training/lessons/07-accessibility-testing-git-review.md`.
