# Lesson 17 · Scaling the codebase — 🖥️ Dashboard

## Goal
Learners add the Extras page by following the established API, query, form, and table patterns.

## What arrives
| Path | Status | Why |
|---|---|---|
| `src/features/network/api/network-queries.ts` | RailPass with LIVE gap | Adds add-on mutation; LIVE 17.5 invalidates add-on queries after save. |
| `src/features/network/components/extras-view.tsx` | RailPass with LIVE gap | Fare table, modal, and form are worked examples; LIVE 17.6 adds editable add-ons table. |

## Talk through
- **`network-keys.ts` — existing key family.** Ask: where should add-ons fit? Answer: under the network key factory, not a new ad-hoc key.
- **`extras-view.tsx` — copy a pattern.** Ask: what should be copied from route default fares? Answer: loading, error, table, and edit interaction structure.
- **`AddOnForm` — feature-local form.** Ask: why keep it in network components? Answer: add-ons are part of the network domain.

## LIVE 17.5 — add-on invalidation
Why: mutations must refresh the specific cached collection they change.
1. In `network-queries.ts`, add `const queryClient = useQueryClient();` inside `useAddOnMutation`.
2. In `onSuccess`, call `queryClient.invalidateQueries({ queryKey: networkKeys.addOns })`.
3. Keep the API call and options spread intact.
Hint: do not invalidate all network queries when only add-ons changed.
Done when: saving an add-on refreshes the add-ons table.

## LIVE 17.6 — editable add-ons table
Why: new features scale when they reuse the same loading/error/table/edit pattern.
1. In `extras-view.tsx`, import `useAddOns` and `componentSizeKeys`.
2. Call `const addOns = useAddOns();` near the route fares query.
3. Change state to `const [editing, setEditing] = useState<AddOnDto | null>(null)`.
4. Add `openEdit(addOn)` to set the editing add-on.
5. Replace the marked JSX with Skeleton, ErrorState, and `DataTable` rows including the `Switch` and Edit `Button`.
Hint: mirror the route default fares block and use `networkKeys.addOns` through the hook, not a manual fetch.
Done when: the Extras page shows add-ons and opens the modal for edits; `lesson status 17` shows no open dashboard LIVE markers and `yarn --cwd dashboard typecheck` passes.

## Checkpoint
The browser Extras page now shows route default fares and editable add-ons, with loading/error states, table rows, edit modal, and mutation refresh. Commands: `lesson status 17`, `yarn --cwd dashboard typecheck`, `yarn --cwd dashboard lint`, `yarn --cwd dashboard test`.
