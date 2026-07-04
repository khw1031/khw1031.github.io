/**
 * Frontmatter integrity checker for all content .md files, plus the hand-authored
 * labs registry.
 *
 * - Validates each .md file's frontmatter against its collection Zod schema.
 * - Reports keys that are required-by-convention but absent from the raw
 *   frontmatter (schema defaults do NOT count as "present").
 * - Checks every labs entry in src/lib/labs.ts for a non-empty title/description,
 *   since labs share the same listings as posts.
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
import { join, relative, resolve, sep } from 'node:path';
import matter from 'gray-matter';
import type { ZodType } from 'zod';
import { baseFrontmatter, postSchema, readAndWriteSchema } from '../src/content/schemas';
// labs.ts only type-imports from ./collections, so this pulls in no Astro
// virtual modules at runtime — safe to import from a plain tsx script.
import { labs } from '../src/lib/labs';

const CONTENT_ROOT = resolve('src/content');

/**
 * Every .md under src/content/ is a target. Known collections carry their own
 * schema and required-key set; any other directory falls back to the base
 * schema and the schema-required identity fields, so new collections are checked
 * automatically until explicitly configured here.
 */
const KNOWN_SCHEMA: Record<string, ZodType> = {
  posts: postSchema,
  'read-and-write': readAndWriteSchema,
  notes: baseFrontmatter,
  inbox: baseFrontmatter,
};

/**
 * Keys that must be PRESENT in the raw frontmatter of every content .md file,
 * regardless of collection. notes/inbox are unlisted from search/sitemap but
 * still carry complete frontmatter.
 */
const REQUIRED_KEYS = ['title', 'pubDate', 'description', 'summary', 'lang', 'tags'];

interface FileReport {
  file: string;
  collection: string;
  missing: string[];
  invalid: { field: string; message: string }[];
  /** Identifies a specific entry within a multi-entry source (e.g. a lab href). */
  ref?: string;
}

/** Labs are a hand-authored TS registry, not .md; require a non-empty title/description. */
function labReports(): FileReport[] {
  const reports: FileReport[] = [];
  for (const lab of labs) {
    const missing: string[] = [];
    if (!lab.title?.trim()) missing.push('title');
    if (!lab.description?.trim()) missing.push('description');
    if (missing.length > 0) {
      reports.push({ file: 'src/lib/labs.ts', collection: 'labs', ref: lab.href, missing, invalid: [] });
    }
  }
  return reports;
}

/** Top-level directory under src/content/, or '(root)' for a bare .md. */
function collectionOf(file: string): string {
  const rel = relative(CONTENT_ROOT, file);
  const first = rel.split(sep)[0];
  return first.endsWith('.md') ? '(root)' : first;
}

function contentFiles(): string[] {
  if (!existsSync(CONTENT_ROOT)) return [];
  return readdirSync(CONTENT_ROOT, { recursive: true, withFileTypes: true })
    .filter((e) => e.isFile() && e.name.endsWith('.md'))
    .map((e) => join(e.parentPath, e.name))
    .sort();
}

function inspect(file: string): FileReport {
  const collection = collectionOf(file);
  const schema = KNOWN_SCHEMA[collection] ?? baseFrontmatter;

  const raw = readFileSync(file, 'utf-8');
  const data = matter(raw).data as Record<string, unknown>;

  const missing = REQUIRED_KEYS.filter((key) => !(key in data));

  const invalid: FileReport['invalid'] = [];
  const parsed = schema.safeParse(data);
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

  for (const file of contentFiles()) {
    const report = inspect(file);
    if (report.missing.length > 0 || report.invalid.length > 0) {
      reports.push(report);
    }
  }
  reports.push(...labReports());

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
    process.stdout.write(`  ${r.file}${r.ref ? ` (${r.ref})` : ''}\n`);
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
