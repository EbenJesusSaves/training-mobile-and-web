# Profile feature

## Purpose
Profile-specific rows and account presentation helpers live here.

## What belongs here
`settings-row.tsx` arrives in lesson 06 and is used by the final profile tab in lesson 12.

## What does not belong here
Theme/session stores stay in `store/`; generic list rows or buttons stay in `components/`.

## Allowed imports
Feature modules may import components, hooks, api, libs, constants and config. They must not import `app/`, `store/` or another feature; route files connect stores to features.

## Naming pattern
Kebab-case file, PascalCase export: `settings-row.tsx` → `SettingsRow`.

## Lesson that fills it
Lesson 06 provides the row; lesson 12 uses it in account screens.

## 💬 Discuss
- What makes a settings row profile-specific rather than generic?
