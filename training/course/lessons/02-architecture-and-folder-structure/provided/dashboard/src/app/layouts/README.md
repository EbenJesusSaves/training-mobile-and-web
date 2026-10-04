# `src/app/layouts`

## Purpose

Dashboard chrome: navigation, header, outlet and staff actions.

## What belongs here

`dashboard-layout.tsx` starts as navigation in 07, gets preferences in 09, and becomes the staff shell in 12.

## Real RailPass files that arrive here

- Lesson 07: `src/app/layouts/dashboard-layout.module.css`
- Lesson 07: `src/app/layouts/dashboard-layout.tsx`

## What does not belong here

Feature tables, drawers and forms stay inside their feature folder.

## Allowed imports

May import shared constants, app hooks, preference/auth public actions and small feature labels only.

## Naming pattern

`router.tsx`, `providers.tsx`, `store.ts`, `hooks.ts`, `routes/*-route.tsx`, `layouts/*`.

## Lesson that fills it

This folder is introduced in lesson 02 and filled progressively in the lesson numbers named above.

## 💬 Discuss

- Which file in this folder should be public to another feature, and which should remain private?
- What import would make this folder harder to change safely?
- How does the naming pattern help a teammate find the right code quickly?
