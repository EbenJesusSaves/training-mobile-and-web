#!/usr/bin/env node
// RailPass course: lesson workspace tool. Zero dependencies; run with Node 22+.
// Usage: node training/course/tools/lesson.mjs <command> [lesson] [options]   (tip: alias lesson="node /path/to/training/course/tools/lesson.mjs")

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const COURSE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LESSONS_DIR = path.join(COURSE_DIR, 'lessons');
const REFERENCE_DIR = path.resolve(COURSE_DIR, '..', '..');
const APPS = ['mobile', 'dashboard'];
const SITE_PATH = '/courses/scalable-mobile-and-web-apps';
const MARKER = /\b(LIVE|TALK) ((?:\d\d|[A-D]))\.(\d+)\b\s*[—–-]?\s*(.*)$/;
const SKIP_DIRS = new Set(['node_modules', '.git', '.expo', 'dist', 'ios', 'android', 'coverage', '.yarn', '.turbo', 'web-build']);
const SKIP_FILES = new Set(['.DS_Store']);

// Reference files the course deliberately never recreates, or recreates as course versions.
const COMPARE_IGNORE = {
  mobile: ['AGENTS.md', 'LICENSE', 'docs/', '.claude/', '.env', '.env.local', '.metro-health-check', '.eslintcache'],
  dashboard: ['README.md', 'PRODUCT.md', 'package-lock.json', '.env', '.env.local', 'tsconfig.app.tsbuildinfo', 'tsconfig.node.tsbuildinfo'],
};
const COMPARE_ALLOW_DIFFERENT = { mobile: ['.env.example'], dashboard: ['.env.example'] };
const COMPARE_ALLOW_EXTRA = (rel) => path.basename(rel) === 'README.md';

const color = (code) => (text) => (process.stdout.isTTY && !process.env.NO_COLOR ? `\x1b[${code}m${text}\x1b[0m` : text);
const bold = color('1');
const dim = color('2');
const green = color('32');
const red = color('31');
const yellow = color('33');
const cyan = color('36');

function fail(message) {
  console.error(red(`✖ ${message}`));
  process.exit(1);
}

// ---------------------------------------------------------------------------------------------
// Lessons

function lessonOrder(id) {
  return /^\d+$/.test(id) ? Number(id) : 100 + id.charCodeAt(0);
}

function loadLessons() {
  if (!fs.existsSync(LESSONS_DIR)) fail(`No lessons folder at ${LESSONS_DIR}`);
  return fs
    .readdirSync(LESSONS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^(\d\d|[A-D])-/.test(entry.name))
    .map((entry) => {
      const dir = path.join(LESSONS_DIR, entry.name);
      const id = entry.name.split('-')[0];
      const metaPath = path.join(dir, 'lesson.json');
      const meta = fs.existsSync(metaPath) ? JSON.parse(fs.readFileSync(metaPath, 'utf8')) : {};
      return {
        id,
        slug: entry.name.slice(id.length + 1),
        folder: entry.name,
        dir,
        title: meta.title ?? entry.name,
        apps: meta.apps ?? [],
        remove: meta.remove ?? [],
      };
    })
    .sort((a, b) => lessonOrder(a.id) - lessonOrder(b.id));
}

function normaliseId(raw) {
  if (raw === undefined) return undefined;
  const value = String(raw).trim();
  if (/^\d{1,2}$/.test(value)) return value.padStart(2, '0');
  if (/^[a-dA-D]$/.test(value)) return value.toUpperCase();
  const prefix = value.match(/^(\d\d|[A-D])-/);
  if (prefix) return prefix[1];
  fail(`"${value}" is not a lesson. Use a number like 05 or an extension letter like A.`);
}

function findLesson(lessons, raw) {
  const id = normaliseId(raw);
  const lesson = lessons.find((item) => item.id === id);
  if (!lesson) fail(`Lesson ${id} does not exist. Run \`lesson list\`.`);
  return lesson;
}

