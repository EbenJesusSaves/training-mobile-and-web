# Lesson 12 · Auth & sessions on the client — 📱 Mobile

> By the end, RailPass Mobile has the final passenger session flow: Remember me controls persistence, expired tokens sign out, and account/password screens are real.

## What arrives

| File | Status | Why it's here |
| --- | --- | --- |
| `mobile/api/client.ts` | RailPass, LIVE 12.1 | Final response interceptor: a 401 from an authenticated request signs the passenger out. |
| `mobile/app/(auth)/sign-in.tsx` | RailPass, LIVE 12.2 | Final sign-in form where Remember me reaches the session store. |
| `mobile/app/(auth)/reset-password.tsx` | RailPass, LIVE 12.3 | Reset form that receives the email passed by forgot password. |
| `mobile/app/(app)/(tabs)/profile.tsx` | RailPass | Final profile screen with account links and sign-out. |
| `mobile/app/(app)/edit-profile.tsx`, `mobile/app/(app)/change-password.tsx` | RailPass | Passenger account-management forms. |
| `mobile/app/(auth)/forgot-password.tsx` | RailPass | Requests the reset email and navigates to reset password with the email param. |

## Talk through (together)

1. **`mobile/api/client.ts`: 401 boundary.** Ask: why check whether the request carried `Authorization`? Answer: only authenticated requests should force sign-out; public failures should stay local to the screen.
2. **`mobile/store/session-store.ts`: persistence is already there.** Ask: what changes in this lesson? Answer: the final sign-in screen now passes the checkbox value into the existing store API.
3. **`mobile/app/(auth)/forgot-password.tsx`: email handoff.** Ask: why pass the email to reset password? Answer: the reset form needs the account email plus the code from the email.
4. **`mobile/app/(app)/(tabs)/profile.tsx`: session controls.** Ask: why is sign-out just a store action? Answer: the protected root layout reacts and swaps the route group.

## Live tasks

### LIVE 12.1 — Sign out on authenticated 401 (`mobile/api/client.ts`)

**Why:** when a token expires or is revoked, the app should clear the session and let the root layout show sign-in.

1. In the response error handler, keep `const apiError = toApiError(error);`.
2. Add a check for `apiError.status === HTTP_STATUS.unauthorized`.
3. Also require `error.config?.headers?.Authorization` so only requests that sent a token trigger sign-out.
4. Inside the branch, call `useSessionStore.getState().signOut();`.
5. Keep `return Promise.reject(apiError);`.

**Hint:** `HTTP_STATUS.unauthorized` is already imported in this file.

**Done when:** an expired passenger token returns the app to sign-in instead of leaving protected screens mounted.

### LIVE 12.2 — Pass Remember me to the store (`mobile/app/(auth)/sign-in.tsx`)

**Why:** the checkbox should control whether the token survives reloads.

1. Find the successful `authApi.signIn` path.
2. Keep the passenger-role guard.
3. Replace `useSessionStore.getState().signIn(session);` with `useSessionStore.getState().signIn(session, remember);`.
4. Do not navigate manually. The root layout reacts to the store.

**Hint:** lesson 09 already taught `signIn(session, remember = true)`.

**Done when:** **Remember me** survives reload, and an unchecked sign-in returns to sign-in after reload.

### LIVE 12.3 — Read the reset email param (`mobile/app/(auth)/reset-password.tsx`)

**Why:** forgot password passes the account email to reset password. The route param is the email, not a reset code.

1. Change the import to `import { router, useLocalSearchParams } from 'expo-router';`.
2. Inside `ResetPasswordScreen`, add `const { email = '' } = useLocalSearchParams<{ email?: string }>();`.
3. Remove the placeholder `const email = '';`.
4. Leave the code field validation alone; the passenger types the 6-digit code from email.

**Hint:** `forgot-password.tsx` calls `router.push({ pathname: '/reset-password', params: { email } })`.

**Done when:** submitting forgot password opens reset password with the email already available to the reset request.

## Checkpoint

Sign out, then sign in twice: once with **Remember me** on and once off. Reload after each sign-in to confirm persistence follows the checkbox. Use Profile to open Edit profile and Change password. Use Forgot password: the reset screen should receive the email, while the passenger still types the reset code from Mailpit or the API log.

Commands: `lesson status 12` shows no open mobile tasks, and `yarn run check` passes from the workspace root.

## Removed / replaced in this lesson

`lesson start 12` overwrites the lesson 10 API client course version, the lesson 11 sign-in course version, the lesson 09 profile course version, and the lesson 07 account/password prototypes. Nothing is deleted.
