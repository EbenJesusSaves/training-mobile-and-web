# Exercise 08 — Accessibility fix

## Context

A custom control looks right but is inaccessible. You will fix a flawed seat button or icon-only action.

## Starting point

Read:

- `training/exercises/flawed-examples/inaccessible-seat-button.tsx`
- `mobile/features/booking/seat-map.tsx`
- `mobile/components/ui/buttons/icon-button.tsx`
- `mobile/__tests__/status-chip.test.tsx`

## Task

Rewrite the flawed control so assistive technologies receive useful semantics.

## Acceptance criteria

- Interactive controls have role, label and state.
- Unavailable/disabled is not communicated by colour alone.
- Hit target is at least 44 pt or uses existing `hitSlop` constants.
- If applicable, add a small test for visible text or accessible label.
- Visual values use tokens.

## Hints

- Native `Pressable` can expose `accessibilityRole`, `accessibilityLabel` and `accessibilityState`.
- If a Skia drawing is decorative, mark it inaccessible and layer native controls over it.
- A good label includes entity, position and state.
