# RailPass frontend training course

RailPass is a hands-on course for new frontend engineers joining the team. It teaches the real passenger app and operations dashboard in this monorepo, not a toy sample. Learners read production-shaped code, debug realistic failures, make small changes, and review each other’s work.

## Audience

New employees who know JavaScript/TypeScript and React basics and need to learn this codebase’s frontend conventions: Expo Router, React Native UI and accessibility, Skia/Reanimated, Zustand, Redux Toolkit, TanStack Query, Axios, Mantine, Tailwind via CSS Modules, design tokens, and the RailPass API contract.

## Course structure

The course is modular rather than fixed-length. Run the eight core lessons in sequence, then choose extensions based on the cohort.

| Module      | Lesson                                                    | Duration | Primary code                                                                                                                                                   |
| ----------- | --------------------------------------------------------- | -------: | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Core 1      | Project organisation, naming, imports, feature boundaries |   60 min | `mobile/app/_layout.tsx`, `mobile/app/(app)/(tabs)/index.tsx`, `dashboard/src/app/router.tsx`                                                                  |
| Core 2      | Components, design consistency, tokens, themes            |   75 min | `mobile/constants/colors.ts`, `mobile/components/theme/tokens.ts`, `dashboard/src/styles/tokens.css`                                                           |
| Core 3      | Navigation and complete user flows                        |   75 min | `mobile/app/(app)/_layout.tsx`, `mobile/app/(app)/station-picker.tsx`, `dashboard/src/features/auth/require-staff.tsx`                                         |
| Core 4      | State management decisions                                |   90 min | `mobile/store/booking-draft-store.ts`, `mobile/store/session-store.ts`, `dashboard/src/app/store.ts`, `dashboard/src/features/journeys/api/journey-queries.ts` |
| Core 5      | API consumption, forms, validation, failure handling      |   90 min | `mobile/api/client.ts`, `mobile/api/errors.ts`, `mobile/app/(app)/checkout.tsx`, `dashboard/src/shared/api/errors.ts`                                          |
| Core 6      | Performance, animation, list rendering, debugging         |   90 min | `mobile/features/booking/seat-map.tsx`, `mobile/hooks/use-api-query.ts`, `dashboard/src/shared/ui/data-table.tsx`                                              |
| Core 7      | Accessibility, testing, Git workflow, code review         |   75 min | `mobile/__tests__/status-chip.test.tsx`, `dashboard/src/features/bookings/components/booking-status-badge.test.tsx`, `.husky/pre-commit`                       |
| Core 8      | Extending apps without hard-to-maintain code              |   75 min | `mobile/hooks/use-journey-search.ts`, `dashboard/src/features/journeys/components/journeys-view.tsx`                                                           |
| Extension A | Ticketing, PDF417 and PDFs                                |   60 min | `mobile/features/tickets/barcode.tsx`, `mobile/features/tickets/ticket-pdf.ts`, `backend/src/bookings/barcode.ts`                                              |
| Extension B | Dashboard operations patterns                             |   60 min | `dashboard/src/features/journeys/components/journey-form.tsx`, `dashboard/src/features/bookings/components/bookings-view.tsx`                                  |
| Extension C | API contracts, concurrency, and end-to-end thinking       |   75 min | `backend/src/bookings/pricing.ts`, `backend/test/booking-flow.e2e-spec.ts`, `backend/prisma/schema.prisma`                                                     |

## Suggested schedules

### 1-day intensive

- 09:00–09:30 setup and product walkthrough
- 09:30–10:30 Lesson 1
- 10:45–12:00 Lesson 2
- 13:00–14:15 Lesson 4
- 14:30–15:45 Lesson 5
- 16:00–17:00 Lesson 7 and code-review activity

Use short demos only; assign exercises 1, 3, and 6 as follow-up.

### 2-day course

**Day 1:** Lessons 1–4 with exercises 1, 4, and state-boundary review.  
**Day 2:** Lessons 5–8 with exercises 2, 3, 5, 7, and 8. Close with a mini PR review.

