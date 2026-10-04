# 12 · Auth & sessions on the client

**Notes:** `/courses/scalable-mobile-and-web-apps/auth-and-sessions` on the course website · **Time:** 20 min ·
**Workspace changes:** `lesson start 12` adds 7 mobile and 5 dashboard files (LIVE 12.1–12.3, 12.5–12.6)

## Goal

Finish client-side auth. Mobile remembers only when asked and signs out on authenticated 401s; the dashboard admits only staff and clears server caches on logout.

## What happens

1. **Concept (about 3 min):** token storage, 401 handling, role guards and password reset.
2. **Talk-through (about 4 min):** inspect mobile response interceptors, sign-in persistence, reset-password params and dashboard staff guard.
3. **Mobile LIVE tasks (about 6 min):** LIVE 12.1 authenticated 401 sign-out (📱), LIVE 12.2 Remember me (📱), LIVE 12.3 reset email param (📱).
4. **Dashboard LIVE tasks (about 4 min):** LIVE 12.5 reject passengers (🖥️), LIVE 12.6 clear cache on logout (🖥️).
5. **Checkpoint and compare (about 3 min):** reload session tests, passenger/staff role tests, then run diffs.

## LIVE tasks

| Task | App | File | What you write |
| --- | --- | --- | --- |
| LIVE 12.1 authenticated 401 sign-out | 📱 | `mobile/api/client.ts` | If `apiError.status` is unauthorized and the failed request carried `Authorization`, call `useSessionStore.getState().signOut()`. |
| LIVE 12.2 Remember me | 📱 | `mobile/app/(auth)/sign-in.tsx` | Replace `signIn(session)` with `signIn(session, remember)`. |
| LIVE 12.3 reset email param | 📱 | `mobile/app/(auth)/reset-password.tsx` | Import `useLocalSearchParams` and read `const { email = '' } = useLocalSearchParams<{ email?: string }>()`. |
| LIVE 12.5 reject passengers | 🖥️ | `dashboard/src/features/auth/require-staff.tsx` | Dispatch `setUser` only for `STAFF`; otherwise dispatch `logout()`, and render children only for staff users. |
| LIVE 12.6 clear query cache | 🖥️ | `dashboard/src/app/layouts/dashboard-layout.tsx` | Import the shared `queryClient` and call `queryClient.clear()` in the logout handler after `dispatch(logout())`. |

## Checkpoint

- 📱 Remembered mobile sign-in survives reload; unchecked sign-in does not. Forgot password passes the email to reset password, where the passenger enters the emailed code.
- 🖥️ Staff can sign in and refresh; passenger accounts are rejected; logout returns to Login and clears cached staff data.
- `yarn run check` passes.

## Common problems

- **A public 401 signs the user out:** check that the failed request had an `Authorization` header before calling `signOut()`.
- **Reset password treats the param as a code:** the route param is the email; the code comes from Mailpit or the API log.
- **Passenger sees dashboard pages:** render children only when `user?.role === 'STAFF'`.
- **Back button shows stale dashboard data after logout:** clear the shared `queryClient` on logout.

## Facilitator notes

- Test mobile Remember me with a reload, not by navigating away.
- Sign in to the dashboard with a passenger account once to prove role checks are client-visible and server-backed.
- Do not linger on backend auth internals; the course owns the clients.

**Next:** lesson 13 focuses on performance and rendering behaviour.
