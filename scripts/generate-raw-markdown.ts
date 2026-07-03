import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import matter from 'gray-matter';

const COLLECTIONS = ['posts', 'read-and-write', 'notes', 'inbox'] as const;

function sourceFiles(collection: (typeof COLLECTIONS)[number]): string[] {
  const dir = resolve('src/content', collection);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((name) => name.endsWith('.md'))
    .sort()
    .map((name) => join(dir, name));
}

function writeRawMarkdown(collection: (typeof COLLECTIONS)[number], file: string): void {
  const slug = basename(file, '.md');
  const outDir = resolve('public', collection, slug);
  const raw = readFileSync(file, 'utf-8');
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
