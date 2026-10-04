# 04 · Choosing libraries deliberately

**Notes:** `/courses/scalable-mobile-and-web-apps/choosing-libraries` on the course website · **Time:** 15 min ·
**Workspace changes:** `lesson start 04` adds 2 mobile files and a workspace decision-record template (LIVE 04.1, 04.9)

## Goal

Choose libraries as long-term dependencies, wrap risky APIs behind app-owned seams, and write down the decision.

## What happens

1. **Library checklist (about 3 min):** maintenance, size, platform support, licence and escape hatch.
2. **Mobile wrappers (about 4 min):** SecureStore adapter and Lottie colour helper. Dependencies were already installed in lesson 01.
3. **Mobile LIVE task (about 3 min):** LIVE 04.1 implements the SecureStore `StateStorage` adapter.
4. **Workspace LIVE task (about 3 min):** LIVE 04.9 fills an ADR for one library choice.
5. **Checkpoint and compare (about 2 min):** typecheck, status and diff.

## LIVE tasks

| Task | App | File | What you write |
| --- | --- | --- | --- |
| LIVE 04.1 | 📱 mobile | `mobile/libs/secure-storage.ts` | Import `expo-secure-store` and implement `getItem`, `setItem` and `removeItem` for Zustand persistence. |
| LIVE 04.9 | workspace | `docs/decisions/0004-our-library-choice.md` | Fill the ADR title, status, applies-to line, context, options, chosen library, why, trade-offs and when to choose differently. |

For LIVE 04.9, the solution records `expo-secure-store` over MMKV/AsyncStorage for small persisted credentials in Expo Go. Done looks like a teammate can explain the trade-off without hearing the class discussion.

## Checkpoint

- 📱 Mobile has a `secureStorage` adapter ready for lesson 09 persistence; no visible screen changes yet.
- 🖥️ Dashboard has no new files in this lesson; it participates in the library-role discussion.
- `yarn run check` passes.

## Common problems

- **Trying to install packages now:** do not. `expo-secure-store`, Axios, Zustand and Lottie were installed in lesson 01.
- **Putting JSON logic in `secure-storage.ts`:** keep the adapter string-based; Zustand handles JSON later.
- **Saying `libs/lottie.ts` wraps `LottieView`:** it does not. It centralises colour swapping; screens import `LottieView` directly.

## Facilitator notes

- Keep the ADR lightweight. The point is decision shape, not a perfect essay.
- Compare SecureStore, AsyncStorage and MMKV against Expo Go constraints.
- If time is tight, fill the ADR as a group and let pairs improve wording after the checkpoint.

**Next:** lesson 05 gives the UI named tokens and themes.
