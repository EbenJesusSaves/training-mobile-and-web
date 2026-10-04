# Theme components

## Purpose
Theme creation, provider and forced theme scopes live here.

## What belongs here
`tokens.ts` arrives lesson 05; `theme-provider.tsx` starts in lesson 05 and becomes final in lesson 09 when preferences persist.

## What does not belong here
Raw token values belong in `constants/`; feature components should consume `useTheme()` rather than owning palettes.

## Allowed imports
Components may import constants, libs, config and API types. They do not import app routes, feature modules, hooks, stores or API clients. Exception: `components/theme/theme-provider.tsx` reads the preferences store. Exception: `theme-provider.tsx` reads `store/preferences-store.ts` in the final app.

## Naming pattern
Theme files use clear nouns: `tokens.ts`, `theme-provider.tsx`; hooks use `useTheme`.

## Lesson that fills it
Lessons 05 and 09 fill it.

## 💬 Discuss
- Why is preferences-store the one allowed store import here?
