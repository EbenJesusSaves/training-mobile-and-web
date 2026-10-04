# Review kata — answer key

> Facilitator file. Hand it out **after** the room has written its own comments on `review-pr.diff`.

The pull request: **#27 "added book again button and revenue"** by Kofi, a teammate who joined last month.
It touches both apps:

| App | File | Change |
| --- | --- | --- |
| 📱 | `mobile/components/BookAgainButton.tsx` | new "Book again" button for past trips |
| 📱 | `mobile/app/(app)/(tabs)/tickets.tsx` | shows the button under every past trip |
| 🖥️ | `dashboard/src/features/bookings/components/RevenueCard.tsx` | new revenue card above the bookings table |
| 🖥️ | `dashboard/src/features/bookings/bookings-slice.ts` | new Redux slice that holds bookings |
| 🖥️ | `dashboard/src/app/store.ts` | registers the slice |
| 🖥️ | `dashboard/src/features/bookings/components/bookings-view.tsx` | renders the card |

## Running the kata

1. **Read it like a GitHub PR** (10 min). Open `review-pr.diff` in VS Code; it's coloured like a PR. Read the
   description first, then the diff. Write each comment with a label (below) and the line it belongs to.
2. **Run the tools on it** (optional, 5 min). In your workspace, on a clean tree:

   ```bash
   git switch -c review/pr-27
   git apply --check ~/RailPass/training/course/lessons/16-code-quality-and-review/kata/review-pr.diff
   git apply ~/RailPass/training/course/lessons/16-code-quality-and-review/kata/review-pr.diff
   yarn run check
   ```

   Afterwards, undo it exactly and go back:

   ```bash
   git apply -R ~/RailPass/training/course/lessons/16-code-quality-and-review/kata/review-pr.diff
   git switch - && git branch -D review/pr-27
   ```

   If `git apply --check` complains, some of your files differ from RailPass. Review the diff as text instead; most real
   reviews happen that way.
3. **Compare** with this key (10 min): which issues did the tools find, which did people find, and which did nobody find?

### Comment labels

| Label | Meaning | Blocks the merge? |
| --- | --- | --- |
| **blocking** | A bug, a broken contract, a security or data problem, or a break of a rule in `CONVENTIONS.md` | yes |
| **suggestion** | Worth changing; the author decides, or it becomes a follow-up issue | no |
| **question** | You don't know. Ask; don't accuse | no |
| **nit** | Tiny and personal. Never blocks | no |
| **praise** | Something done well, said specifically | no |

A good comment says **what** to change, **why** (the rule, the risk or the user impact) and, when it helps, **how**
(a link to the RailPass file that already does it). Comment on the code, not on Kofi.

## What the tools caught

Measured by applying the diff to the RailPass reference apps and running the same commands as `yarn run check`:

| Check | Result |
| --- | --- |
| 📱 ESLint | **2 errors**, both `simple-import-sort/imports` (in `tickets.tsx` and `BookAgainButton.tsx`), fixable with `--fix` |
| 📱 TypeScript | passes. The `as any` on line 27 hides the broken request body |
| 📱 Jest | passes (14 tests). Nothing tests the new code |
| 🖥️ oxlint | no new findings. Any warnings you see were there before the PR |
| 🖥️ TypeScript | passes |
| 🖥️ Vitest | passes. Nothing tests the new code |

Two import-order errors out of about thirty issues. The tools check the *form* of the code; reviewers check what it
*means*. Both features also fail against the course API (details below), so "works on my machine" can't be true.

## The comments

Line numbers are in the new version of each file.

### 📱 `mobile/components/BookAgainButton.tsx`

1. **blocking: what the button does (lines 10–33).**
   > "Past trips have already departed, so re-sending the same journey and seats can't work: the API answers
   > `JOURNEY_DEPARTED`, or `409 SEAT_TAKEN` once the seats are sold again. Could 'Book again' prefill the search
   > instead (same origin and destination) and let the passenger pick a new journey? `bookFrom` in
   > `app/(app)/stations/[id].tsx` already does this with `setStation` and `router.navigate('/')`."

   Why: the feature must match the domain. Lessons 08 and 10.

