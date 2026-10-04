# Capstone · Review rubric

Use this rubric in pairs: swap laptops, run the demo script from `acceptance-criteria.md`, then score each other's work. It's for feedback, not grades: each row says what "solid" looks like, so the gaps are easy to name.

Score each row **0** (missing), **1** (works, with gaps) or **2** (solid).

## 1. Behaviour (does it do the job?)

| Area | 2 = solid looks like… | Score |
|---|---|---|
| Status controls | D1–D4 pass: current status preselected, delay input only for Delayed, confirm before Cancel, one request per click. | |
| Feedback & freshness | D5–D6 pass: success and error notifications; header, list and Overview update without a reload. | |
| Passenger signal | M1–M2 pass: badge appears when Home regains focus; the bell's label changes with state. | |
| Updates screen | M3–M7 pass: correct copy for each kind, tap opens the ticket, all four states (loading, empty, error, data), pull to refresh. | |

## 2. Architecture (will it survive the next feature?)

| Area | 2 = solid looks like… | Score |
|---|---|---|
| Server state stays server state | Updates are derived from the shared `bookings:upcoming` query with `useMemo`; nothing is copied into a store; the dashboard relies on query invalidation. | |
| Right layer, right file | Derivation in `hooks/use-trip-updates.ts`; mutation and invalidation in `journey-queries.ts`; screens only render and call hooks. No feature imports another feature. | |
| Precise cache updates | Exactly the affected keys are invalidated (`journeyKeys.all`, `journeyKeys.detail(id)`, `overviewKeys.all`). No `queryClient.clear()` and no full refetch. | |
| Trusts the contract | Sends only `status` and `delayMinutes` (0 unless Delayed); lets the API validate; shows the API's error message. | |

## 3. Craft (is it pleasant to read and use?)

| Area | 2 = solid looks like… | Score |
|---|---|---|
| Tokens & constants | No hex codes, pixel values or magic numbers; `fieldLimits`, theme colours and spacing tokens are used. | |
| Accessibility | Bell and cards have roles and labels; status isn't shown by colour alone; the dashboard controls have visible labels. | |
| Naming & readability | Files are kebab-case, hooks start with `use`, booleans read as questions (`hasUpdates`, `cancelled`), and handlers say what they do (`saveStatus`). | |
| Checks & history | `yarn run check` is green; no LIVE markers left; small conventional commits per app. | |

**Total: ___ / 24**

## Debrief questions (whole room, 5 minutes)

1. Where did the trip-update logic end up, and what would break if it lived inside the Home screen instead?
2. The passenger app learns about the delay when Home regains focus. What are the trade-offs of focus refetching, polling (`refetchIntervalMs`) and push notifications here?
3. Which dashboard screens would show stale data if you removed one of the three invalidations? How would you notice in a code review?
4. What would you change if staff could also post a free-text message with the delay ("signal failure at Nsawam")? Which files change in each app, and what do you need from the API?

## Facilitator notes

- If a pair's badge never appears, check three things in order: the passenger's booking is on *that* journey; the booking is still upcoming (not cancelled, arrival in the future); Home actually lost and regained focus (open another tab first).
- If the dashboard header doesn't update, `journeyKeys.detail(id)` is usually the missing invalidation.
- Before anyone catches up, have pairs commit and run `lesson diff` to compare their apps with RailPass; it's a good debrief prompt. Then `lesson catch-up 18` brings everyone to the full RailPass apps.
