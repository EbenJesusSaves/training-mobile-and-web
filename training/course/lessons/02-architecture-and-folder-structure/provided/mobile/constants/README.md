# Constants

## Purpose
Design constants, geometry values and stable app-wide values live here.

## What belongs here
All token files arrive in lesson 05: colors, spacing, type, radii, sizes, motion, drawing and UI constants.

## What does not belong here
No runtime env parsing; use `config/`. No component logic or API calls.

## Allowed imports
Constants import no app layers. They may export values and types consumed everywhere.

## Naming pattern
Plural nouns for token groups: `colors.ts`, `spacing.ts`, `typography.ts`.

## Lesson that fills it
Lesson 05 fills it.

## 💬 Discuss
- Why are tokens constants instead of theme-provider state?
