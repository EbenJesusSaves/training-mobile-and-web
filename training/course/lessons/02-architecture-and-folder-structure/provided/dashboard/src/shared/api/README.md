# `src/shared/api`

## Purpose

Axios client and normalized API errors.

## What belongs here

`client.ts` and `errors.ts` arrive in 10; `errors.test.ts` arrives in 15.

## Real RailPass files that arrive here

- Lesson 10: `src/shared/api/client.ts`
- Lesson 15: `src/shared/api/errors.test.ts`
- Lesson 10: `src/shared/api/errors.ts`

## What does not belong here

Feature endpoint functions belong in `features/*/api`.

## Allowed imports

May import shared config/constants only; exposes small primitives for features.

## Naming pattern

Small, named modules such as `format.ts`, `data-table.tsx`, `client.ts`, `use-debounced-value.ts`.

## Lesson that fills it

This folder is introduced in lesson 02 and filled progressively in the lesson numbers named above.

## 💬 Discuss

- Which file in this folder should be public to another feature, and which should remain private?
- What import would make this folder harder to change safely?
- How does the naming pattern help a teammate find the right code quickly?
