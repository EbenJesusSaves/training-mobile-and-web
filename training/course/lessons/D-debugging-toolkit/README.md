# D · Debugging toolkit

**Notes:** `/courses/scalable-mobile-and-web-apps/debugging-toolkit` on the course website · **Time:** 20 min ·
**Workspace changes:** none (reading guide and kata)

## Goal

Learners practise a repeatable debugging method across mobile and dashboard: reproduce, isolate, hypothesise and verify.

## What happens

1. **Method, about 4 min:** write the symptom before changing code.
2. **Mobile drill, about 5 min:** debug a phone sign-in failure with Expo, network and storage checks.
3. **Dashboard drill, about 5 min:** debug stale data through query keys, API errors and tests.
4. **Kata, about 4 min:** write the first checks for one symptom.
5. **Checkpoint, about 2 min:** share the smallest verified fix.

## Kata

Use `kata/mobile/debugging-toolkit-kata.md` and `kata/dashboard/exercise.md`. The mobile kata asks for the first checks when a physical phone cannot sign in but the simulator can.

## Checkpoint

- 📱 Learners can check API URL, LAN reachability, Wi-Fi, `/api/health`, normalized errors and persisted session state.
- 🖥️ Learners can inspect query keys, parsed API errors and a focused test.
- `yarn run check` passes.

## Common problems

- Do not guess before reproducing. Capture the exact screen, request or log.
- Phones cannot use `localhost` for the facilitator API.
- Clear persisted state only after you know what it proves.

## Facilitator notes

- Pull this extension forward if setup or networking problems dominate the room.
- Keep fixes small and reversible.
- Ask learners to state what evidence would disprove their hypothesis.

**Next:** return to the course notes or use the katas for deeper practice.
