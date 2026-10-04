# Booking feature

## Purpose
Booking-specific presentation lives here: journey cards, date strips, seat maps, class pickers and checkout affordances.

## What belongs here
Lesson 06 adds cards, pickers and price UI; lesson 08 adds `seat-map.tsx`; lesson 10 adds `archive-list.tsx`; lesson 18 integrates updates through Home.

## What does not belong here
API endpoint functions belong in `api/`; booking draft state belongs in `store/booking-draft-store.ts`; generic controls belong in `components/ui/`.

## Allowed imports
Feature modules may import components, hooks, api, libs, constants and config. They must not import `app/`, `store/` or another feature; route files connect stores to features.

## Naming pattern
Kebab-case by product noun: `journey-card.tsx`, `class-picker.tsx`, `seat-map.tsx`.

## Lesson that fills it
Lessons 06, 08, 10 and 18 fill it.

## 💬 Discuss
- Why is `seat-map.tsx` a feature component instead of a generic component?
- Which props keep `JourneyCard` reusable?