function selectLessons(lessons, raw) {
  if (!raw || raw === 'all') return lessons;
  if (raw.includes('..')) {
    const [from, to] = raw.split('..').map(normaliseId);
    const start = lessonOrder(from);
    const end = lessonOrder(to);
    return lessons.filter((lesson) => lessonOrder(lesson.id) >= start && lessonOrder(lesson.id) <= end);
  }
  return [findLesson(lessons, raw)];
}

// ---------------------------------------------------------------------------------------------
// Files

function walk(dir, base = dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_FILES.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      walk(full, base, out);
    } else if (entry.isFile()) {
      out.push(path.relative(base, full).split(path.sep).join('/'));
    }
  }
  return out;
}

function assertInside(root, rel) {
  const target = path.resolve(root, rel);
  if (path.isAbsolute(rel) || rel.split(/[\\/]/).includes('..') || !target.startsWith(path.resolve(root) + path.sep)) {
    fail(`Refusing to touch "${rel}": it is outside the workspace.`);
  }
  return target;
}

// Overlays store `.gitignore` files as `_gitignore` so they don't act as ignore rules inside this repo.
function toWorkspaceRel(rel) {
  return rel
    .split('/')
    .map((segment) => (segment === '_gitignore' ? '.gitignore' : segment))
    .join('/');
}

/** Copies an overlay folder into the workspace. Returns per-file results. */
function applyOverlay(overlayDir, workspace, { dryRun = false } = {}) {
  const results = [];
  for (const sourceRel of walk(overlayDir)) {
    const rel = toWorkspaceRel(sourceRel);
    const source = path.join(overlayDir, sourceRel);
    const target = assertInside(workspace, rel);
    const incoming = fs.readFileSync(source);
    let status = 'added';
    if (fs.existsSync(target)) status = fs.readFileSync(target).equals(incoming) ? 'unchanged' : 'updated';
    if (!dryRun && status !== 'unchanged') {
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, incoming);
      fs.chmodSync(target, fs.statSync(source).mode & 0o777);
    }
    results.push({ rel, sourceRel, status });
  }
  return results;
}

function applyRemovals(lesson, workspace, { dryRun = false } = {}) {
  const removed = [];
  for (const rel of lesson.remove) {
    const target = assertInside(workspace, rel);
    if (!fs.existsSync(target)) continue;
    if (!dryRun) fs.rmSync(target, { recursive: true, force: true });
    removed.push(rel);
  }
  return removed;
}

function findMarkers(root, files, { lessonId, kinds = ['LIVE'] } = {}) {
  const markers = [];
  for (const rel of files) {
    const full = path.join(root, rel);
    if (!fs.existsSync(full)) continue;
    const buffer = fs.readFileSync(full);
    if (buffer.includes(0)) continue;
    buffer
      .toString('utf8')
      .split('\n')
      .forEach((line, index) => {
        const match = line.match(MARKER);
        if (!match) return;
        const [, kind, id, step, rest] = match;
        if (!kinds.includes(kind)) return;
        if (lessonId && id !== lessonId) return;
        const text = rest.replace(/\s*(\*\/\}?|-->)\s*$/, '').trim();
        markers.push({ kind, id, step: Number(step), file: rel, line: index + 1, text });
      });
  }
  return markers.sort((a, b) => a.id.localeCompare(b.id) || a.step - b.step || a.file.localeCompare(b.file) || a.line - b.line);
}

// A LIVE file whose solution is the provided file minus its marker lines gives learners nothing to do.
function hollowLiveFiles(lesson, providedDir) {
  const files = [...new Set(findMarkers(providedDir, walk(providedDir), { lessonId: lesson.id }).map((marker) => marker.file))];
  const withoutMarkers = (text) => text.split('\n').filter((line) => !MARKER.test(line)).join('\n');
  return files.filter((rel) => {
    const solutionFile = path.join(lesson.dir, 'solution', rel);
    if (!fs.existsSync(solutionFile)) return false;
    return withoutMarkers(fs.readFileSync(path.join(providedDir, rel), 'utf8')) === fs.readFileSync(solutionFile, 'utf8');
  });
}

function printMarkers(markers) {
  for (const marker of markers) {
    const label = marker.kind === 'LIVE' ? yellow(`${marker.kind} ${marker.id}.${marker.step}`) : cyan(`${marker.kind} ${marker.id}.${marker.step}`);
    console.log(`  ${label}  ${marker.file}:${marker.line}${marker.text ? dim(`  ${marker.text}`) : ''}`);
  }
}

