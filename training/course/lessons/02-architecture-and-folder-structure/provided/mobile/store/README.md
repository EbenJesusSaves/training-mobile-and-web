# Store

## Purpose
Client-owned state that must survive routes or launches lives here.

## What belongs here
`session-store.ts`, `preferences-store.ts` and `booking-draft-store.ts` arrive in lesson 09; tests arrive in lesson 15.

## What does not belong here
Server data does not belong here; fetch it through API hooks. UI components do not belong here.

## Allowed imports
Stores may import libs, config and API types. Stores do not import screens, components or feature modules.

## Naming pattern
Store files end in `-store.ts`; selectors are named `selectThing` when exported.

## Lesson that fills it
Lessons 09 and 15 fill it.

## 💬 Discuss
- How do we decide whether data is client state or server state?
