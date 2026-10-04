# Lesson 14 · Accessibility — 📱 Mobile

> The seat map becomes understandable and usable through assistive technology. Available seats are buttons, selected seats expose state, and taken seats remain announced as unavailable.

## What arrives

| File | Status | Why it's here |
| --- | --- | --- |
| `mobile/features/booking/seat-map.tsx` | RailPass, LIVE 14.1 | The Skia seat map with a deliberate accessibility gap around seat labels, roles, state and touch target padding. |

## Talk through (together)

1. **`SeatButton`: custom drawing plus native semantics.** Ask: why does a Skia drawing need a `Pressable` or accessible `View`? Answer: pixels alone do not create roles, labels or state for assistive tech.
2. **Taken seats:** Ask: should unavailable seats disappear from the accessibility tree? Answer: no. They are still information, so they stay accessible but disabled.
3. **`hitSlop.sm`: touch target forgiveness.** Ask: why add hit slop instead of making the drawn seat larger? Answer: the visual geometry stays accurate while the tap target becomes easier to hit.

## Live tasks

### LIVE 14.1 — Add seat accessibility (`mobile/features/booking/seat-map.tsx`)

**Why:** a passenger using VoiceOver or TalkBack needs the seat number, side, availability and selected state, not just colour.

1. Import `hitSlop` from `@/constants/sizes`.
2. In `SeatButton`, build the exact label:
   `Seat ${seat.seatNumber}, ${seat.column === 0 ? 'left' : 'right'} side, ${isTaken ? 'unavailable' : isSelected ? 'selected' : 'available'}`.
3. For a taken seat, return `<View accessible accessibilityLabel={label} accessibilityState={{ disabled: true }} style={[styles.seat, position]} />`.
4. For an available seat, add `accessibilityRole="button"`, `accessibilityLabel={label}`, `accessibilityState={{ selected: isSelected }}` and `hitSlop={hitSlop.sm}` to the `Pressable`.
5. Keep the existing animation, backrest and colour logic unchanged.

**Hint:** the lesson 15 Maestro flow `mobile/e2e/maestro/book-one-way.yaml` taps the first label matching `Seat \d+, .* side, available`, so copy the label format exactly.

**Done when:** a screen reader can focus seats, taken seats announce unavailable and disabled, and selected seats announce selected.

## Checkpoint

Open a journey, choose a class and move through the seat map with VoiceOver or TalkBack. Available seats announce as buttons; taken seats announce as unavailable. Commands: `lesson status 14` shows no open mobile tasks, and `yarn run check` passes from the workspace root.

## Removed / replaced in this lesson

`lesson start 14` overwrites `mobile/features/booking/seat-map.tsx` with the accessibility exercise. Nothing is deleted.
