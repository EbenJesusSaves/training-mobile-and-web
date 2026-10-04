# Solution — Exercise 06: Code review exercise

## Example review comments

1. **Tokens:** “This component uses `#FF4D5A`, `27` and `19` directly. Could we move those to the existing colour/radius/spacing tokens or use the closest existing token? Components should not hard-code design values.”
2. **State ownership:** “The PR stores search results in Zustand. These journeys are server state and can go stale after bookings; please keep only filter intent in the store and fetch results through `useJourneySearch`.”
3. **Accessibility:** “The seat button uses colour-only state. Please add `accessibilityRole`, a label like `Seat 6, left side, selected`, and disabled/selected state.”
4. **Cache key:** “The new filter changes API results but is not part of the query key. Toggling it can reuse stale cached data.”
5. **Errors:** “This catch block returns `null`, so the screen cannot retry or show field errors. Please normalize/display the `ApiError`.”

## Discussion points

- Which comments are blockers and which are suggestions?
- How can the reviewer teach without rewriting the author’s code?
- What evidence should the author add before requesting re-review?
