# Exercise 04 — Extend a reusable component with tokens

## Context

Reusable components should grow deliberately. This exercise extends a UI primitive such as `Button`, `InlineAlert`, `StatusChip` or dashboard `DataTable` without hard-coding design values.

## Starting point

Read:

- `mobile/components/ui/buttons/button.tsx`
- `mobile/components/ui/feedback/inline-alert.tsx`
- `mobile/components/ui/display/status-chip.tsx`
- `dashboard/src/components/ui/data-table.tsx`
- `dashboard/src/constants/index.ts`
- `docs/design-tokens.md`

## Task

Add a small `size`, `loading` or variant prop to a reusable component.

## Acceptance criteria

- Prop is typed and optional.
- Existing call sites keep current behavior.
- New visual values come from constants or CSS variables.
- Accessibility state reflects loading/disabled/selected state.
- Add or update a small test if the behavior is user-visible.

## Hints

- `Button` already has `loading`, `disabled` and `size`; consider extending a component that does not.
- Avoid variant names that encode one screen’s product language.
- If you need a new token, add it where similar tokens already live.
