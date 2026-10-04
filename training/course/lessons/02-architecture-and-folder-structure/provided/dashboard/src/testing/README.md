# `src/testing`

## Purpose

Vitest setup and render helpers.

## What belongs here

`setup.ts` arrives in 01 for Vite config, `render.tsx` and `index.ts` arrive in 08.

## Real RailPass files that arrive here

- Lesson 08: `src/testing/index.ts`
- Lesson 08: `src/testing/render.tsx`
- Lesson 01: `src/testing/setup.ts`

## What does not belong here

Production code should not import testing helpers.

## Allowed imports

May import app providers only when needed for tests; otherwise keep helpers focused.

## Naming pattern

`x-api.ts`, `x-keys.ts`, `x-queries.ts`, `components/*-view.tsx`, `*-slice.ts`, `.module.css`, `.test.tsx` as appropriate.

## Lesson that fills it

This folder is introduced in lesson 02 and filled progressively in the lesson numbers named above.

## 💬 Discuss

- Which file in this folder should be public to another feature, and which should remain private?
- What import would make this folder harder to change safely?
- How does the naming pattern help a teammate find the right code quickly?
