# RailPass passenger app (Expo)

The passenger app reproduces the supplied booking, seat-selection and ticket designs, with a red accent in dark mode.

## Run

```bash
yarn install
yarn start            # i = iOS simulator, a = Android emulator, or scan the QR code with Expo Go (SDK 57)
```

The API URL is resolved in this order (`config/app-config.ts`):

1. _Profile → Developer settings_ override (development only, saved on the device);
2. `EXPO_PUBLIC_API_URL` in `mobile/.env` (copy `.env.example`);
3. in development, `http://<machine running Metro>:3000/api` — works for simulators and phones on the same Wi-Fi.

| Script           | Purpose                                                                                             |
| ---------------- | --------------------------------------------------------------------------------------------------- |
| `yarn start`     | Metro + Expo dev tools                                                                              |
| `yarn prebuild`  | Regenerate the git-ignored `ios/` and `android/` projects from `app.json` (`expo prebuild --clean`) |
| `yarn lint`      | ESLint (`expo lint`, `eslint-config-expo`); wrong import order is an error, `yarn lint --fix` sorts |
| `yarn format`    | Prettier (config in the repo root `.prettierrc.json`)                                               |
| `yarn typecheck` | `tsc --noEmit`                                                                                      |
| `yarn test`      | Jest (`jest-expo`) + React Native Testing Library                                                   |

## Folder structure

