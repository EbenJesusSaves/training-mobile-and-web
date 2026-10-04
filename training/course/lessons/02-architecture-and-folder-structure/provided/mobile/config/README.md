# Config

## Purpose
Runtime configuration and environment-derived defaults live here.

## What belongs here
`app-config.ts` arrives lesson 01 and is used by API client, date strip, stores and developer settings.

## What does not belong here
Design tokens belong in `constants/`; screen state belongs in `store/` or route files.

## Allowed imports
Config may read environment/runtime metadata. Other layers can import config, but config should not import UI or features.

## Naming pattern
Use `*-config.ts` or a clear app-level name such as `app-config.ts`.

## Lesson that fills it
Lesson 01 fills it and later lessons consume it.

## 💬 Discuss
- Why is API URL fallback centralized here?