2. **blocking: the client sends a price (lines 13, 26–27).**
   > "The app must send selections, never prices: `BookingRequest` has no total, and the API prices every booking
   > itself (`bookingsApi.quote` shows the price before checkout). The API also rejects unknown fields, so this request
   > fails with `400 VALIDATION_FAILED`, 'property totalCents should not exist'. `as any` is what hid that from
   > TypeScript; please remove the cast and the `totalCents` line."

   Why: never trust the client, and money comes from the server. Lessons 08, 10 and 12, and the flawed example
   `training/exercises/flawed-examples/client-trusted-price.ts`. The `+ 250` is also an unexplained magic number.

3. **blocking: the error is swallowed (lines 29–31).**
   > "If this fails, the passenger sees the button flash and nothing else; the error only reaches the Metro console.
   > `useAsyncAction` (`hooks/use-async-action.ts`) gives you `run`, `isPending` and `error` and ignores double taps;
   > `app/(app)/checkout.tsx` shows how we surface the `ApiError` message. With the prefill approach from comment 1 there's no request here at all."

   Why: every failure reaches the user, with a way forward. Lesson 11 and `flawed-examples/swallowing-errors.ts`.

4. **blocking: double submit and no accessibility (lines 36–37).**
   > "Nothing disables the button while it's loading, so a double tap sends two bookings. Screen readers also get no
   > role or label, and they read the loading state as 'dot dot dot'. Our `Button` (`components/ui/buttons/button.tsx`)
   > handles `loading`, `disabled`, the role and the minimum touch size. Could you use it here?"

   Why: lessons 06 and 14, and `flawed-examples/inaccessible-seat-button.tsx`.

5. **blocking: hard-coded design values (lines 36–37).**
   > "`#C6F432`, `14`, `22`, `6`, `'700'` and `15` bypass the tokens, so dark mode and a future rebrand miss this button.
   > `#C6F432` isn't even one of our colours: the accent is `colors.accent` from `useTheme()`. Using `Button` fixes all
   > of these at once."

   Why: no hard-coded design values (`CONVENTIONS.md`, "Values: no magic numbers"). Lesson 05 and
   `flawed-examples/hard-coded-styles.tsx`.

6. **blocking: file name, place and export (lines 1–7).**
   > "Only the tickets tab uses this, so per `CONVENTIONS.md` it belongs in the feature, in kebab-case:
   > `features/tickets/book-again-button.tsx`, with a named export `BookAgainButton`. Shared `components/` is for
   > pieces several features use."

   Why: lessons 02 and 03 (and the team rule "Named exports only"). Cheap to fix now, expensive after the next ten
   files copy it.

7. **blocking: misleading copy (line 28).**
   > "'You paid' isn't true: checkout is simulated and no payment is taken. Also, `formatFare` in `libs/format.ts` formats
   > money for us, so we don't hand-build `GH₵` strings."

8. **question: round trips (lines 12, 16, 21).**
   > "This only books `segments[0]` as a one-way trip. Is that intended for round-trip bookings, or should 'Book again'
   > keep the trip type?"

9. **nit: names (lines 8, 10, 22, 29).**
   > "`click` → a verb for what it does (`bookAgain` or `searchAgain`); `loading` → `isBooking`; `t` → `ticket`,
   > `e` → `error`. See the names table in `CONVENTIONS.md`."

10. **nit: `setLoading(false)` outside `finally` (line 32).**
    > "This works today only because the `catch` swallows everything. If anyone rethrows, the spinner sticks. `finally`
    > (or `useAsyncAction`) makes it safe."

### 📱 `mobile/app/(app)/(tabs)/tickets.tsx`

11. **blocking (the tool caught it): import order (line 4).**
    > "ESLint fails here: run `yarn lint --fix`. The default import also goes away once the button has a named export."