### 4×half-day onboarding

1. Codebase map + tokens: Lessons 1–2, exercise 4.
2. Flow + state: Lessons 3–4, exercise 1.
3. API + debugging: Lessons 5–6, exercises 2, 3, 7.
4. Quality + extension: Lessons 7–8 plus one extension and code-review exercise 6.

## Prerequisites

Read the root setup docs before class:

- [Root README §1 Prerequisites](../README.md#1-prerequisites)
- [Root README §2 Quick start](../README.md#2-quick-start-10-minutes)
- [Root README §4 Everyday commands](../README.md#4-everyday-commands)
- [Shared design tokens](../docs/design-tokens.md)
- [Architecture and decisions](../docs/architecture.md)

Learners need Node.js 22.22.3+ or 24.15+ (see `.nvmrc`), Yarn classic, Docker Desktop, a browser, and either Expo Go or an emulator/simulator.

## Running the stack

From the repository root, follow [Quick start](../README.md#2-quick-start-10-minutes):

```bash
yarn install
docker compose up -d
cd backend && cp .env.example .env && yarn install && yarn db:deploy && yarn db:seed && yarn start:dev
cd dashboard && cp .env.example .env && yarn install && yarn dev
cd mobile && yarn install && yarn start
```

Useful URLs:

- API: <http://localhost:3000/api> and health: <http://localhost:3000/api/health>
- Swagger docs: <http://localhost:3000/api/docs>
- Dashboard: <http://localhost:5173>
- Mailpit password-reset inbox: <http://localhost:8025>

Demo accounts:

| Role      | Email                | Password         |
| --------- | -------------------- | ---------------- |
| Passenger | `ama@railpass.dev`   | `Passenger#2026` |
| Passenger | `kwame@railpass.dev` | `Passenger#2026` |
| Staff     | `staff@railpass.dev` | `Staff#2026`     |

## Facilitator-hosted API for learners

Run the API, PostgreSQL, and Mailpit on the facilitator laptop. Learners can run only the mobile app or dashboard.

1. Facilitator starts the API: `docker compose up -d` and `yarn --cwd backend start:dev`.
2. Find the facilitator laptop’s LAN IP, for example `ipconfig getifaddr en0` on macOS.
3. Verify from another device: `curl http://<facilitator-ip>:3000/api/health`.
4. Learners configure frontends:
   - Mobile on physical phones: set `EXPO_PUBLIC_API_URL=http://<facilitator-ip>:3000/api` in the mobile project’s local .env file and restart Metro, or use Profile → Developer settings in the app.
   - Dashboard: set `VITE_API_URL=http://<facilitator-ip>:3000/api` in the dashboard project’s local .env file.
   - Android emulator using an API on the same computer: `http://10.0.2.2:3000/api`.
   - iOS simulator using an API on the same computer: `http://localhost:3000/api`.
5. Confirm with `GET /api/health` before debugging the app. Guest Wi-Fi with client isolation will block physical phones.

## Teaching principles

- Use the real code first, then flawed examples to expose trade-offs.
- Keep slides light. Detailed walkthroughs live in `training/lessons/`.
- The most important convention: **no hard-coded design values in components**. Colours, spacing, radii, typography, sizes, motion and geometry come from constants or token files.
- Distinguish client state from server state before choosing a library.
- Treat backend rules as product constraints: server-side pricing and database seat uniqueness are part of frontend correctness.

## Deliverables in this folder

- `training/lessons/` — facilitator lesson notes.
- `training/exercises/` — learner briefs and flawed examples.
- `training/solutions/` — facilitator solutions and discussion notes.
- `training/slides/railpass-frontend-course.pptx` — editable PowerPoint deck.
- `training/slides/railpass-frontend-course.pdf` — exported PDF handout.
- `training/verify-paths.mjs` — checks Markdown path references.
