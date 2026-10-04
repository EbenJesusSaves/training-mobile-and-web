# `src/features/network`

## Purpose

Stations, routes, add-ons and route labels.

## What belongs here

`types.ts` in 02, `route-label.tsx` in 06, placeholders in 07, APIs/stations view in 10, extras in 17.

## Real RailPass files that arrive here

- Lesson 10: `src/features/network/api/network-api.ts`
- Lesson 10: `src/features/network/api/network-keys.ts`
- Lesson 10: `src/features/network/api/network-queries.ts`
- Lesson 07: `src/features/network/components/extras-view.tsx`
- Lesson 06: `src/features/network/components/route-label.tsx`
- Lesson 10: `src/features/network/components/stations-routes-view.module.css`
- Lesson 07: `src/features/network/components/stations-routes-view.tsx`
- Lesson 02: `src/features/network/types.ts`

## What does not belong here

Journey scheduling forms belong in journeys; charts belong in overview.

## Allowed imports

May import shared UI/lib and journey public types only when representing route context.

## Naming pattern

`x-api.ts`, `x-keys.ts`, `x-queries.ts`, `components/*-view.tsx`, `*-slice.ts`, `.module.css`, `.test.tsx` as appropriate.

## Lesson that fills it

This folder is introduced in lesson 02 and filled progressively in the lesson numbers named above.

## 💬 Discuss

- Which file in this folder should be public to another feature, and which should remain private?
- What import would make this folder harder to change safely?
- How does the naming pattern help a teammate find the right code quickly?
