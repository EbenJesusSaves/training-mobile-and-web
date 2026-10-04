# UI components

## Purpose
Reusable controls grouped by user-interface job: buttons, display, feedback, inputs and loaders.

## What belongs here
Lesson 06 fills most UI groups; lesson 10 adds `feedback/state-views.tsx`; lesson 15 tests status chip.

## What does not belong here
No route-specific orchestration, API calls or Zustand state. Feature-specific visuals stay under `features/*`.

## Allowed imports
Components may import constants, libs, config and API types. They do not import app routes, feature modules, hooks, stores or API clients. Exception: `components/theme/theme-provider.tsx` reads the preferences store.

## Naming pattern
Group by job, then kebab-case files: `buttons/button.tsx`, `display/status-chip.tsx`.

## Lesson that fills it
Lessons 06, 10 and 15 fill it.

## 💬 Discuss
- How do we decide between `components/ui` and `features/booking`?
