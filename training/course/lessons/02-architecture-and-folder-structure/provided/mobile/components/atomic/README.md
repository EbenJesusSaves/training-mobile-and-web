# Atomic components

## Purpose
Smallest UI primitives such as app text and icons.

## What belongs here
`app-text.tsx` and `icon.tsx` arrive by lesson 05/06 and are used everywhere.

## What does not belong here
No product copy, navigation, API calls or stores. Use feature/components above this layer for composed UI.

## Allowed imports
Components may import constants, libs, config and API types. They do not import app routes, feature modules, hooks, stores or API clients. Exception: `components/theme/theme-provider.tsx` reads the preferences store.

## Naming pattern
Short noun files: `app-text.tsx`, `icon.tsx`; exports `AppText`, `Icon`.

## Lesson that fills it
Lessons 05–06 fill it.

## 💬 Discuss
- Why wrap text and icons instead of using raw primitives everywhere?
