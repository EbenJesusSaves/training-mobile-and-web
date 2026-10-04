# Lesson 09 · State management — 📱 Mobile

> By the end, the app remembers who is signed in (only when they ask), the theme survives a reload, and the booking
> draft has a working seat toggle. The route guards from lesson 07 now read real stores.

## What arrives

| File | Status | Why it's here |
| --- | --- | --- |
| `mobile/store/session-store.ts` | RailPass, LIVE 09.3 | Token, user and the Remember-me flag, persisted through `libs/secure-storage.ts` only when remembered. |
| `mobile/store/preferences-store.ts` | RailPass | Theme mode, "onboarding seen" and the developer API URL. All three persist. |
| `mobile/store/booking-draft-store.ts` | RailPass, LIVE 09.1 | The booking being built: route, dates, sort, passengers, add-ons, and the journey, class and seats for each direction. Only the last searched route persists. |
| `mobile/components/theme/theme-provider.tsx` | RailPass (replaces the lesson 05 version) | Reads `themeMode`, so the choice on Profile beats the system setting. |
| `mobile/app/_layout.tsx` | RailPass (replaces the lesson 07 version) | Waits for fonts and both stores to hydrate; the guards read the stores instead of hard-coded flags. |
| `mobile/app/onboarding.tsx` | RailPass | Calls `completeOnboarding()`. The guard then swaps onboarding for the sign-in screens. |
| `mobile/app/(app)/sort.tsx` | RailPass | Reads `sort` with a selector and writes it with `getState().setSort(…)`. |
| `mobile/app/(auth)/sign-in.tsx` | course version, LIVE 09.2 → API sign-in in 10 | Signs in a made-up session, with or without Remember me. |
| `mobile/app/(app)/(tabs)/profile.tsx` | course version → RailPass in 12 | Who is signed in, the theme switch and Sign out. |

## Talk through (together)

1. **`mobile/store/booking-draft-store.ts`: why a client store?** Ask: why isn't the draft fetched from the API?
   Answer: the server hasn't seen it yet. It's the passenger's intent until checkout sends it in lesson 11, so it's
   client state. Server data (journeys, seats) never gets copied in here.
2. **`mobile/store/session-store.ts`: who decides what reaches the disk?** Ask: where does the token end up, and which
   line decides? Answer: SecureStore, through the `secureStorage` adapter from lesson 04. `partialize` decides what is
   written (LIVE 09.3), so no screen ever touches storage.
3. **`mobile/app/_layout.tsx`: the hydration gate.** Ask: why `return null` until `hasHydrated` is true? Answer: the
   stores start signed out. Without the gate the guards would flash the sign-in screen before the remembered session
   loads.
4. **`mobile/app/(app)/sort.tsx`: reading vs writing.** Ask: why a selector hook to read `sort`, but
   `useBookingDraftStore.getState().setSort(next)` in the handler? Answer: the selector re-renders the sheet only when
   `sort` changes; an event handler needs the latest action, not a subscription.

## Live tasks

### LIVE 09.1 — Toggle a seat within the passenger count (`mobile/store/booking-draft-store.ts`)

**Why:** the seat map (lesson 10) and checkout trust this rule: a passenger can never hold more seats than travellers.

1. Find `toggleSeat`. Rename the parameters to `direction` and `seat`, and give `set` an updater: `set((state) => { … })`.
2. Read the segment: `const current = state[segmentKey(direction)];` and `return {}` when there isn't one yet.
3. Use the `sameSeat` helper to work out `isSelected`. A selected seat is removed:
   `current.seats.filter((item) => !sameSeat(item, seat))`.
4. If `current.seats.length >= state.passengerCount`, drop the earliest pick and add the new one:
   `[...current.seats.slice(1), seat]`.
5. Otherwise append: `[...current.seats, seat]`.
6. Return `{ [segmentKey(direction)]: { ...current, seats } }`.

**Hint:** `setTravelClass`, just above, has the same shape: read `current`, return a partial update keyed by
`segmentKey(direction)`.

**Done when:** `yarn --cwd mobile typecheck` passes and you can say what a third tap does with two passengers (the first
seat moves). You'll see it on the seat map in lesson 10, and lesson 15 pins it with a store test.

### LIVE 09.2 — Sign in through the store (`mobile/app/(auth)/sign-in.tsx`)

**Why:** a screen never navigates after sign-in. It updates the session store, and the guards in `app/_layout.tsx`
decide which routes exist.

1. Replace the placeholder with
   `const signIn = (remember: boolean) => useSessionStore.getState().signIn(PROTOTYPE_SESSION, remember);`
2. Don't add `router.replace(…)`. Tap **Sign in and remember me** and watch the tabs appear.

**Hint:** `signIn(session, remember = true)` takes the `Session` shape the API returns (`accessToken` and `user`), which
is why `PROTOTYPE_SESSION` is typed as `Session`.

**Done when:** both buttons take you to the tabs, and **Sign out** on Profile brings the sign-in screen back.

### LIVE 09.3 — Persist only remembered sessions (`mobile/store/session-store.ts`)

**Why:** Remember me is a promise to the passenger. The persistence boundary keeps it, not each screen.

1. In the `persist` options, replace `partialize: () => ({})`.
2. Destructure `{ token, user, remember }` and return all three when `remember` is true.
3. Otherwise return `{ token: null, user: null, remember }`.
4. Leave `onRehydrateStorage` alone: it sets `hasHydrated`, which the root layout waits for.

**Hint:** never persist `hasHydrated` itself, or the next launch would skip the gate.

**Done when:** the reload test in the checkpoint passes.

## Checkpoint

On a fresh install you see onboarding once, then sign-in. Then try this reload test (press `r` in the Metro terminal):

1. **Sign in and remember me** → reload → still signed in.
2. Profile → **Sign out** → sign-in screen.
3. **Sign in for this session only** → reload → back at sign-in.
4. Profile → theme **Dark** → reload → still dark.

Commands: `lesson status 09` shows no open mobile tasks, and `yarn run check` passes from the workspace root.

## Removed / replaced in this lesson

`lesson start 09` overwrites the lesson 07 prototypes of `app/_layout.tsx`, `app/onboarding.tsx`, `app/(app)/sort.tsx`,
`app/(auth)/sign-in.tsx` and `app/(app)/(tabs)/profile.tsx`, and the lesson 05 `theme-provider.tsx`. Nothing is deleted.