// ---------------------------------------------------------------------------------------------
// Workspace helpers

function gitDirtyFiles(workspace) {
  const result = spawnSync('git', ['status', '--porcelain'], { cwd: workspace, encoding: 'utf8' });
  if (result.error || result.status !== 0) return null;
  return result.stdout.split('\n').filter(Boolean);
}

function guardWorkspace(workspace, { force, action }) {
  if (!fs.existsSync(workspace)) fail(`Workspace ${workspace} does not exist.`);
  const resolved = path.resolve(workspace);
  if (resolved === REFERENCE_DIR || resolved.startsWith(REFERENCE_DIR + path.sep)) {
    fail('Run this from your own workspace (for example ~/my-railpass), not inside the RailPass reference repo.');
  }
  const dirty = gitDirtyFiles(workspace);
  if (dirty === null) {
    console.log(dim('ℹ Not a git repository yet. Run `git init` so you can commit after each lesson (Husky needs it too).'));
    return;
  }
  if (dirty.length && !force) {
    console.error(red(`✖ ${dirty.length} uncommitted change(s). ${action} overwrites course files, so commit first:`));
    console.error(dim('    git add -A && git commit -m "chore: finish lesson NN"'));
    console.error(dim('  or re-run with --force to overwrite anyway.'));
    process.exit(1);
  }
}

function summarise(results) {
  const count = (status) => results.filter((item) => item.status === status).length;
  return `${green(`+${count('added')} added`)}, ${yellow(`~${count('updated')} updated`)}, ${dim(`${count('unchanged')} unchanged`)}`;
}

function needsInstall(results) {
  return results.some((item) => item.status !== 'unchanged' && /(^|\/)(package\.json|yarn\.lock)$/.test(item.rel));
}

function lessonPaths(lesson) {
  const relDir = path.relative(REFERENCE_DIR, lesson.dir).split(path.sep).join('/');
  const guides = ['README.md', ...APPS.map((app) => `${app}.md`)].filter((name) => fs.existsSync(path.join(lesson.dir, name)));
  return {
    guides: guides.map((name) => `${relDir}/${name}`).join(', '),
    notes: `${SITE_PATH}/${lesson.slug}`,
  };
}

// ---------------------------------------------------------------------------------------------
// Commands

function commandList(lessons) {
  console.log(bold('RailPass course lessons\n'));
  for (const lesson of lessons) {
    const providedDir = path.join(lesson.dir, 'provided');
    const provided = walk(providedDir);
    const apps = APPS.filter((app) => provided.some((rel) => rel.startsWith(`${app}/`)));
    const live = findMarkers(providedDir, provided, { lessonId: lesson.id }).length;
    const appsLabel = APPS.map((app) => (apps.includes(app) ? (app === 'mobile' ? 'M' : 'D') : '·')).join('');
    console.log(`  ${bold(lesson.id.padEnd(2))}  ${dim(appsLabel)}  ${lesson.title}${live ? dim(`  · ${live} live task(s)`) : ''}`);
  }
  console.log(dim('\nM = changes the mobile app, D = changes the dashboard. Start a lesson from your workspace: lesson start 01'));
}

