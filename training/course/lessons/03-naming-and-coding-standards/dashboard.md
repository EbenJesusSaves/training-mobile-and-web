# Lesson 03 · Naming conventions & coding standards — 🖥️ Dashboard

## Goal
The dashboard adopts final lint and import conventions before the codebase grows.

## What arrives
| Path | Status | Why |
|---|---|---|
| `.oxlintrc.json` | RailPass | Enables the final import-sort discipline used by all later overlays. |

## Talk through
- **`.oxlintrc.json` — import order.** Ask: what does automatic sorting reduce? Answer: noisy review comments and merge conflicts.
- **`api/*-keys.ts` and `api/*-queries.ts` naming.** Ask: why repeat the same pattern in each feature? Answer: contributors can navigate by convention.
- **`routes/*-route.tsx` naming.** Ask: why not put view code in route modules? Answer: routes connect URLs to feature views.

## LIVE tasks
None.

## Checkpoint
The browser still shows the setup panel; this lesson changes only the lint rules learners use before adding more files. Commands: `lesson status 03`, `yarn --cwd dashboard lint`, `yarn --cwd dashboard typecheck`, `yarn --cwd dashboard test`.
