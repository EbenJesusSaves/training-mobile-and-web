# `src/features/auth`

## Purpose

Staff session state, login view and route guard.

## What belongs here

`types.ts` in 02, `auth-slice.ts` in 09, `auth-api.ts` and login view in 10, `auth-keys.ts`, `auth-queries.ts` and `require-staff.tsx` in 12, slice tests in 15.

## Real RailPass files that arrive here

- Lesson 10: `src/features/auth/api/auth-api.ts`
- Lesson 12: `src/features/auth/api/auth-keys.ts`
- Lesson 12: `src/features/auth/api/auth-queries.ts`
- Lesson 15: `src/features/auth/auth-slice.test.ts`
- Lesson 09: `src/features/auth/auth-slice.ts`
- Lesson 10: `src/features/auth/components/login-view.module.css`
- Lesson 07: `src/features/auth/components/login-view.tsx`
- Lesson 12: `src/features/auth/require-staff.tsx`
- Lesson 02: `src/features/auth/types.ts`

## What does not belong here

Generic HTTP errors stay in `shared/api`; dashboard layout stays in `app/layouts`.

## Allowed imports

May import shared API/errors, app hooks and preference-independent UI; expose `auth-slice`, auth queries and `RequireStaff`.

## Naming pattern

`x-api.ts`, `x-keys.ts`, `x-queries.ts`, `components/*-view.tsx`, `*-slice.ts`, `.module.css`, `.test.tsx` as appropriate.

## Lesson that fills it

This folder is introduced in lesson 02 and filled progressively in the lesson numbers named above.

## 💬 Discuss

- Which file in this folder should be public to another feature, and which should remain private?
- What import would make this folder harder to change safely?
- How does the naming pattern help a teammate find the right code quickly?