function commandStart(lessons, raw, options) {
  const lesson = findLesson(lessons, raw);
  const workspace = options.workspace;
  guardWorkspace(workspace, { force: options.force || options.dryRun, action: 'Starting a lesson' });
  const index = lessons.indexOf(lesson);
  if (index > 1 && !APPS.some((app) => fs.existsSync(path.join(workspace, app)))) {
    console.log(yellow(`⚠ This workspace has no mobile/ or dashboard/ yet. Did you mean \`lesson catch-up ${lessons[index - 1].id}\` first?`));
  }
  const results = applyOverlay(path.join(lesson.dir, 'provided'), workspace, options);
  const removed = applyRemovals(lesson, workspace, options);
  const { guides, notes } = lessonPaths(lesson);

  console.log(`\n${bold(`▶ Lesson ${lesson.id} · ${lesson.title}`)}${options.dryRun ? yellow('  (dry run)') : ''}`);
  console.log(`  ${summarise(results)}${removed.length ? `, ${red(`−${removed.length} removed`)}` : ''}`);
  for (const rel of removed) console.log(red(`    − ${rel}`));
  if (options.verbose) for (const item of results.filter((entry) => entry.status !== 'unchanged')) console.log(dim(`    ${item.status === 'added' ? '+' : '~'} ${item.rel}`));

  const markers = options.dryRun
    ? findMarkers(path.join(lesson.dir, 'provided'), results.map((item) => item.sourceRel), { lessonId: lesson.id, kinds: ['LIVE', 'TALK'] })
    : findMarkers(workspace, results.map((item) => item.rel), { lessonId: lesson.id, kinds: ['LIVE', 'TALK'] });
  if (markers.length) {
    console.log(bold('\n  Together in this lesson:'));
    printMarkers(markers);
  }
  if (needsInstall(results)) console.log(yellow('\n  Dependencies changed: run `yarn install:all` (or `yarn --cwd <app> install`).'));
  if (guides) console.log(`\n  Guides: ${guides}`);
  console.log(`  Notes:  ${notes}`);
  console.log(dim(`  Next:   search your editor for "LIVE ${lesson.id}", then run \`lesson status ${lesson.id}\`. Stuck? \`lesson solution ${lesson.id}\`.\n`));
}

function commandSolution(lessons, raw, options) {
  const lesson = findLesson(lessons, raw);
  const solutionDir = path.join(lesson.dir, 'solution');
  if (!fs.existsSync(solutionDir)) {
    console.log(dim(`Lesson ${lesson.id} has no solution overlay (nothing to fill in).`));
    return;
  }
  guardWorkspace(options.workspace, { force: options.force || options.dryRun, action: 'Applying a solution' });
  const results = applyOverlay(solutionDir, options.workspace, options);
  console.log(`\n${bold(`✓ Solution for lesson ${lesson.id} · ${lesson.title}`)}${options.dryRun ? yellow('  (dry run)') : ''}`);
  console.log(`  ${summarise(results)}`);
  for (const item of results.filter((entry) => entry.status !== 'unchanged')) console.log(dim(`    ${item.status === 'added' ? '+' : '~'} ${item.rel}`));
  console.log(dim('\n  Compare with your attempt: git diff\n'));
}

function composeTo(lessons, target, workspace, options = {}) {
  const all = [];
  for (const lesson of lessons) {
    if (lessonOrder(lesson.id) > lessonOrder(target.id)) break;
    all.push(...applyOverlay(path.join(lesson.dir, 'provided'), workspace, options));
    applyRemovals(lesson, workspace, options);
    all.push(...applyOverlay(path.join(lesson.dir, 'solution'), workspace, options));
  }
  return all;
}

function commandCatchUp(lessons, raw, options) {
  const lesson = findLesson(lessons, raw);
  guardWorkspace(options.workspace, { force: options.force || options.dryRun, action: 'Catching up' });
  const results = composeTo(lessons, lesson, options.workspace, options);
  const latest = new Map();
  for (const item of results) latest.set(item.rel, latest.get(item.rel) === 'added' || latest.get(item.rel) === 'updated' ? latest.get(item.rel) : item.status);
  const final = [...latest]
    .map(([rel, status]) => ({ rel, status }))
    .filter((item) => options.dryRun || fs.existsSync(path.join(options.workspace, item.rel)));
  console.log(`\n${bold(`⏩ Course files now match the end of lesson ${lesson.id} · ${lesson.title}`)}${options.dryRun ? yellow('  (dry run)') : ''}`);
  console.log(`  ${summarise(final)}`);
  if (needsInstall(final)) console.log(yellow('  Dependencies changed: run `yarn install:all`.'));
  const next = lessons[lessons.indexOf(lesson) + 1];
  console.log(dim(`  Commit, then continue with: lesson start ${next ? next.id : '…'}\n`));
}

