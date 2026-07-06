import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';
import matter from 'gray-matter';

const COLLECTIONS = ['posts', 'read-and-write', 'notes', 'inbox'] as const;

function sourceFiles(collection: (typeof COLLECTIONS)[number]): string[] {
  const dir = resolve('src/content', collection);
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { recursive: true, encoding: 'utf-8' })
    .filter((name) => name.endsWith('.md'))
    .sort();
}

function writeRawMarkdown(collection: (typeof COLLECTIONS)[number], relFile: string): void {
  // Mirror the content-collection id: path without extension, `/index` folded
  // into its directory (notes/foo/index.md serves at /notes/foo/raw.md).
  const slug = relFile
    .split(sep)
    .join('/')
    .replace(/\.md$/, '')
    .replace(/\/index$/, '');
  const outDir = resolve('public', collection, slug);
  const raw = readFileSync(resolve('src/content', collection, relFile), 'utf-8');
  const body = matter(raw).content;

  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'raw.md'), body);
}

function main(): void {
  let count = 0;
  for (const collection of COLLECTIONS) {
    for (const file of sourceFiles(collection)) {
      writeRawMarkdown(collection, file);
      count += 1;
    }
  }
  console.log(`✓ generated ${count} raw markdown file(s)`);
}

main();
