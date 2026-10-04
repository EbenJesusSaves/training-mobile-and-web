# C · Dashboard operations patterns

**Notes:** `/courses/scalable-mobile-and-web-apps/dashboard-operations-patterns` on the course website · **Time:** 25 min ·
**Workspace changes:** none (reading guide and kata)

## Goal

Learners study staff-facing operations patterns and decide what passenger apps should borrow, adapt or avoid.

## What happens

1. **Concept, about 5 min:** operations UI optimises for monitoring, triage and safe mutation.
2. **Dashboard reading, about 8 min:** inspect tables, drawers, errors, retries and cache defaults.
3. **Mobile pairing, about 4 min:** compare passenger constraints with staff workflows.
4. **Kata, about 5 min:** complete the operations-patterns exercise.
5. **Checkpoint, about 3 min:** share one borrowed pattern and one rejected pattern.

## Kata

Use `kata/dashboard/exercise.md` and `kata/mobile/operations-patterns-kata.md`. The mobile kata asks which dashboard pattern to borrow and which to avoid.

## Checkpoint

- 📱 Mobile learners can explain why passenger UI should not copy staff-only workflows.
- 🖥️ Dashboard learners can point to loading, error, retry, empty and stale-data patterns.
- `yarn run check` passes.

## Common problems

- Do not turn this into a mobile implementation lesson; there are no workspace changes.
- Avoid saying every dashboard pattern belongs on mobile. Authority and context differ.
- Keep suggestions frontend-only and tied to existing RailPass files.

## Facilitator notes

- Pair mobile-heavy learners with dashboard-heavy learners.
- Ask for trade-offs, not a list of components.
- Use lesson 18 trip updates as the bridge between operations and passenger notification.

**Next:** extension D practises debugging with a repeatable method.
