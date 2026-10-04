# 05 · Design tokens & theming

**Notes:** `/courses/scalable-mobile-and-web-apps/design-tokens-and-theming` on the course website · **Time:** 20 min ·
**Workspace changes:** `lesson start 05` adds 21 mobile files and 26 dashboard files (LIVE 05.1–05.2, 05.5–05.6)

## Goal

Replace scattered design values with named tokens and make both apps respond to light and dark theme decisions.

## What happens

1. **Token tour (about 4 min):** colours, spacing, typography, radii, motion and fixed layout values.
2. **Mobile theme playground (about 5 min):** `ThemeProvider`, `useTheme`, `AppText`, `Screen` and the token showcase.
3. **Mobile LIVE tasks (about 4 min):** LIVE 05.1 reads system colour scheme; LIVE 05.2 replaces raw playground values with tokens.
4. **Dashboard LIVE tasks (about 4 min):** LIVE 05.5 fixes the dark rail virtual colour; LIVE 05.6 fixes dark raised surfaces.
5. **Checkpoint and compare (about 3 min):** switch themes, run checks and compare.

## LIVE tasks

| Task | App | File | What you write |
| --- | --- | --- | --- |
| LIVE 05.1 | 📱 mobile | `mobile/components/theme/theme-provider.tsx` | Use `useColorScheme()` to choose `'dark'` only when the system scheme is dark, otherwise `'light'`. |
| LIVE 05.2 | 📱 mobile | `mobile/app/index.tsx` | Import `spacing`, `radii` and `borderWidths`, then replace raw gaps, radius and border width in the showcase styles. |
| LIVE 05.5 | 🖥️ dashboard | `dashboard/src/styles/theme.ts` | Set the dark rail virtual colour to `railRed` while keeping light mode `railGreen`. |
| LIVE 05.6 | 🖥️ dashboard | `dashboard/src/styles/tokens.css` | Replace the white dark-mode `--rp-surface-raised` token with the dark raised surface value. |

## Checkpoint

- 📱 The mobile token showcase uses custom fonts and follows the device light/dark appearance.
- 🖥️ The dashboard playground uses RailPass tokens, Mantine theme values and readable dark raised cards.
- `yarn run check` passes.

## Common problems

- **The mobile theme stays light:** make sure `systemScheme` is used and the comparison is exactly `systemScheme === 'dark'`.
- **Raw values creep back in:** `height`/`width` for a local demo swatch are fine; reusable gaps, radii and borders should use tokens.
- **Dashboard dark cards are white:** check `--rp-surface-raised` inside the dark color-scheme block, not the light block.
- **Expo does not update after changing appearance:** reload the app if the simulator setting changed while the JS bundle was paused.

## Facilitator notes

- Show the same screen in light and dark mode before editing.
- Ask learners to classify a number before replacing it: token, config, domain constant or local geometry.
- Keep the dashboard and mobile accent story aligned: green in light, red in dark.

**Next:** lesson 06 turns tokens into reusable components and feature cards.
