# Solution — Exercise 08: Accessibility fix

## Corrected code

```tsx
<Pressable
  accessibilityRole="button"
  accessibilityLabel={`Seat ${seatNumber}, ${taken ? 'unavailable' : selected ? 'selected' : 'available'}`}
  accessibilityState={{ selected, disabled: taken }}
  disabled={taken}
  hitSlop={hitSlop.sm}
  onPress={onPress}
  style={[styles.seat, { backgroundColor }]}
>
  <AppText variant="labelStrong" color={textColor}>{seatNumber}</AppText>
</Pressable>
```

## Explanation

The state is no longer colour-only. Screen readers receive role, label and state; unavailable seats are disabled; hit slop increases the practical target size. Visual values should come from `colors`, `sizes`, `spacing`, `radii` and `hitSlop`.

## Discussion points

- Should unavailable seats be focusable as disabled information or omitted from the focus order?
- What label format is easiest to scan by ear?
- How can a test assert the accessible label without relying on colours?