function commandFiles(lessons, raw) {
  const lesson = findLesson(lessons, raw);
  const providedDir = path.join(lesson.dir, 'provided');
  const solutionDir = path.join(lesson.dir, 'solution');
  const provided = walk(providedDir);
  const solution = walk(solutionDir);
  const kata = walk(path.join(lesson.dir, 'kata'));
  const live = findMarkers(providedDir, provided, { lessonId: lesson.id });
  const liveFiles = new Set(live.map((marker) => marker.file));
  console.log(bold(`\nLesson ${lesson.id} · ${lesson.title}\n`));
  console.log(bold(`  Arrives (${provided.length})`));
  for (const rel of provided) console.log(`    ${liveFiles.has(rel) ? yellow('✎') : ' '} ${toWorkspaceRel(rel)}`);
  if (lesson.remove.length) {
    console.log(bold('\n  Removed at start'));
    for (const rel of lesson.remove) console.log(red(`    − ${rel}`));
  }
  if (solution.length) {
    console.log(bold(`\n  Solution overlay (${solution.length})`));
    for (const rel of solution) console.log(`      ${toWorkspaceRel(rel)}`);
  }
  if (kata.length) {
    console.log(bold('\n  Kata (read in place, not copied)'));
    for (const rel of kata) console.log(`      ${path.relative(REFERENCE_DIR, path.join(lesson.dir, 'kata', rel))}`);
  }
  if (live.length) {
    console.log(bold('\n  Live tasks'));
    printMarkers(live);
  }
  console.log('');
}

function commandStatus(lessons, raw, options) {
  const lessonId = raw ? findLesson(lessons, raw).id : undefined;
  const markers = findMarkers(options.workspace, walk(options.workspace), { lessonId });
  if (!markers.length) {
    console.log(green(`✓ No LIVE markers left${lessonId ? ` for lesson ${lessonId}` : ''}. Commit and move on!`));
    return;
  }
  console.log(bold(`${markers.length} LIVE task(s) still open${lessonId ? ` for lesson ${lessonId}` : ''}:`));
  printMarkers(markers);
  console.log(dim('\nDelete each LIVE comment when its task is done.'));
}

function compareApp(app, workspaceAppDir) {
  const referenceAppDir = path.join(REFERENCE_DIR, app);
  const ignore = COMPARE_IGNORE[app] ?? [];
  const isIgnored = (rel) => ignore.some((pattern) => (pattern.endsWith('/') ? rel.startsWith(pattern) : rel === pattern));
  const referenceFiles = walk(referenceAppDir).filter((rel) => !isIgnored(rel));
  const workspaceFiles = walk(workspaceAppDir).filter((rel) => !isIgnored(rel));
  const workspaceSet = new Set(workspaceFiles);
  const referenceSet = new Set(referenceFiles);
  const missing = referenceFiles.filter((rel) => !workspaceSet.has(rel));
  const extra = workspaceFiles.filter((rel) => !referenceSet.has(rel));
  const different = referenceFiles.filter(
    (rel) => workspaceSet.has(rel) && !fs.readFileSync(path.join(referenceAppDir, rel)).equals(fs.readFileSync(path.join(workspaceAppDir, rel))),
  );
  return { missing, extra, different, same: referenceFiles.length - missing.length - different.length };
}

function printComparison(app, comparison, { strict = false } = {}) {
  const allowedDifferent = new Set(COMPARE_ALLOW_DIFFERENT[app] ?? []);
  const different = comparison.different.filter((rel) => !strict || !allowedDifferent.has(rel));
  const extra = comparison.extra.filter((rel) => !strict || !COMPARE_ALLOW_EXTRA(rel));
  console.log(
    bold(`\n${app}: ${comparison.same} same as RailPass, ${different.length} different, ${comparison.missing.length} not built yet, ${extra.length} extra`),
  );
  for (const rel of different) console.log(yellow(`    ≠ ${app}/${rel}`));
  for (const rel of comparison.missing) console.log(dim(`    · ${app}/${rel}`));
  for (const rel of extra) console.log(cyan(`    + ${app}/${rel}`));
  return different.length + comparison.missing.length + extra.length;
}

