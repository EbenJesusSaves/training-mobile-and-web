# 18 · Capstone: ship a feature end to end

**Notes:** `/courses/scalable-mobile-and-web-apps/capstone` on the course website · **Time:** 45 min ·
**Workspace changes:** `lesson start 18` adds 3 mobile and 2 dashboard files, removes `mobile/prototype`, and includes the capstone kata (LIVE 18.1–18.3, 18.5–18.7)

## Goal

Learners ship one cross-app feature: staff change a journey status in the dashboard, and affected passengers see a mobile update.

## What happens

1. **Feature brief, about 5 min:** read the acceptance criteria and pick safe test data.
2. **Dashboard LIVE 18.5–18.7, about 12 min:** invalidate affected queries, save status and render status controls.
3. **Mobile LIVE 18.1–18.3, about 14 min:** derive updates, render the updates screen and light the Home bell.
4. **End-to-end demo, about 7 min:** staff mark a journey delayed; passenger sees the bell/card/ticket path.
5. **Review, about 5 min:** use the rubric, run checks and compare with RailPass.
6. **Catch-up, about 2 min:** use `lesson diff mobile` and `lesson diff dashboard`.

## LIVE tasks

| Task | App | File | What you write |
| --- | --- | --- | --- |
| LIVE 18.1 derive updates | 📱 | `mobile/hooks/use-trip-updates.ts` | Query `bookings:upcoming` and `flatMap` non-`SCHEDULED` segments into `TripUpdate` items. |
| LIVE 18.2 updates UI | 📱 | `mobile/app/(app)/updates.tsx` | Render skeleton, empty, error and delayed/cancelled cards that open tickets. |
| LIVE 18.3 Home badge | 📱 | `mobile/app/(app)/(tabs)/index.tsx` | Replace `const hasUpdates = false` with `const { hasUpdates } = useTripUpdates()`. |
| LIVE 18.5 update invalidation | 🖥️ | `dashboard/src/features/journeys/api/journey-queries.ts` | Invalidate `journeyKeys.all`, `journeyKeys.detail(id)` and `overviewKeys.all`. |
| LIVE 18.6 save status | 🖥️ | `dashboard/src/features/journeys/components/journey-detail-view.tsx` | Add status state, delay state and `saveStatus` with delayed minutes only for delayed journeys. |
| LIVE 18.7 status controls | 🖥️ | `dashboard/src/features/journeys/components/journey-detail-view.tsx` | Render the Status select, Delay minutes input and Save status button. |

## Checkpoint

- 📱 Returning to Home shows a bell badge for upcoming delayed or cancelled trips; Updates opens the affected ticket.
- 🖥️ Staff can mark journeys Scheduled, Delayed or Cancelled and see refreshed list/detail/overview data.
- `yarn run check` passes.

## Common problems

- Use your own journey and passenger. The course API is shared, so do not cancel seeded demo journeys.
- If the mobile badge does not appear, leave and re-enter Home so `refetchOnFocus` runs.
- Do not copy updates into Zustand. They are derived from upcoming bookings.
- `lesson start 18` removes `mobile/prototype`; do not refer to the prototype screen in this capstone.

## Facilitator notes

- Keep both apps visible for the demo: dashboard save on one side, mobile bell on the other.
- Ask learners to reset their journey to Scheduled when done.
- Use `kata/acceptance-criteria.md` before coding and `kata/rubric.md` during peer review.

**Next:** optional extension A explores the drawing and motion behind the finished app.
