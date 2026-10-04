# 01 · Tools & project setup

**Notes:** `/courses/scalable-mobile-and-web-apps/tools-and-project-setup` on the course website · **Time:** 30 min ·
**Workspace changes:** `lesson start 01` adds root workspace config, 37 mobile files and 18 dashboard files (LIVE 01.1–01.2, 01.5–01.6)

## Goal

Create `my-railpass/`, install all dependencies once, and prove both apps can reach the facilitator API.

## What happens

1. **Workspace setup (about 8 min):** `git init`, `lesson start 01`, `yarn install:all`, copy both `.env.example` files to `.env`, then start the apps.
2. **Toolchain tour (about 5 min):** root `.nvmrc`, Prettier, VS Code settings, Husky hooks, `scripts/check-all.sh`, and why `yarn run check` is the shared command.
3. **Mobile LIVE tasks (about 7 min):** LIVE 01.1 resolves `defaultApiUrl`; LIVE 01.2 fetches `/health` from the setup screen.
4. **Dashboard LIVE tasks (about 6 min):** LIVE 01.5 validates `VITE_API_URL`; LIVE 01.6 renders the browser health result.
5. **Checkpoint and compare (about 4 min):** `lesson status 01`, `yarn run check`, then `lesson diff mobile` and `lesson diff dashboard`.

## LIVE tasks

| Task | App | File | What you write |
| --- | --- | --- | --- |
| LIVE 01.1 | 📱 mobile | `mobile/config/app-config.ts` | Import `expo-constants`, derive the Metro host from `Constants.expoConfig?.hostUri`, and set `defaultApiUrl` to env → Metro host → localhost. |
| LIVE 01.2 | 📱 mobile | `mobile/app/index.tsx` | Fetch `${defaultApiUrl}/health`, throw on non-OK responses, and show `API: ok` on success. |
| LIVE 01.5 | 🖥️ dashboard | `dashboard/src/shared/config/env.ts` | Validate `VITE_API_URL` with `URL.canParse(value)` before exporting `env.apiUrl`. |
| LIVE 01.6 | 🖥️ dashboard | `dashboard/src/main.tsx` | Add state/effect code that calls `${env.apiUrl}/health` and renders `Health: checking`, `ok` or `unreachable`. |

## Checkpoint

- 📱 Expo opens **Hello RailPass**, shows the resolved API URL, and reports `API: ok` or a useful setup error.
- 🖥️ Vite opens the setup panel and shows the API URL plus `/health` status.
- `yarn run check` passes.

## Common problems

- **Red "Could not connect to development server" screen:** the phone cannot reach Metro. Use the same Wi-Fi, avoid guest-network client isolation, and restart `yarn mobile` if the host changed.
- **Phone says Network Error while laptop works:** `localhost` points at the phone. Put `http://<facilitator-ip>:3000/api` in `mobile/.env`.
- **Typed routes missing:** Expo writes `.expo/types/router.d.ts` while `yarn mobile` runs. Start Metro once before `yarn --cwd mobile typecheck` if route types are stale.
- **`yarn check` seems to do the wrong thing:** use `yarn run check`; Yarn 1 has a built-in `check` command.

## Facilitator notes

- Put the API URL on the board before setup starts.
- Pair learners when Wi-Fi is slow; one phone proving Metro/API reachability can unblock a table.
- Do not let anyone install later lesson packages separately. Lesson 01 already brought them all.
- Show the Husky hooks, but keep the focus on visible app health.

**Next:** lesson 02 gives every future file a home.
