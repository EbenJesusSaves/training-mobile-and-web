# Lesson 05 · Design tokens & theming — 📱 Mobile

> You replace raw design values with RailPass tokens and make the temporary theme provider follow the system light/dark setting. The playground now shows the product palette, type and spacing in one place.

## What arrives

| File | Status | Why it's here |
| --- | --- | --- |
| `mobile/constants/borders.ts`, `mobile/constants/radii.ts`, `mobile/constants/spacing.ts`, `mobile/constants/sizes.ts` | RailPass | Reusable measurements for borders, corners, gaps and component sizes. |
| `mobile/constants/colors.ts`, `mobile/constants/fonts.ts`, `mobile/constants/typography.ts`, `mobile/constants/opacity.ts`, `mobile/constants/motion.ts` | RailPass | Colour, font, text, opacity and interaction scales. |
| `mobile/constants/drawing.ts`, `mobile/constants/illustration.ts`, `mobile/constants/layout.ts`, `mobile/constants/ui.ts`, `mobile/constants/index.ts` | RailPass | Geometry, illustration, layout, behaviour constants and barrel exports. |
| `mobile/components/theme/tokens.ts` | RailPass | Builds `AppTheme` objects from the token palette. |
| `mobile/components/theme/theme-provider.tsx` | course version, LIVE 05.1 → RailPass in 09 | Starts with a hard-coded `'light'`; LIVE 05.1 uses `useColorScheme()` until preferences arrive in lesson 09. |
| `mobile/components/atomic/app-text.tsx`, `mobile/components/atomic/icon.tsx`, `mobile/components/layout/screen.tsx` | RailPass | Shared primitives used by the token playground and lesson 06 components. |
| `mobile/app/_layout.tsx` | course version → RailPass in 09 | Loads fonts, hides the splash screen and wraps the stack in `ThemeProvider`. |
| `mobile/app/index.tsx` | course-only (removed in 07) | Token showcase. LIVE 05.2 replaces raw style numbers with tokens. |

## Talk through (together)

1. **`mobile/constants/colors.ts`: semantic colour.** Ask: why use `colors.accent` instead of a hex value? Answer: light/dark palettes and future brand changes stay token-level.
2. **`mobile/components/theme/theme-provider.tsx`: one scheme decision.** Ask: what is wrong with each component calling `useColorScheme()`? Answer: preferences, forced scopes and tests would disagree.
3. **`mobile/components/atomic/app-text.tsx`: typography wrapper.** Ask: why not raw `Text` everywhere? Answer: variants, tones and font families stay consistent.
4. **`mobile/app/index.tsx`: allowed numbers.** Ask: which numbers can remain? Answer: one-off geometry such as a swatch's width/height can stay; reusable spacing, radii and borders should be tokens.

## Live tasks

### LIVE 05.1 — Choose the system color scheme (`mobile/components/theme/theme-provider.tsx`)

**Why:** the provider is the single place that turns a device setting into a RailPass theme.

1. Rename `_systemScheme` to `systemScheme` so the value is used.
2. Replace `const scheme: ColorScheme = 'light';` with `const scheme: ColorScheme = systemScheme === 'dark' ? 'dark' : 'light';`.
3. Keep `const theme = useMemo(() => createTheme(scheme), [scheme]);`.
4. Leave `ThemeScope` alone; it is the forced-theme escape hatch.

**Hint:** `useColorScheme()` can return `null`, so only the exact value `'dark'` should select dark mode.

**Done when:** changing the simulator or phone appearance changes the showcase colours.

### LIVE 05.2 — Use tokens in the showcase (`mobile/app/index.tsx`)

**Why:** the course playground should model the design-system habit before real components arrive.

1. Import `borderWidths` from `@/constants/borders`, `radii` from `@/constants/radii` and `spacing` from `@/constants/spacing`.
2. Replace `stack: { gap: 24 }` with `stack: { gap: spacing.lg }`.
3. Replace `swatches: { flexDirection: 'row', gap: 8 }` with `gap: spacing.sm`.
4. Replace the swatch `borderRadius: 16` with `radii.lg`.
5. Replace `borderWidth: 1` with `borderWidths.hairline`.
6. Leave `height: 56` and `width: 56`; those are local swatch geometry.

**Hint:** if a value has a name in `constants/`, use the name. If it only sizes this demo shape, it can stay local.

**Done when:** the token showcase renders in light and dark themes, and `yarn --cwd mobile typecheck` passes.

## Checkpoint

The device shows **RailPass tokens**, custom fonts, semantic swatches and system-aware light/dark colours.

Commands: `lesson status 05` shows no open mobile tasks, and `yarn run check` passes from the workspace root.

## Removed / replaced in this lesson

`lesson start 05` overwrites the lesson 01 course versions of `mobile/app/_layout.tsx` and `mobile/app/index.tsx`. Nothing is deleted.
