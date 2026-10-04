# Lesson A · Motion & graphics with Skia and Reanimated — 📱 Mobile

> This optional guide reads the finished app instead of changing workspace files. Learners trace how RailPass uses Skia and Reanimated for stateful, accessible visuals.

## What arrives

Nothing. This extension copies no mobile files.

## Talk through (together)

1. **`mobile/features/booking/seat-map.tsx`: drawing plus controls.** Ask: what is Skia responsible for? Answer: car body, compartments, hatched unavailable seats and selection pulse; native pressables provide accessibility.
2. **`mobile/components/ui/display/journey-timeline.tsx`: motion with meaning.** Ask: what does the train glyph communicate? Answer: route progress and relationship between origin and destination, not decoration alone.
3. **`mobile/features/tickets/ticket-card.tsx`: ticket silhouette.** Ask: why draw the shape but keep text native? Answer: custom outline and perforation can be graphics, while ticket content stays readable and accessible.
4. **Reduce Motion:** Ask: what changes when motion is reduced? Answer: state remains visible; loops and flourish should shorten or stop.

## Live tasks

There is no mobile LIVE task. Use `kata/mobile/motion-seat-map-kata.md` to list three places where motion communicates state and how to respect Reduce Motion.

## Checkpoint

Read the kata and point to the real files: `mobile/features/booking/seat-map.tsx`, `mobile/components/ui/display/journey-timeline.tsx`, `mobile/features/tickets/ticket-card.tsx`, `mobile/features/auth/travel-scene.tsx` and `mobile/features/booking/success-mark.tsx`. Commands: `lesson status A` shows no open mobile tasks, and `yarn run check` passes from the workspace root.

## Removed / replaced in this lesson

Nothing.
