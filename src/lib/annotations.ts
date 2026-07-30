/**
 * Note-feedback basket: the data model shared by the dev-only annotator
 * (src/components/NoteAnnotator.astro) and its tests.
 *
 * The annotator anchors on `data-line`, stamped onto block elements by
 * rehypeStampSourceLines (src/lib/markdown-plugins.ts), and pulls the matching
 * line out of the page's raw.md. That is why `sourceText` is the *source*
 * line rather than what the browser rendered: remarkSmartypants rewrites
 * quotes and dashes, and marker/link syntax disappears in the DOM, so rendered
 * text is not reliably greppable against the .md file. Source text is.
 */

export type Annotation = {
  id: string;
  /** Repo-relative path of the markdown source, e.g. src/content/notes/foo/index.md */
  file: string;
  /** 1-based line in the markdown BODY (frontmatter excluded), matching raw.md. */
  bodyLine: number;
  /** Set when the selection crossed into a later block. */
  endBodyLine?: number;
  /** Tag name of the anchored block, e.g. 'li' — tells the agent what it is editing. */
  block: string;
  /** The block's rendered `data-line`, used to find it again and mark it on the page. */
  domLine?: number;
  /** The body line(s) verbatim, safe to search for in the source file. */
  sourceText: string;
  /** What the user highlighted, as rendered. Absent when the whole block was taken. */
  selected?: string;
  /** The user's instruction for this spot. */
  prompt: string;
  /** True when the source line could not be verified, so `sourceText` is rendered text. */
  unverified?: boolean;
  url: string;
  at: string;
};

export type ResolvedLine = { line: number; text: string; delta: number };

/**
 * Undo the transformations that sit between a markdown line and its rendered
 * text: smartypants quotes/dashes, marker and emphasis syntax, list and heading
 * prefixes, and link targets. Whitespace goes too — CJK line wrapping in the
 * source must not count as a difference.
 */
function normalize(text: string): string {
  return text
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[—–]/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^\s*(?:[-*+]|\d+[.)])\s+/, '')
    .replace(/^\s*#{1,6}\s+/, '')
    .replace(/^\s*>\s?/, '')
    .replace(/[=*_`~]/g, '')
    .replace(/\s+/g, '')
    .trim();
}

const KEY_LENGTH = 24;
const MIN_KEY_LENGTH = 6;

function matches(source: string, rendered: string): boolean {
  if (source === '' || rendered === '') return false;
  if (source === rendered) return true;
  const forward = rendered.slice(0, KEY_LENGTH);
  if (forward.length >= MIN_KEY_LENGTH && source.includes(forward)) return true;
  const backward = source.slice(0, KEY_LENGTH);
  return backward.length >= MIN_KEY_LENGTH && rendered.includes(backward);
}

/**
 * Find the source line a rendered block came from, using its stamped
 * `data-line` as a hint and the rendered text as proof.
 *
 * A hint alone is not enough: `data-line` counts against the body Astro parsed,
 * while raw.md keeps the blank line gray-matter leaves after the frontmatter, so
 * the two are shifted (measured at +1 across all 50 blocks of the current note).
 * The shift depends on the file's own blank lines, so it is discovered per
 * lookup instead of assumed — and when nothing nearby matches, this returns null
 * rather than attaching a line it cannot vouch for.
 */
export function resolveSourceLine(
  lines: readonly string[],
  hint: number,
  renderedText: string,
  radius = 3,
): ResolvedLine | null {
  const target = normalize(renderedText);
  if (target === '') return null;

  for (let step = 0; step <= radius; step += 1) {
    // Forward first: the observed shift runs that way.
    for (const delta of step === 0 ? [0] : [step, -step]) {
      const line = hint + delta;
      if (line < 1 || line > lines.length) continue;
      const text = lines[line - 1] ?? '';
      if (matches(normalize(text), target)) return { line, text, delta };
    }
  }
  return null;
}

export function addAnnotation(list: readonly Annotation[], item: Annotation): Annotation[] {
  return [...list, item];
}

export function removeAnnotation(list: readonly Annotation[], id: string): Annotation[] {
  return list.filter((item) => item.id !== id);
}

/** Rewrite one item's instruction, keeping its anchor so no re-selection is needed. */
export function updateAnnotation(
  list: readonly Annotation[],
  id: string,
  prompt: string,
): Annotation[] {
  return list.map((item) => (item.id === id ? { ...item, prompt } : item));
}

/**
 * Restore a basket from localStorage. A corrupt or stale value must not throw:
 * the basket is the only way to reach the "clear" button, so a parse error
 * would strand the user with an unusable toolbar.
 */
export function parseBasket(raw: string | null): Annotation[] {
  if (!raw) return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];
  return parsed.filter(isAnnotation);
}

/** The slice of `Storage` the basket needs, so tests can hand in a fake. */
export type BasketStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

/**
 * Persist the basket, leaving nothing behind once it empties. Copying a batch
 * approves it and drops it, so neither the batch nor an empty placeholder may
 * linger in storage afterwards.
 */
export function persistBasket(
  storage: BasketStorage,
  key: string,
  items: readonly Annotation[],
): void {
  if (items.length === 0) storage.removeItem(key);
  else storage.setItem(key, JSON.stringify(items));
}

function isAnnotation(value: unknown): value is Annotation {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === 'string' &&
    typeof v.file === 'string' &&
    typeof v.bodyLine === 'number' &&
    typeof v.block === 'string' &&
    typeof v.sourceText === 'string' &&
    typeof v.prompt === 'string'
  );
}

/** A fence long enough that `text` cannot close it early — notes contain inline code. */
function fenceFor(text: string): string {
  const longestRun = Math.max(0, ...[...text.matchAll(/`+/g)].map((m) => m[0].length));
  return '`'.repeat(Math.max(3, longestRun + 1));
}

function lineLabel(item: Annotation): string {
  return item.endBodyLine && item.endBodyLine !== item.bodyLine
    ? `본문 ${item.bodyLine}-${item.endBodyLine}행`
    : `본문 ${item.bodyLine}행`;
}

/**
 * Assemble the whole basket into one prompt. Grouped by file and ordered by
 * body line inside each file, so applying the edits walks each document top to
 * bottom instead of jumping around.
 */
export function buildFeedbackMarkdown(list: readonly Annotation[]): string {
  if (list.length === 0) return '';

  const byFile = new Map<string, Annotation[]>();
  for (const item of list) {
    const bucket = byFile.get(item.file);
    if (bucket) bucket.push(item);
    else byFile.set(item.file, [item]);
  }

  const out: string[] = [
    `# 노트 피드백 (${list.length}건)`,
    '',
    '아래 소스 블록은 파일 본문과 정확히 일치한다. 그대로 찾아 해당 줄을 편집하라.',
    '',
  ];

  let index = 0;
  for (const file of [...byFile.keys()].sort()) {
    out.push(`## ${file}`, '');
    const items = [...(byFile.get(file) ?? [])].sort((a, b) => a.bodyLine - b.bodyLine);
    for (const item of items) {
      index += 1;
      out.push(`### ${index}. ${lineLabel(item)} (${item.block})`, '');
      out.push(`요청: ${item.prompt}`);
      if (item.selected) out.push(`선택: ${item.selected}`);
      if (item.unverified) {
        out.push('주의: 소스 줄 확인 실패 — 아래는 화면에 렌더링된 텍스트다');
      }
      out.push('');
      const fence = fenceFor(item.sourceText);
      out.push(fence, item.sourceText, fence, '');
    }
  }

  return `${out.join('\n').trimEnd()}\n`;
}
