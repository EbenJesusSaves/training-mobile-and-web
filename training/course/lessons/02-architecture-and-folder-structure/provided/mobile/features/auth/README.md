# Auth feature

## Purpose
Auth-only shells, widgets and illustrations live here so sign-in/up/reset screens share structure without duplicating visuals.

## What belongs here
`auth-shell.tsx`, `auth-widgets.tsx` and `travel-scene.tsx` arrive in lesson 06 and are used by final auth routes in lessons 11–12.

## What does not belong here
Form state belongs in `hooks/use-form.ts`; session persistence belongs in `store/session-store.ts`; route decisions belong in `app/_layout.tsx`.

## Allowed imports
Feature modules may import components, hooks, api, libs, constants and config. They must not import `app/`, `store/` or another feature; route files connect stores to features.

## Naming pattern
Kebab-case files with PascalCase component exports: `AuthShell`, `TravelScene`.

## Lesson that fills it
Lesson 06 provides visuals; lessons 11–12 connect real auth flows.

## 💬 Discuss
- Which auth UI is reusable between sign-in and sign-up?
- What would make this feature too coupled to navigation?
