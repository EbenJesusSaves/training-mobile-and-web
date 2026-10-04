# `src/features`

## Purpose

Product capability folders owned by a domain team.

## What belongs here

Auth, bookings, journeys, network, overview, passengers and preferences fill from lessons 02, 06, 07, 09, 10, 11, 12, 15, 17 and 18.

## Real RailPass files that arrive here

- Lesson 10: `src/features/auth/api/auth-api.ts`
- Lesson 12: `src/features/auth/api/auth-keys.ts`
- Lesson 12: `src/features/auth/api/auth-queries.ts`
- Lesson 15: `src/features/auth/auth-slice.test.ts`
- Lesson 09: `src/features/auth/auth-slice.ts`
- Lesson 10: `src/features/auth/components/login-view.module.css`
- Lesson 07: `src/features/auth/components/login-view.tsx`
- Lesson 12: `src/features/auth/require-staff.tsx`
- Lesson 02: `src/features/auth/types.ts`
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
- Lesson 10: `src/features/journeys/api/journey-keys.ts`
- Lesson 10: `src/features/journeys/api/journey-queries.ts`
- Lesson 10: `src/features/journeys/api/journeys-api.ts`
- Lesson 10: `src/features/journeys/components/journey-detail-view.module.css`
- Lesson 07: `src/features/journeys/components/journey-detail-view.tsx`
- Lesson 11: `src/features/journeys/components/journey-form.module.css`
- Lesson 11: `src/features/journeys/components/journey-form.tsx`
- Lesson 06: `src/features/journeys/components/journey-status-badge.tsx`
- Lesson 10: `src/features/journeys/components/journeys-view.module.css`
- Lesson 07: `src/features/journeys/components/journeys-view.tsx`
- Lesson 08: `src/features/journeys/components/seat-occupancy-map.module.css`
- Lesson 08: `src/features/journeys/components/seat-occupancy-map.tsx`
- Lesson 06: `src/features/journeys/components/train-label.tsx`
- Lesson 02: `src/features/journeys/types.ts`
- Lesson 08: `src/features/journeys/utils.test.ts`
- Lesson 08: `src/features/journeys/utils.ts`
- Lesson 10: `src/features/network/api/network-api.ts`
- Lesson 10: `src/features/network/api/network-keys.ts`
- Lesson 10: `src/features/network/api/network-queries.ts`
- Lesson 07: `src/features/network/components/extras-view.tsx`
- Lesson 06: `src/features/network/components/route-label.tsx`
- ...and 20 more files in later lessons.

## What does not belong here

Cross-cutting primitives belong in `shared/`; application wiring belongs in `app/`.

## Allowed imports

Features may import `shared/`, `app/hooks.ts`, and other features public pieces: types, query keys/hooks, slice actions, badges and labels; never another feature's `*-view`.

## Naming pattern

`x-api.ts`, `x-keys.ts`, `x-queries.ts`, `components/*-view.tsx`, `*-slice.ts`, `.module.css`, `.test.tsx` as appropriate.

## Lesson that fills it

This folder is introduced in lesson 02 and filled progressively in the lesson numbers named above.

## 💬 Discuss

- Which file in this folder should be public to another feature, and which should remain private?
- What import would make this folder harder to change safely?
- How does the naming pattern help a teammate find the right code quickly?
