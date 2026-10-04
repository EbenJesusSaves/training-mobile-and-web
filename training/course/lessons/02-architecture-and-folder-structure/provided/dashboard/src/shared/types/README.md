# `src/shared/types`

## Purpose

Cross-feature TypeScript shapes.

## What belongs here

`pagination.ts` arrives in 02 because many API list responses use it later.

## Real RailPass files that arrive here

- Lesson 02: `src/shared/types/pagination.ts`

## What does not belong here

Domain DTOs that belong to one capability stay in that feature.

## Allowed imports

No imports from features unless deliberately modeling a public shared contract.

## Naming pattern

Small, named modules such as `format.ts`, `data-table.tsx`, `client.ts`, `use-debounced-value.ts`.

## Lesson that fills it

This folder is introduced in lesson 02 and filled progressively in the lesson numbers named above.

## 💬 Discuss

- Which file in this folder should be public to another feature, and which should remain private?
- What import would make this folder harder to change safely?
- How does the naming pattern help a teammate find the right code quickly?
