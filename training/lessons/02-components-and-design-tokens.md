# Lesson 2 — Reusable components, design consistency, tokens and themes

**Estimated duration:** 75 minutes

## Learning objectives

Learners can:

- Explain the RailPass token system across mobile and dashboard.
- Use `mobile/constants/*`, `mobile/components/theme/tokens.ts`, `dashboard/src/constants/*` and `dashboard/src/styles/tokens.css` instead of hard-coded values.
- Describe the light theme, the red-accented dark theme, and why danger/unavailable states remain distinct from the red brand.
- Extend a reusable component without leaking product-specific logic.

## Relevant code paths

- `docs/design-tokens.md`
- `mobile/constants/colors.ts`
- `mobile/components/theme/tokens.ts`
- `mobile/components/theme/theme-provider.tsx`
- `mobile/components/ui/buttons/button.tsx`
- `mobile/components/ui/display/status-chip.tsx`
- `mobile/features/booking/seat-map.tsx`
- `dashboard/src/app/theme.ts`
- `dashboard/src/styles/tokens.css`
- `dashboard/src/components/ui/status-badges.tsx`

## Real snippets to read aloud

The theme object intentionally carries only colours:

```ts
export interface AppTheme {
  scheme: ColorScheme;
  colors: ThemeColors;
}

export const createTheme = (scheme: ColorScheme): AppTheme => ({ scheme, colors: palettes[scheme] });
```

`mobile/components/ui/buttons/button.tsx` tokenizes every visual decision:

```tsx
const palette: Record<Variant, { background: string; border: string; tone: TextTone; content: string }> = {
  primary: { background: colors.accent, border: colors.accent, tone: 'onAccent', content: colors.onAccent },
  danger: { background: colors.dangerSoft, border: colors.danger, tone: 'danger', content: colors.danger },
};
```

The dashboard mirrors token values as CSS variables:

```css
:root[data-mantine-color-scheme='dark'] {
  --rp-accent: #ff4d5a;
  --rp-danger: #ffb4a9;
  --rp-seat-taken: #3a3535;
}
```

## What we chose / Why / Trade-offs / When we'd choose differently

| Topic               | What we chose                                                           | Why                                                                    | Trade-offs                                            | Choose differently when                                                         |
| ------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------- |
| Mobile styling      | Plain `StyleSheet` with typed constants                                 | Low dependency overhead; easy to search                                | More manual imports than Restyle                      | A design system needs responsive variants and typed scales across many apps     |
| Dashboard styling   | Mantine theme plus CSS variables in `tokens.css`                        | Mantine components are accessible; CSS Modules can use the same tokens | Must keep TS constants and CSS variables in lock-step | A single CSS-in-JS system may fit a smaller dashboard                           |
| Dark adaptation     | Brand accent changes from green to `#FF4D5A`                            | Matches requested red dark mode while keeping contrast                 | Red can be confused with errors                       | Danger uses a separate token plus icon/label and unavailable seats use hatching |
| Reusable components | Shared UI in `mobile/components/ui/` and `dashboard/src/components/ui/` | Consistency and lower review burden                                    | Too-early abstraction can freeze the wrong API        | Keep feature-local until used by at least two features with the same behavior   |

## Do / Don't examples

### Do — use tokens

```tsx
const styles = StyleSheet.create({
  row: { borderRadius: radii.xl, padding: spacing.md, minHeight: sizes.rowMinHeight },
});
```

### Don't — hard-code design values in components

```tsx
// Teaching anti-pattern.
const styles = StyleSheet.create({
  row: { borderRadius: 24, padding: 12, minHeight: 64, backgroundColor: '#FF4D5A' },
});
```

### Do — keep red brand, danger and unavailable seats distinguishable

```tsx
danger: { background: colors.dangerSoft, border: colors.danger, tone: 'danger', content: colors.danger }
```

## Live demonstration script

1. Open `docs/design-tokens.md` and read the “Keeping states distinguishable from the red brand accent” section.
2. Open `mobile/constants/colors.ts`; compare `accent`, `danger`, `seatTaken`, `seatSelected` in light and dark.
3. Open `mobile/components/ui/buttons/button.tsx`; find where loading, disabled opacity, compact size and variants are tokenized.
4. Open `dashboard/src/app/theme.ts`; show Mantine’s virtual `rail` colour switching between green and red.
5. Open `dashboard/src/styles/tokens.css`; point out CSS Modules use `--rp-*` variables rather than raw hex/px.

## Discussion questions

- Why is `danger` not just “red” in dark mode?
- What should a reviewer do when they see `padding: 16` in a component?
- How do token files make screenshots and design QA cheaper?
- When does a shared component become too generic?

## Prediction exercise

**Question:** What will happen if unavailable seats use `colors.accent` with lower opacity instead of `colors.seatTaken` and hatching?

**Facilitator notes / answer:** Users who cannot distinguish colour or are in dark mode may confuse unavailable and available seats. The current design uses shape (hatching), missing numbers, accessibility labels and a separate token. Colour alone would fail the course accessibility and state-distinction rules.

## Debugging task

A learner changes a dashboard CSS Module to `box-shadow: 0 12px 34px rgba(0, 0, 0, 0.25)` and `border-radius: 30px`. Ask the group to replace the raw values with existing `--rp-*` variables or constants and explain which token should own each value.

## Code-review activity

Review a component extension. Check:

- No raw hex, px, font size, duration, shadow or breakpoint in TSX/CSS Modules.
- Uses the existing variant naming language.
- Accessibility state and labels update with the variant.
- Danger/destructive styles use danger tokens, not brand accent.
- The component remains feature-neutral.

## Implementation challenge

**Task:** Add a `loading` or `size` variant to an existing reusable component using tokens.

**Acceptance criteria:**

- The public prop is typed.
- Existing call sites keep current behavior.
- New visual values come from `mobile/constants/*` or `dashboard/src/constants/*`.
- Loading/disabled states announce `accessibilityState` or the equivalent web semantics.

## Expected outcomes

Learners should leave with a reflex: if a value affects appearance, first look for a token; if none exists, add a token deliberately and mirror it across platforms where appropriate.

## Facilitator guidance

- **Timing:** 25 min walkthrough, 15 min token scavenger hunt, 20 min component exercise, 15 min review.
- **Common misconception:** “A colour constant is enough.” The state must also be named and communicated by text/icon/shape.
- **How to run:** Use the app screenshots and live theme toggles. Mobile theme can be changed from Profile; dashboard colour scheme is in the app shell.
