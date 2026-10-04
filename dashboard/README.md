# RailPass Ops Dashboard

A polished staff operations dashboard for the RailPass training monorepo. It runs against the existing NestJS API at `http://localhost:3000/api` and demonstrates clear React data boundaries for new frontend engineers.

## Run locally

```bash
source ~/.local/share/railpass-node/env.sh
yarn --cache-folder .yarn-cache-dash install
cp .env.example .env
yarn dev
```

`.env.example` points to the local backend:

```env
VITE_API_URL=http://localhost:3000/api
```

To use a facilitator-hosted API, set `VITE_API_URL` to that API base URL, keeping the `/api` suffix if the facilitator uses the same backend prefix.

## Scripts

- `yarn lint` — oxlint
- `yarn typecheck` — TypeScript project build checks
- `yarn test` — Vitest + React Testing Library + jsdom
- `yarn build` — TypeScript check and Vite production build

## State management boundary

- **Redux Toolkit** owns client/session/UI state only: bearer token, signed-in user, colour-scheme preference, table density, and persisted booking search.
- **TanStack Query** owns server state: overview, journeys, stations, routes, bookings, passengers, add-ons, mutations, cache invalidation, and refetching.
- **Axios** is the single HTTP client. It injects the bearer token and logs out on `401`. The training API issues bearer tokens, so the dashboard persists the token in `localStorage`; production systems should prefer httpOnly cookies to reduce XSS exposure.

## Styling approach

Mantine provides accessible components and theming. Tailwind CSS v4 is installed through `@tailwindcss/vite` and imported as theme/utilities layers only; preflight stays disabled so Mantine's reset and component styles remain in control. Component styling lives in dedicated CSS Modules.

Design values are never hard-coded in components or CSS Modules. Source tokens live in `src/shared/constants/colors.ts`, `fonts.ts`, `typography.ts`, `spacing.ts`, `radii.ts`, `sizes.ts`, `motion.ts`, `breakpoints.ts`, `layout.ts`, `z-index.ts`, `query.ts`, and `domain.ts`. `src/styles/theme.ts` feeds those constants into Mantine (`colors`, `fontFamily`, `fontSizes`, `spacing`, `radius`, `breakpoints`, headings). `src/styles/tokens.css` mirrors the same constants as CSS custom properties (`--rp-*`) for CSS Modules; keep it in lock-step with the TS constants when changing tokens. CSS Modules must use those variables, Mantine variables, or tokenized Tailwind values rather than raw px/hex/font/shadow/breakpoint values. TSX styling props use token constants such as `iconSizes.md`, `componentSizes.tableWideMinWidth`, `fontWeights.extraBold`, `spacingKeys.md`, and `themeColorNames.rail`.

Design tokens from `../docs/design-tokens.md` are represented in those constants and CSS variables: Plus Jakarta Sans, soft green light theme, red-accented dark theme, inverse emphasis surfaces, high radii, and clear non-red destructive states.

## Dependencies added

- `@mantine/core`, `@mantine/hooks`, `@mantine/notifications`, `@mantine/form` — UI components, hooks, notifications, and teachable form handling.
- `@reduxjs/toolkit`, `react-redux` — local/session/UI state.
- `@tanstack/react-query` — server state, caching, mutations, invalidation.
- `axios` — configured API client with auth interceptors and API error parsing.
- `react-router` — dashboard routing and guarded staff pages.
- `@tabler/icons-react` — Mantine-recommended icon set for nav, statuses, and actions.
- `tailwindcss`, `@tailwindcss/vite` — utility layer used from dedicated CSS Modules.
- `postcss`, `postcss-preset-mantine`, `postcss-simple-vars` — Mantine Vite/PostCSS integration.
- `vitest`, `jsdom`, `@testing-library/*` — unit and component tests.

## Folder structure

```text
src/
  app/
    providers.tsx     Mantine, TanStack Query, Redux, router
    router.tsx        route table; every route module is lazy-loaded
    store.ts          combines feature slices; persists auth + preferences
    query-client.ts   global query defaults
    hooks.ts          typed Redux hooks
    layouts/          dashboard-layout (guarded staff shell)
    routes/           thin route modules: read URL params, render a feature view
  features/<area>/    auth, bookings, journeys, network, overview, passengers, preferences
    api/              <area>-api.ts (HTTP), <area>-keys.ts (cache keys), <area>-queries.ts (hooks)
    components/       views and feature-only components
    types.ts          DTOs owned by the feature
  shared/
    api/              axios client, error parsing
    ui/               domain-independent UI (DataTable, PageHeader, Empty/ErrorState)
    hooks/            generic hooks (debounce, notifications)
    lib/              formatting helpers
    config/           validated environment settings
    constants/        design tokens and app constants
    types/            shared contracts (pagination)
  styles/             theme.ts, tokens.css, global.css, Tailwind v4 layer
  testing/            Vitest setup and Mantine-aware render helpers
```

Dependency direction: `app` → `features` → `shared`. Features may import another feature's `types.ts`, `*-keys.ts`, or display components, never its internals; `shared` never imports `app` or `features`.

## Known limitations and API notes

- Payments are simulated; all revenue labels say simulated revenue where shown.
- The API exposes route fare editing through the Routes endpoint, so Extras & fares shows route fares and links the editing responsibility to Stations & Routes.
- Booking detail barcodes are returned by the API but intentionally ignored in the dashboard because staff workflows here revolve around status and passenger support.
- The backend uses bearer tokens rather than httpOnly cookie sessions; see the state-management note above.
