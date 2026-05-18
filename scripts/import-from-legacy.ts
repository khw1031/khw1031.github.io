import { execSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import matter from 'gray-matter';
import { convertLegacyFrontmatter } from '../src/lib/legacy-frontmatter';
import { convertQuoteJsx } from '../src/lib/quote-jsx';

const SOURCE_BRANCH = 'legacy/nextjs';
const CONTENT_ROOT = 'src/content';

interface Migration {
  collection: string;
  legacyPath: string;
  slug: string;
}

const POST_SLUGS = [
  '20250330',
  '20250404',
  '20250407',
  '20251210',
  '20251211',
  '20251218',
  '20251220',
  '20251221',
];

const RW_SLUGS = ['251129', '251201', '251211', '251214', '251222'];

const migrations: Migration[] = [
  ...POST_SLUGS.map((s) => ({
    collection: 'posts',
    legacyPath: `src/app/posts/${s}.mdx`,
    slug: s,
  })),
  {
    collection: 'notes',
    legacyPath: 'src/app/notes/posts/2024/fp.js.mdx',
    slug: '2024-fp-js',
  },
  {
    collection: 'notes',
    legacyPath: 'src/app/notes/posts/2024/fx.mdx',
    slug: '2024-fx',
  },
  {
    collection: 'notes',
    legacyPath: 'src/app/notes/posts/2024/http1.1.mdx',
    slug: '2024-http-1-1',
  },
  {
    collection: 'log',
    legacyPath: 'src/app/log/posts/2024/06/20240617.mdx',
    slug: '20240617',
  },
  {
    collection: 'log',
    legacyPath: 'src/app/log/posts/2024/06/20240619.mdx',
    slug: '20240619',
  },
  {
    collection: 'cs',
    legacyPath: 'src/app/cs/posts/hash.mdx',
    slug: 'hash',
  },
  {
    collection: 'cs',
    legacyPath: 'src/app/cs/posts/hash2.mdx',
    slug: 'hash2',
  },
  ...RW_SLUGS.map((s) => ({
    collection: 'read-and-write',
    legacyPath: `src/app/read-and-write/posts/${s}.mdx`,
    slug: s,
  })),
];

function readFromLegacy(path: string): string {
  return execSync(`git show ${SOURCE_BRANCH}:${path}`, {
    encoding: 'utf-8',
    maxBuffer: 10 * 1024 * 1024,
  });
}

function migrate(entry: Migration): void {
  const raw = readFromLegacy(entry.legacyPath);
  const parsed = matter(raw);
  const newFm = convertLegacyFrontmatter(parsed.data);
  const body = convertQuoteJsx(parsed.content);
  const out = matter.stringify(body, newFm as unknown as Record<string, unknown>);
  const outDir = `${CONTENT_ROOT}/${entry.collection}`;
  mkdirSync(outDir, { recursive: true });
  const outPath = `${outDir}/${entry.slug}.md`;
  writeFileSync(outPath, out);
  console.log(`✓ ${outPath}`);
}

let failed = 0;
for (const entry of migrations) {
  try {
    migrate(entry);
  } catch (error) {
    failed += 1;
    console.error(`✗ ${entry.legacyPath}: ${(error as Error).message}`);
  }
}

if (failed > 0) {
  console.error(`\n${failed} migration(s) failed.`);
  process.exit(1);
}

console.log(`\nMigrated ${migrations.length} files.`);
