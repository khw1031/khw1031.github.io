/**
 * Frontmatter integrity checker for all content .md files.
 *
 * - Validates each file's frontmatter against its collection Zod schema.
 * - Reports keys that are required-by-convention but absent from the raw
 *   frontmatter (schema defaults do NOT count as "present").
 *
 * Usage:
 *   tsx scripts/check-frontmatter.ts          # human report, exit 1 on errors
 *   tsx scripts/check-frontmatter.ts --json    # machine-readable report on stdout
 *
 * Severity model:
 *   - error : schema-invalid OR missing a required key for that collection.
 *             Blocks the pre-push hook.
 *   The /lint skill consumes --json to auto-fill the gaps.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import matter from 'gray-matter';
import type { ZodType } from 'zod';
import { baseFrontmatter, postSchema, readAndWriteSchema } from '../src/content/schemas';

type Collection = 'posts' | 'read-and-write' | 'notes' | 'inbox';

const SCHEMA: Record<Collection, ZodType> = {
  posts: postSchema,
  'read-and-write': readAndWriteSchema,
  notes: baseFrontmatter,
  inbox: baseFrontmatter,
};

/**
 * Keys that must be PRESENT in the raw frontmatter for each collection.
 * Public listed collections carry the full set; unlisted notes/inbox stay
 * lightweight and only need the schema-required identity fields.
 */
const REQUIRED_KEYS: Record<Collection, string[]> = {
  posts: ['title', 'pubDate', 'description', 'summary', 'lang', 'tags'],
  'read-and-write': ['title', 'pubDate', 'description', 'summary', 'lang', 'tags'],
  notes: ['title', 'pubDate'],
  inbox: ['title', 'pubDate'],
};

interface FileReport {
  file: string;
  collection: Collection;
  missing: string[];
  invalid: { field: string; message: string }[];
}

function sourceFiles(collection: Collection): string[] {
  const dir = resolve('src/content', collection);
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((e) => e.isFile() && e.name.endsWith('.md'))
    .map((e) => join(e.parentPath, e.name))
    .sort();
}

function inspect(collection: Collection, file: string): FileReport {
  const raw = readFileSync(file, 'utf-8');
  const data = matter(raw).data as Record<string, unknown>;

  const missing = REQUIRED_KEYS[collection].filter((key) => !(key in data));

  const invalid: FileReport['invalid'] = [];
  const parsed = SCHEMA[collection].safeParse(data);
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      const field = issue.path.length > 0 ? issue.path.join('.') : '(root)';
      invalid.push({ field, message: issue.message });
    }
  }

  return { file: relative(process.cwd(), file), collection, missing, invalid };
}

function main(): void {
  const json = process.argv.includes('--json');
  const reports: FileReport[] = [];

  for (const collection of Object.keys(SCHEMA) as Collection[]) {
    for (const file of sourceFiles(collection)) {
      const report = inspect(collection, file);
      if (report.missing.length > 0 || report.invalid.length > 0) {
        reports.push(report);
      }
    }
  }

  if (json) {
    process.stdout.write(`${JSON.stringify(reports, null, 2)}\n`);
    process.exit(reports.length > 0 ? 1 : 0);
  }

  if (reports.length === 0) {
    process.stdout.write('✓ frontmatter: all content files pass\n');
    process.exit(0);
  }

  process.stdout.write(`✗ frontmatter issues in ${reports.length} file(s):\n\n`);
  for (const r of reports) {
    process.stdout.write(`  ${r.file}\n`);
    if (r.missing.length > 0) {
      process.stdout.write(`    missing: ${r.missing.join(', ')}\n`);
    }
    for (const i of r.invalid) {
      process.stdout.write(`    invalid: ${i.field} — ${i.message}\n`);
    }
  }
  process.stdout.write('\nRun /lint to auto-fill missing frontmatter, then re-check.\n');
  process.exit(1);
}

main();
