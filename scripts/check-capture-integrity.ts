/**
 * Capture-integrity checker for agent-authored content.
 *
 * A capture can fail in ways every other checker passes: frontmatter is complete
 * and valid, so check-frontmatter is happy, and check-notes-polish only reports
 * "unpolished" — which is indistinguishable from "not polished yet". Two real
 * failures in this repo looked healthy to both:
 *
 *   - `2026-07-30-satteri-…` — description, summary, and the entire body were all
 *     the agent's own meta-sentence ("먼저 원본 페이지의 내용을 확인하겠습니다.").
 *     The capture produced nothing but passed every check.
 *   - `2026-07-30-디자이너를-위한-…` — the body stopped mid-table at `| 아름다`,
 *     losing §핵심 시사점, §레퍼런스, and §확인 질문.
 *
 * So this checker looks for *structural corruption*, deliberately NOT for template
 * conformance. Requiring `## TL;DR` / `## 레퍼런스` / `> 출처:` was measured and
 * rejected: of 139 inbox captures only 104 / 126 / 92 carry them, so a conformance
 * rule would flag 30–47 older-but-fine captures and bury the real failures.
 *
 * Checks (all calibrated to zero false positives on the tree at 2026-07-30):
 *   - truncated-table  a row inside a real table block that does not close with `|`
 *   - unclosed-fence   an odd number of ``` fence markers
 *   - short-body       body under MIN_BODY_CHARS (measured floor of a healthy file
 *                      is 923 chars, so the threshold has wide margin)
 *   - meta-echo        the body is just the description/summary repeated — the
 *                      signature of an agent meta-sentence written into all fields
 *
 * Code-fence content is skipped for the table check: TypeScript discriminated
 * unions legitimately start lines with `|` and are not tables.
 *
 * Warning-only: NEVER blocks a push (always exit 0), matching check-notes-polish
 * and check-stray-script. Captures arrive as commits from another machine, so a
 * local pre-push hook cannot prevent their entry — blocking would only stop
 * unrelated pushes. Repair is an explicit re-capture from the source.
 *
 * Usage:
 *   tsx scripts/check-capture-integrity.ts          # human report, exit 0
 *   tsx scripts/check-capture-integrity.ts --json    # machine-readable, exit 0
 *
 * Scope: pass file path(s) as positional args, or set CAPTURE_SCOPE=<comma/newline
 * separated repo-relative paths>, to restrict the scan.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';
import matter from 'gray-matter';

const CONTENT_ROOT = resolve('src/content');

/** Agent-authored collections. posts and read-and-write are user-authored. */
const TARGET_COLLECTIONS = new Set(['notes', 'inbox', 'idea', 'sources']);

/** Measured floor of a healthy body is 923 chars; this leaves wide margin. */
const MIN_BODY_CHARS = 500;

type Kind = 'truncated-table' | 'unclosed-fence' | 'short-body' | 'meta-echo';

interface IntegrityReport {
  file: string;
  collection: string;
  kind: Kind;
  /** 1-indexed body line for line-anchored kinds; null for whole-file kinds. */
  line: number | null;
  detail: string;
}

function collectionOf(file: string): string {
  const rel = relative(CONTENT_ROOT, file);
  const first = rel.split(sep)[0];
  return first.endsWith('.md') ? '(root)' : first;
}

function scopeSet(): Set<string> | null {
  const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
  const env = (process.env.CAPTURE_SCOPE ?? '')
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

/** A markdown table separator row: `|---|---|`, `| :--- | ---: |`, … */
function isSeparatorRow(line: string): boolean {
  return /^\|(\s*:?-{3,}:?\s*\|)+$/.test(line.trim());
}

/** Body text with the trailing `> 출처:` line and all whitespace collapsed. */
function normalizedProse(body: string): string {
  return body
    .split('\n')
    .filter((l) => !l.trim().startsWith('> 출처:'))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function inspect(file: string): IntegrityReport[] {
  const raw = readFileSync(file, 'utf-8');
  const parsed = matter(raw);
  const body = parsed.content;
  const data = parsed.data as Record<string, unknown>;
  const rel = relative(process.cwd(), file);
  const base = { file: rel, collection: collectionOf(file) };
  const out: IntegrityReport[] = [];

  const lines = body.split('\n');
  let inFence = false;
  let inTable = false;
  lines.forEach((line, i) => {
    const s = line.trim();
    if (s.startsWith('```')) {
      inFence = !inFence;
      return;
    }
    if (inFence) return;

    // A table block starts at a separator row and ends at the first non-row line.
    if (isSeparatorRow(s)) {
      inTable = true;
      return;
    }
    if (!s.startsWith('|')) {
      inTable = false;
      return;
    }
    if (inTable && !s.endsWith('|')) {
      out.push({
        ...base,
        kind: 'truncated-table',
        line: i + 1,
        detail: `표 행이 '|'로 닫히지 않음: ${s.slice(0, 40)}`,
      });
    }
  });

  const fences = lines.filter((l) => l.trim().startsWith('```')).length;
  if (fences % 2 !== 0) {
    out.push({
      ...base,
      kind: 'unclosed-fence',
      line: null,
      detail: `코드펜스 ${fences}개 — 홀수이므로 닫히지 않음`,
    });
  }

  const trimmed = body.trim();
  if (trimmed.length < MIN_BODY_CHARS) {
    out.push({
      ...base,
      kind: 'short-body',
      line: null,
      detail: `본문 ${trimmed.length}자 — 정상 최소치(923자)에 크게 미달`,
    });
  }

  const prose = normalizedProse(body);
  for (const key of ['description', 'summary'] as const) {
    const value = String(data[key] ?? '').trim();
    if (value !== '' && prose !== '' && prose === value) {
      out.push({
        ...base,
        kind: 'meta-echo',
        line: null,
        detail: `본문이 ${key}와 동일 — 캡처가 실제 내용을 못 담았을 가능성`,
      });
    }
  }

  return out;
}

function main(): void {
  const reports = targetFiles(scopeSet()).flatMap(inspect);

  if (process.argv.includes('--json')) {
    process.stdout.write(`${JSON.stringify(reports, null, 2)}\n`);
    process.exit(0);
  }

  if (reports.length === 0) {
    process.stdout.write('✓ capture-integrity: no truncated or degenerate bodies\n');
    process.exit(0);
  }

  const files = new Set(reports.map((r) => r.file));
  process.stdout.write(`⚠ ${reports.length} integrity problem(s) in ${files.size} file(s):\n\n`);
  for (const r of reports) {
    const at = r.line === null ? '' : `:${r.line}`;
    process.stdout.write(`  ${r.file}${at}  [${r.kind}]\n    ${r.detail}\n`);
  }
  process.stdout.write(
    '\n캡처가 깨진 것이면 frontmatter의 canonical에서 다시 캡처한다. 폴리시로 덮지 않는다.\n',
  );
  process.exit(0);
}

main();
