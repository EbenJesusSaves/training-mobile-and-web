# Lesson 06 · Components: building & structuring — 📱 Mobile

> You build the shared component layer and use typed prototype data to render the first RailPass journey card. This is the last playground lesson before lesson 07 deletes the playground and fixture file.

## What arrives

| File | Status | Why it's here |
| --- | --- | --- |
| `mobile/components/atomic/app-text.tsx`, `mobile/components/atomic/icon.tsx` | RailPass | Text and icon primitives reused by every UI layer. |
| `mobile/components/layout/header-bar.tsx`, `mobile/components/layout/screen.tsx` | RailPass | Common safe-area, scrolling, header and refresh layout primitives. |
| `mobile/components/ui/buttons/button.tsx` | RailPass, LIVE 06.2 | Shared button. LIVE 06.2 adds pressed opacity and scale feedback. |
| `mobile/components/ui/buttons/icon-button.tsx` | RailPass | Compact icon action used by route headers and cards. |
| `mobile/components/ui/display/status-chip.tsx` | RailPass, LIVE 06.1 | Status label, icon and tone mapping for bookings, journeys and updates. |
| `mobile/components/ui/display/avatar.tsx`, `mobile/components/ui/display/journey-timeline.tsx` | RailPass | Person and journey display widgets. |
| `mobile/components/ui/feedback/inline-alert.tsx`, `mobile/components/ui/loaders/skeleton.tsx` | RailPass | Error/notice and loading primitives. |
| `mobile/components/ui/inputs/segmented-tabs.tsx`, `mobile/components/ui/inputs/stepper.tsx`, `mobile/components/ui/inputs/text-field.tsx` | RailPass | Shared controls for filters, passenger counts and forms. |
| `mobile/features/auth/auth-shell.tsx`, `mobile/features/auth/auth-widgets.tsx`, `mobile/features/auth/travel-scene.tsx` | RailPass | Presentational auth pieces used when real auth screens arrive. |
| `mobile/features/booking/add-on-icon.ts`, `car-selector.tsx`, `city-card.tsx`, `city-images.ts`, `class-picker.tsx`, `date-strip.tsx`, `filter-sheet.tsx`, `journey-card.tsx`, `option-row.tsx`, `price-bar.tsx`, `route-card.tsx`, `success-mark.tsx` | RailPass | Booking feature UI: city cards, filters, journey cards, class/seat choices, pricing and success visuals. |
| `mobile/features/profile/settings-row.tsx`, `mobile/features/tickets/trip-list-item.tsx` | RailPass | Profile settings row and ticket list item used by later route screens. |
| `mobile/libs/dates.ts`, `mobile/libs/format.ts` | RailPass | Date and money formatting helpers used by feature components. |
| `mobile/prototype/fixtures.ts` | course-only (removed in 07) | `prototypeJourneys`, stations and bookings for playground composition before API data arrives. |
| `mobile/app/index.tsx` | course-only (removed in 07) | Component playground. LIVE 06.3 renders a `FlatList` of `JourneyCard` items. |

## Talk through (together)

1. **`mobile/components/ui/display/status-chip.tsx`: one status vocabulary.** Ask: why centralise labels, icons and tones? Answer: bookings, journeys and updates share status language, and lesson 15 can test one component.
2. **`mobile/components/ui/buttons/button.tsx`: interaction feedback.** Ask: why does a shared button own pressed, disabled and loading states? Answer: every screen gets the same accessibility state and tactile response.
3. **`mobile/features/booking/journey-card.tsx`: feature component API.** Ask: why receive `journey`, `passengers` and callbacks as props? Answer: route files orchestrate data and state; feature UI stays reusable.
4. **`mobile/prototype/fixtures.ts`: temporary data.** Ask: when should fixtures disappear? Answer: lesson 07 deletes them with the playground, before route prototypes and real API-backed pages take over.

## Live tasks

### LIVE 06.1 — Complete the status chip map (`mobile/components/ui/display/status-chip.tsx`)

**Why:** passengers should never have to decode enum names or colour alone.

1. Change `CHIPS` from `Partial<Record<...>>` to `Record<ChipKind, { label: string; icon: IconName; tone: ChipTone }>`.
2. Keep `CONFIRMED: { label: 'Confirmed', icon: 'check', tone: 'neutral' }` and `SCHEDULED: { label: 'On time', icon: 'clock', tone: 'neutral' }`.
3. Add `CHECKED_IN: { label: 'Checked in', icon: 'checkedIn', tone: 'info' }`.
4. Add `CANCELLED: { label: 'Cancelled', icon: 'closeCircle', tone: 'muted' }`.
5. Add `COMPLETED: { label: 'Completed', icon: 'checkPlain', tone: 'muted' }`.
6. Add `DELAYED: { label: 'Delayed', icon: 'clock', tone: 'warning' }`.
7. Add `JOURNEY_CANCELLED: { label: 'Train cancelled', icon: 'ban', tone: 'danger' }`.
8. Remove the fallback `?? { label: String(kind), … }`; `const chip = CHIPS[kind];` should be exhaustive.

**Hint:** TypeScript should complain if a `ChipKind` is missing.

**Done when:** `<StatusChip kind="SCHEDULED" />` still shows **On time**, and typecheck passes with the exhaustive record.

### LIVE 06.2 — Wire button pressed feedback (`mobile/components/ui/buttons/button.tsx`)

**Why:** a reusable button should make pressed and disabled feedback impossible to forget.

1. In the `Pressable` style callback, keep `const isDisabled = disabled || loading` above the return.
2. Replace `opacity: isDisabled ? opacity.disabled : opacity.full` with `opacity: isDisabled ? opacity.disabled : pressed ? opacity.pressed : opacity.full`.
3. Replace `transform: [{ scale: scales.rest }]` with `transform: [{ scale: pressed ? scales.pressed : scales.rest }]`.
4. Leave `disabled={isDisabled}` and `accessibilityState={{ disabled: isDisabled, busy: loading }}` aligned with the visual state.

**Hint:** do not use colour alone for disabled or pressed state.

**Done when:** pressing **Primary action** visibly dims/scales the button, and disabled/loading states still prevent presses.

### LIVE 06.3 — Render journey cards from prototype data (`mobile/app/index.tsx`)

**Why:** the playground should show composition of shared primitives plus booking feature UI before routes exist.

1. Import `FlatList` from `react-native` alongside `StyleSheet` and `View`.
2. Import `JourneyCard` from `@/features/booking/journey-card`.
3. Import `prototypeJourneys` from `@/prototype/fixtures`.
4. Replace the placeholder text under the button with a `FlatList`.
5. Set `data={prototypeJourneys}` and `keyExtractor={(item) => item.id}`.
6. Render each item as `<JourneyCard journey={item} passengers={1} onSelectClass={() => undefined} />`.
7. Keep navigation out of this file; lesson 07 links screens.

**Hint:** one prototype journey is enough. This task is about component composition, not data fetching.

**Done when:** the playground shows **Gold Coast Express** as a RailPass journey card under the shared button and chip.

## Checkpoint

The device shows **Component system**, an **On time** status chip, a tactile **Primary action** button and a `JourneyCard` for the Accra to Kumasi prototype journey.

Commands: `lesson status 06` shows no open mobile tasks, and `yarn run check` passes from the workspace root.

## Removed / replaced in this lesson

`lesson start 06` overwrites the lesson 05 playground `mobile/app/index.tsx` and several early primitives with the fuller component set. Nothing is deleted until lesson 07, which removes `mobile/app/index.tsx` and `mobile/prototype/fixtures.ts`.
