# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

RailPass staff operators work at a desk or on a tablet to monitor intercity train operations, schedule journeys, manage network data, and help passengers with bookings. Facts here are inferred from the implementation brief because this session is unattended.

## Product Purpose

RailPass is a train-travel booking and operations training system. The dashboard gives staff a complete, teachable operations surface for live-looking seeded data, simulated revenue, route/station administration, passenger support, booking status changes, and journey capacity management.

## Positioning

The product demonstrates a Ghana intercity rail network with real CRUD operations against the course backend while keeping code clear enough for new frontend engineers to learn modern React state boundaries.

## Operating Context

Backend API runs at `http://localhost:3000/api`; currency is GHS stored in integer pesewas; all network times are UTC/GMT for Africa/Accra; demo staff and passenger accounts are seeded.

## Capabilities and Constraints

React, Vite, TypeScript, Redux Toolkit, TanStack Query, Axios, Mantine, Tailwind CSS v4, Yarn, oxlint, Vitest, and CSS Modules are binding implementation constraints. Staff role is required; passenger accounts must be refused.

## Brand Commitments

Name: RailPass Ops. The dashboard extends the supplied mobile visual language: Plus Jakarta Sans, soft green light theme, red-accented dark theme, rounded cards, inverse near-black emphasis surfaces, and explicit status iconography.

## Evidence on Hand

Design tokens: `../docs/design-tokens.md`; backend API source: `../backend/src/admin`, `../backend/src/journeys`, `../backend/src/bookings`, `../backend/src/auth`; dashboard font files: `src/assets/fonts`.

## Product Principles

- Teach clear boundaries: Redux owns client/session/UI state; TanStack Query owns server state.
- Make operational status scannable before it is decorative.
- Treat money and time formatting as domain decisions, not presentation afterthoughts.
- Preserve accessibility, keyboard operation, and high contrast in both themes.

## Accessibility & Inclusion

The dashboard must be keyboard-usable, semantic, visible on small screens, respect reduced motion, and keep destructive/error states distinguishable from the red dark-theme brand accent.
