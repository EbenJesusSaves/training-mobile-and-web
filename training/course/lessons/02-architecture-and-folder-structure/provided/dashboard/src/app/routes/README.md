# `src/app/routes`

## Purpose

Route modules that export `Component` for React Router lazy loading.

## What belongs here

Nine `*-route.tsx` files arrive in lesson 07 and connect URLs to feature views.

## Real RailPass files that arrive here

- Lesson 07: `src/app/routes/bookings-route.tsx`
- Lesson 07: `src/app/routes/extras-route.tsx`
- Lesson 07: `src/app/routes/journey-detail-route.tsx`
- Lesson 07: `src/app/routes/journeys-route.tsx`
- Lesson 07: `src/app/routes/login-route.tsx`
- Lesson 07: `src/app/routes/network-route.tsx`
- Lesson 07: `src/app/routes/overview-route.tsx`
- Lesson 07: `src/app/routes/passenger-detail-route.tsx`
- Lesson 07: `src/app/routes/passengers-route.tsx`

## What does not belong here

View markup and data fetching stay in `features/*/components`.

## Allowed imports

May import feature view components and `react-router`; keep route modules thin.

## Naming pattern

`router.tsx`, `providers.tsx`, `store.ts`, `hooks.ts`, `routes/*-route.tsx`, `layouts/*`.

## Lesson that fills it

This folder is introduced in lesson 02 and filled progressively in the lesson numbers named above.

## 💬 Discuss

- Which file in this folder should be public to another feature, and which should remain private?
- What import would make this folder harder to change safely?
- How does the naming pattern help a teammate find the right code quickly?
