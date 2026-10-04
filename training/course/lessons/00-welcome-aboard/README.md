# 00 · Welcome aboard RailPass

**Notes:** `/courses/scalable-mobile-and-web-apps/welcome-aboard` on the course website · **Time:** 15 min ·
**Workspace changes:** none (you run the finished reference apps)

## Goal

Everyone has seen both RailPass apps working against the course API, and every laptop is ready for lesson 01.

## What happens

1. **The trailer (facilitator, about 5 min, on the projector).** Staff create a journey in the dashboard, Kwame books
   it on his phone, ops find the booking, a delay is announced and the bell lights up on the phone.
2. **What "scalable" means here:** easy to change safely, by many people, over time. Every later decision is judged
   against that sentence.
3. **How a lesson runs:** concept → RailPass code → LIVE tasks in your workspace → checkpoint → compare with RailPass.
4. **Setup checklist** (below) while installs run.

## Setup checklist

- [ ] `node -v` prints 22.22+ or 24.15+ (`nvm use` in this repository picks 24).
- [ ] `yarn -v` prints 1.22.x.
- [ ] Expo Go (SDK 57) on your phone, or a simulator/emulator that opens.
- [ ] Laptop and phone on the same Wi-Fi as the facilitator (not a guest network with client isolation).
- [ ] `http://<facilitator-ip>:3000/api/health` answers `{"status":"ok", …}` in your laptop's **and** your phone's browser.
- [ ] The `lesson` alias works: `lesson list` prints the lessons (see [the course README](../../README.md#set-up-your-workspace-once)).

## Run the reference apps

These are the finished apps you'll compare against all through the course.

| | 📱 Mobile (`mobile/`) | 🖥️ Dashboard (`dashboard/`) |
| --- | --- | --- |
| Configure | copy `.env.example` to `.env`, set `EXPO_PUBLIC_API_URL=http://<facilitator-ip>:3000/api` | copy `.env.example` to `.env`, set `VITE_API_URL=http://<facilitator-ip>:3000/api` |
| Install and run | `yarn install`, then `yarn start` (scan the QR code, or press `i` / `a`) | `yarn install`, then `yarn dev` → http://localhost:5173 |
| Sign in | `kwame@railpass.dev` / `Passenger#2026` | `staff@railpass.dev` / `Staff#2026` |
| Try | search Accra Central → Kumasi Central | open *Journeys*, then the API docs at `http://<facilitator-ip>:3000/api/docs` |

Other demo accounts: `ama@railpass.dev` (passenger with trip history) and `ops@railpass.dev` (a second staff user).
Passengers can't sign in to the dashboard and staff can't sign in to the app. Try it: both refuse politely.

## Checkpoint

- 📱 RailPass runs on your phone or simulator, signed in as Kwame, showing journeys for a route.
- 🖥️ RailPass Ops runs at `localhost:5173`, signed in as staff.
- 🔌 You've sent one request from the Swagger page with *Try it out*.

## Common first-run problems

- **Red "Could not connect to development server" screen:** the phone can't reach Metro. Same Wi-Fi? Not a guest network?
- **"Network Error" or an endless spinner:** the API address is wrong or unreachable. Open `/api/health` in the phone's browser.
- **CORS error in the dashboard console:** the API only allows known browser origins. Make sure Vite runs on port 5173.

## Facilitator notes

- Start the API before anyone arrives (repository README, "Facilitator-hosted API") and put its address on the board.
- If the Wi-Fi is slow, pair people up: one laptop running both reference apps is enough for this lesson.
- Note the problems people hit. They're good material for extension D (debugging).

**Next:** lesson 01 starts from an empty folder: `git init`, then `lesson start 01`.
