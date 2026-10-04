# Solution — Exercise 04: Extend a reusable component

## Corrected code pattern

For a mobile component, type the prop and map variants to tokens:

```tsx
type AlertTone = 'info' | 'warning' | 'error';
type AlertSize = 'compact' | 'regular';

const paddingBySize = {
  compact: spacing.md,
  regular: spacing.lg,
} as const;
```

```tsx
<View style={[styles.card, { padding: paddingBySize[size], backgroundColor: palette.background }]}>
  <AppText variant="bodyStrong" tone={palette.tone}>{title}</AppText>
</View>
```

## Explanation

The prop is semantic, not a raw number. Existing call sites default to the old behavior. If a new visual value is needed, add it to the closest constants file and document why.

## Discussion points

- What makes `compact` better than `padding={8}`?
- Should a loading component set `accessibilityState={{ busy: true }}`?
- When should a feature-local variant stay feature-local?
