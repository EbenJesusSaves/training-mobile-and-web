# Lesson 14 · Accessibility — 🖥️ Dashboard

## Goal
The dashboard improves screen-reader labels and table semantics without changing visual layout.

## What arrives
| Path | Status | Why |
|---|---|---|
| `src/app/layouts/dashboard-layout.tsx` | RailPass with LIVE gap | LIVE 14.5 restores labels for icon-only controls. |
| `src/shared/ui/data-table.tsx` | RailPass with LIVE gap | LIVE 14.6 renders header cells as `<th>` through `Table.Th`. |

## Talk through
- **`dashboard-layout.tsx` — icon-only buttons.** Ask: what does a screen reader announce without a label? Answer: usually only “button”.
- **`data-table.tsx` — table headers.** Ask: why does `<th>` matter? Answer: assistive tech can connect cells to columns.
- **Browser inspection — semantics.** Ask: what should we inspect besides pixels? Answer: accessible names and roles.

## LIVE 14.5 — label icon buttons
Why: keyboard and screen-reader users need the same control meaning sighted users infer from icons.
1. In `dashboard-layout.tsx`, find the `Burger` control.
2. Add `aria-label="Toggle navigation"`.
3. Find the user menu `ActionIcon`.
4. Add `aria-label="Open user menu"`.
Hint: keep the marker above the return; do not place comments inside JSX attributes.
Done when: accessibility inspection shows useful button names.

## LIVE 14.6 — table headers
Why: data tables should announce column names as users move through cells.
1. In `data-table.tsx`, find the header cell rendering.
2. Render header cells with `Table.Th`.
3. Keep body cells as `Table.Td`.
4. Preserve existing class names and props.
Hint: only the header component changes element type.
Done when: table headers are `<th>` elements; `lesson status 14` shows no open dashboard LIVE markers and `yarn --cwd dashboard typecheck` passes.

## Checkpoint
The browser looks the same, but the sidebar/user controls have accessible names and dashboard tables expose real header cells to assistive technology. Commands: `lesson status 14`, `yarn --cwd dashboard typecheck`, `yarn --cwd dashboard lint`, `yarn --cwd dashboard test`.