| Directory                | Purpose                                                                                                                                                                                                                               |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/`                   | Expo Router routes. Each route file is the screen itself (default export). Route groups: `(app)` (signed in, contains `(tabs)`), `(auth)`, and `onboarding`. `Stack.Protected` in `app/_layout.tsx` decides which group is reachable. |
| `features/<name>/`       | Components and helpers used only by that feature's screens (seat map, journey card, ticket card, ticket PDF…). No sub-folders.                                                                                                        |
| `components/atomic`      | Primitives everything else is built from: `AppText`, `Icon`. See "Atomic or UI?" below.                                                                                                                                               |
| `components/ui/buttons`  | `Button`, `IconButton`.                                                                                                                                                                                                               |
| `components/ui/inputs`   | Controls that take user input: `TextField`, `SegmentedTabs`, `Stepper`.                                                                                                                                                               |
| `components/ui/feedback` | Messages about state: `InlineAlert`, `EmptyState`, `ErrorState`.                                                                                                                                                                      |
| `components/ui/loaders`  | Loading placeholders: `Skeleton`.                                                                                                                                                                                                     |
| `components/ui/display`  | Read-only presentation of data: `Avatar`, `StatusChip`, `JourneyTimeline`.                                                                                                                                                            |
| `components/layout`      | Screen scaffold, header bar, Android tab bar.                                                                                                                                                                                         |
| `components/theme`       | Theme provider (`useTheme`) and colour tokens.                                                                                                                                                                                        |
| `constants/`             | **Every design value**: colours, fonts, typography, spacing, radii, sizes, borders, opacity, motion, layout, Skia drawing geometry, illustration palette, small UI constants.                                                         |
| `config/`                | Runtime configuration (API URL, refresh intervals, validation rules).                                                                                                                                                                 |
| `api/`                   | Axios client + interceptors, typed endpoint functions, `ApiError`.                                                                                                                                                                    |
| `store/`                 | Zustand stores: session, preferences, booking draft.                                                                                                                                                                                  |
| `hooks/`                 | All hooks: `useApiQuery`, `useAsyncAction`, `useForm`, `useJourneySearch`, `useTripUpdates`.                                                                                                                                          |
| `libs/`                  | Pure utilities (formatting, dates, seat layout, secure storage adapter).                                                                                                                                                              |
| `plugins/`               | Expo config plugin allowing HTTP to a LAN training API in development builds.                                                                                                                                                         |
| `assets/`                | Fonts (Plus Jakarta Sans, OFL) and app icons.                                                                                                                                                                                         |
| `__tests__/`             | Unit and component tests.                                                                                                                                                                                                             |

## Conventions

- **No hard-coded design values.** Spacing, sizes, radii, colours, typography, opacity, durations and drawing
  geometry come from `constants/`. Colours that change with the theme come from `useTheme().colors`.
- Files and folders in kebab-case; components in PascalCase; hooks `useSomething` in `use-something.ts`.
- Imports grouped with blank lines: external → components/features → hooks → app utilities/stores/api → relative → constants → types.
- Component body order: hooks → derived state → handlers → effects → render.
- Screens live in `app/` route files; their feature-specific components live in `features/<name>/`; every hook lives in `hooks/`. A component moves to `components/` only when a second feature needs it.

### Atomic or UI?

A component belongs in `components/atomic` only when **all** of these are true:

1. It renders a single primitive (one `Text`, one icon glyph, one shape) styled with design tokens.
2. It imports no other component from `components/` (the theme hook is fine).
3. It has no behaviour: no `onPress`, no state, no animation, no data loading.
4. It knows nothing about RailPass: no API types, no booking/journey/station vocabulary.

Anything that combines atoms or adds behaviour goes in `components/ui/<category>`:

| Category   | Put it here when it…                                     | Examples                                                           |
| ---------- | -------------------------------------------------------- | ------------------------------------------------------------------ |
| `buttons`  | performs an action when pressed                          | `Button`, `IconButton`                                             |
| `inputs`   | lets the user enter or choose a value                    | `TextField`, `SegmentedTabs`, `Stepper`                            |
| `feedback` | tells the user about success, errors or empty results    | `InlineAlert`, `EmptyState`, `ErrorState`                          |
| `loaders`  | stands in for content that is loading                    | `Skeleton`                                                         |
| `display`  | presents data without editing it                         | `Avatar`, `StatusChip`, `JourneyTimeline`                          |
| `cards`    | is a generic card surface shared by two or more features | none yet (feature cards such as `JourneyCard` stay in `features/`) |

Create a new category folder only when a component fits none of the above. Domain helpers that used to sit
next to a component (for example `addOnIcon`) go to the feature that needs them, not to `atomic`.

## Dependencies and why

| Package                                                                                                                                                                      | Why                                                                                              |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `expo`, `expo-router`, `react-native-screens`, `react-native-safe-area-context`, `expo-linking`, `expo-constants`, `expo-status-bar`, `expo-splash-screen`, `expo-system-ui` | Required stack and Expo Router's own requirements                                                |
| `axios`, `zustand`                                                                                                                                                           | Required stack: HTTP client with interceptors; small global stores                               |
| `@shopify/react-native-skia`                                                                                                                                                 | Required: seat map, timeline, ticket shape, barcode, illustrations, animations                   |
| `react-native-reanimated` (+ `react-native-worklets`)                                                                                                                        | Skia 2 animates through Reanimated shared values on the UI thread; also gives `useReducedMotion` |
| `expo-secure-store`                                                                                                                                                          | Keychain/keystore storage for the session and preferences (works in Expo Go)                     |
| `expo-print`, `expo-sharing`                                                                                                                                                 | Render the ticket PDF on device and open the share sheet (Save to Files, email, print)           |
| `expo-font`, `@expo/vector-icons`                                                                                                                                            | Brand typeface; icon set already bundled with Expo                                               |
| Dev: `jest`, `jest-expo`, `@testing-library/react-native`                                                                                                                    | Unit and component tests                                                                         |

Not added on purpose: a barcode library (the API sends a PDF417 matrix), a date library (GMT network, small
formatters), a form library (one small `useForm`), React Query (see `docs/architecture.md`).

## Screens

| Route                                                         | Screen                                                                            | Reference                           |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------- | ----------------------------------- |
| `/onboarding`                                                 | Three-step illustrated introduction                                               | Adapted from the auth illustrations |
| `/sign-in`, `/sign-up`, `/forgot-password`, `/reset-password` | Auth flow                                                                         | Illustrated auth sheet              |
| `/` (tab)                                                     | Book Tickets: one-way, round trip, archive, route card, date strip, journey cards | Light sheet, left phone             |
| `/journeys/[id]`                                              | Choose a Seat: class cards, car pills, seat map, extras, passengers, price bar    | Light sheet, right phone            |
| `/return-journeys`                                            | Choose the return journey (round trip)                                            | New, same language                  |
| `/checkout`                                                   | Review & simulated payment (server quote)                                         | New                                 |
| `/booking-confirmed/[id]`                                     | Animated confirmation                                                             | New                                 |
| `/tickets` (tab), `/tickets/[id]`                             | Trips list; ticket with notches, barcode, PDF                                     | Light sheet, middle phone           |
| `/stations` (tab), `/stations/[id]`                           | Station list; destinations and departures board                                   | New                                 |
| `/profile` (tab), `/edit-profile`, `/change-password`         | Profile, theme, developer settings                                                | New                                 |
| `/updates`                                                    | Delays and cancellations for your trips                                           | New (bell icon)                     |
| `/station-picker`                                             | Station search with city photo cards                                              | New                                 |
