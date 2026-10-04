# Lesson 12 · Auth & sessions on the client — 🖥️ Dashboard

## Goal
The dashboard becomes staff-only: login restores the session, passengers are rejected, and logout clears client/server state.

## What arrives
| Path | Status | Why |
|---|---|---|
| `src/features/auth/api/auth-keys.ts`, `auth-queries.ts` | RailPass | Session query keys and login/current-staff hooks. |
| `src/features/auth/require-staff.tsx` | RailPass with LIVE gap | Route guard; LIVE 12.5 blocks passenger accounts. |
| `src/app/router.tsx` | RailPass | Wraps dashboard routes with `RequireStaff`. |
| `src/app/layouts/dashboard-layout.tsx` | RailPass with LIVE gap | Final user menu/logout behavior; LIVE 12.6 clears Query cache. |

## Talk through
- **`require-staff.tsx` — role check.** Ask: why check role on the client if the API also checks? Answer: fast UX and defense in depth.
- **`auth-queries.ts` — current staff query.** Ask: why fetch current staff after token restore? Answer: token presence alone does not prove an active staff session.
- **`dashboard-layout.tsx` — logout.** Ask: why clear query cache? Answer: staff-specific server data should not survive logout.

## LIVE 12.5 — reject passengers
Why: authenticated is not the same as authorized.
1. In `require-staff.tsx`, inspect the loaded user role.
2. If the role is not `STAFF`, dispatch `logout()`.
3. Navigate to `/login`.
4. Keep loading and unauthenticated branches intact.
Hint: the guard should allow only staff users to render children.
Done when: a passenger session returns to login instead of seeing dashboard pages.

## LIVE 12.6 — clear cache on logout
Why: cached staff data must leave with the session.
1. In `dashboard-layout.tsx`, import the shared `queryClient` from `'../query-client'`, the same instance `providers.tsx` passes to `QueryClientProvider`.
2. In the logout handler, dispatch `logout()`.
3. Call `queryClient.clear()`.
4. Navigate to `/login`.
Hint: clear Query after changing auth state.
Done when: logout lands on login and back navigation does not show stale staff data.

## Checkpoint
The browser starts at Login when unauthenticated; staff can sign in, see the routed dashboard, refresh with session restore, and log out without stale cached pages. Commands: `lesson status 12`, `yarn --cwd dashboard typecheck`, `yarn --cwd dashboard lint`, `yarn --cwd dashboard test`.
