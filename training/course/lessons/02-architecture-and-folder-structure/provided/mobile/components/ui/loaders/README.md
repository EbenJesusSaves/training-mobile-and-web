# UI loaders

## Purpose
Shared pending-state visuals.

## What belongs here
`skeleton.tsx` arrives in lesson 06 and is used by API-backed screens from lesson 10.

## What does not belong here
Do not fetch data or know endpoint names here.

## Allowed imports
Components may import constants, libs, config and API types. They do not import app routes, feature modules, hooks, stores or API clients. Exception: `components/theme/theme-provider.tsx` reads the preferences store.

## Naming pattern
Loader noun files: `skeleton.tsx`.

## Lesson that fills it
Lessons 06 and 10 fill it.

## 💬 Discuss
- When is a skeleton better than a spinner?
