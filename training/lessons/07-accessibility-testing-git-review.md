# Lesson 7 — Accessibility, testing, Git workflow and code review

**Estimated duration:** 75 minutes

## Learning objectives

Learners can:

- Add labels, roles, states and hit targets to mobile controls.
- Avoid communicating status only through colour.
- Understand the test layers: Jest/RNTL, Vitest/RTL and backend e2e concurrency tests.
- Use Husky hooks and conventional commits.
- Apply a frontend code-review checklist.

## Relevant code paths

- `mobile/features/booking/seat-map.tsx`
- `mobile/components/ui/display/status-chip.tsx`
- `mobile/__tests__/status-chip.test.tsx`
- `mobile/__tests__/booking-draft-store.test.ts`
- `dashboard/src/features/bookings/components/booking-status-badge.tsx`
- `dashboard/src/features/bookings/components/booking-status-badge.test.tsx`
- `backend/test/booking-flow.e2e-spec.ts`
- `.husky/pre-commit`
- `.husky/commit-msg`
- `scripts/check-all.sh`

## Real snippets to read aloud

Seat buttons expose labels and state:

```tsx
<Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ selected: isSelected }} hitSlop={hitSlop.sm} />
```

The status-chip test checks words, not colour:

```tsx
expect(await screen.findByLabelText('Delayed +25 min')).toBeTruthy();
expect(screen.getByText('Delayed +25 min')).toBeTruthy();
```

The backend e2e test proves concurrency behavior:

```ts
const statuses = results.map((result) => result.status).sort();
expect(statuses).toEqual([201, 409]);
expect(results.find((result) => result.status === 409)!.body.code).toBe('SEAT_TAKEN');
```

The pre-commit hook checks only touched apps:

```sh
for app in backend dashboard mobile; do
  if echo "$staged" | grep -q "^$app/"; then
    yarn --cwd "$app" --silent lint || exit 1
    yarn --cwd "$app" --silent typecheck || exit 1
  fi
done
```

## What we chose / Why / Trade-offs / When we'd choose differently

| Topic                | What we chose                                      | Why                                                     | Trade-offs                   | Choose differently when                                       |
| -------------------- | -------------------------------------------------- | ------------------------------------------------------- | ---------------------------- | ------------------------------------------------------------- |
| Seat accessibility   | Native Pressables over Skia                        | Labels, focus and hit areas work across platforms       | More layout math             | Pure Skia input needs a strong accessibility wrapper strategy |
| Status communication | Icon + label + colour                              | Inclusive and testable                                  | Slightly more visual noise   | Internal operator tools still need labels for auditability    |
| Tests                | Unit/component tests plus backend e2e              | Fast frontend feedback and server truth for concurrency | No mobile E2E yet            | Add Maestro or Detox when flows stabilize                     |
| Git hooks            | Conventional commit and touched-app lint/typecheck | Fast guardrails                                         | Hooks are not CI replacement | CI should still run `scripts/check-all.sh` for release        |

## Do / Don't examples

### Do — include accessible labels and roles

```tsx
<View key={label} style={styles.detail} accessible accessibilityLabel={`${label} ${value}`}>
  <AppText variant="label" color={ticketColors.muted}>
    {label}
  </AppText>
</View>
```

### Don't — rely on colour alone

```tsx
// Teaching anti-pattern.
<View style={{ backgroundColor: isDelayed ? 'yellow' : 'green' }} />
```

### Do — test user-visible words

```tsx
expect(screen.getByText('Checked in')).toBeTruthy();
```

## Live demonstration script

1. Turn on a screen reader or inspect accessibility props in code for the seat map.
2. Show unavailable seats: hatched, disabled, labelled “unavailable”.
3. Run targeted tests: `yarn --cwd mobile test __tests__/status-chip.test.tsx` and `yarn --cwd dashboard test src/features/bookings/components/booking-status-badge.test.tsx`.
4. Open `.husky/commit-msg`; explain allowed conventional commit formats.
5. Show `scripts/check-all.sh` as the broader release-quality command.

## Discussion questions

- Which UI states in RailPass must not rely on colour?
- What would a screen reader announce for an unavailable seat?
- Why are backend e2e tests part of frontend confidence?
- What belongs in a PR description for a UI change?

## Prediction exercise

**Question:** What will happen if a seat button has no `accessibilityLabel` and only displays the seat number visually?

**Facilitator notes / answer:** Screen-reader users may hear an unhelpful number or no meaningful state, and they will not know whether the seat is available, selected or unavailable. The current label includes side and state: “Seat 6, left side, selected.”

## Debugging task

A learner changes `StatusChip` colours and the test still passes. Ask: what did the test prove, and what did it not prove? Add a manual contrast check against `docs/design-tokens.md` and consider a visual regression or token snapshot if needed.

## Code-review activity

Use this checklist on any exercise PR:

- Design values are tokenized.
- Labels/roles/states exist for interactive controls.
- Loading/error/empty states are covered.
- Server state is not duplicated into client stores.
- Query keys include all server inputs.
- Tests cover important logic or user-visible behavior.
- Commit message matches `type(scope): description`.

## Implementation challenge

**Task:** Fix an accessibility issue in a deliberately flawed seat button.

**Acceptance criteria:**

- The control has role, label and selected/disabled state.
- Unavailable state is communicated by label and disabled semantics, not only colour.
- Touch target is at least 44 pt or uses `hitSlop`.
- A small test or manual verification note describes expected announcement.

## Expected outcomes

Learners can review for inclusion and maintainability, not just “does it compile”.

## Facilitator guidance

- **Timing:** 20 min accessibility walkthrough, 15 min tests, 20 min review checklist, 20 min challenge.
- **Common misconception:** “If the visible text is clear, accessibility is done.” Custom-drawn and icon-only controls need explicit semantics.
- **How to run:** Targeted tests are enough during class. Full release checks use `yarn check` from the root.
