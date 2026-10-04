# RailPass API (NestJS)

Supporting API for the RailPass passenger app and operations dashboard. It is deliberately straightforward:
one NestJS app, Prisma ORM, PostgreSQL in Docker, no caching layer.

## Run

```bash
docker compose up -d          # from the repository root: PostgreSQL :5433 + Mailpit :8025
cp .env.example .env          # set JWT_SECRET (openssl rand -hex 32)
yarn install                  # also runs `prisma generate`
yarn db:deploy                # apply migrations
yarn db:seed                  # seed an empty database
yarn start:dev                # http://localhost:3000/api · Swagger: /api/docs
```

| Script | Purpose |
| --- | --- |
| `yarn start:dev` | Watch mode on `0.0.0.0:3000` (reachable from phones on the LAN) |
| `yarn db:migrate` | Create/apply a migration after editing `prisma/schema.prisma` |
| `yarn db:deploy` | Apply existing migrations |
| `yarn db:seed` | Seed (refuses to run on a non-empty database) |
| `yarn db:reset` | **Destructive**: drop everything, re-migrate, re-seed |
| `yarn db:studio` | Prisma Studio data browser |
| `yarn lint` / `yarn typecheck` | oxlint / `tsc --noEmit` |
| `yarn test` | Unit tests (Vitest), e.g. pricing |
| `yarn test:e2e` | API tests against a separate `railpass_test` database (created and migrated automatically) |

## Structure

```
src/
  main.ts, app.factory.ts   bootstrap (global prefix /api, validation, error filter, CORS, Swagger)
  config/                   environment → typed config
  prisma/                   PrismaService (pg driver adapter)
  common/                   auth guard (JWT + roles), decorators, error filter, validation pipe, codes
  auth/  users/  mail/      sessions, profile, password reset (Mailpit)
  stations/  journeys/      public network, search, availability, seat maps
  add-ons/                  extras catalogue
  bookings/                 quote, create (seat reservations), list, cancel, pricing, PDF417 barcode
  admin/                    staff endpoints: overview, journeys, network, bookings, passengers
prisma/
  schema.prisma, migrations/, seed.ts
test/
  booking-flow.e2e-spec.ts  auth, permissions, pricing, concurrency, cancellation, password reset
```

Design decisions (seat concurrency, pricing, time zone, barcode, auth) are in [`../docs/architecture.md`](../docs/architecture.md).

## Notes

- Node.js 22.22.3+ or 24.15+ is required by the NestJS 12 tooling.
- Prisma is pinned to 7.10 (the `prisma` CLI's `latest` tag currently points at an 8.0 release candidate).
- Dev email: messages go to Mailpit (http://localhost:8025); with `LOG_RESET_CODES=true` codes are also logged.
