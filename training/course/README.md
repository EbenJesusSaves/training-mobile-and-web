# Building Scalable Mobile & Web Apps — lesson folders

This folder is the hands-on half of the course **Building Scalable Mobile & Web Apps — the RailPass Field Guide**.
The other half is the course website, which has one page of notes per lesson
(`/courses/scalable-mobile-and-web-apps/<lesson>`): concepts, RailPass code, quizzes, exercises and recaps.

In the room you build **your own** RailPass, in one workspace, lesson by lesson:

- `mobile/`: the passenger app (Expo, React Native, Expo Router, Zustand, Axios)
- `dashboard/`: the operations dashboard (React, Vite, React Router, Redux Toolkit, TanStack Query, Mantine)

Each lesson adds a few files to your workspace. Some files arrive finished, so you can read them and talk them through.
Others arrive with **LIVE** gaps that the room fills in together. By the last lesson your two apps are the same as the
RailPass reference apps in this repository, and you've built or discussed every part of them.

```
training/course/
├── README.md                ← you are here
├── tools/lesson.mjs         ← the `lesson` command (Node, no dependencies)
└── lessons/
    ├── 00-welcome-aboard/
    ├── 01-tools-and-project-setup/
    │   ├── README.md        ← the lesson at a glance: goal, what arrives, LIVE tasks, checkpoint
    │   ├── mobile.md        ← step-by-step guide for the mobile app
    │   ├── dashboard.md     ← step-by-step guide for the dashboard
    │   ├── lesson.json      ← title, apps it changes, files it removes
    │   ├── provided/        ← copied into your workspace by `lesson start 01`
    │   ├── solution/        ← the finished version of every file with a LIVE gap
    │   └── kata/            ← extra exercises that stay here (not copied)
    ├── …
    ├── 18-capstone/
    └── A-… B-… C-… D-…      ← optional extensions
```

The backend is not part of the course. The facilitator runs the RailPass API for the whole room, and both apps treat it
as a contract (Swagger docs at `http://<facilitator-ip>:3000/api/docs`).

## Before the course

- Node.js **22.22+ or 24.15+**. `.nvmrc` pins 24, so `nvm use` picks the right one.
- Yarn 1.22 (classic): `npm install --global yarn`, then `yarn -v`.
- Git, and VS Code (recommended extensions arrive in lesson 01).
- Expo Go for SDK 57 on your phone, or an iOS Simulator (Xcode) or Android emulator (Android Studio).
- This repository on your laptop, so the `lesson` command and the RailPass reference apps are available:
  `git clone https://github.com/EbenJesusSaves/training-mobile-and-web.git ~/RailPass`

## Set up your workspace (once)

Create the workspace **outside** this repository (the tool refuses to run inside it):

```bash
# 1. A short command for the tool. Add this line to ~/.zshrc or ~/.bashrc and use the path of YOUR copy of RailPass
alias lesson="node ~/RailPass/training/course/tools/lesson.mjs"

# 2. An empty Git repository for your apps
mkdir ~/my-railpass && cd ~/my-railpass
git init

# 3. Lesson 01 brings the boilerplate: root config, Git hooks and both app skeletons
lesson start 01
yarn install:all          # root (Husky), dashboard and mobile dependencies, once for the whole course

# 4. Point both apps at the course API (ask the facilitator for the address)
cp mobile/.env.example mobile/.env
cp dashboard/.env.example dashboard/.env

git add -A && git commit -m "chore: start lesson 01"
```

All dependencies arrive in lesson 01, so you install only once. Later lessons add source files, never packages.

## The rhythm of every lesson

```bash
git status                       # 1. clean? commit your work first
lesson start 05                  # 2. copy the lesson's files in; prints what arrived and the LIVE tasks
                                 # 3. work through the LIVE tasks with the room (see below)
lesson status 05                 # 4. which LIVE 05 tasks are still open?
yarn run check                   # 5. lint, type-check and test both apps
git add -A && git commit -m "feat: lesson 05 design tokens"   # 6. save your progress
```

`lesson start` refuses to run while Git has uncommitted changes, so a lesson never overwrites work you haven't saved.
Commit first, or pass `--force` if you really mean it.

> **`yarn run check`, not `yarn check`.** In Yarn 1, `yarn check` is a built-in command that verifies
> `node_modules` and ignores our `check` script. Always write `yarn run check`.

### LIVE markers

Files that arrive with gaps carry markers at the exact spot to edit:

```ts
// LIVE 08.1 — Derive the seat list from the compartments instead of returning [].
```

