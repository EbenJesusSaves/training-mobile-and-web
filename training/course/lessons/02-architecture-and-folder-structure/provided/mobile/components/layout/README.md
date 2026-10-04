# Layout components

## Purpose
Reusable screen chrome: safe-area screens, headers and tab bars.

## What belongs here
`screen.tsx` arrives lesson 05/06; `header-bar.tsx` arrives lesson 06; `app-tab-bar.tsx` arrives lesson 07.

## What does not belong here
No feature data fetching or business decisions; route stacks stay in `app/`.

## Allowed imports
Components may import constants, libs, config and API types. They do not import app routes, feature modules, hooks, stores or API clients. Exception: `components/theme/theme-provider.tsx` reads the preferences store.

## Naming pattern
Layout noun files: `screen.tsx`, `header-bar.tsx`, `app-tab-bar.tsx`.

## Lesson that fills it
Lessons 05–07 fill it.

## 💬 Discuss
- Why is the tab bar layout but the tab routes are in `app/`?