function commandDiff(raw, options) {
  const apps = raw ? [raw] : APPS;
  for (const app of apps) {
    if (!APPS.includes(app)) fail(`Unknown app "${app}". Use mobile or dashboard.`);
    const dir = path.join(options.workspace, app);
    if (!fs.existsSync(dir)) {
      console.log(dim(`\n${app}: not in this workspace yet.`));
      continue;
    }
    printComparison(app, compareApp(app, dir));
    console.log(dim(`See one file's differences: git diff --no-index ${path.join(REFERENCE_DIR, app, '<file>')} ${app}/<file>`));
  }
  console.log('');
}

// ---------------------------------------------------------------------------------------------
// Verify (maintainers)

function linkNodeModules(workspace) {
  for (const app of APPS) {
    const appDir = path.join(workspace, app);
    const modulesDir = path.join(appDir, 'node_modules');
    const source = path.join(REFERENCE_DIR, app, 'node_modules');
    if (!fs.existsSync(path.join(appDir, 'package.json')) || fs.existsSync(modulesDir)) continue;
    if (!fs.existsSync(source)) fail(`${source} is missing. Install the reference app's dependencies first.`);
    fs.mkdirSync(modulesDir);
    for (const entry of fs.readdirSync(source)) {
      if (['.cache', '.tmp', '.vite', '.vite-temp', '.yarn-integrity'].includes(entry)) continue;
      fs.symlinkSync(path.join(source, entry), path.join(modulesDir, entry));
    }
  }
}

// Expo writes .expo/types/router.d.ts while `expo start` runs; verify generates it the same way so Href types are checked.
const TYPED_ROUTES_SCRIPT = `
const fs = require('node:fs');
const path = require('node:path');
const appDir = process.argv[1];
const req = (id) => require(require.resolve(id, { paths: [appDir] }));
const { requireContext } = req('expo-router/internal/testing');
const { EXPO_ROUTER_CTX_IGNORE } = req('expo-router/_ctx-shared');
const { getTypedRoutesDeclarationFile } = req('@expo/router-server/build/typed-routes/generate');
const ctx = requireContext(path.join(appDir, 'app'), true, EXPO_ROUTER_CTX_IGNORE);
const file = getTypedRoutesDeclarationFile(ctx);
fs.mkdirSync(path.join(appDir, '.expo', 'types'), { recursive: true });
fs.writeFileSync(path.join(appDir, '.expo', 'types', 'router.d.ts'), file);
`;

function generateTypedRoutes(mobileDir) {
  const typesFile = path.join(mobileDir, '.expo', 'types', 'router.d.ts');
  fs.rmSync(typesFile, { force: true });
  let typedRoutes = false;
  try {
    typedRoutes = JSON.parse(fs.readFileSync(path.join(mobileDir, 'app.json'), 'utf8')).expo?.experiments?.typedRoutes === true;
  } catch {
    typedRoutes = false;
  }
  if (!typedRoutes || !fs.existsSync(path.join(mobileDir, 'app'))) return true;
  return run('mobile · typed routes', process.execPath, ['-e', TYPED_ROUTES_SCRIPT, mobileDir], mobileDir);
}

function run(label, command, args, cwd) {
  const started = Date.now();
  const result = spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, CI: '1', FORCE_COLOR: '0', NO_COLOR: '1' },
    maxBuffer: 64 * 1024 * 1024,
  });
  const seconds = ((Date.now() - started) / 1000).toFixed(1);
  const ok = result.status === 0;
  console.log(`    ${ok ? green('✓') : red('✗')} ${label} ${dim(`${seconds}s`)}`);
  if (!ok) {
    const output = `${result.stdout ?? ''}${result.stderr ?? ''}${result.error ? String(result.error) : ''}`.trim().split('\n');
    console.log(dim(output.slice(-60).map((line) => `      ${line}`).join('\n')));
  }
  return ok;
}

