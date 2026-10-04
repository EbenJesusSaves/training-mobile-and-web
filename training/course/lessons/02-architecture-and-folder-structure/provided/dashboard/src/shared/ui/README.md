# `src/shared/ui`

## Purpose

Reusable presentational UI primitives.

## What belongs here

`DataTable`, `PageHeader`, `EmptyState` and CSS modules arrive in 06; `ErrorState` arrives in 10.

## Real RailPass files that arrive here

- Lesson 06: `src/shared/ui/data-table.module.css`
- Lesson 06: `src/shared/ui/data-table.tsx`
- Lesson 06: `src/shared/ui/empty-state.tsx`
- Lesson 10: `src/shared/ui/error-state.tsx`
- Lesson 06: `src/shared/ui/page-header.module.css`
- Lesson 06: `src/shared/ui/page-header.tsx`
- Lesson 06: `src/shared/ui/states.module.css`

## What does not belong here

Feature-specific cards/forms/tables belong in `features/*/components`.

## Allowed imports

May import shared constants and external UI libraries; never feature code.

## Naming pattern

Small, named modules such as `format.ts`, `data-table.tsx`, `client.ts`, `use-debounced-value.ts`.

## Lesson that fills it

This folder is introduced in lesson 02 and filled progressively in the lesson numbers named above.

## 💬 Discuss

- Which file in this folder should be public to another feature, and which should remain private?
- What import would make this folder harder to change safely?
- How does the naming pattern help a teammate find the right code quickly?
