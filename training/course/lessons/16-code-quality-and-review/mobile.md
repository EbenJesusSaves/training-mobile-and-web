# Lesson 16 · Code quality, readability & review — 📱 Mobile

> There are no new mobile files in this lesson. Learners review their own mobile code using the same checklist they add to the workspace PR template.

## What arrives

Nothing. `lesson start 16` does not copy files into `mobile/`.

## Talk through (together)

1. **Your latest mobile diff: review for meaning.** Ask: what would a reviewer learn that lint cannot see? Answer: domain mistakes, copied server state, client-sent prices and hidden errors.
2. **`mobile/app/(app)/(tabs)/tickets.tsx`: stable keys.** Ask: what did lesson 13 protect? Answer: list identity during insertions and re-ordering.
3. **`mobile/features/booking/seat-map.tsx`: accessible custom UI.** Ask: what should every custom drawing expose? Answer: role, label, state and a reachable target.
4. **`mobile/store/booking-draft-store.ts`: server trust boundary.** Ask: what does the app send to the API? Answer: selections, never prices.

## Live tasks

There is no mobile LIVE task in lesson 16. Do the workspace task in the README, then use the kata to review the mobile and dashboard diff.

## Checkpoint

Open the review kata in `lessons/16-code-quality-and-review/kata/`, write two mobile review comments before reading the answer key, then update the workspace PR template. Commands: `lesson status 16` shows no open mobile tasks, and `yarn run check` passes from the workspace root.

## Removed / replaced in this lesson

No mobile files are overwritten or deleted. `lesson start 16` updates the workspace `.github/pull_request_template.md` for LIVE 16.9.
