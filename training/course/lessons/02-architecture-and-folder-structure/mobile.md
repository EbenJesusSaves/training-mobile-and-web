# Lesson 02 · Architecture & folder structure — 📱 Mobile

> You add the mobile folder map and the API contract types before screens grow. The app still looks the same, but every future file now has an obvious home.

## What arrives

| File | Status | Why it's here |
| --- | --- | --- |
| `mobile/api/types.ts` | RailPass | Request and response shapes from the RailPass API. Fixtures, stores, clients and screens all compile against these names. |
| `mobile/app/README.md` | folder notes | Route files are composition roots: they connect navigation, stores, hooks and feature UI. |
| `mobile/api/README.md`, `mobile/config/README.md`, `mobile/constants/README.md` | folder notes | Boundaries for API clients, runtime config and fixed design/domain values. |
| `mobile/components/README.md`, `mobile/components/atomic/README.md`, `mobile/components/layout/README.md`, `mobile/components/theme/README.md`, `mobile/components/ui/**/README.md` | folder notes | Shared UI ownership, with the important exception that `components/theme/theme-provider.tsx` reads preferences in the final app. |
| `mobile/features/README.md`, `mobile/features/auth/README.md`, `mobile/features/booking/README.md`, `mobile/features/profile/README.md`, `mobile/features/tickets/README.md` | folder notes | Feature folders own product-specific UI, not navigation or global store wiring. |
| `mobile/hooks/README.md`, `mobile/libs/README.md`, `mobile/store/README.md` | folder notes | Glue hooks, pure helpers/storage wrappers and client-owned state. |
| `mobile/__tests__/README.md`, `mobile/e2e/README.md` | folder notes | Where Jest tests and Maestro flows will land later. |

## Talk through (together)

1. **`mobile/features/README.md`: strict feature boundaries.** Ask: can booking import ticket components? Answer: no. Mobile features never import another feature and never import `store/`; screens in `app/` read stores and pass props down.
2. **`mobile/components/theme/README.md`: the one store exception.** Ask: why can the final `theme-provider.tsx` read preferences? Answer: theme selection is app-wide infrastructure, and the provider is the boundary that turns a persisted preference into UI colours.
3. **`mobile/api/types.ts`: contract vocabulary.** Ask: which values are dangerous to guess? Answer: status enums, route IDs, seat shapes, money in integer pesewas and UTC timestamps.
4. **`ARCHITECTURE.md`: compare mobile and dashboard.** Ask: how is the dashboard looser? Answer: dashboard features may import another feature's public pieces such as types, query keys/hooks, slice actions and small display components, but not views.

## Live tasks

No live mobile coding task in this lesson. Read the folder notes, then complete the workspace task in `ARCHITECTURE.md` from the lesson README.

## Checkpoint

Opening any mobile folder README explains what belongs there, what does not, allowed imports, naming and the lesson that fills it. The app still shows the lesson 01 setup screen.

Commands: `lesson status 02` shows no open mobile tasks, and `yarn run check` passes from the workspace root.

## Removed / replaced in this lesson

Nothing.
