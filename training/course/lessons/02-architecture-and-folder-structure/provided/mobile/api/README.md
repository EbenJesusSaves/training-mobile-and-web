# API

## Purpose
Typed endpoint modules, the HTTP client and error normalization live here.

## What belongs here
`types.ts` arrives lesson 02; `client.ts`, `errors.ts`, `travel-api.ts`, `bookings-api.ts` and `auth-api.ts` arrive lesson 10 and are refined in lesson 12.

## What does not belong here
Do not render UI or hold React state here. Screen-specific loading belongs in hooks/screens.

## Allowed imports
API modules import config, types and the HTTP client. `api/client.ts` may read `config/app-config.ts` plus session/preferences stores for auth and API override policy.

## Naming pattern
Endpoint files use `*-api.ts`; shared transport is `client.ts`; normalized errors live in `errors.ts`.

## Lesson that fills it
Lessons 02, 10 and 12 fill it.

## 💬 Discuss
- Why is `api/client.ts` allowed to read stores when other API modules are not?
