# RailPass — travel-ticket booking system for frontend training

RailPass is a complete, working train-travel booking system built to support an interactive frontend
course for new employees. It has three applications that share one API and one design language:

| App | Path | Stack | Who uses it |
| --- | --- | --- | --- |
| Passenger app | [`mobile/`](mobile/docs/README.md) | Expo SDK 57, React Native, TypeScript, Expo Router, Axios, Zustand, React Native Skia (+ Reanimated) | Passengers: search, choose seats, book, tickets |
| Operations dashboard | [`dashboard/`](dashboard/README.md) | React, Vite, TypeScript, Redux Toolkit, TanStack Query, Axios, Mantine, Tailwind CSS (via CSS Modules) | Staff: schedules, fares, capacity, bookings |
| API | [`backend/`](backend/README.md) | NestJS, TypeScript, Prisma, PostgreSQL in Docker, Mailpit (dev email) | Both apps |
| Course | [`training/`](training/README.md) | Slides (PPTX + PDF), lesson notes, exercises, solutions | Facilitators and learners |

Design references were reproduced in the mobile app; the dark theme swaps the green/lime accent for red.
See [`docs/design-tokens.md`](docs/design-tokens.md) and [`docs/architecture.md`](docs/architecture.md).

---

## 1. Prerequisites

| Tool | Version | Notes |
| --- | --- | --- |
| Node.js | **22.22.3+ (22 LTS) or 24.15+** | NestJS 12 tooling refuses older 22.x releases. `.nvmrc` pins 24. |
| Yarn | 1.22.x (classic) | Every app uses Yarn; there is one `yarn.lock` per app. |
| Docker Desktop | 4.x | Runs PostgreSQL and Mailpit. |
| Expo Go | SDK 57 | On a phone, or installed automatically into the iOS Simulator / Android emulator. |
| Xcode / Android Studio | optional | Only for simulators/emulators or native development builds. |

## 2. Quick start (≈10 minutes)

```bash
# Clone into ~/RailPass so the course's `lesson` alias works as written
git clone https://github.com/EbenJesusSaves/training-mobile-and-web.git ~/RailPass && cd ~/RailPass

# 0. From the repository root: install the Git hooks (Husky) and start the database + mail catcher
yarn install
docker compose up -d                 # PostgreSQL on :5433 (persistent volume), Mailpit on :8025/:1025

# 1. API
cd backend
cp .env.example .env                 # then set JWT_SECRET to a long random value: openssl rand -hex 32
yarn install                         # also generates the Prisma client
yarn db:deploy                       # apply migrations
yarn db:seed                         # realistic network + demo accounts (only runs on an empty database)
yarn start:dev                       # http://localhost:3000/api  ·  docs: http://localhost:3000/api/docs

# 2. Dashboard (new terminal)
cd dashboard
cp .env.example .env
yarn install
yarn dev                             # http://localhost:5173

# 3. Mobile app (new terminal)
cd mobile
yarn install
yarn start                           # press i (iOS simulator), a (Android emulator) or scan the QR code with Expo Go
```

