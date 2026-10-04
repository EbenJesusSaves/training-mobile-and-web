# Lesson 18 · Capstone: ship a feature end to end — 🖥️ Dashboard

## Goal
Staff can update journey status end to end, and the composed dashboard matches the RailPass reference.

## What arrives
| Path | Status | Why |
|---|---|---|
| `src/features/journeys/api/journey-queries.ts` | RailPass with LIVE gap | Adds journey update mutation; LIVE 18.5 invalidates list, detail, and overview caches. |
| `src/features/journeys/components/journey-detail-view.tsx` | RailPass with LIVE gaps | Full detail page; LIVE 18.6 wires save logic and LIVE 18.7 renders status controls. |

## Talk through
- **`useUpdateJourney` — targeted invalidation.** Ask: which screens can change after a status update? Answer: journey list, current detail, and overview metrics.
- **`journey-detail-view.tsx` — local form state.** Ask: why keep status controls local until save? Answer: staff can review changes before mutation.

## LIVE 18.5 — update invalidation
Why: one status change affects multiple cached views.
1. In `journey-queries.ts`, add `const queryClient = useQueryClient();` inside `useUpdateJourney`.
2. In `onSuccess`, invalidate `journeyKeys.all`.
3. Invalidate `journeyKeys.detail(id)`.
4. Invalidate `overviewKeys.all`.
Hint: the mutation receives the updated journey id.
Done when: status changes refresh list, detail header, and overview without a reload.

## LIVE 18.6 — save status
Why: the status panel needs one clear mutation boundary.
1. In `journey-detail-view.tsx`, add `status` and `delayMinutes` state from the journey.
2. In the effect that syncs loaded journey data, set both state values.
3. Implement `saveStatus` to call `updateJourney.mutate` with `{ id: journeyId, status, delayMinutes }`.
4. Send `delayMinutes` only when status is `DELAYED`.
Hint: keep the API payload shape from `UpdateJourneyInput`.
Done when: the Save button can persist scheduled, delayed, and cancelled states.

## LIVE 18.7 — status controls
Why: staff need an accessible, explicit way to make operational changes.
1. Import `Select`, `NumberInput`, and `JourneyStatus` if your editor removed them.
2. Inside the Status controls panel, render a `Select` bound to `status`.
3. Render `NumberInput` for delay minutes only when status is `DELAYED`.
4. Render a `Button` that calls `saveStatus` and shows mutation loading state.
Hint: use the same status values the API type exports.
Done when: marking a journey Delayed +15 shows that status in the header and overview/list data refresh; `lesson status 18` shows no open dashboard LIVE markers and `yarn --cwd dashboard typecheck` passes.

## Checkpoint
The browser shows the complete RailPass staff dashboard: auth, overview charts, journeys, status controls, bookings, passengers, network, and extras all use real data. Commands: `lesson status 18`, `yarn --cwd dashboard typecheck`, `yarn --cwd dashboard lint`, `yarn --cwd dashboard test`, `yarn run check`; `lesson diff dashboard` lists only the files where your version differs from RailPass (the folder README notes and `.env.example` always do).
