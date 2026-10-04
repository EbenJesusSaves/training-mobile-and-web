# `src/features/journeys`

## Purpose

Journey listing, detail operations, forms and seat occupancy.

## What belongs here

`types.ts` in 02, badges in 06, placeholders/routes in 07, utils and seat map in 08, API/query views in 10, form in 11, status controls in 18.

## Real RailPass files that arrive here

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

## What does not belong here

Booking list views stay in bookings; network edit screens stay in network.

## Allowed imports

May import network types/query hooks, booking badges, shared helpers/UI and app hooks when needed.

## Naming pattern

`x-api.ts`, `x-keys.ts`, `x-queries.ts`, `components/*-view.tsx`, `*-slice.ts`, `.module.css`, `.test.tsx` as appropriate.

## Lesson that fills it

This folder is introduced in lesson 02 and filled progressively in the lesson numbers named above.

## 💬 Discuss

- Which file in this folder should be public to another feature, and which should remain private?
- What import would make this folder harder to change safely?
- How does the naming pattern help a teammate find the right code quickly?
