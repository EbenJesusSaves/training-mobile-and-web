## What and why

<!-- What does this change, and why now? Link the issue or the request. One sentence each is fine. -->

## How to test

<!-- Steps a reviewer can follow against the course API, with an account to use. -->

1.
2.

## Screenshots

<!-- Before and after when the UI changes. Delete the row for an app this PR doesn't touch. -->

| | Light | Dark |
| --- | --- | --- |
| 📱 Mobile | | |
| 🖥️ Dashboard | | |

## Checklist

- [ ] `yarn run check` passes (lint, type-check and tests in both apps)
- [ ] Commit messages follow `type(scope): description`
- [ ] Names, files and folders follow `CONVENTIONS.md` (kebab-case files, named exports, the right suffix and place)
- [ ] No hard-coded design values or magic numbers: tokens, constants and configuration instead
- [ ] Loading, empty and error states exist, and every error reaches the user
- [ ] Server data stays in the query layer; client stores hold client state only
- [ ] Query keys come from the key factory and include every input
- [ ] The client sends selections, never prices or totals
- [ ] Interactive elements have a role, a label and their state (disabled, selected, busy)
- [ ] New logic has a test, or this PR says why not
- [ ] Docs or a decision record are updated when a decision changed

<!-- LIVE 16.9 — Add the checklist items your team agreed on in the review kata (at least one). -->