// At the start of a lesson the code must compile and lint (learners run it straight away), but tests may fail:
// a red test there points at a LIVE task. By the end of the lesson everything must pass.
function checkState(workspace, label, options, { testsMustPass = true } = {}) {
  console.log(bold(`  ${label}`));
  linkNodeModules(workspace);
  let ok = true;
  const test = (label, command, args, cwd) => {
    const passed = run(label, command, args, cwd);
    if (!passed && !testsMustPass) console.log(yellow('      ↳ allowed at the start of a lesson: failing tests point at LIVE tasks'));
    return passed || !testsMustPass;
  };
  const bin = (app, name) => path.join(workspace, app, 'node_modules', '.bin', name);
  const mobile = path.join(workspace, 'mobile');
  const dashboard = path.join(workspace, 'dashboard');
  const wants = (app) => !options.app || options.app === app;
  if (wants('mobile') && fs.existsSync(path.join(mobile, 'tsconfig.json'))) {
    ok = generateTypedRoutes(mobile) && ok;
    ok = run('mobile · tsc', bin('mobile', 'tsc'), ['--noEmit', '-p', 'tsconfig.json'], mobile) && ok;
    if (options.lint && fs.existsSync(path.join(mobile, 'eslint.config.js'))) ok = run('mobile · eslint', bin('mobile', 'eslint'), ['.'], mobile) && ok;
    if (options.test) ok = test('mobile · jest', bin('mobile', 'jest'), ['--ci', '--passWithNoTests', '--watchman=false'], mobile) && ok;
  }
  if (wants('dashboard') && fs.existsSync(path.join(dashboard, 'tsconfig.app.json'))) {
    ok = run('dashboard · tsc (app)', bin('dashboard', 'tsc'), ['-p', 'tsconfig.app.json', '--noEmit'], dashboard) && ok;
    ok = run('dashboard · tsc (node)', bin('dashboard', 'tsc'), ['-p', 'tsconfig.node.json', '--noEmit'], dashboard) && ok;
    if (options.lint) ok = run('dashboard · oxlint', bin('dashboard', 'oxlint'), [], dashboard) && ok;
    if (options.test) ok = test('dashboard · vitest', bin('dashboard', 'vitest'), ['run', '--passWithNoTests'], dashboard) && ok;
  }
  return ok;
}

function commandVerify(lessons, raw, options) {
  const selected = selectLessons(lessons, raw);
  const selectedIds = new Set(selected.map((lesson) => lesson.id));
  const last = selected[selected.length - 1];
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'railpass-course-'));
  const workspace = path.join(temp, 'ws');
  fs.mkdirSync(workspace);
  console.log(dim(`Composing lessons in ${workspace}${options.app ? ` (checking ${options.app} only)` : ''}`));
  const inScope = (marker) => !options.app || marker.file.startsWith(`${options.app}/`);
  let ok = true;

  for (const lesson of lessons) {
    if (lessonOrder(lesson.id) > lessonOrder(last.id)) break;
    const providedDir = path.join(lesson.dir, 'provided');
    const provided = applyOverlay(providedDir, workspace);
    const removed = applyRemovals(lesson, workspace);
    const check = selectedIds.has(lesson.id);
    if (check) {
      console.log(bold(`\n▶ ${lesson.id} · ${lesson.title}`));
      const foreign = findMarkers(providedDir, walk(providedDir), { kinds: ['LIVE', 'TALK'] }).filter((marker) => marker.id !== lesson.id && inScope(marker));
      if (foreign.length) {
        ok = false;
        console.log(red('    ✗ markers from other lessons in provided/:'));
        printMarkers(foreign);
      }
      const hollow = hollowLiveFiles(lesson, providedDir).filter((rel) => !options.app || rel.startsWith(`${options.app}/`));
      if (hollow.length) {
        ok = false;
        console.log(red('    ✗ LIVE task already done in provided/ (the solution only deletes the marker; leave a real gap):'));
        for (const rel of hollow) console.log(red(`      ${rel}`));
      }
      if (provided.some((item) => item.status !== 'unchanged') || removed.length || options.all) ok = checkState(workspace, 'start of lesson', options, { testsMustPass: false }) && ok;
    }
    const solution = applyOverlay(path.join(lesson.dir, 'solution'), workspace);
    if (check) {
      const leftovers = findMarkers(workspace, walk(workspace), { lessonId: lesson.id }).filter(inScope);
      if (leftovers.length) {
        ok = false;
        console.log(red('    ✗ LIVE markers left after the solution overlay:'));
        printMarkers(leftovers);
      }
      if (solution.some((item) => item.status !== 'unchanged') || options.all) ok = checkState(workspace, 'end of lesson', options) && ok;
    }
  }

  if (options.final) {
    console.log(bold('\n▶ Final comparison with RailPass'));
    const leftovers = findMarkers(workspace, walk(workspace), { kinds: ['LIVE', 'TALK'] }).filter(inScope);
    if (leftovers.length) {
      ok = false;
      console.log(red('    ✗ markers still present at the end of the course:'));
      printMarkers(leftovers);
    }
    for (const app of APPS.filter((name) => !options.app || options.app === name)) {
      const dir = path.join(workspace, app);
      if (fs.existsSync(dir)) ok = printComparison(app, compareApp(app, dir), { strict: true }) === 0 && ok;
    }
  }

  if (options.keep) console.log(dim(`\nKept ${workspace}`));
  else fs.rmSync(temp, { recursive: true, force: true });
  console.log(ok ? green('\n✓ verify passed') : red('\n✖ verify failed'));
  process.exit(ok ? 0 : 1);
}

