# 03 · Naming conventions & coding standards

**Notes:** `/courses/scalable-mobile-and-web-apps/naming-and-coding-standards` on the course website · **Time:** 15 min ·
**Workspace changes:** `lesson start 03` adds 1 mobile file, 1 dashboard file and `CONVENTIONS.md` (LIVE 03.1, 03.9)

## Goal

Make names, suffixes, import order and team rules explicit before the codebase grows.

## What happens

1. **Naming tour (about 3 min):** kebab-case files, role suffixes, component/hook/boolean/event names.
2. **Import-order tour (about 3 min):** mobile ESLint groups and dashboard oxlint/simple-import-sort config.
3. **Mobile LIVE task (about 4 min):** LIVE 03.1 turns on mobile import sorting.
4. **Workspace LIVE task (about 3 min):** LIVE 03.9 adds one team convention with a ✅ / ❌ example.
5. **Checkpoint and compare (about 2 min):** lint, check status and compare.

## LIVE tasks

| Task | App | File | What you write |
| --- | --- | --- | --- |
| LIVE 03.1 | 📱 mobile | `mobile/eslint.config.js` | Replace the disabled `simple-import-sort/imports` rule with the eight groups from `CONVENTIONS.md`. |
| LIVE 03.9 | workspace | `CONVENTIONS.md` | Add one room-agreed rule with a heading, ✅ example, ❌ example and a short "Why" line. |

For LIVE 03.9, choose a rule the room actually wants to enforce. The solution example uses "Named exports only" while allowing framework-required defaults such as Expo Router screens. Do LIVE 03.1 and LIVE 03.9 together so the linter and notes agree.

## Checkpoint

- 📱 Mobile lint now enforces import order.
- 🖥️ Dashboard lint reads the final `.oxlintrc.json`; there is no dashboard LIVE marker in this lesson.
- `yarn run check` passes.

## Common problems

- **Escaping backslashes in the ESLint groups:** copy the regex strings exactly, including `^\\u0000` and `^.+\\u0000$`.
- **Putting constants too early:** mobile constants have their own group after relative imports.
- **Adding a rule nobody will follow:** keep LIVE 03.9 short, reviewable and tied to code examples.

## Facilitator notes

- Run `yarn --cwd mobile lint --fix` only after showing what the rule catches.
- Treat dashboard import sorting as a reading task, not a live task.
- Ask learners to name one convention from their workplace and whether tooling could enforce it.

**Next:** lesson 04 discusses dependency choices and wraps SecureStore.
