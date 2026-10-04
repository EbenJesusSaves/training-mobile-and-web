# Solution — God component

## Corrected structure

```text
app/(app)/(tabs)/index.tsx                      screen composition and flow
hooks/use-journey-search.ts                     server query boundary
features/booking/journey-card.tsx               reusable feature rendering
libs/format.ts                                  date and money formatting
constants/*                                     visual values
```

```tsx
const search = useJourneySearch({ originId, destinationId, date, sort, passengers });
return <JourneyCard journey={item} passengers={passengers} onSelectClass={selectClass} />;
```

## Explanation

Separate responsibilities make code testable and reviewable. The screen composes; the hook fetches; the API module speaks HTTP; formatters format; components render; tokens style.

## Discussion points

- What should remain in a screen component?
- When should a feature component move to shared `components/ui/`?
