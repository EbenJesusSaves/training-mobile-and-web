# Conventions — my RailPass

> Course file, added in lesson 03. These are the team's agreements. The linters enforce some of them; reviews catch the rest.
> When a rule stops helping, change it here in a pull request, not by quietly breaking it.

## Files and folders

- **kebab-case** for every file and folder: `seat-map.tsx`, `use-api-query.ts`, `booking-draft-store.ts`.
  Expo Router's special names are the exception: `_layout.tsx`, `[id].tsx`, `(tabs)/`.
- One main export per file, named after the file: `seat-map.tsx` exports `SeatMap`.
- A **suffix** says what a file *is* before you open it:

| Suffix | Contains | Example |
| --- | --- | --- |
| `-api.ts` | One API resource's HTTP calls | `mobile/api/travel-api.ts`, `dashboard/src/features/journeys/api/journeys-api.ts` |
| `-keys.ts` | TanStack Query key factory (dashboard) | `dashboard/src/features/bookings/api/booking-keys.ts` |
| `-queries.ts` | Query and mutation hooks (dashboard) | `dashboard/src/features/journeys/api/journey-queries.ts` |
| `-slice.ts` | Redux Toolkit slice (dashboard) | `dashboard/src/features/auth/auth-slice.ts` |
| `-store.ts` | Zustand store (mobile) | `mobile/store/session-store.ts` |
| `-view.tsx` | A feature's page-level component (dashboard) | `dashboard/src/features/passengers/components/passengers-view.tsx` |
| `-route.tsx` | A lazy route module that exports `Component` (dashboard) | `dashboard/src/app/routes/passengers-route.tsx` |
| `use-*.ts` | A hook | `mobile/hooks/use-form.ts` |
| `.module.css` | CSS Module next to its component | `dashboard/src/features/journeys/components/journeys-view.module.css` |
| `.test.ts(x)` | Tests (next to the code on the dashboard, in `__tests__/` on mobile) | `dashboard/src/shared/lib/format.test.ts` |

## Names in code

| Thing | Rule | ✅ | ❌ |
| --- | --- | --- | --- |
| Components | PascalCase noun | `JourneyCard`, `PageHeader` | `journeyCard`, `RenderJourney` |
| Hooks | `use` + what it gives you | `useJourneySearch`, `useDebouncedValue` | `journeySearchHook`, `useData` |
| Booleans | a yes/no question: `is`, `has`, `can`, `should` | `isSelected`, `hasHydrated`, `isTaken` | `selected`, `flag`, `status2` |
| Event props | `on` + what happened | `onPress`, `onChange`, `onSuccess` | `pressHandler`, `doChange` |
| Handlers | a verb for what they do | `openBooking`, `saveStatus`, `confirmCancel` | `click`, `handler1`, `doStuff` |
| Types | PascalCase, no `I` prefix | `Journey`, `JourneyDto`, `BookingStatus` | `IJourney`, `journeyType` |
| Grouped values | camelCase object, `as const` | `appConfig.seatRefreshMs`, `queryTimings.debounceMs` | `SEAT_REFRESH`, `20000` |

`handleX` is fine for a thin wrapper around a library callback (`handleSubmit = form.onSubmit(...)`), but a name that
says what happens (`saveStatus`) reads better at the call site: `onClick={saveStatus}`.

API data types follow the app: mobile uses the domain name (`Journey` in `mobile/api/types.ts`), and the dashboard
marks API shapes with `Dto` (`JourneyDto` in `dashboard/src/features/journeys/types.ts`) so they're easy to tell apart
from view models.

## Imports

Imports are grouped and sorted by the linter, so nobody argues about them in review. Run the fixer instead of sorting by hand.

| 📱 mobile (`eslint.config.js`) | 🖥️ dashboard (`.oxlintrc.json`) |
| --- | --- |
| 1. side-effect imports | 1. packages (`react`, `@mantine/core`…) |
| 2. `react`, then packages | 2. relative imports (`../../shared/ui/page-header`) |
| 3. `@/components/…`, `@/features/…` | 3. CSS Modules (`./journeys-view.module.css`) |
| 4. `@/hooks/…` | 4. side-effect imports (`import './styles/global.css'`) |
| 5. other `@/…` (api, store, libs, config) | |
| 6. relative imports | |
| 7. `@/constants/…` | |
| 8. type-only imports | |
| Fix: `yarn --cwd mobile lint --fix` | Fix: `yarn --cwd dashboard lint --fix` |

Mobile imports use the `@/` alias (`@/libs/format`), so moving a file doesn't break its imports.
The dashboard uses relative imports.

## Component anatomy

Every component reads top to bottom in the same order, so you always know where to look:

```tsx
export function JourneyCard({ journey, onPress }: JourneyCardProps) {
  // 1. hooks: theme, stores, queries, local state
  const { colors } = useTheme();

  // 2. derived values: computed from props and state, never stored
  const isDelayed = journey.status === 'DELAYED';

  // 3. handlers: named for what they do
  const openJourney = () => onPress(journey.id);

  // 4. effects: last, and only for syncing with something outside React

  // 5. render
  return <Pressable onPress={openJourney}>…</Pressable>;
}
```

Keep components short. When one grows past a screenful, look for a sub-component or a hook to extract.

## Values: no magic numbers

A bare number or colour in a component is a decision nobody can find. Give every value a name and a home:

| Kind of value | Home | Example |
| --- | --- | --- |
| Design decisions (colour, spacing, radius, type, motion) | design tokens | `mobile/constants/spacing.ts`, `dashboard/src/styles/tokens.css` |
| Fixed facts about the domain | constants | `railDomain.seatsPerCompartment` in `dashboard/src/shared/constants/domain.ts` |
| Tunable behaviour (timeouts, refresh rates, limits) | configuration | `appConfig.seatRefreshMs` in `mobile/config/app-config.ts`, `queryTimings` in `dashboard/src/shared/constants/query.ts` |
| Environment (API address) | env file, read in one module | `EXPO_PUBLIC_API_URL` → `mobile/config/app-config.ts`, `VITE_API_URL` → `dashboard/src/shared/config/env.ts` |

`0`, `1` and `-1` in obvious arithmetic are fine. Everything else gets a name.

## Comments

Comment **why**, not what. The code already says what it does:

```ts
// ❌ Set the interval to 20 seconds
// ✅ Seat maps refresh while visible, so availability does not go stale.
seatRefreshMs: 20_000,
```

## Git

- Branches: `feature/seat-legend`, `bugfix/stale-seat-map`, `hotfix/…`, `release/…` (kebab-case).
- Commits: `type(scope): description`, for example `feat(booking): add seat legend`.
  Types: `feat fix docs style refactor perf test chore build ci revert`. The `commit-msg` hook rejects anything else.
- Before you push: `yarn run check` (lint, type-check and tests for both apps).

## Our team rules

Rules this team added. Keep each one short, with a ✅ / ❌ example and the reason.

### Named exports only

✅ `export function SeatMap() {…}` and `import { SeatMap } from '@/features/booking/seat-map';`
❌ `export default function () {…}` and `import Thing from '…/seat-map';`

Why: the name is the same at every import, so search and rename find every use. Default exports are only for
files a framework loads for us: Expo Router screens in `mobile/app/` must `export default`. Dashboard route
modules use a named `Component` export instead.
