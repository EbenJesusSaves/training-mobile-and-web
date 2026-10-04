# A · Motion & graphics with Skia and Reanimated

**Notes:** `/courses/scalable-mobile-and-web-apps/motion-and-graphics` on the course website · **Time:** 30 min ·
**Workspace changes:** none (reading guide and kata)

## Goal

Learners inspect where motion and drawing communicate state in the finished apps, without adding animation for its own sake.

## What happens

1. **Concept, about 6 min:** motion should explain state, not hide it.
2. **Mobile reading, about 9 min:** trace the seat map, journey timeline, ticket silhouette, travel scene and success mark.
3. **Dashboard reading, about 6 min:** review motion constants, error states and navigation.
4. **Kata, about 6 min:** complete the mobile or dashboard exercise.
5. **Checkpoint, about 3 min:** share one motion improvement and one Reduce Motion safeguard.

## Kata

Use `kata/mobile/motion-seat-map-kata.md` and `kata/dashboard/exercise.md`. The mobile kata asks for three places where motion communicates state and how to respect Reduce Motion. The dashboard kata asks for one risk and the smallest frontend-only improvement.

## Checkpoint

- 📱 Learners can name the real files that draw or animate state.
- 🖥️ Learners can explain where restrained dashboard motion could help.
- `yarn run check` passes.

## Common problems

- Do not treat motion as decoration. Tie every animation to feedback, location or state.
- Keep text and controls accessible even when the surrounding shape is custom-drawn.
- Respect Reduce Motion by preserving static state when animation is removed.

## Facilitator notes

- This is a reading extension; avoid opening new LIVE work.
- Pair a visual learner with someone who knows accessibility well.
- If time is short, focus on `seat-map.tsx` and `journey-timeline.tsx`.

**Next:** extension B looks at ticket barcodes and PDF export.
