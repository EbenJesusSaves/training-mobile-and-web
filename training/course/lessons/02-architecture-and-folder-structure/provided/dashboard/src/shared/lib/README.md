# `src/shared/lib`

## Purpose

Pure formatting and derivation helpers.

## What belongs here

`format.ts` and tests arrive in 08.

## Real RailPass files that arrive here

- Lesson 08: `src/shared/lib/format.test.ts`
- Lesson 08: `src/shared/lib/format.ts`

## What does not belong here

React components and query hooks do not belong here.

## Allowed imports

Imports only shared constants/types or external pure utilities.

## Naming pattern

Small, named modules such as `format.ts`, `data-table.tsx`, `client.ts`, `use-debounced-value.ts`.

## Lesson that fills it

This folder is introduced in lesson 02 and filled progressively in the lesson numbers named above.

## 💬 Discuss

- Which file in this folder should be public to another feature, and which should remain private?
- What import would make this folder harder to change safely?
- How does the naming pattern help a teammate find the right code quickly?
