# Architecture — my RailPass

> Course file, added in lesson 02. It's the first thing a new teammate should read, so keep it true as the apps grow.

## The system

```
 we build this side                                  provided (a contract)
┌─────────────────────────┐
│ mobile/  (passengers)   │ ──┐
│ Expo · React Native     │   │   HTTPS + JSON    ┌──────────────────────────┐
└─────────────────────────┘   ├─────────────────▶ │ RailPass API  /api/*      │
┌─────────────────────────┐   │                   │ Swagger: /api/docs        │
│ dashboard/  (staff)     │ ──┘                   │ errors: { statusCode,     │
│ Vite · React            │                       │   code, message, details }│
└─────────────────────────┘                       └──────────────────────────┘
```

Two apps, one API. We never change the API: we read its documentation and code against its promises.

## Layers

Both apps have the same layers. Only the folder names differ.

| Layer | What it owns | 📱 `mobile/` | 🖥️ `dashboard/src/` |
| --- | --- | --- | --- |
| Routes | URLs, screens and pages, layouts, guards | `app/` (Expo Router: the file tree *is* the route table) | `app/router.tsx`, `app/routes/`, `app/layouts/` |
| Features | One product area each: its components (dashboard: also its API calls, queries and slice) | `features/<name>/` | `features/<name>/` |
| Shared UI | Components that know nothing about the product | `components/` (`atomic/`, `ui/`, `layout/`, `theme/`) | `shared/ui/` |
| Logic | Pure functions and reusable hooks | `libs/`, `hooks/` | `shared/lib/`, `shared/hooks/` |
| Client state | What the app remembers that the server doesn't know | `store/` (Zustand) | `app/store.ts` + `features/*/*-slice.ts` (Redux Toolkit) |
| Data access | The HTTP client, one module per API resource, server-state caching | `api/` + `hooks/use-api-query.ts` | `shared/api/` + `features/*/api/` (TanStack Query) |
| Configuration | Environment, tunable values, design tokens | `config/`, `constants/` | `shared/config/`, `shared/constants/`, `styles/` |

## Which way imports go

Imports flow **down** this list, never up. A layer may import from the layers below it, never from the ones above.

```
📱 mobile                                   🖥️ dashboard
app/            routes and screens          main.tsx → app/   router, routes, layouts, providers, store
  ↓                                           ↓
features/<x>/   product areas               features/<x>/     product areas
  ↓                                           ↓
components/     shared UI                   shared/ui/        shared UI
hooks/          glue hooks                  shared/hooks/     shared hooks
  ↓                                           ↓
api/            HTTP client + resources     shared/api/       HTTP client + error normalising
  ↓                                           ↓
store/          Zustand stores              shared/lib/       pure helpers
libs/           helpers, storage wrapper      ↓
  ↓                                         shared/config/, shared/constants/, styles/
config/, constants/                         (import nothing from the app)
(import nothing from the app)
```

Two shortcuts are allowed everywhere because they carry no behaviour: **types** from the API contract
(`mobile/api/types.ts`, `dashboard/src/features/*/types.ts`) and **constants** (design tokens and fixed values).

### The rules

| Folder | May import | Must not import |
| --- | --- | --- |
| 📱 `app/` | anything below | — (nothing imports routes) |
| 📱 `features/<name>/` | `components/`, `hooks/`, `api/`, `libs/`, `constants/`, `config/` | `app/`; another feature; `store/` (in RailPass the screens in `app/` read the stores and pass values down as props) |
| 📱 `components/` | `constants/`, `libs/`, `config/`, API types; `components/theme` reads the preferences store | `features/`, `app/` |
| 📱 `hooks/` | `api/`, `libs/`, `config/` | `features/`, `app/`, `components/` |
| 📱 `api/` | `config/`; `store/` (the client reads the token and the developer API URL) | `features/`, `app/`, `components/`, `hooks/` |
| 📱 `store/`, `libs/` | `libs/`, `config/`, API types | `api/` modules (types only), anything above |
| 🖥️ `app/` | `features/`, `shared/`, `styles/` | — |
| 🖥️ `features/<name>/` | `shared/`, the typed hooks in `app/hooks.ts`, and another feature's **public pieces**: its `types.ts`, query keys and hooks, slice actions, small display components such as status badges | another feature's views (`*-view.tsx`) or private helpers; `app/routes/`, `app/layouts/` |
| 🖥️ `shared/` | other `shared/` folders (`shared/api` → `shared/config`, `shared/hooks` → `shared/api`), libraries | `features/`, `app/` (shared code knows nothing about the product) |

## How to place a new file

1. Does it define a URL, a screen or a page? → **Routes**. Keep it thin: it composes features.
2. Does it belong to one product area (booking, tickets, journeys…)? → **that feature's folder**.
3. Would a second feature use it unchanged, and does it know nothing about the product? → **shared UI or logic**.
   Move code to shared when the *second* real use appears, not before.
4. Does it talk to the API? → **data access** (`api/` on mobile, the feature's `api/` folder on the dashboard).
5. Is it a value someone might tune or a design decision? → **configuration** or **constants**.

Not sure? Put it in the feature. Moving it to shared later is a small, safe change; untangling a shared folder
full of product code isn't.

## Changing these rules

Rules change when the app teaches you something. When they do, change this file in the same pull request and
write a decision record (lesson 04) explaining why.
