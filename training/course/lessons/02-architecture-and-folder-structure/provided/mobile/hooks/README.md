# Hooks

## Purpose
Reusable behavior that coordinates async work or form state without rendering UI.

## What belongs here
`use-api-query.ts` and `use-journey-search.ts` arrive lesson 10; `use-form.ts` and `use-async-action.ts` arrive lesson 11; `use-trip-updates.ts` arrives lesson 18.

## What does not belong here
Do not put JSX, route files or persistent client state here. Zustand stores live in `store/`.

## Allowed imports
Hooks may import api, libs and config. They should return data/actions to screens without rendering UI.

## Naming pattern
Hook files start with `use-`: `use-api-query.ts`, `use-form.ts`.

## Lesson that fills it
Lessons 10, 11 and 18 fill it.

## 💬 Discuss
- How is a hook different from a store in this app?
