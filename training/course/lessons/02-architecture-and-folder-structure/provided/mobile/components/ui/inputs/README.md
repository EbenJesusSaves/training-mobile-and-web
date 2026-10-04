# UI inputs

## Purpose
Reusable form controls and compact input widgets.

## What belongs here
`segmented-tabs.tsx`, `stepper.tsx` and `text-field.tsx` arrive in lesson 06; forms use them in lessons 11–12.

## What does not belong here
Validation rules belong in screens/hooks; product-specific pickers belong in features.

## Allowed imports
Components may import constants, libs, config and API types. They do not import app routes, feature modules, hooks, stores or API clients. Exception: `components/theme/theme-provider.tsx` reads the preferences store.

## Naming pattern
Input noun files: `text-field.tsx`, `segmented-tabs.tsx`, `stepper.tsx`.

## Lesson that fills it
Lessons 06, 11 and 12 fill it.

## 💬 Discuss
- Why should validation not be baked into a generic text field?
