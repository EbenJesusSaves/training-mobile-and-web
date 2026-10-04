# `src/features/preferences`

## Purpose

Client-only dashboard preferences.

## What belongs here

`preferences-slice.ts` arrives in 09; layout and bookings use its public actions/selectors.

## Real RailPass files that arrive here

- Lesson 09: `src/features/preferences/preferences-slice.ts`

## What does not belong here

Server state never belongs here; use TanStack Query for API data.

## Allowed imports

May import Redux Toolkit and expose slice actions; do not import feature views.

## Naming pattern

`x-api.ts`, `x-keys.ts`, `x-queries.ts`, `components/*-view.tsx`, `*-slice.ts`, `.module.css`, `.test.tsx` as appropriate.

## Lesson that fills it

This folder is introduced in lesson 02 and filled progressively in the lesson numbers named above.

## 💬 Discuss

- Which file in this folder should be public to another feature, and which should remain private?
- What import would make this folder harder to change safely?
- How does the naming pattern help a teammate find the right code quickly?
