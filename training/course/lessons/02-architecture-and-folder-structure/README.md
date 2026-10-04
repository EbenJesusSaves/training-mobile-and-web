# 02 · Architecture & folder structure

**Notes:** `/courses/scalable-mobile-and-web-apps/architecture-and-folder-structure` on the course website · **Time:** 25 min ·
**Workspace changes:** `lesson start 02` adds 25 mobile files, 28 dashboard files and `ARCHITECTURE.md` (LIVE 02.9)

## Goal

Agree where code belongs and which imports are allowed before implementation spreads across the apps.

## What happens

1. **Layer map (about 5 min):** routes, features, shared UI, logic, client state, data access and configuration.
2. **Mobile folder tour (about 6 min):** README notes plus `mobile/api/types.ts`, with strict feature boundaries.
3. **Dashboard folder tour (about 5 min):** feature public pieces are allowed; views and private helpers are not.
4. **Workspace LIVE task (about 5 min):** LIVE 02.9 completes the two missing import-rule rows in `ARCHITECTURE.md`.
5. **Checkpoint and compare (about 4 min):** inspect folder notes, run checks, then compare with RailPass.

## LIVE tasks

| Task | App | File | What you write |
| --- | --- | --- | --- |
| LIVE 02.9 | workspace | `ARCHITECTURE.md` | Complete the mobile `features/<name>/` row and dashboard `shared/` row in the import rules table. |

For LIVE 02.9, write that mobile features may import `components/`, `hooks/`, `api/`, `libs/`, `constants/` and `config/`, but not `app/`, another feature or `store/`. Add that dashboard `shared/` may import other `shared/` folders and libraries, but not `features/` or `app/`. Done looks like the table can answer a placement question without the facilitator.

## Checkpoint

- 📱 Mobile still shows the setup screen, and the folder README files explain ownership and imports.
- 🖥️ Dashboard still shows the setup panel, with feature/shared README notes and API type files in place.
- `yarn run check` passes.

## Common problems

- **"Feature-first" sounds like features can import each other:** not on mobile. Promote shared code down to `components/` or `libs/` instead.
- **Store imports in feature components:** route files in `mobile/app/` read stores and pass props; feature UI should stay reusable.
- **Dashboard rule confusion:** dashboard features may import another feature's public types, query keys/hooks, slice actions or small display components, but not its views.

## Facilitator notes

- Keep this concrete: open one real mobile feature file and one dashboard feature file.
- Emphasise that `components/theme/theme-provider.tsx` is the one mobile component allowed to read a store later.
- If short on time, complete LIVE 02.9 together and leave the rest of the README notes for review.

**Next:** lesson 03 turns naming and import conventions into enforceable habits.
