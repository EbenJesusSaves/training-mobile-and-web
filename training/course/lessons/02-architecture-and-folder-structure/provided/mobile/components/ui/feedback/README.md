# UI feedback

## Purpose
Shared loading, empty, error and alert components.

## What belongs here
`inline-alert.tsx` arrives lesson 06; `state-views.tsx` arrives lesson 10 when API screens need it.

## What does not belong here
Do not normalize API errors here; that belongs in `api/errors.ts`. Do not decide screen-specific recovery flows here.

## Allowed imports
Components may import constants, libs, config and API types. They do not import app routes, feature modules, hooks, stores or API clients. Exception: `components/theme/theme-provider.tsx` reads the preferences store.

## Naming pattern
Feedback noun files: `inline-alert.tsx`, `state-views.tsx`.

## Lesson that fills it
Lessons 06 and 10 fill it.

## 💬 Discuss
- What belongs in a shared ErrorState versus a screen-specific message?
