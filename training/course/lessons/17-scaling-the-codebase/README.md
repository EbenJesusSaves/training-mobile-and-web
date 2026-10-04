# 17 · Scaling the codebase

**Notes:** `/courses/scalable-mobile-and-web-apps/scaling-the-codebase` on the course website · **Time:** 15 min ·
**Workspace changes:** `lesson start 17` adds 1 mobile and 2 dashboard files (LIVE 17.1, 17.5–17.6)

## Goal

Learners add features by following a playbook instead of scattering code: route, data, existing components, states, mutation boundaries and review.

## What happens

1. **Concept, about 3 min:** use a feature playbook and tolerate only useful duplication.
2. **Mobile LIVE 17.1, about 5 min:** build the station detail screen from route params to navigation.
3. **Dashboard LIVE 17.5, about 2 min:** invalidate add-ons after mutation.
4. **Dashboard LIVE 17.6, about 3 min:** render the editable add-ons table.
5. **Checkpoint, about 2 min:** demo both features and compare with RailPass.

## LIVE tasks

| Task | App | File | What you write |
| --- | --- | --- | --- |
| LIVE 17.1 station detail | 📱 | `mobile/app/(app)/stations/[id].tsx` | Fetch `travelApi.station(id)` with `useApiQuery`, render hero/destinations/departures and prefill booking via `setStation`. |
| LIVE 17.5 add-on invalidation | 🖥️ | `dashboard/src/features/network/api/network-queries.ts` | Add `useQueryClient()` and invalidate `networkKeys.addOns` on successful add-on update. |
| LIVE 17.6 editable add-ons | 🖥️ | `dashboard/src/features/network/components/extras-view.tsx` | Use `useAddOns()`, `setEditing`, `openEdit`, loading/error states and a `DataTable` with toggle and edit actions. |

## Checkpoint

- 📱 Station detail loads, refreshes, handles empty/error states and can prefill a booking.
- 🖥️ Extras show add-ons, support editing and refresh after mutation.
- `yarn run check` passes.

## Common problems

- If `stations/[id]` type-checks fail, keep Expo running once so typed routes regenerate.
- Do not import another feature's internals. Use API modules, hooks, stores and shared UI.
- In the dashboard, invalidate the add-ons query after mutation; local toggles alone leave stale data.

## Facilitator notes

- Narrate the playbook order while coding: params, data, components, states, navigation.
- Point out useful duplication: the screen can have local styles without extracting early.
- Keep the dashboard table task scoped to add-ons, not routes.

**Next:** lesson 18 ships a full end-to-end status update feature.
