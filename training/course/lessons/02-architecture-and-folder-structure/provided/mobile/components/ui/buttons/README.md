# UI buttons

## Purpose
Shared pressable controls with accessible labels, loading/disabled states and token-backed styling.

## What belongs here
`button.tsx` and `icon-button.tsx` arrive in lesson 06; accessibility is revisited in lesson 14.

## What does not belong here
Do not create one-off route buttons here; pass props to the shared button or keep feature-specific composition in a feature folder.

## Allowed imports
Components may import constants, libs, config and API types. They do not import app routes, feature modules, hooks, stores or API clients. Exception: `components/theme/theme-provider.tsx` reads the preferences store.

## Naming pattern
Button files are noun-based: `button.tsx`, `icon-button.tsx`; exports are `Button`, `IconButton`.

## Lesson that fills it
Lessons 06 and 14 fill/review it.

## 💬 Discuss
- Why must an icon-only button require a label?
