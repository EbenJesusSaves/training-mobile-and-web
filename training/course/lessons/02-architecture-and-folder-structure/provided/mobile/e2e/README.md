# E2E flows

## Purpose
Device-level Maestro flows for smoke and critical passenger paths.

## What belongs here
`e2e/maestro/{open-app,sign-in,book-one-way}.yaml` and its README arrive in lesson 15.

## What does not belong here
Do not put Jest tests here; do not import app code.

## Allowed imports
E2E flows are external test scripts and do not import app code.

## Naming pattern
Maestro YAML names describe user journeys: `book-one-way.yaml`, `sign-in.yaml`.

## Lesson that fills it
Lesson 15 fills it.

## 💬 Discuss
- Which path is important enough for a slower device test?
