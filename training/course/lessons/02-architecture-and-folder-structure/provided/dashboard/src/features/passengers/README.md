# `src/features/passengers`

## Purpose

Passenger search and detail views.

## What belongs here

`types.ts` in 02, placeholders in 07, API and RailPass views in 10.

## Real RailPass files that arrive here

- Lesson 10: `src/features/passengers/api/passenger-keys.ts`
- Lesson 10: `src/features/passengers/api/passenger-queries.ts`
- Lesson 10: `src/features/passengers/api/passengers-api.ts`
- Lesson 07: `src/features/passengers/components/passenger-detail-view.tsx`
- Lesson 07: `src/features/passengers/components/passengers-view.tsx`
- Lesson 02: `src/features/passengers/types.ts`

## What does not belong here

Booking drawer behavior stays in bookings; auth user session stays in auth.

## Allowed imports

May import booking types through its DTOs, shared UI/lib and its own API hooks.

## Naming pattern

`x-api.ts`, `x-keys.ts`, `x-queries.ts`, `components/*-view.tsx`, `*-slice.ts`, `.module.css`, `.test.tsx` as appropriate.

## Lesson that fills it

This folder is introduced in lesson 02 and filled progressively in the lesson numbers named above.

## 💬 Discuss

- Which file in this folder should be public to another feature, and which should remain private?
- What import would make this folder harder to change safely?
- How does the naming pattern help a teammate find the right code quickly?
