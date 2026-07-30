/**
 * Stray-script checker for authored content.
 *
 * AGENTS.md §Script: Korean is written in 한글. 한자 is not used as ordinary
 * prose, and Japanese kana / simplified-Chinese-only forms are never used. These
 * characters arrive as capture-time leakage from an upstream model or source, not
 * as an authorial choice, so they are a defect unless the text is quoting or is
 * about that script.
 *
 * Why a script and not the /notes-polish model pass: character-class
 * contamination is deterministic. A script finds every occurrence in the whole
 * tree cheaply and never misses one, while /notes-polish is a judgment pass whose
 * failure spec forbids rewriting prose. So the split is: this finds, a human or
 * model fixes. Replacement is NOT automated on purpose — 続く → 이어지는 /
 * 계속되는 / 지속되는 is a meaning choice, not a substitution table.
 *
 * What is flagged:
 *   - Hiragana (U+3040–U+309F) and Katakana (U+30A0–U+30FF) — unambiguous, a
 *     Korean document never needs them outside a quotation.
 *   - A short list of simplified-Chinese-only forms actually observed in this
 *     repo's leakage (see SIMPLIFIED_ONLY).
 *
 * What is NOT flagged: CJK ideographs in general (U+4E00–U+9FFF). Korean prose
 * legitimately uses 한자 for disambiguation and in quoted titles, so flagging the
 * whole block would bury the real hits in false positives. The §Script rule
 * discourages 한자 in prose; enforcing that needs judgment, not a range test.
 *
 * Warning-only: NEVER blocks a push (always exit 0), matching
 * check-notes-polish. Fixing is an explicit edit, not a hook side effect.
 *
 * Usage:
 *   tsx scripts/check-stray-script.ts          # human report, exit 0
 *   tsx scripts/check-stray-script.ts --json    # machine-readable report, exit 0
 *
 * Scope: pass file path(s) as positional args, or set STRAY_SCRIPT_SCOPE=<comma/
 * newline-separated repo-relative paths>, to restrict the scan to those files.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';

const CONTENT_ROOT = resolve('src/content');

/** Hiragana + Katakana. Never legitimate in Korean prose outside a quotation. */
const KANA = /[぀-ゟ゠-ヿ]/gu;

/**
 * Simplified-Chinese-only forms observed leaking into this repo. Kept as an
 * explicit list rather than a range: the simplified block overlaps characters
 * that are also valid 한자, so a range test would false-positive.
 */
const SIMPLIFIED_ONLY = /[构习后众义]/gu;

/**
 * Files whose foreign script is deliberate: the content quotes or is about that
 * script. Each entry needs a reason — an allowlist without one is indistinguishable
 * from an unfixed defect.
 */
const ALLOWLIST: Record<string, string> = {
  'src/content/inbox/2026-07-04-최상위-ai-모델에-던져야-할-단-하나의-질문과-다섯-가지-전개.md':
    '일본어 프롬프트 원문을 한국어 주석과 함께 직접 인용하고, 레퍼런스에 원 트윗의 일본어 제목을 남긴다.',
};

interface StrayHit {
  file: string;
  line: number;
  /** 'kana' or 'simplified' — which rule the character violates. */
  kind: 'kana' | 'simplified';
  /** The offending characters found on this line, deduplicated. */
  chars: string[];
  /** Trimmed excerpt around the first hit, for locating it without opening the file. */
  excerpt: string;
}

/** Top-level directory under src/content/, or '(root)' for a bare .md. */
function collectionOf(file: string): string {
  const rel = relative(CONTENT_ROOT, file);
  const first = rel.split(sep)[0];
  return first.endsWith('.md') ? '(root)' : first;
}

/** Optional scope: positional path args + STRAY_SCRIPT_SCOPE env. */
function scopeSet(): Set<string> | null {
  const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
  const env = (process.env.STRAY_SCRIPT_SCOPE ?? '')
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
    .filter((f) => scope === null || scope.has(resolve(f)))
    .sort();
}

function excerptAround(line: string, index: number): string {
  const from = Math.max(0, index - 25);
  const to = Math.min(line.length, index + 25);
  return `${from > 0 ? '…' : ''}${line.slice(from, to).trim()}${to < line.length ? '…' : ''}`;
}

function inspect(file: string): StrayHit[] {
  const rel = relative(process.cwd(), file);
  if (rel in ALLOWLIST) return [];

  const hits: StrayHit[] = [];
  const lines = readFileSync(file, 'utf-8').split('\n');
  lines.forEach((line, i) => {
    for (const [kind, re] of [
      ['kana', KANA],
      ['simplified', SIMPLIFIED_ONLY],
    ] as const) {
      const found = [...line.matchAll(re)];
      if (found.length === 0) continue;
      hits.push({
        file: rel,
        line: i + 1,
        kind,
        chars: [...new Set(found.map((m) => m[0]))],
        excerpt: excerptAround(line, found[0].index ?? 0),
      });
    }
  });
  return hits;
}

function main(): void {
  const scope = scopeSet();
  const hits = targetFiles(scope).flatMap(inspect);

  if (process.argv.includes('--json')) {
    process.stdout.write(`${JSON.stringify(hits, null, 2)}\n`);
    process.exit(0);
  }

  if (hits.length === 0) {
    process.stdout.write('✓ stray-script: no kana or simplified-only forms in content\n');
    process.exit(0);
  }

  const files = new Set(hits.map((h) => h.file));
  process.stdout.write(
    `⚠ ${hits.length} line(s) in ${files.size} file(s) use characters AGENTS.md §Script disallows:\n\n`,
  );
  for (const h of hits) {
    process.stdout.write(`  ${h.file}:${h.line}  [${h.kind}] ${h.chars.join(' ')}\n`);
    process.stdout.write(`    ${h.excerpt}\n`);
  }
  process.stdout.write(
    '\nRewrite each in 한글. Replacement is a meaning choice, so it is not automated.\n' +
      'If the foreign script is a deliberate quotation, add the file to ALLOWLIST in\n' +
      'scripts/check-stray-script.ts with the reason.\n',
  );
  process.exit(0);
}

main();
