import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  rmdirSync,
  writeFileSync,
} from 'node:fs';
import { join, resolve, sep } from 'node:path';
import matter from 'gray-matter';

const COLLECTIONS = [
  'posts',
  'read-and-write',
  'notes',
  'inbox',
  'wiki',
  'specs',
  'idea',
  'docs',
] as const;

type Collection = (typeof COLLECTIONS)[number];

function sourceFiles(collection: Collection): string[] {
  const dir = resolve('src/content', collection);
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { recursive: true, encoding: 'utf-8' })
    .filter((name) => name.endsWith('.md'))
    .sort();
}

// Mirror the content-collection id: path without extension, `/index` folded
// into its directory (notes/foo/index.md serves at /notes/foo/raw.md).
function outDirFor(collection: Collection, relFile: string): string {
  const slug = relFile
    .split(sep)
    .join('/')
    .replace(/\.md$/, '')
    .replace(/\/index$/, '');
  return resolve('public', collection, slug);
}

function writeRawMarkdown(collection: Collection, relFile: string, outDir: string): void {
  const raw = readFileSync(resolve('src/content', collection, relFile), 'utf-8');
  const body = matter(raw).content;

  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'raw.md'), body);
}

// Drop `raw.md` outputs whose source document no longer exists, then remove the
// directories left empty behind them. Without this a moved or deleted note keeps
// an orphaned raw.md under public/, and Astro copies it into dist on every
// build — so the old URL keeps serving stale content indefinitely.
//
// Deliberately conservative: only files named exactly `raw.md` are deleted, and
// only directories that end up empty are removed. Anything else under
// public/{collection}/ is left untouched.
function pruneOrphans(collection: Collection, expected: Set<string>): number {
  const root = resolve('public', collection);
  if (!existsSync(root)) return 0;

  let removed = 0;

  // Returns true when `dir` holds nothing after pruning, so the caller can drop it.
  const walk = (dir: string): boolean => {
    let kept = 0;

    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);

      if (entry.isDirectory()) {
        if (walk(full)) rmdirSync(full);
        else kept += 1;
      } else if (entry.name === 'raw.md' && !expected.has(dir)) {
        rmSync(full);
        removed += 1;
      } else {
        kept += 1;
      }
    }

    return kept === 0;
  };

  // The collection root itself stays even when emptied — only its contents are pruned.
  walk(root);

  return removed;
}

function main(): void {
  let generated = 0;
  let pruned = 0;

  for (const collection of COLLECTIONS) {
    const expected = new Set<string>();

    for (const file of sourceFiles(collection)) {
      const outDir = outDirFor(collection, file);
      writeRawMarkdown(collection, file, outDir);
      expected.add(outDir);
      generated += 1;
    }

    pruned += pruneOrphans(collection, expected);
  }

  console.log(`✓ generated ${generated} raw markdown file(s)`);
  if (pruned > 0) console.log(`✓ pruned ${pruned} orphaned raw markdown file(s)`);
}

main();
