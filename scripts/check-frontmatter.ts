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
 *   tsx scripts/check-frontmatter.ts --stamp   # write lintHash = current body hash
 *
 * Severity model:
 *   - error   : schema-invalid OR missing a required key. Blocks the pre-push hook.
 *   - warning : stale — the body changed since the AI-derived fields were last
 *               generated (lintHash mismatch/absent). Reported but does NOT block.
 *   The /lint skill consumes --json to auto-fill gaps, regenerate stale fields,
 *   and re-stamp the hash (via --stamp) once the content is fresh.
 */
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
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
  /** Warning (non-blocking): body changed since the derived fields were generated. */
  stale?: boolean;
  /** Current body hash — what /lint should stamp after refreshing the file. */
  bodyHash?: string;
  /** Identifies a specific entry within a multi-entry source (e.g. a lab href). */
  ref?: string;
}

/** Short hash of the markdown body only (frontmatter excluded) to detect drift. */
function bodyHash(raw: string): string {
  return createHash('sha256').update(matter(raw).content).digest('hex').slice(0, 12);
}

function hasError(r: FileReport): boolean {
  return r.missing.length > 0 || r.invalid.length > 0;
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

  const hash = bodyHash(raw);
  const stale = String(data.lintHash ?? '') !== hash;

  return { file: relative(process.cwd(), file), collection, missing, invalid, stale, bodyHash: hash };
}

/** Deterministically write `lintHash: '<body hash>'` into every content file. */
function stampHashes(): number {
  let stamped = 0;
  for (const file of contentFiles()) {
    const raw = readFileSync(file, 'utf-8');
    const hash = bodyHash(raw);
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!match) continue;
    const block = match[1];
    const line = `lintHash: '${hash}'`;
    const nextBlock = /^lintHash:.*$/m.test(block)
      ? block.replace(/^lintHash:.*$/m, line)
      : `${block}\n${line}`;
    if (nextBlock === block) continue;
    writeFileSync(file, raw.replace(block, nextBlock));
    stamped += 1;
  }
  return stamped;
}

function main(): void {
  if (process.argv.includes('--stamp')) {
    const stamped = stampHashes();
    process.stdout.write(`✓ stamped lintHash on ${stamped} file(s)\n`);
    process.exit(0);
  }

  const json = process.argv.includes('--json');
  const reports: FileReport[] = [];

  for (const file of contentFiles()) {
    const report = inspect(file);
    if (hasError(report) || report.stale) {
      reports.push(report);
    }
  }
  reports.push(...labReports());

  const errors = reports.filter(hasError);
  const stale = reports.filter((r) => r.stale && !hasError(r));

  if (json) {
    process.stdout.write(`${JSON.stringify(reports, null, 2)}\n`);
    process.exit(errors.length > 0 ? 1 : 0);
  }

  if (reports.length === 0) {
    process.stdout.write('✓ frontmatter: all content files pass\n');
    process.exit(0);
  }

  if (errors.length > 0) {
    process.stdout.write(`✗ frontmatter issues in ${errors.length} file(s):\n\n`);
    for (const r of errors) {
      process.stdout.write(`  ${r.file}${r.ref ? ` (${r.ref})` : ''}\n`);
      if (r.missing.length > 0) {
        process.stdout.write(`    missing: ${r.missing.join(', ')}\n`);
      }
      for (const i of r.invalid) {
        process.stdout.write(`    invalid: ${i.field} — ${i.message}\n`);
      }
    }
    process.stdout.write('\n');
  }

  if (stale.length > 0) {
    process.stdout.write(`⚠ ${stale.length} file(s) stale (body changed since last lint):\n\n`);
    for (const r of stale) {
      process.stdout.write(`  ${r.file}\n`);
    }
    process.stdout.write('\n');
  }

  process.stdout.write('Run /lint to refresh frontmatter (fills gaps, regenerates stale fields).\n');
  process.exit(errors.length > 0 ? 1 : 0);
}

main();
