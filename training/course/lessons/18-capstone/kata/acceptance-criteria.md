# Capstone · Trip updates end to end — acceptance criteria

> **The story.** As operations staff, I can mark a journey *Delayed* (with minutes) or *Cancelled* in the dashboard, so that passengers with an upcoming booking on that train find out from the app instead of at the platform.

This is the "definition of done" for the capstone. It describes behaviour, not code, so you can check your work against it before you compare with RailPass. The step-by-step tasks are in this lesson's `dashboard.md` and `mobile.md`.

## Before you start: test data etiquette (shared API)

Everyone in the room uses the same course API, so a journey you mark *Cancelled* is cancelled for every learner.

1. **Use your own journey.** In the dashboard, schedule a journey that departs a few hours from now (*Journeys → Create journey*, lesson 11).
2. **Use your own passenger.** On mobile, sign up a new passenger account (lesson 12) and book one seat on that journey.
3. **Leave the journey *Scheduled* again** when you're done.

Never change the seeded journeys or the demo accounts' bookings (`ama@railpass.dev`, `kwame@railpass.dev`).

## 🖥️ Dashboard (staff)

| # | Given / When | Then |
|---|---|---|
| D1 | I open a journey's detail page (`/journeys/:journeyId`) | The **Status controls** panel shows a *Status* select (Scheduled, Delayed, Cancelled) set to the journey's current status. |
| D2 | I choose **Delayed** | A *Delay minutes* number input appears, pre-filled with the journey's current delay and limited to 0–1440 (the `fieldLimits` constants match the API rule). For Scheduled and Cancelled it is hidden. |
| D3 | I press **Save status** | The dashboard sends `{ status, delayMinutes }` through `useUpdateJourney`. `delayMinutes` is `0` unless the status is Delayed. The button shows a loader while the request runs, so a second click can't send a duplicate. |
| D4 | I choose **Cancelled** and press Save | The browser asks me to confirm first. If I dismiss the dialog, nothing is sent. |
| D5 | The update succeeds | A "Journey updated." notification appears. Without a page reload, the header badge shows the new status (e.g. **Delayed · 15m**), and the *Journeys* list and *Overview* show it the next time I open them. |
| D6 | The update fails (API stopped, or an invalid value) | An error notification shows the API's message, and the panel keeps what I chose so I can try again. |

## 📱 Mobile (passenger)

| # | Given / When | Then |
|---|---|---|
| M1 | I have an upcoming booking on that journey, and staff marked it Delayed or Cancelled | When **Home** comes back into focus, the bell shows a badge. No restart or sign-out needed. |
| M2 | A screen reader focuses the bell | It announces "Trip updates, new" when there are updates and "Trip updates" when there are none. |
| M3 | I open **Updates** (`/updates`) | I see one card per affected trip. Delayed: "Delayed by 15 min · *train number*", the route and departure time, and "Your seats are unchanged. Booking *reference*". Cancelled: "Train cancelled · *train number*" and "Contact RailPass staff to rebook or arrange a refund." |
| M4 | I look at a card | The icon, border and text all signal Delayed (clock, warning tone) or Cancelled (ban, danger tone). Colour is never the only signal. |
| M5 | I tap a card | The ticket for that booking opens (`/tickets/[id]`). |
| M6 | The list is loading, empty or failed | Loading shows a skeleton. Empty shows "You're all caught up". A failure with no cached data shows an error with a *Retry* button. Pull to refresh works. |
| M7 | Staff set the journey back to **Scheduled** | After a refresh (or when Home regains focus), the card disappears and the badge clears. |

## Engineering criteria (how it's built)

- **No new store.** Trip updates are *derived* from the upcoming-bookings query (`bookings:upcoming`), which Home and Tickets already share. Nothing is copied into Zustand or Redux. (Lesson 09's rule: server data is never copied into a client store.)
- **Logic lives in a hook, not a screen.** `mobile/hooks/use-trip-updates.ts` turns bookings into `TripUpdate` items. Home and Updates both consume it.
- **Targeted invalidation.** After a successful update, the dashboard invalidates `journeyKeys.all`, `journeyKeys.detail(id)` and `overviewKeys.all`. It doesn't clear the whole cache or reload the page.
- **The server owns the rules.** The client sends a status and minutes. The API validates them (`delayMinutes` 0–1440) and decides which bookings count as upcoming.
- **Tokens, not values.** Colours, sizes and spacing come from theme tokens and constants (`colors.warning`, `colors.danger`, `sizes`, `spacing`, `fieldLimits`). No hex codes or magic numbers.
- **Green checks.** `yarn run check` passes at the workspace root, and `lesson status 18` shows no LIVE markers left.
- **Reviewable history.** Conventional commits, one per app, e.g. `feat(dashboard): add journey status controls` and `feat(mobile): show trip updates on home and updates screen`.

## Demo script (2 minutes, both apps side by side)

1. Dashboard: open your journey → **Delayed**, 15 minutes → **Save status**. Point at the notification and the header badge.
2. Mobile: switch to Home. The bell has a badge → open **Updates** → read the card → tap it to open the ticket.
3. Dashboard: **Cancelled** → confirm → save. Mobile: pull to refresh on Updates. The card now says the train is cancelled.
4. Dashboard: back to **Scheduled**. Mobile: return to Home. The badge is gone.

## Stretch goals (optional)

- Move the bookings → trip-updates mapping into a pure function and unit-test it (Delayed, Cancelled and Scheduled segments, and a round trip with one leg delayed).
- Add a Maestro flow that opens Updates from the Home bell (see `mobile/e2e/maestro/`).
- Show the delay on the ticket screen too, reusing `StatusChip`.
