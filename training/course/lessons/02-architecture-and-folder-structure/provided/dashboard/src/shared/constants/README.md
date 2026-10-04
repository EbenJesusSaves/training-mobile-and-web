# `src/shared/constants`

## Purpose

TypeScript mirrors of design, domain and sizing tokens.

## What belongs here

`breakpoints.cjs` arrives in 01 for PostCSS; the `.ts` constants arrive in 05.

## Real RailPass files that arrive here

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

## What does not belong here

Component markup and business logic do not belong here.

## Allowed imports

Imports only external types or other shared constants.

## Naming pattern

Small, named modules such as `format.ts`, `data-table.tsx`, `client.ts`, `use-debounced-value.ts`.

## Lesson that fills it

This folder is introduced in lesson 02 and filled progressively in the lesson numbers named above.

## 💬 Discuss

- Which file in this folder should be public to another feature, and which should remain private?
- What import would make this folder harder to change safely?
- How does the naming pattern help a teammate find the right code quickly?
