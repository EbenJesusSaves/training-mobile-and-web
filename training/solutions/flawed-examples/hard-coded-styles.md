# Solution — Hard-coded styles

## Corrected code

```tsx
const styles = StyleSheet.create({
  card: { backgroundColor: colors.accent, borderRadius: layout.cardRadius, padding: spacing.lg, margin: spacing.md },
  divider: { borderBottomWidth: borderWidths.hairline, borderBottomColor: colors.line, paddingBottom: spacing.sm },
});
```

## Explanation

The component should not own arbitrary visual values. Use `colors` from `useTheme()` and static scales from `mobile/constants/*` so light/dark themes, screenshots and shared design language remain consistent.

## Discussion points

- Which constant file owns spacing vs radii vs borders?
- If no token exists, should you create one or adapt the design?