12. **question: one row, two touch targets (lines 34–39).**
    > "Each past trip is now a card plus a separate button underneath. Should the action live inside `TripListItem`, so
    > the row stays one clear unit for screen readers and the list keeps a single `renderItem` shape?"

### 🖥️ `dashboard/src/features/bookings/bookings-slice.ts` and `dashboard/src/app/store.ts`

13. **blocking: server data copied into Redux (slice lines 1–16; store lines 4 and 32).**
    > "Bookings are server state, and TanStack Query already owns them. A copy in Redux goes stale as soon as someone
    > changes a status (`useBookingStatusMutation` invalidates the query, not this slice), and then two parts of the
    > screen disagree. Redux here holds client state only: `auth` and `preferences`. Please drop the slice."

    Why: lesson 09's rule, "server data is never copied into a client store", and
    `flawed-examples/duplicated-server-state-store.ts`.

### 🖥️ `dashboard/src/features/bookings/components/RevenueCard.tsx`

14. **blocking: the request always fails (line 15).**
    > "The API caps `pageSize` at 100, and it doesn't accept an empty `status` (that's why `bookings-view.tsx` sends
    > `status || undefined`). This request gets `400 VALIDATION_FAILED` every time, and with no error state the card
    > shows GH₵ 0.00. Could you try it against the course API and add a screenshot?"

    Why: the API is a contract; check it in Swagger (`/api/docs`) before relying on it. Lesson 10.

15. **blocking: revenue is computed from one page (lines 15, 23).**
    > "Even with a valid page size, summing one page undercounts as soon as there are more bookings than fit on it, and
    > with no status filter it also adds up cancelled bookings. Revenue is already computed by the API:
    > `useOverview()` returns `totals.revenueTodayCents` and `totals.revenueLast7DaysCents`, and the Overview page shows
    > them. Could this card link there, or could we ask for a revenue figure on the bookings endpoint?"

    Why: derive from the source of truth; don't duplicate business logic in the client. Lessons 08 and 17.

16. **blocking: the query key misses its inputs (line 14).**
    > "`['bookings']` doesn't include `status`, so changing the select doesn't refetch, and the new result is cached under
    > the old key. It's also exactly `bookingKeys.all`, the prefix we use to invalidate every bookings query. Keys come
    > from the factory, with every input: `bookingKeys.list(params)` in `api/booking-keys.ts`, or simply `useBookings`."

    Why: lesson 10, query-key factories.

17. **blocking: no loading, empty or error states (lines 25–31).**
    > "Right now loading, failure and 'no bookings' all look like GH₵ 0.00, which is a real-looking number. Mantine's
    > `Skeleton` and our `ErrorState` and `EmptyState` (`shared/ui`) cover these; `bookings-view.tsx` shows the pattern."

    Why: lesson 11.

18. **blocking: polling every 5 seconds (line 16).**
    > "`5000` is a magic number, and polling a list endpoint every 5 s for every open tab is expensive (and a failing
    > query keeps retrying). Our timings live in `queryTimings` (`shared/constants/query.ts`); the overview refreshes every
    > `overviewRefetchMs` (60 s)."

    Why: lesson 13 (polling cost) and `CONVENTIONS.md` (tunable behaviour lives in configuration).

19. **blocking: hard-coded design values and hand-made money (lines 26–29).**
    > "`#0B1F14`, `#C6F432`, `18`, `32` and `800` should be tokens (`styles/tokens.css`, the Mantine theme). Money goes
    > through `formatMoney` in `shared/lib/format.ts`."

    Why: lesson 05.

20. **suggestion: a second, unlabelled status filter (line 27).**
    > "The page already has a status filter right below. Two filters that disagree will confuse staff. This one also has
    > no label, its empty option shows as a blank row, and `CHECKED_IN` is missing. If a filter stays, reuse the page's
    > `status` and the same labelled options."

    Why: lessons 06 (duplication) and 14 (labels).