// ---------------------------------------------------------------------------------------------

function parseArgs(argv) {
  const options = {
    workspace: process.cwd(),
    force: false,
    dryRun: false,
    verbose: false,
    lint: false,
    test: false,
    final: false,
    keep: false,
    all: false,
    app: undefined,
  };
  const positional = [];
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--workspace' || arg === '-w') options.workspace = path.resolve(argv[++index] ?? fail('--workspace needs a folder'));
    else if (arg === '--force' || arg === '-f') options.force = true;
    else if (arg === '--dry-run') options.dryRun = true;
    else if (arg === '--verbose' || arg === '-v') options.verbose = true;
    else if (arg === '--lint') options.lint = true;
    else if (arg === '--test') options.test = true;
    else if (arg === '--final') options.final = true;
    else if (arg === '--keep') options.keep = true;
    else if (arg === '--all-states') options.all = true;
    else if (arg === '--app') {
      options.app = argv[++index];
      if (!APPS.includes(options.app)) fail('--app needs mobile or dashboard');
    }
    else if (arg.startsWith('-')) fail(`Unknown option ${arg}`);
    else positional.push(arg);
  }
  return { command: positional[0], target: positional[1], options };
}

const HELP = `${bold('lesson')}: RailPass course workspace tool

  lesson list                     Lessons and what they change
  lesson start <NN>               Add lesson NN's files to your workspace (run inside my-railpass)
  lesson status [NN]              LIVE tasks still open in your workspace
  lesson solution <NN>            Fill in lesson NN's LIVE tasks with the finished code
  lesson catch-up <NN>            Make the course files match the end of lesson NN
  lesson files <NN>               What lesson NN adds, changes and removes
  lesson diff [mobile|dashboard]  Compare your apps with the RailPass reference

Options: --workspace <dir>  --force  --dry-run  --verbose
Maintainers: lesson verify [NN|NN..MM|all] [--app mobile|dashboard] [--lint] [--test] [--final] [--keep] [--all-states]
`;

function main() {
  const { command, target, options } = parseArgs(process.argv.slice(2));
  if (command === undefined || ['help', '--help', '-h'].includes(command)) return console.log(HELP);
  const lessons = loadLessons();
  switch (command) {
    case 'list':
      return commandList(lessons);
    case 'start':
      if (!target) fail('Which lesson? e.g. lesson start 01');
      return commandStart(lessons, target, options);
    case 'solution':
      if (!target) fail('Which lesson? e.g. lesson solution 05');
      return commandSolution(lessons, target, options);
    case 'catch-up':
    case 'catchup':
      if (!target) fail('Up to which lesson? e.g. lesson catch-up 04');
      return commandCatchUp(lessons, target, options);
    case 'files':
      if (!target) fail('Which lesson? e.g. lesson files 06');
      return commandFiles(lessons, target);
    case 'status':
      return commandStatus(lessons, target, options);
    case 'diff':
      return commandDiff(target, options);
    case 'verify':
      return commandVerify(lessons, target, options);
    default:
      fail(`Unknown command "${command}".\n${HELP}`);
  }
}

main();
