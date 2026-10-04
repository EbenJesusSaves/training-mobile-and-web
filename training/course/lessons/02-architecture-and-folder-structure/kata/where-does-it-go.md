# Kata · Where does it go?

Twelve pieces of code from RailPass. For each one, decide **which folder it belongs in**, in the app named, and
which layer that is. Then check your answer against `ARCHITECTURE.md` and the real file.

Work in pairs: one person argues for a folder, the other argues against it. Disagreement is the point.

| # | App | The code | Your answer |
| --- | --- | --- | --- |
| 1 | 📱 | Turns `12000` pesewas into `GH₵ 120.00` | |
| 2 | 📱 | The screen at `/journeys/123` | |
| 3 | 📱 | The train-car seat map drawn with Skia, used only while booking | |
| 4 | 📱 | The pill that shows `CONFIRMED`, `DELAYED` or `CANCELLED` on tickets *and* journeys | |
| 5 | 📱 | Remembers the signed-in user and their token between launches | |
| 6 | 📱 | `searchJourneys(params, signal)`: the HTTP call behind journey search | |
| 7 | 📱 | Reads `EXPO_PUBLIC_API_URL` and decides which API address to use | |
| 8 | 🖥️ | The page module the router loads for `/passengers` | |
| 9 | 🖥️ | The table of passengers with search and paging | |
| 10 | 🖥️ | `bookingKeys.detail(id)`, the cache key for one booking | |
| 11 | 🖥️ | A hook that waits until you stop typing (350 ms) before a table searches | |
| 12 | 🖥️ | Sends anyone who isn't signed-in staff back to the login page | |

<details>
<summary>Answers</summary>

| # | Folder | File in RailPass | Why |
| --- | --- | --- | --- |
| 1 | `libs/` (logic) | `mobile/libs/format.ts` | A pure function used all over the app. No React, no product screen. The dashboard has its own: `dashboard/src/shared/lib/format.ts`. |
| 2 | `app/` (routes) | `mobile/app/(app)/journeys/[id].tsx` | With Expo Router the file path *is* the URL. `[id]` is the dynamic segment, and `(app)` is a group that doesn't appear in the URL. |
| 3 | `features/booking/` | `mobile/features/booking/seat-map.tsx` | It belongs to one product area. If a second feature needed it unchanged, it could move to `components/`. |
| 4 | `components/ui/display/` (shared UI) | `mobile/components/ui/display/status-chip.tsx` | Two features use it, and it only needs a status value: shared UI. |
| 5 | `store/` (client state) | `mobile/store/session-store.ts` | Client state that outlives a screen. It persists through `libs/secure-storage.ts`. |
| 6 | `api/` (data access) | `mobile/api/travel-api.ts` | One module per API resource. Screens never build URLs themselves. |
| 7 | `config/` | `mobile/config/app-config.ts` | Environment and tunable values in one place. `api/client.ts` reads it. |
| 8 | `app/routes/` | `dashboard/src/app/routes/passengers-route.tsx` | Route modules are thin: they export `Component` and render the feature's view. |
| 9 | `features/passengers/components/` | `dashboard/src/features/passengers/components/passengers-view.tsx` | A feature view. The generic table it renders lives in `dashboard/src/shared/ui/data-table.tsx`. |
| 10 | `features/bookings/api/` | `dashboard/src/features/bookings/api/booking-keys.ts` | Each feature owns its query keys. Other features import them to invalidate bookings after a change. |
| 11 | `shared/hooks/` | `dashboard/src/shared/hooks/use-debounced-value.ts` | Generic and product-free: the journeys, bookings and passengers views all use it. The 350 ms lives in `dashboard/src/shared/constants/query.ts`, not in the hook. |
| 12 | `features/auth/` | `dashboard/src/features/auth/require-staff.tsx` | It's auth logic, owned by the auth feature. `dashboard/src/app/router.tsx` wraps the staff pages with it. |

</details>

## Stretch

Pick a file from your own work project that has no obvious home. Where would it go in RailPass, and which rule
would you add to `ARCHITECTURE.md` so the next person doesn't have to ask?
