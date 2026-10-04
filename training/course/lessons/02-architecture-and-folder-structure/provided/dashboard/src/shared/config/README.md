# `src/shared/config`

## Purpose

Public runtime configuration read by browser code.

## What belongs here

`env.ts` arrives in 01 with a validation LIVE task and is replaced by RailPass in 05.

## Real RailPass files that arrive here

- Lesson 01: `src/shared/config/env.ts`

## What does not belong here

Secrets do not belong in Vite env; backend config is outside this course.

## Allowed imports

May import no feature code; keep it side-effect-light.

## Naming pattern

Small, named modules such as `format.ts`, `data-table.tsx`, `client.ts`, `use-debounced-value.ts`.

## Lesson that fills it

This folder is introduced in lesson 02 and filled progressively in the lesson numbers named above.

## 💬 Discuss

- Which file in this folder should be public to another feature, and which should remain private?
- What import would make this folder harder to change safely?
- How does the naming pattern help a teammate find the right code quickly?
