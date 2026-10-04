# Lesson 03 · Naming conventions & coding standards — 📱 Mobile

> You turn mobile import order into an enforced rule. Names and file suffixes stay in the notes; imports become something the linter can fix.

## What arrives

| File | Status | Why it's here |
| --- | --- | --- |
| `mobile/eslint.config.js` | RailPass, LIVE 03.1 | Replaces the lesson 01 course version and adds `eslint-plugin-simple-import-sort` groups used by all later files. |

## Talk through (together)

1. **`CONVENTIONS.md`: source of truth.** Ask: why do LIVE 03.1 and LIVE 03.9 happen together? Answer: the code rule and the team note should say the same thing before the codebase grows.
2. **`mobile/eslint.config.js`: imports as a tool problem.** Ask: why should reviewers not discuss import order? Answer: the fixer sorts imports the same way every time.
3. **Type imports.** Ask: why are type-only imports last? Answer: they disappear at runtime and the group makes that boundary visible.

## Live tasks

### LIVE 03.1 — Fill import-sort groups (`mobile/eslint.config.js`)

**Why:** stable imports keep diffs readable and make future course overlays lint cleanly.

1. Leave `simpleImportSort` imported with `require('eslint-plugin-simple-import-sort')`.
2. Replace `'simple-import-sort/imports': 'off'` with the rule array.
3. Set the groups in this order: side-effect imports `['^\\u0000']`; `react`, then packages `['^react', '^@?\\w']`; components/features `['^@/components/', '^@/features/']`; hooks `['^@/hooks/']`; other `@/` imports `['^@/']`; relative imports `['^\\.']`; constants `['^@/constants/']`; type-only imports `['^.+\\u0000$']`.
4. Keep the existing ignore block for `dist`, `.expo` and `node_modules`.
5. Run the fixer when you have later files to sort: `yarn --cwd mobile lint --fix`.

**Hint:** the `@/constants/` group comes after relatives because constants are design/domain values, not feature code.

**Done when:** `yarn --cwd mobile lint` passes and an intentionally shuffled import list is reported or fixed.

## Checkpoint

The app still shows the setup screen, but import-order drift is now a lint error.

Commands: `lesson status 03` shows no open mobile tasks, and `yarn run check` passes from the workspace root.

## Removed / replaced in this lesson

`lesson start 03` overwrites the lesson 01 course-version `mobile/eslint.config.js`.