- **LIVE NN.k** is a task the room codes together. Most take a few minutes (the capstone's take longer), and the app
  still runs before you start. Delete the comment when you're done.
- Numbering: `NN.1`–`NN.4` are mobile tasks, `NN.5`–`NN.8` dashboard tasks, and `NN.9` workspace tasks
  (for example a decision record or a team convention).
- Find them in VS Code with **Find in Files** (<kbd>⇧⌘F</kbd> / <kbd>Ctrl+Shift+F</kbd>): search for `LIVE 08`.
  `lesson status` lists every open one.
- A few tasks start with a failing test on purpose (lessons 08 and 15). The red test is your to-do list, and
  `yarn run check` turns green when the tasks are done. The Git hooks only lint and type-check, so you can still commit.
- Discussion prompts aren't in the code. Each guide's **Talk through** section names the files to read together, the
  question to ask and the answer to look for.

Some tasks are in files that can't hold comments (JSON). Those appear only in the lesson's `README.md` and guides.

## Fallen behind? Broken something?

| You want to… | Run |
| --- | --- |
| See what a lesson adds, changes and removes | `lesson files 08` |
| Fill in a lesson's LIVE tasks with the finished code | `lesson solution 08` |
| Jump to the end of a lesson (every course file as it should be) | `lesson catch-up 08` |
| Preview any of these without writing files | add `--dry-run` |

`catch-up` rebuilds every course file up to the end of that lesson. Files that only you created are kept. Your own edits to
course files are overwritten, which is why the tool wants a clean Git tree first: commit, catch up, then use `git diff` to
see what changed. Joining late? `lesson catch-up 07` and then `lesson start 08`.

## Build it, then compare

When a lesson's tasks are done, compare your work with the reference:

```bash
lesson diff mobile        # files that differ from RailPass, and files you're still missing
lesson diff dashboard
code --diff mobile/libs/seat-layout.ts ~/RailPass/mobile/libs/seat-layout.ts   # side by side in VS Code
```

Differences aren't mistakes. Talk about them: which version is easier to read, test and change? Some files are
deliberately simpler early on and say so at the top: `// Course version (lesson 05) — becomes the full RailPass version in lesson 09.`
Course-only files don't exist in RailPass: the playground screens and sample data leave in lesson 07, the prototype
screen component (`mobile/prototype/`) leaves in lesson 18, and the folder `README.md` notes stay as documentation.

## Lessons

| # | Lesson | 📱 | 🖥️ |
| --- | --- | :-: | :-: |
| 00 | Welcome aboard RailPass | | |
| 01 | Tools & project setup | ✓ | ✓ |
| 02 | Architecture & folder structure | ✓ | ✓ |
| 03 | Naming conventions & coding standards | ✓ | ✓ |
| 04 | Choosing libraries deliberately | ✓ | |
| 05 | Design tokens & theming | ✓ | ✓ |
| 06 | Components: building & structuring | ✓ | ✓ |
| 07 | Navigation & routing | ✓ | ✓ |
| 08 | Data & business logic | ✓ | ✓ |
| 09 | State management | ✓ | ✓ |
| 10 | Network layer & server state | ✓ | ✓ |
| 11 | Forms, validation & failure UX | ✓ | ✓ |
| 12 | Auth & sessions on the client | ✓ | ✓ |
| 13 | Performance | ✓ | ✓ |
| 14 | Accessibility | ✓ | ✓ |
| 15 | Testing strategy | ✓ | ✓ |
| 16 | Code quality, readability & review | | |
| 17 | Scaling the codebase | ✓ | ✓ |
| 18 | Capstone: ship a feature end to end | ✓ | ✓ |
| A | Motion & graphics with Skia and Reanimated | | |
| B | Tickets: PDF417 and PDF export | | |
| C | Dashboard operations patterns | | |
| D | Debugging toolkit | | |

`lesson list` shows the same table with what each lesson currently ships. The extensions are deep dives into code you
already have: reading guides and katas, with no new workspace files.

## For facilitators

- Teach from each lesson's `README.md` (overview and timings) and the `mobile.md` / `dashboard.md` guides
  (the question to ask the room, the steps for every LIVE task, hints, what "done" looks like).
- The course website has the longer explanations, quizzes and exercises for each lesson. Learners can reread them later.
- Run the API for the room before anyone arrives, and write its address somewhere everyone can see
  (see "Facilitator-hosted API" in the repository README). Phones need your LAN address, never `localhost`.
- When the room splits by app, pair a mobile learner with a dashboard learner at each checkpoint so both see both apps.

## For maintainers: changing a lesson

Lesson files follow a few rules, so that every lesson compiles from start to end and lesson 18 ends exactly at RailPass:

- **Copy, don't retype.** Files that arrive finished are byte-for-byte copies of `mobile/` or `dashboard/` in this repository.
- **Course versions** (simpler early versions of a RailPass file) start with a `// Course version (lesson NN) — …` line
  that names the lesson that replaces them, for example `— becomes the full RailPass version in lesson MM.`, and keep
  the same exports.
- **LIVE gaps** keep the file compiling. The finished file goes in the same lesson's `solution/` (with no markers).
- **Course-only code:** the playgrounds `mobile/app/index.tsx` (lessons 01–06) and `dashboard/src/app/course-playground.tsx`
  (05–06), the sample data in `mobile/prototype/fixtures.ts` and `dashboard/src/prototype/` (06), and
  `mobile/prototype/prototype-screen.tsx` (07–17). `lesson.json` → `remove` deletes them: lesson 07 removes the
  playgrounds and sample data, lesson 18 removes `mobile/prototype/`.
- Store `.gitignore` files as `_gitignore`. The tool renames them when it copies, and they don't hide lesson files from Git here.
- Never copy a real `.env` or a tunnel URL. The `.env.example` files point at `http://localhost:3000/api` and explain the class address.

Then verify. `verify` builds every lesson's start and end state in a temporary folder (using this repository's
`node_modules`) and type-checks, lints and tests it:

```bash
node training/course/tools/lesson.mjs verify 08 --lint --test          # one lesson
node training/course/tools/lesson.mjs verify 05..09 --app mobile        # a range, one app
node training/course/tools/lesson.mjs verify all --lint --test --final  # everything, and the end state must equal RailPass
```

`--final` lists every file that is missing, different or extra compared with the reference apps (allowed: folder
`README.md` notes and the `.env.example` files), plus any LIVE or TALK marker left behind.
Run it before a course, and after any change to `mobile/` or `dashboard/`.