The mobile app finds the API automatically in development: it uses the IP of the machine running Metro,
so a phone on the same Wi-Fi works without configuration. See [§5](#5-connecting-learners-to-a-facilitator-hosted-api).

### Demo accounts

| Role | Email | Password | Notes |
| --- | --- | --- | --- |
| Passenger | `ama@railpass.dev` | `Passenger#2026` | Has upcoming one-way and round-trip bookings, a past trip and a cancelled trip |
| Passenger | `kwame@railpass.dev` | `Passenger#2026` | Fresh account for walking through a first booking |
| Staff | `staff@railpass.dev` | `Staff#2026` | Dashboard access |
| Staff | `ops@railpass.dev` | `Staff#2026` | Second staff account |

Passengers cannot use the dashboard and staff accounts cannot sign in to the passenger app.

### URLs and ports

| What | URL |
| --- | --- |
| API | http://localhost:3000/api (health: `/api/health`) |
| API docs (Swagger) | http://localhost:3000/api/docs |
| Dashboard | http://localhost:5173 |
| Mailpit inbox (password-reset emails) | http://localhost:8025 |
| PostgreSQL | `localhost:5433`, user `railpass`, database `railpass` |
| Metro (Expo) | http://localhost:8081 |

## 3. The end-to-end demo

1. **Dashboard** → sign in as staff → *Journeys* → *Create journey* → pick a route (e.g. Accra Central → Kumasi Central), times, fares and cars.
2. **Mobile** → sign in as Kwame → choose the same stations and date → the new journey appears → pick a class, car and seat → add extras → *Buy Ticket* → *Confirm & Pay* (simulated).
3. **Dashboard** → *Bookings* (search "Kwame") shows the booking; the journey's seat map shows the seat as taken.
4. **Mobile** → *Tickets* → open the ticket → *Download PDF*.
5. Optional: mark the journey *Delayed* in the dashboard, then pull to refresh on mobile: the bell shows a trip update.

## 4. Everyday commands

| Task | Backend | Dashboard | Mobile |
| --- | --- | --- | --- |
| Run | `yarn start:dev` | `yarn dev` | `yarn start` |
| Lint | `yarn lint` | `yarn lint` | `yarn lint` |
| Type-check | `yarn typecheck` | `yarn typecheck` | `yarn typecheck` |
| Unit tests | `yarn test` | `yarn test` | `yarn test` |
| E2E / integration | `yarn test:e2e` (uses a separate `railpass_test` database) | – | – |
| Build | `yarn build` | `yarn build` | – (use EAS or `npx expo run:ios`) |

`yarn check` at the repository root runs lint, type-check and tests for all three apps.

### Development reset operations (destructive)

| Command | What it does |
| --- | --- |
| `yarn --cwd backend db:reset` | **Deletes all data**, re-applies migrations and re-seeds. Use when the seeded dates are in the past or the data is messy after exercises. |
| `docker compose down` | Stops containers. Data is **kept** in the `railpass-postgres` volume. |
| `docker compose down -v` | **Deletes the database volume** as well. |

Seeded journeys run from 3 days ago to 21 days ahead of the day you seed. Staff can extend the timetable
from the dashboard (*Create journey → Repeat for N days*), or you can run `db:reset`.

## 5. Connecting learners to a facilitator-hosted API

Run the API, PostgreSQL and Mailpit on the facilitator's laptop; learners run only the frontends.

1. Facilitator: `docker compose up -d` and `yarn --cwd backend start:dev`. The API listens on all interfaces (`0.0.0.0:3000`).
   Find the laptop's LAN IP (`ipconfig getifaddr en0` on macOS) and check `http://<ip>:3000/api/health` from another device.
   Allow incoming connections on port 3000 in the OS firewall if prompted.
2. Add each learner's dashboard origin to `CORS_ORIGINS` in `backend/.env` (e.g. `http://localhost:5173`, which is already there, works for learners running the dashboard locally).
3. Learners:
   - **Dashboard**: set `VITE_API_URL=http://<facilitator-ip>:3000/api` in `dashboard/.env`.
   - **Mobile (Expo Go on a phone)**: set `EXPO_PUBLIC_API_URL=http://<facilitator-ip>:3000/api` in `mobile/.env` and restart `yarn start`,
     *or* open *Profile → Developer settings*, enter the URL and tap *Test & save* (development builds only).
   - **Android emulator** talking to an API on the same computer: `http://10.0.2.2:3000/api`.
   - **iOS simulator** on the same computer: `http://localhost:3000/api`.
4. Password-reset codes appear in Mailpit on the facilitator's machine (`http://<facilitator-ip>:8025`) and in the API log.

Phones and laptops must be on the same network, and guest Wi-Fi with "client isolation" will block them.
Expo Go allows plain HTTP to LAN addresses; development builds use the config plugin in `mobile/plugins/` for the same.

## 6. Repository layout

```
.
├── backend/            NestJS API, Prisma schema/migrations/seed, e2e tests
├── dashboard/          Vite + React operations dashboard
├── mobile/             Expo passenger app (app/, features/, components/, constants/, …)
├── training/           Course: slides, lesson notes, exercises, solutions
├── docs/               Architecture decisions and shared design tokens
├── scripts/            Repository-wide helper scripts
├── .husky/             Git hooks (pre-commit checks, commit-message convention)
└── docker-compose.yml  PostgreSQL + Mailpit for development
```

## 7. Git workflow

Adapted from the team guide: branches `feature/…`, `bugfix/…`, `hotfix/…`, `release/…` in kebab-case, PRs into `develop`,
commit messages in the form `type(scope): description` (`feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `build`, `ci`, `revert`).

Husky installs two hooks when you run `yarn install` at the root:
- **pre-commit** lints and type-checks only the apps touched by the commit;
- **commit-msg** rejects messages that don't follow the convention.

## 8. Further reading

- [`docs/architecture.md`](docs/architecture.md) — data model, API design, important decisions and deviations from the reference guide
- [`docs/design-tokens.md`](docs/design-tokens.md) — colours (light + red dark theme), typography, spacing
- [`docs/verification.md`](docs/verification.md) — what was tested, on which platforms, and known limitations
- [`mobile/docs/README.md`](mobile/docs/README.md), [`dashboard/README.md`](dashboard/README.md), [`backend/README.md`](backend/README.md)
