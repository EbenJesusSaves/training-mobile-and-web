# Lesson 04 · Choosing libraries deliberately — 🖥️ Dashboard

## Goal
Learners can name which library owns each concern before those libraries appear in feature code.

## What arrives
| Path | Status | Why |
|---|---|---|
| No dashboard files | reading tour | The decision discussion happens before implementation adds more moving parts. |

## Talk through
- **`package.json` — server cache.** Ask: which library owns API cache and invalidation? Answer: TanStack Query.
- **`src/features/preferences/preferences-slice.ts` — client state.** Ask: what belongs in Redux? Answer: local UI/session state, not fetched lists.
- **`src/shared/api/client.ts` — HTTP boundary.** Ask: why centralize Axios? Answer: auth headers and API errors need one policy.

## LIVE tasks
None.

## Checkpoint
The browser still shows the setup panel; the lesson is a library-role discussion before Router, Query, Redux, and Mantine appear in dashboard code. Commands: `lesson status 04`, `yarn --cwd dashboard typecheck`, `yarn --cwd dashboard lint`, `yarn --cwd dashboard test`.
