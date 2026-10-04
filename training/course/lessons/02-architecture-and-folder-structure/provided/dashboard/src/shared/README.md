# `src/shared`

## Purpose

Code reusable across features without product ownership.

## What belongs here

Constants/styles fill in 05, UI in 06, lib/tests in 08, API/hooks/error-state in 10, API tests in 15.

## Real RailPass files that arrive here

- Lesson 10: `src/shared/api/client.ts`
- Lesson 15: `src/shared/api/errors.test.ts`
- Lesson 10: `src/shared/api/errors.ts`
- Lesson 01: `src/shared/config/env.ts`
- Lesson 01: `src/shared/constants/breakpoints.cjs`
- Lesson 05: `src/shared/constants/breakpoints.ts`
- Lesson 05: `src/shared/constants/colors.ts`
- Lesson 05: `src/shared/constants/domain.ts`
- Lesson 05: `src/shared/constants/fonts.ts`
- Lesson 05: `src/shared/constants/index.ts`
- Lesson 05: `src/shared/constants/layout.ts`
- Lesson 05: `src/shared/constants/motion.ts`
- Lesson 05: `src/shared/constants/query.ts`
- Lesson 05: `src/shared/constants/radii.ts`
- Lesson 05: `src/shared/constants/sizes.ts`
- Lesson 05: `src/shared/constants/spacing.ts`
- Lesson 05: `src/shared/constants/typography.ts`
- Lesson 05: `src/shared/constants/z-index.ts`
- Lesson 10: `src/shared/hooks/use-debounced-value.ts`
- Lesson 10: `src/shared/hooks/use-query-notification.ts`
- Lesson 08: `src/shared/lib/format.test.ts`
- Lesson 08: `src/shared/lib/format.ts`
- Lesson 02: `src/shared/types/pagination.ts`
- Lesson 06: `src/shared/ui/data-table.module.css`
- Lesson 06: `src/shared/ui/data-table.tsx`
- Lesson 06: `src/shared/ui/empty-state.tsx`
- Lesson 10: `src/shared/ui/error-state.tsx`
- Lesson 06: `src/shared/ui/page-header.module.css`
- Lesson 06: `src/shared/ui/page-header.tsx`
- Lesson 06: `src/shared/ui/states.module.css`

## What does not belong here

Feature-specific queries, DTO mappings and views belong in `features/`.

## Allowed imports

`shared/` imports only `shared/` or external packages; never `features/` or `app/`.

## Naming pattern

Small, named modules such as `format.ts`, `data-table.tsx`, `client.ts`, `use-debounced-value.ts`.

## Lesson that fills it

This folder is introduced in lesson 02 and filled progressively in the lesson numbers named above.

## 💬 Discuss

- Which file in this folder should be public to another feature, and which should remain private?
- What import would make this folder harder to change safely?
- How does the naming pattern help a teammate find the right code quickly?
