import { existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';

const repo = resolve(new URL('..', import.meta.url).pathname);
const training = join(repo, 'training');
const course = join(training, 'course');
const lessonsDir = join(course, 'lessons');
const mdFiles = [];

// Course docs also point at files that only exist in a learner workspace, built from these overlays.
const overlays = existsSync(lessonsDir)
  ? readdirSync(lessonsDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .flatMap((entry) => ['provided', 'solution'].map((kind) => join(lessonsDir, entry.name, kind)))
  : [];

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.artifacts', '.yarn-cache-course'].includes(entry.name)) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path);
    else if (entry.name.endsWith('.md')) mdFiles.push(path);
  }
}

function stripFences(markdown) {
  return markdown.replace(/```[\s\S]*?```/g, '');
}

function candidateToPath(value, file) {
  const clean = value.replace(/#.*$/, '').replace(/:\d+(:\d+)?$/, '');
  if (!clean || clean.includes('*') || clean.includes('<') || clean.includes('{') || clean.startsWith('http')) return null;
  const prefixes = ['../', './', 'training/', 'mobile/', 'dashboard/', 'backend/', 'docs/', 'scripts/', '.husky/', '.artifacts/', 'README.md'];
  if (!prefixes.some((prefix) => clean === prefix || clean.startsWith(prefix))) return null;
  if (file.startsWith(course + sep)) {
    // Relative specifiers in course docs are imports; kata files describe hypothetical code.
    if (clean.startsWith('./') || clean.startsWith('../') || file.split(sep).includes('kata')) return null;
  }
  if (clean.startsWith('../')) return resolve(training, clean);
  if (clean.startsWith('./')) return resolve(training, clean);
  return resolve(repo, clean);
}

function pathExists(target) {
  if (existsSync(target)) return true;
  // Learners create .env from the committed .env.example.
  if (target.endsWith('.env') && existsSync(`${target}.example`)) return true;
  const rel = relative(repo, target);
  return overlays.some((overlay) => existsSync(join(overlay, rel)));
}

walk(training);
const missing = [];
const checked = [];
for (const file of mdFiles) {
  const text = stripFences(await BunLikeRead(file));
  const matches = text.matchAll(/`([^`\n]+)`/g);
  for (const match of matches) {
    const target = candidateToPath(match[1].trim(), file);
    if (!target) continue;
    checked.push([file, match[1].trim(), target]);
    if (!pathExists(target)) missing.push([file, match[1].trim(), target]);
  }
}

for (const [file, raw, target] of missing) {
  console.error(`Missing path: ${raw} in ${file}\n  -> ${target}`);
}
console.log(`Checked ${checked.length} Markdown path references in ${mdFiles.length} files.`);
if (missing.length) process.exit(1);

async function BunLikeRead(path) {
  const { readFileSync } = await import('node:fs');
  return readFileSync(path, 'utf8');
}
