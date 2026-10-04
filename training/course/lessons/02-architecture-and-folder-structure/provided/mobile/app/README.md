# App routes

## Purpose
Expo Router route files live here. Screens compose navigation, stores, hooks and feature UI into user flows.

## What belongs here
Real route files arrive in lesson 07 as prototypes, then become final across lessons 09–18: `(app)/(tabs)/index.tsx`, `journeys/[id].tsx`, `checkout.tsx`, `tickets/[id].tsx`, `stations/[id].tsx`, `updates.tsx`, and auth routes.

## What does not belong here
Reusable UI does not belong here; move it to `components/` or `features/*`. Pure helpers go to `libs/`; API calls go to `api/`; persistent state goes to `store/`.

## Allowed imports
May import components, features, hooks, api, store, libs, constants and config. Nothing imports `app/`; route files are the composition root.

## Naming pattern
Route files match URL segments: `_layout.tsx`, `index.tsx`, `[id].tsx`, and group folders such as `(app)` or `(auth)`.

## Lesson that fills it
Lesson 07 creates the clickable route map; lessons 09–18 replace prototypes with final RailPass screens.

## 💬 Discuss
- Which imports prove a route file is a composition root?
- When should code move out of a route file into a feature component or hook?
