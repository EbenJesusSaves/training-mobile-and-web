# 14 · Accessibility

**Notes:** `/courses/scalable-mobile-and-web-apps/accessibility` on the course website · **Time:** 15 min ·
**Workspace changes:** `lesson start 14` adds 1 mobile and 2 dashboard files (LIVE 14.1, 14.5–14.6)

## Goal

Learners add semantics that do not change the visual UI: seat labels and states on mobile, and labelled controls plus table headers on the dashboard.

## What happens

1. **Concept, about 3 min:** roles, labels, state, focus and touch targets are part of the interface.
2. **Mobile LIVE 14.1, about 4 min:** add exact seat labels, role, state and `hitSlop.sm`.
3. **Dashboard LIVE 14.5, about 3 min:** add aria labels to the Burger and user-menu icon buttons.
4. **Dashboard LIVE 14.6, about 3 min:** render table headers with `Table.Th`.
5. **Checkpoint, about 2 min:** inspect semantics and run checks.

## LIVE tasks

| Task | App | File | What you write |
| --- | --- | --- | --- |
| LIVE 14.1 seat accessibility | 📱 | `mobile/features/booking/seat-map.tsx` | Add `hitSlop.sm`, exact seat labels, button role, selected state, and disabled state for taken seats. |
| LIVE 14.5 icon labels | 🖥️ | `dashboard/src/app/layouts/dashboard-layout.tsx` | Add `aria-label="Toggle navigation"` to `Burger` and `aria-label="Open user menu"` to the user `ActionIcon`. |
| LIVE 14.6 table headers | 🖥️ | `dashboard/src/shared/ui/data-table.tsx` | Change the header cell mapping from `Table.Td` to `Table.Th`. |

## Checkpoint

- 📱 Seat labels read like `Seat 6, right side, available`; taken seats stay discoverable and disabled.
- 🖥️ Icon-only controls have names and table headers are real header cells.
- `yarn run check` passes.

## Common problems

- Do not hide taken seats from assistive tech. They explain why a seat cannot be chosen.
- Put the dashboard marker outside JSX attributes; comments inside attributes are easy to break.
- There is no `/` keyboard search shortcut in RailPass. Do not add or mention one.

## Facilitator notes

- Demo with a real screen reader if possible; the label format matters.
- Tie accessibility to testing: Maestro can tap by the same labels users hear.
- Keep the dashboard tasks to the Burger, user menu and table header cells only.

**Next:** lesson 15 turns these behaviours into tests.
