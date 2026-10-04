# Lesson 05 · Design tokens & theming — 🖥️ Dashboard

## Goal
The setup panel becomes a themed Mantine playground with RailPass tokens and dark-mode support.

## What arrives
| Path | Status | Why |
|---|---|---|
| `src/styles/tokens.css` | RailPass with LIVE gap | CSS variable contract; LIVE 05.6 fixes the dark raised surface token. |
| `src/styles/theme.ts` | RailPass with LIVE gap | Mantine theme bridge; LIVE 05.5 maps the rail virtual color to `railRed` in dark mode. |
| `src/styles/global.css`, `src/styles/tailwind.css` | RailPass | Font loading, base styles, and Tailwind layers. |
| `src/shared/constants/*.ts` | RailPass | Colors, spacing, typography, layout, motion, query, domain, and z-index values. |
| `src/assets/fonts/*` | RailPass | Plus Jakarta Sans files used by global CSS and the theme. |
| `src/main.tsx` | RailPass | Hands rendering to app providers. |
| `src/app/providers.tsx` | course version → RailPass in 10 | Wraps Mantine and renders the playground until Router/Query arrive. |
| `src/app/course-playground.tsx` | course-only | Safe surface for token and component experiments. |

## Talk through
- **`tokens.css` — product contract.** Ask: why not put hex values in components? Answer: one token change updates the product safely.
- **`theme.ts` — Mantine bridge.** Ask: why feed tokens into Mantine? Answer: library components and custom CSS share the same palette.
- **`constants/layout.ts` — named measurements.** Ask: why use `layout.sidebarWidth`? Answer: names carry intent in reviews.

## LIVE 05.5 — dark rail accent
Why: theme-level brand choices scale better than per-component patches.
1. Open `src/styles/theme.ts`.
2. Find the `rail` virtual color definition.
3. Set the dark-mode color to `colors.railRed`.
4. Leave the light-mode value unchanged.
Hint: the marker is inside the color tuple.
Done when: dark mode uses the red rail accent; `yarn --cwd dashboard typecheck` passes.

## LIVE 05.6 — raised dark surfaces
Why: fixing a token keeps every card readable without editing card components.
1. Open `src/styles/tokens.css`.
2. In the dark color-scheme block, find `--rp-surface-raised`.
3. Compare it with `--rp-surface`.
4. Replace the white value with the dark raised surface value from the solution.
Hint: raised cards should remain dark, just slightly elevated.
Done when: playground cards are not white in dark mode; `lesson status 05` shows no open dashboard LIVE markers and `yarn --cwd dashboard typecheck` passes.

## Checkpoint
The browser shows a themed playground with RailPass font, spacing, colors, and color-scheme support; there are still no routes. Commands: `lesson status 05`, `yarn --cwd dashboard typecheck`, `yarn --cwd dashboard lint`, `yarn --cwd dashboard test`.
