# Tests

## Purpose
Unit and component tests for mobile helpers, stores and UI components.

## What belongs here
`format.test.ts` and `dates-and-seats.test.ts` arrive lesson 08; booking/lottie/status tests arrive lesson 15.

## What does not belong here
No production code imports from tests. E2E flows belong in `e2e/`.

## Allowed imports
Tests may import the unit under test and test helpers. Keep production code unaware of tests.

## Naming pattern
Mirror the file under test: `status-chip.test.tsx`, `booking-draft-store.test.ts`.

## Lesson that fills it
Lessons 08 and 15 fill it.

## 💬 Discuss
- What should be a unit/component test instead of a Maestro flow?