21. **blocking: file name and export (line 10).**
    > "Kebab-case and a named export, please: `revenue-card.tsx` exporting `RevenueCard`."

22. **nit: names (lines 23, 27).**
    > "`b` → `booking`, `v` → `value`."

### The pull request itself

23. **blocking: the commit message.**
    > "The `commit-msg` hook rejects 'added book again button and revenue'. Two changes, two PRs, e.g.
    > `feat(tickets): add book again to past trips` and `feat(bookings): show revenue on the bookings page`. Smaller
    > PRs get faster, better reviews."

24. **blocking: no tests, no way to test.**
    > "Could you add how-to-test steps and a screenshot per app (light and dark)? And a test for the new behaviour:
    > after pressing 'Book again', the draft store has the trip's origin and destination."

    Why: the PR template (this lesson) and lesson 15. "It's a small change" is exactly when a test is cheap.

### Praise worth giving

Kind, specific praise is part of a good review:

- "Thanks for explaining *why* in the description: passengers asked for it, and so did operations. That makes this
  much easier to review."
- "Good call to show the button only for past trips (`scope === 'past'`)."
- "Nice reuse of `listBookings` and `bookingsApi` instead of calling Axios directly: the API layer is doing its job."
- "`import type` for the types: 👍"

## A better shape

📱 One possible fix (it compiles and lints in the reference app):

```tsx
// mobile/features/tickets/book-again-button.tsx
import { router } from 'expo-router';

import { Button } from '@/components/ui/buttons/button';

import { useBookingDraftStore } from '@/store/booking-draft-store';

import type { Booking } from '@/api/types';

interface BookAgainButtonProps {
  booking: Booking;
}

/** Re-runs the search for a past trip; the passenger still picks a journey, seats and pays the current fare. */
export function BookAgainButton({ booking }: BookAgainButtonProps) {
  const { origin, destination } = booking.segments[0].journey;

  const handlePress = () => {
    const { setStation } = useBookingDraftStore.getState();
    setStation('origin', origin);
    setStation('destination', destination);
    router.navigate('/');
  };

  return (
    <Button
      title="Book again"
      variant="secondary"
      size="compact"
      onPress={handlePress}
      accessibilityHint={`Searches ${origin.city} to ${destination.city} again`}
    />
  );
}
```

No request, no price, no error to swallow: the booking flow that already handles all of that does the work.

🖥️ Drop `RevenueCard.tsx` and `bookings-slice.ts`, and revert `store.ts`. Revenue is already on the Overview page,
from the API. If operations need it on the bookings page, that's a conversation with them and with the API owners,
followed by a small card that uses a query hook, `formatMoney`, tokens and the three states.

## What tools could catch next time

When the same comment comes up in every review, turn it into a tool:

| Comment | Tool |
| --- | --- |
| `console.log` swallowing errors | `no-console` (ESLint core; built into oxlint) |
| `as any` hiding a contract break | `@typescript-eslint/no-explicit-any` (already installed on mobile); `typescript/no-explicit-any` in oxlint |
| PascalCase file names | oxlint's `unicorn/filename-case` (add `"unicorn"` to `plugins` in `.oxlintrc.json`; RailPass's dashboard already passes it, only `RevenueCard.tsx` fails) |
| Query keys that miss inputs | `@tanstack/eslint-plugin-query` (`exhaustive-deps`), a new package to evaluate with the lesson 04 checklist |
| A commit message | already caught by the `commit-msg` hook |

Rules about meaning (re-booking a departed trip, revenue from one page, server state in Redux) still need people.

## Debrief questions

1. Which three comments matter most to passengers or staff? Which would you fix first?
2. Which comments would you **not** leave, because they cost more attention than they save?
3. Rewrite comment 2 for a brand-new teammate. What changes?
4. The PR says "works on my machine". What would you ask for instead of arguing with it?
5. Pick one row from "What tools could catch next time". Would you add it? What would it cost?
