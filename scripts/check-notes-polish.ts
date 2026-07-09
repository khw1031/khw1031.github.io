/**
 * Polish-staleness checker for agent-authored content collections.
 *
 * The /notes-polish skill applies two body edits to agent-authored notes:
 *   1. `==마커==` highlight of the load-bearing spans, and
 *   2. hub / sub-TOC restructuring (deferring to each collection's own charter).
 * Both mutate the body, so this checker mirrors check-frontmatter's hashing: it
 * stamps `polishHash` = short hash of the body only (frontmatter excluded) and
 * flags a file when the current body hash differs (or the hash is absent) — the
 * body changed since it was last polished, so a /notes-polish pass is due.
 *
 * Scope: notes, inbox, specs, wiki only. posts and read-and-write are
 * user-authored and never polished.
 *
 * Warning-only: this NEVER blocks a push (always exit 0). The pre-push hook runs
 * it for an advisory before the frontmatter check; the actual polish is an
 * explicit /notes-polish invocation, run before /lint.
 *
 * Usage:
 *   tsx scripts/check-notes-polish.ts          # human report, exit 0
 *   tsx scripts/check-notes-polish.ts --json    # machine-readable report, exit 0
 *   tsx scripts/check-notes-polish.ts --stamp   # write polishHash = current body hash
 *
 * Scope (per-note pipeline): pass file path(s) as positional args, or set
 * NOTES_POLISH_SCOPE=<comma/newline-separated repo-relative paths>, to restrict
 * both the report and --stamp to only those files. Unset/none = full-collection
 * batch (the human-run pass). The automated publish bridge sets NOTES_POLISH_SCOPE
 * to the single just-authored note so a per-note trigger never re-polishes the
 * whole collection (spec: batch is a separate, explicit human path).
 */
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';
import matter from 'gray-matter';

const CONTENT_ROOT = resolve('src/content');

/** Agent-authored collections. posts and read-and-write are user-authored — never polished. */
const TARGET_COLLECTIONS = new Set(['notes', 'inbox', 'specs', 'wiki']);

interface PolishReport {
  file: string;
  collection: string;
  /** 'unpolished' = never stamped; 'stale' = body changed since last polish. */
  reason: 'unpolished' | 'stale';
  /** Current body hash — what /notes-polish should stamp after refreshing the file. */
  bodyHash: string;
}

/** Short hash of the markdown body only (frontmatter excluded) to detect drift. */
function bodyHash(raw: string): string {
  return createHash('sha256').update(matter(raw).content).digest('hex').slice(0, 12);
}

/** Top-level directory under src/content/, or '(root)' for a bare .md. */
function collectionOf(file: string): string {
  const rel = relative(CONTENT_ROOT, file);
  const first = rel.split(sep)[0];
  return first.endsWith('.md') ? '(root)' : first;
}

/**
 * Optional scope: positional path args + NOTES_POLISH_SCOPE env (comma/newline
 * separated). Returns a Set of absolute paths, or null when unscoped (full batch).
 */
function scopeSet(): Set<string> | null {
  const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
  const env = (process.env.NOTES_POLISH_SCOPE ?? '')
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
  const all = [...args, ...env];
  if (all.length === 0) return null;
  return new Set(all.map((p) => resolve(p)));
}

function targetFiles(scope: Set<string> | null): string[] {
  if (!existsSync(CONTENT_ROOT)) return [];
  return readdirSync(CONTENT_ROOT, { recursive: true, withFileTypes: true })
    .filter((e) => e.isFile() && e.name.endsWith('.md'))
    .map((e) => join(e.parentPath, e.name))
    .filter((f) => TARGET_COLLECTIONS.has(collectionOf(f)))
    .filter((f) => scope === null || scope.has(resolve(f)))
    .sort();
}

function inspect(file: string): PolishReport | null {
  const raw = readFileSync(file, 'utf-8');
  const data = matter(raw).data as Record<string, unknown>;
  const hash = bodyHash(raw);
  const stamped = String(data.polishHash ?? '');
  if (stamped === hash) return null;
  return {
    file: relative(process.cwd(), file),
    collection: collectionOf(file),
    reason: stamped === '' ? 'unpolished' : 'stale',
    bodyHash: hash,
  };
}

/** Deterministically write `polishHash: '<body hash>'` into every target file. */
function stampHashes(scope: Set<string> | null): number {
  let stamped = 0;
  for (const file of targetFiles(scope)) {
    const raw = readFileSync(file, 'utf-8');
    const hash = bodyHash(raw);
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!match) continue;
    const block = match[1];
    const line = `polishHash: '${hash}'`;
    const nextBlock = /^polishHash:.*$/m.test(block)
      ? block.replace(/^polishHash:.*$/m, line)
      : `${block}\n${line}`;
    if (nextBlock === block) continue;
    writeFileSync(file, raw.replace(block, nextBlock));
    stamped += 1;
  }
  return stamped;
}

function main(): void {
  const scope = scopeSet();

  if (process.argv.includes('--stamp')) {
    const n = stampHashes(scope);
    process.stdout.write(`✓ stamped polishHash on ${n} file(s)\n`);
    process.exit(0);
  }

  const json = process.argv.includes('--json');
  const reports = targetFiles(scope)
    .map(inspect)
    .filter((r): r is PolishReport => r !== null);

  if (json) {
    process.stdout.write(`${JSON.stringify(reports, null, 2)}\n`);
    process.exit(0);
  }

  if (reports.length === 0) {
    process.stdout.write('✓ notes-polish: all agent-authored content is fresh\n');
    process.exit(0);
  }

  process.stdout.write(`⚠ ${reports.length} agent-authored file(s) due for a polish pass:\n\n`);
  for (const r of reports) {
    process.stdout.write(`  ${r.file} (${r.reason})\n`);
  }
  process.stdout.write(
    '\nRun /notes-polish to highlight key content and align structure (before /lint).\n',
  );
  process.exit(0);
}

main();
