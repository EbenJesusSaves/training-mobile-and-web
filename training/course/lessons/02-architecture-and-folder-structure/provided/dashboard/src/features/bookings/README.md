# `src/features/bookings`

## Purpose

Booking search, status badges and detail drawer.

## What belongs here

`types.ts` in 02, badge in 06, placeholder view in 07, API/drawer/RailPass view in 10, regression/test overlays in 13 and 15.

## Real RailPass files that arrive here

- Lesson 10: `src/features/bookings/api/booking-keys.ts`
- Lesson 10: `src/features/bookings/api/booking-queries.ts`
- Lesson 10: `src/features/bookings/api/bookings-api.ts`
- Lesson 10: `src/features/bookings/components/booking-detail-drawer.module.css`
- Lesson 10: `src/features/bookings/components/booking-detail-drawer.tsx`
- Lesson 15: `src/features/bookings/components/booking-status-badge.test.tsx`
- Lesson 06: `src/features/bookings/components/booking-status-badge.tsx`
- Lesson 10: `src/features/bookings/components/bookings-view.module.css`
- Lesson 07: `src/features/bookings/components/bookings-view.tsx`
- Lesson 02: `src/features/bookings/types.ts`

## What does not belong here

Journey API logic stays in journeys; reusable table shell stays in `shared/ui`.

## Allowed imports

May import journey/network public labels or types, shared UI/lib/hooks and preference actions.

## Naming pattern

`x-api.ts`, `x-keys.ts`, `x-queries.ts`, `components/*-view.tsx`, `*-slice.ts`, `.module.css`, `.test.tsx` as appropriate.

## Lesson that fills it

This folder is introduced in lesson 02 and filled progressively in the lesson numbers named above.

## 💬 Discuss

- Which file in this folder should be public to another feature, and which should remain private?
- What import would make this folder harder to change safely?
- How does the naming pattern help a teammate find the right code quickly?
