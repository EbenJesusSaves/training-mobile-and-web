import { existsSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const repo = resolve(new URL('..', import.meta.url).pathname);
const training = join(repo, 'training');
const mdFiles = [];

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

function candidateToPath(value) {
  const clean = value.replace(/#.*$/, '').replace(/:\d+(:\d+)?$/, '');
  if (!clean || clean.includes('*') || clean.includes('<') || clean.includes('{') || clean.startsWith('http')) return null;
  const prefixes = ['../', './', 'training/', 'mobile/', 'dashboard/', 'backend/', 'docs/', 'scripts/', '.husky/', '.artifacts/', 'README.md'];
  if (!prefixes.some((prefix) => clean === prefix || clean.startsWith(prefix))) return null;
  if (clean.startsWith('../')) return resolve(training, clean);
  if (clean.startsWith('./')) return resolve(training, clean);
  return resolve(repo, clean);
}

walk(training);
const missing = [];
const checked = [];
for (const file of mdFiles) {
  const text = stripFences(await BunLikeRead(file));
  const matches = text.matchAll(/`([^`\n]+)`/g);
  for (const match of matches) {
    const target = candidateToPath(match[1].trim());
    if (!target) continue;
    checked.push([file, match[1].trim(), target]);
    if (!existsSync(target)) missing.push([file, match[1].trim(), target]);
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
