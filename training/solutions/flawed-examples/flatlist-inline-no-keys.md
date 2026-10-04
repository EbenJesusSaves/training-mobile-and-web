# Solution — FlatList inline work and index keys

## Corrected code

```tsx
<FlatList
  data={journeys}
  keyExtractor={(journey) => journey.id}
  renderItem={renderJourney}
  getItemLayout={fixedRowHeight ? getJourneyItemLayout : undefined}
/>
```

## Explanation

Use stable IDs, move expensive formatting into memoized helpers or child components, and consider `getItemLayout` when rows have fixed height. Inline callbacks are not always wrong, but avoid repeated heavy work in large lists.

## Discussion points

- When is an inline render acceptable?
- What breaks when index keys are used and list order changes?
