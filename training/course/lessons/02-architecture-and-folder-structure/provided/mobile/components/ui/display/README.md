# UI display

## Purpose
Reusable non-input presentation: avatars, status chips and journey timelines.

## What belongs here
`avatar.tsx`, `journey-timeline.tsx` and `status-chip.tsx` arrive in lesson 06; `status-chip.test.tsx` arrives in lesson 15.

## What does not belong here
Do not fetch data or read stores here. Pass ready-to-render values from screens/features.

## Allowed imports
Components may import constants, libs, config and API types. They do not import app routes, feature modules, hooks, stores or API clients. Exception: `components/theme/theme-provider.tsx` reads the preferences store.

## Naming pattern
Kebab-case by visual: `status-chip.tsx`, `journey-timeline.tsx`.

## Lesson that fills it
Lessons 06 and 15 fill it.

## 💬 Discuss
- Why does status text live with the chip instead of every screen?
