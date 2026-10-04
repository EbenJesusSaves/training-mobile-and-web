# 06 · Components: building & structuring

**Notes:** `/courses/scalable-mobile-and-web-apps/building-components` on the course website · **Time:** 30 min ·
**Workspace changes:** `lesson start 06` adds 35 mobile files and 12 dashboard files (LIVE 06.1–06.3, 06.5–06.6)

## Goal

Compose shared primitives and feature components into small product surfaces before routing and API data arrive.

## What happens

1. **Component taxonomy (about 5 min):** atomic, layout, UI, feature and view components.
2. **Mobile component tour (about 7 min):** `Button`, `StatusChip`, `JourneyCard`, prototype fixtures and formatting helpers.
3. **Mobile LIVE tasks (about 8 min):** LIVE 06.1 completes the status chip map; LIVE 06.2 wires pressed feedback; LIVE 06.3 renders `JourneyCard` rows.
4. **Dashboard LIVE tasks (about 6 min):** LIVE 06.5 completes `JourneyStatusBadge`; LIVE 06.6 maps prototype journeys into the shared table.
5. **Checkpoint and compare (about 4 min):** run checks, inspect playgrounds and compare with RailPass.

## LIVE tasks

| Task | App | File | What you write |
| --- | --- | --- | --- |
| LIVE 06.1 | 📱 mobile | `mobile/components/ui/display/status-chip.tsx` | Make `CHIPS` an exhaustive `Record`, add every booking/journey status label/icon/tone, and remove the fallback. |
| LIVE 06.2 | 📱 mobile | `mobile/components/ui/buttons/button.tsx` | Use `pressed` to choose `opacity.pressed` and `scales.pressed`, while disabled/loading still win. |
| LIVE 06.3 | 📱 mobile | `mobile/app/index.tsx` | Import `FlatList`, `JourneyCard` and `prototypeJourneys`, then render journey cards with `passengers={1}`. |
| LIVE 06.5 | 🖥️ dashboard | `dashboard/src/features/journeys/components/journey-status-badge.tsx` | Complete the journey status map with delayed and cancelled labels, colours and icons. |
| LIVE 06.6 | 🖥️ dashboard | `dashboard/src/app/course-playground.tsx` | Map `prototypeJourneys` to `DataTable.Row`, using `TrainLabel` and `JourneyStatusBadge`. |

## Checkpoint

- 📱 The mobile playground shows **Component system**, **On time**, a tactile **Primary action** button and a **Gold Coast Express** journey card.
- 🖥️ The dashboard playground shows shared tables, journey badges, train labels and the empty state with prototype data.
- `yarn run check` passes.

## Common problems

- **A status falls through to enum text:** `CHIPS` should be a full `Record<ChipKind, …>`, not a partial map with a fallback.
- **Pressed feedback does nothing:** check the `Pressable` style callback uses its `pressed` argument.
- **FlatList type errors:** import `prototypeJourneys` from `@/prototype/fixtures` and pass the whole `Journey` object to `JourneyCard`.
- **Confusing temporary fixtures with app data:** `mobile/prototype/fixtures.ts` and dashboard `src/prototype/` are removed at lesson 07.

## Facilitator notes

- Start with props: ask what each component needs to know and what it should not know.
- Demo the button press on a real device if possible; simulator clicks can be subtle.
- Pair mobile and dashboard learners for the status-badge tasks so they see the same domain idea in both stacks.

**Next:** lesson 07 removes the playgrounds and creates the route prototypes.
