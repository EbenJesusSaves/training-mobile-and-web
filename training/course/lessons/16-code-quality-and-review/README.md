# 16 · Code quality, readability & review

**Notes:** `/courses/scalable-mobile-and-web-apps/code-quality-and-review` on the course website · **Time:** 15 min ·
**Workspace changes:** `lesson start 16` updates the workspace pull request template (LIVE 16.9) and includes a review kata

## Goal

Learners practise specific, kind review comments and turn the course standards into a pull request checklist.

## What happens

1. **Concept, about 3 min:** tools catch form; reviewers catch meaning, risk and user impact.
2. **Review kata, about 5 min:** read `kata/review-pr.diff` and write comments before opening the answer key.
3. **LIVE 16.9, about 4 min:** add agreed checklist items to `.github/pull_request_template.md`.
4. **Checkpoint, about 2 min:** run status and checks.
5. **Compare, about 1 min:** use `lesson diff mobile` and `lesson diff dashboard` to confirm no app code changed.

## LIVE tasks

| Task | App | File | What you write |
| --- | --- | --- | --- |
| LIVE 16.9 PR checklist | workspace | `.github/pull_request_template.md` | Add checklist items for light/dark and large text, course API testing, and no secrets or real server addresses. |

For LIVE 16.9, edit the checklist near the bottom of the template. Add:

1. `Checked in light and dark mode, and at the largest text size on mobile`.
2. `Tried against the course API: the how-to-test steps above work`.
3. `No secrets or real server addresses in code or committed env files`.

Done means the template has those three checkbox rows, `lesson status 16` has no LIVE markers, and the kata discussion names at least one issue that tooling missed.

## Checkpoint

- 📱 No mobile files change; learners review mobile risks in the kata.
- 🖥️ No dashboard files change; learners review dashboard risks in the kata.
- `yarn run check` passes.

## Common problems

- Do not apply the kata diff to a dirty workspace. It is safe to read as text.
- Review comments should explain what, why and a possible how; avoid comments that only say "bad" or "fix".
- The PR template is workspace-root `.github/pull_request_template.md`, not an app-local file.

## Facilitator notes

- Keep the tone explicit: kind does not mean vague, and blocking means risk.
- Ask which findings tools caught, then which findings only humans caught.
- Use the answer key after learners have written their own comments.

**Next:** lesson 17 adds a feature using a repeatable playbook.
