# Lesson 04 · Choosing libraries deliberately — 📱 Mobile

> You wrap SecureStore behind a RailPass-owned adapter and read the animation helper that keeps Lottie colour policy out of screens. Dependencies were already installed in lesson 01.

## What arrives

| File | Status | Why it's here |
| --- | --- | --- |
| `mobile/libs/secure-storage.ts` | RailPass, LIVE 04.1 | A Zustand `StateStorage` adapter around `expo-secure-store`, used by persisted stores in lesson 09. |
| `mobile/libs/lottie.ts` | RailPass | Centralises neutral-colour swapping for bundled Lottie JSON. Screens still import `LottieView` from `lottie-react-native` directly. |

## Talk through (together)

1. **`mobile/libs/secure-storage.ts`: adapter boundary.** Ask: why should stores import `secureStorage`, not `expo-secure-store`? Answer: storage policy, tests and future swaps stay in one file.
2. **`mobile/libs/lottie.ts`: what the helper does and does not do.** Ask: does this wrap the Lottie component? Answer: no. It copies animation JSON and swaps near-black/near-white colours; rendering stays with `LottieView`.
3. **Lesson 01 dependencies.** Ask: why not install now? Answer: `expo-secure-store` and `lottie-react-native` were pinned in `mobile/package.json` from lesson 01 so the room avoids mid-course installs.

## Live tasks

### LIVE 04.1 — Implement the SecureStore adapter (`mobile/libs/secure-storage.ts`)

**Why:** persisted stores need encrypted small-value storage without importing Expo APIs throughout the app.

1. Import `* as SecureStore` from `expo-secure-store`.
2. Keep the `StateStorage` type import from `zustand/middleware`.
3. Implement `getItem: (name) => SecureStore.getItemAsync(name)`.
4. Implement `setItem: (name, value) => SecureStore.setItemAsync(name, value)`.
5. Implement `removeItem: (name) => SecureStore.deleteItemAsync(name)`.
6. Do not add JSON parsing here; Zustand's `createJSONStorage` handles that later.

**Hint:** match the `StateStorage` interface exactly: get, set and remove string values.

**Done when:** `yarn --cwd mobile typecheck` passes. You will see the adapter used when session and preferences persist in lesson 09.

## Checkpoint

There is no visible device change yet. The checkpoint is a clean typecheck and a clear answer to: "Why SecureStore for tokens, and why behind our adapter?"

Commands: `lesson status 04` shows no open mobile tasks, and `yarn run check` passes from the workspace root.

## Removed / replaced in this lesson

Nothing.
