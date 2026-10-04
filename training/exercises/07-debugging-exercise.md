# Exercise 07 — Debugging stale search results

## Context

A learner adds a new search input but results do not update consistently. Sometimes old results show under new filter labels.

## Starting point

Read:

- `mobile/hooks/use-journey-search.ts`
- `mobile/hooks/use-api-query.ts`
- `dashboard/src/features/journeys/api/journey-queries.ts`
- `dashboard/src/features/journeys/components/journeys-view.tsx`

## Task

Debug the stale results. Identify whether the issue is local state, debounce, query key, request params, cache invalidation or rendering.

## Acceptance criteria

- You write a short root-cause note.
- You identify the smallest code change to fix the stale cache.
- You explain how to reproduce and verify the fix.
- You do not clear the whole cache as a first resort.

## Hints

- In mobile, `useApiQuery` uses a string cache key.
- In dashboard, TanStack Query uses array keys.
- Every input that changes returned data belongs in the key.
