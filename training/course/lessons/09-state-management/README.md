# 09 · State management

**Notes:** `/courses/scalable-mobile-and-web-apps/state-management` on the course website · **Time:** 25 min ·
**Workspace changes:** `lesson start 09` adds 9 mobile and 6 dashboard files (LIVE 09.1–09.3, 09.5, 09.7)

## Goal

Put each state type in the smallest useful place. Mobile uses Zustand stores for session, preferences and booking draft; the dashboard uses Redux Toolkit for auth and preferences.

## What happens

1. **Concept (about 4 min):** classify local, URL, form, client and server state.
2. **Talk-through (about 5 min):** inspect mobile stores, hydration gates, dashboard slices and persistence boundaries.
3. **Mobile LIVE tasks (about 8 min):** LIVE 09.1 `toggleSeat` (📱), LIVE 09.2 prototype sign-in (📱), LIVE 09.3 remembered-session persistence (📱).
4. **Dashboard LIVE tasks (about 5 min):** LIVE 09.5 color-scheme reducer (🖥️), LIVE 09.7 preferences persistence (🖥️).
5. **Checkpoint and compare (about 3 min):** reload tests, theme tests and `lesson diff mobile` / `lesson diff dashboard`.

## LIVE tasks

| Task | App | File | What you write |
| --- | --- | --- | --- |
| LIVE 09.1 `toggleSeat` | 📱 | `mobile/store/booking-draft-store.ts` | Update the selected segment, remove a tapped selected seat, append a new seat, or drop the earliest pick when passenger count is full. |
| LIVE 09.2 prototype sign-in | 📱 | `mobile/app/(auth)/sign-in.tsx` | Call `useSessionStore.getState().signIn(PROTOTYPE_SESSION, remember)`. |
| LIVE 09.3 remembered persistence | 📱 | `mobile/store/session-store.ts` | `partialize` persists `{ token, user, remember }` only when `remember` is true; otherwise persist null token/user and the flag. |
| LIVE 09.5 color scheme | 🖥️ | `dashboard/src/features/preferences/preferences-slice.ts` | Use the Immer draft: `state.colorScheme = action.payload`. |
| LIVE 09.7 preferences persistence | 🖥️ | `dashboard/src/app/store.ts` | Subscribe to the store and write only `{ preferences }` to `localStorage`. |

## Checkpoint

- 📱 Onboarding appears once; sign-in buttons open tabs; remembered sign-in survives reload; session-only sign-in does not; theme survives reload.
- 🖥️ Dashboard theme and table density persist, but auth state is not written by the preferences subscriber.
- `yarn run check` passes.

## Common problems

- **Seat toggle seems invisible:** the seat map that shows LIVE 09.1 arrives in lesson 10; use typecheck now.
- **Reload flashes sign-in:** the root layout waits for store hydration; do not persist `hasHydrated` itself.
- **Lesson 10 starts with 401s:** if you chose Remember me here, the made-up `prototype-token` remains. Sign out on Profile before lesson 10 API sign-in.
- **Dashboard persists too much:** write only `preferences`, not the whole Redux state.

## Facilitator notes

- Keep repeating: server data does not belong in a client store.
- Demo both sign-in buttons and the reload difference.
- Mention the prototype token cleanup before moving to lesson 10.

**Next:** lesson 10 connects both apps to the API and server-state caches.
