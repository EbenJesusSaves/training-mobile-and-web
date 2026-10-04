# `src/shared/hooks`

## Purpose

Reusable hooks not owned by a single feature.

## What belongs here

`use-debounced-value.ts` and `use-query-notification.ts` arrive in 10.

## Real RailPass files that arrive here

- Lesson 10: `src/shared/hooks/use-debounced-value.ts`
- Lesson 10: `src/shared/hooks/use-query-notification.ts`

## What does not belong here

Feature-specific fetch hooks belong in `features/*/api/*-queries.ts`.

## Allowed imports

May import shared API/constants; never feature views.

## Naming pattern

Small, named modules such as `format.ts`, `data-table.tsx`, `client.ts`, `use-debounced-value.ts`.

## Lesson that fills it

This folder is introduced in lesson 02 and filled progressively in the lesson numbers named above.

## 💬 Discuss

- Which file in this folder should be public to another feature, and which should remain private?
- What import would make this folder harder to change safely?
- How does the naming pattern help a teammate find the right code quickly?
