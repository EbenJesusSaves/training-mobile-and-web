# Libs

## Purpose
Pure helpers and thin adapters shared across features.

## What belongs here
`secure-storage.ts` and `lottie.ts` arrive lesson 04; `format.ts` and `dates.ts` arrive lesson 06; `seat-layout.ts` arrives lesson 08.

## What does not belong here
No React screens, navigation or feature-specific UI. API endpoint calls belong in `api/`.

## Allowed imports
Libs are pure helpers or adapters. Pure libs import no app layers; adapters may import the third-party package they wrap.

## Naming pattern
Small nouns by concern: `format.ts`, `dates.ts`, `seat-layout.ts`, `secure-storage.ts`.

## Lesson that fills it
Lessons 04, 06 and 08 fill it.

## 💬 Discuss
- Which libs are pure and which wrap a platform library?
