# `src/styles`

## Purpose

CSS variables, Tailwind entry and Mantine theme.

## What belongs here

`tokens.css`, `theme.ts`, `tailwind.css`, `global.css` arrive in 05.

## Real RailPass files that arrive here

- Lesson 05: `src/styles/global.css`
- Lesson 05: `src/styles/tailwind.css`
- Lesson 05: `src/styles/theme.ts`
- Lesson 05: `src/styles/tokens.css`

## What does not belong here

Feature CSS modules stay beside their components.

## Allowed imports

May import shared constants in TS theme; CSS references token variables.

## Naming pattern

`x-api.ts`, `x-keys.ts`, `x-queries.ts`, `components/*-view.tsx`, `*-slice.ts`, `.module.css`, `.test.tsx` as appropriate.

## Lesson that fills it

This folder is introduced in lesson 02 and filled progressively in the lesson numbers named above.

## 💬 Discuss

- Which file in this folder should be public to another feature, and which should remain private?
- What import would make this folder harder to change safely?
- How does the naming pattern help a teammate find the right code quickly?
