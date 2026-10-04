# 0004 · expo-secure-store (not MMKV) for the small data the app persists

- **Status:** accepted
- **Applies to:** 📱 mobile

## Context

The app persists three small things between launches: the session token and user (only with "Remember me"), the
preferences (theme, onboarding seen, a developer API URL) and the last searched route. The token is a credential.
Learners run the app in Expo Go, so a library that needs a custom native build would block them. The reference
guide we started from suggested MMKV.

## Options considered

| Option | For | Against |
| --- | --- | --- |
| MMKV (`react-native-mmkv`) | Very fast, synchronous, handles large data | Native module: needs a development build, not Expo Go; not encrypted by default |
| AsyncStorage | Works in Expo Go, simple | Plain text on disk: wrong place for a token |
| `expo-secure-store` | Works in Expo Go; values live in the iOS Keychain / Android Keystore | Async; meant for small values; slower than MMKV |

## Chosen

`expo-secure-store`, behind our own adapter `mobile/libs/secure-storage.ts` (a Zustand `StateStorage` with
`getItem`, `setItem` and `removeItem`). The stores in `mobile/store/` persist through it with `createJSONStorage`.

## Why

- The token is stored encrypted by the operating system, not in plain text.
- It runs in Expo Go, so every learner's setup works without a custom native build.
- Our data is tiny, so speed and size limits don't matter here.

## Trade-offs

- Reads are async, so the app waits for the stores to rehydrate before choosing a screen (`hasHydrated`).
- Not suitable for large or frequently written data (caches, offline lists).

## Choose differently when

- You need to persist large or hot data (an offline ticket archive, a query cache): MMKV or SQLite in a development
  build. Thanks to the adapter, the stores don't change: only `mobile/libs/secure-storage.ts` does.
