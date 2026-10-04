# Solution — Inaccessible seat button

## Corrected code

```tsx
<Pressable
  accessibilityRole="button"
  accessibilityLabel={`Seat ${seatNumber}, ${taken ? 'unavailable' : selected ? 'selected' : 'available'}`}
  accessibilityState={{ selected, disabled: taken }}
  disabled={taken}
  hitSlop={hitSlop.sm}
  onPress={onPress}
>
  <AppText variant="labelStrong">{seatNumber}</AppText>
</Pressable>
```

## Explanation

A passenger must not need colour vision to understand seat state. The label and state expose the same information as the visual design, and `hitSlop` improves touch usability.

## Discussion points

- Should taken seats show a number? RailPass uses hatching and no number.
- What should the screen reader announce for selected seats?
