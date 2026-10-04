# `src/app`

## Purpose

Application shell, providers, router, typed Redux hooks and store wiring.

## What belongs here

`providers.tsx` arrives in lessons 05, 07, 09 and 10 as capabilities grow; `router.tsx` arrives in 07 and becomes guarded in 12; `store.ts` arrives in 09 and gains API accessors in 10.

## Real RailPass files that arrive here

- Lesson 05: `src/app/course-playground.tsx`
- Lesson 09: `src/app/hooks.ts`
- Lesson 07: `src/app/layouts/dashboard-layout.module.css`
- Lesson 07: `src/app/layouts/dashboard-layout.tsx`
- Lesson 05: `src/app/providers.tsx`
- Lesson 10: `src/app/query-client.ts`
- Lesson 07: `src/app/router.tsx`
- Lesson 07: `src/app/routes/bookings-route.tsx`
- Lesson 07: `src/app/routes/extras-route.tsx`
- Lesson 07: `src/app/routes/journey-detail-route.tsx`
- Lesson 07: `src/app/routes/journeys-route.tsx`
- Lesson 07: `src/app/routes/login-route.tsx`
- Lesson 07: `src/app/routes/network-route.tsx`
- Lesson 07: `src/app/routes/overview-route.tsx`
- Lesson 07: `src/app/routes/passenger-detail-route.tsx`
- Lesson 07: `src/app/routes/passengers-route.tsx`
- Lesson 09: `src/app/store.ts`

## What does not belong here

Feature views, HTTP endpoints and reusable UI belong in `features/` or `shared/`.

## Allowed imports

May import `features/*` public pieces, `shared/*`, and local `app/*`; features should not import layouts.

## Naming pattern

`router.tsx`, `providers.tsx`, `store.ts`, `hooks.ts`, `routes/*-route.tsx`, `layouts/*`.

## Lesson that fills it

This folder is introduced in lesson 02 and filled progressively in the lesson numbers named above.

## 💬 Discuss

- Which file in this folder should be public to another feature, and which should remain private?
- What import would make this folder harder to change safely?
- How does the naming pattern help a teammate find the right code quickly?
