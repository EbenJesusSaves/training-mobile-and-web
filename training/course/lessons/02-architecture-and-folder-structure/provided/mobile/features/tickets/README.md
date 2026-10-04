# Tickets feature

## Purpose
Ticket-specific rendering lives here: trip list rows, ticket cards, barcode display and PDF export.

## What belongs here
`trip-list-item.tsx` arrives in lesson 06; `barcode.tsx`, `ticket-card.tsx` and `ticket-pdf.ts` arrive in lesson 11; tests and Maestro coverage arrive in lesson 15.

## What does not belong here
Booking state does not belong here; ticket data comes from API modules/screens. Generic status display belongs in `components/ui/display/status-chip.tsx`.

## Allowed imports
Feature modules may import components, hooks, api, libs, constants and config. They must not import `app/`, `store/` or another feature; route files connect stores to features.

## Naming pattern
Kebab-case files by ticket concern: `ticket-card.tsx`, `ticket-pdf.ts`.

## Lesson that fills it
Lessons 06, 11 and 15 fill it.

## 💬 Discuss
- Why does barcode rendering stay ticket-specific?
- What should be shared between screen ticket and PDF ticket?
