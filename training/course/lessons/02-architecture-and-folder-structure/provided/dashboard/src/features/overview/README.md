# `src/features/overview`

## Purpose

Operations summary charts and KPI panels.

## What belongs here

`types.ts` in 02, placeholder in 07, API, charts and RailPass view in 10.

## Real RailPass files that arrive here

- Lesson 10: `src/features/overview/api/overview-api.ts`
- Lesson 10: `src/features/overview/api/overview-keys.ts`
- Lesson 10: `src/features/overview/api/overview-queries.ts`
- Lesson 10: `src/features/overview/components/bookings-chart.module.css`
- Lesson 10: `src/features/overview/components/bookings-chart.tsx`
- Lesson 10: `src/features/overview/components/busiest-journeys-chart.module.css`
- Lesson 10: `src/features/overview/components/busiest-journeys-chart.tsx`
- Lesson 10: `src/features/overview/components/overview-view.module.css`
- Lesson 07: `src/features/overview/components/overview-view.tsx`
- Lesson 02: `src/features/overview/types.ts`

## What does not belong here

Detailed editing workflows belong in their feature folders.

## Allowed imports

May import public badges/labels, shared formatters/UI and its own API hooks.

## Naming pattern

`x-api.ts`, `x-keys.ts`, `x-queries.ts`, `components/*-view.tsx`, `*-slice.ts`, `.module.css`, `.test.tsx` as appropriate.

## Lesson that fills it

This folder is introduced in lesson 02 and filled progressively in the lesson numbers named above.

## 💬 Discuss

- Which file in this folder should be public to another feature, and which should remain private?
- What import would make this folder harder to change safely?
- How does the naming pattern help a teammate find the right code quickly?
