# Components

## Purpose
Reusable UI that is not owned by a single product feature lives here. Components are easy for many teams to reuse safely.

## What belongs here
Lesson 05 provides theme primitives; lesson 06 fills `atomic`, `layout` and `ui`; lesson 10 adds feedback state views; lesson 15 tests status chip behavior.

## What does not belong here
Do not put route logic, API calls or feature-specific business rules here. If a component needs booking words or ticket data, consider `features/*` instead.

## Allowed imports
Components may import constants, libs, config and API types. They do not import app routes, feature modules, hooks, stores or API clients. Exception: `components/theme/theme-provider.tsx` reads the preferences store.

## Naming pattern
Kebab-case file names, PascalCase component exports. Group by job: `atomic`, `layout`, `theme`, `ui/buttons`, `ui/display`, `ui/feedback`, `ui/inputs`, `ui/loaders`.

## Lesson that fills it
Lessons 05, 06, 10 and 15 fill it.

## 💬 Discuss
- What makes a component reusable enough for this folder?
- Which dependency would make a component too high-level?
