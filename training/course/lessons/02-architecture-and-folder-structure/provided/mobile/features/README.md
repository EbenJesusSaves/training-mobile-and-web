# Features

## Purpose
Feature folders hold product-specific UI for auth, booking, profile and tickets. They expose components/screens helpers but do not own navigation or global store wiring.

## What belongs here
`features/booking/{journey-card,seat-map,price-bar}.tsx` arrives in lessons 06 and 08; `features/auth/*` arrives in lesson 06; `features/tickets/{barcode,ticket-card,ticket-pdf}.tsx` arrives in lesson 11; `features/profile/settings-row.tsx` arrives in lesson 06.

## What does not belong here
Do not put generic buttons, typography or alerts here; use `components/`. Do not import another feature; promote shared code down to `components/` or `libs/`. Do not read Zustand stores directly; screens in `app/` connect stores to feature props.

## Allowed imports
Feature modules may import components, hooks, api, libs, constants and config. They must not import `app/`, `store/` or another feature; route files connect stores to features.

## Naming pattern
Feature components use PascalCase exports in kebab-case files: `journey-card.tsx`, `auth-shell.tsx`, `settings-row.tsx`.

## Lesson that fills it
Lesson 06 fills most presentational feature UI; lessons 08, 10, 11 and 18 add data-aware pieces.

## 💬 Discuss
- If booking and tickets both need a visual, where should it move?
- Why do route files connect stores instead of feature components?
