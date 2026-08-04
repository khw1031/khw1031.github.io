/**
 * Note-feedback basket: the data model shared by the dev-only annotator
 * (src/components/NoteAnnotator.astro) and its tests.
 *
 * Quotes are what the browser rendered, and the line number is the block's
 * stamped `data-line` (rehypeStampSourceLines, src/lib/markdown-plugins.ts)
 * taken as-is. Neither is verified against the source file — an earlier
 * version fetched raw.md and proved every line, but raw.md is generated once
 * per dev-server start and goes stale as the agent applies feedback, turning
 * the proof into noise. A file path, an approximate line, and the rendered
 * wording are enough for the reading agent to find the spot itself.
 */

export type Annotation = {
  id: string;
  /** Repo-relative path of the markdown source, e.g. src/content/notes/foo/index.md */
  file: string;
  /**
   * The block's stamped `data-line`: 1-based against the markdown body Astro
   * parsed, which can sit a line or so off the file (frontmatter handling).
   * A hint for the reader, and the way to find the block on the page again.
   */
  bodyLine: number;
  /** Set when the selection crossed into a later block. */
  endBodyLine?: number;
  /** Tag name of the anchored block, e.g. 'li' — tells the agent what it is editing. */
  block: string;
  /** The anchored block's rendered text. */
  text: string;
  /** What the user highlighted, as rendered. Absent when the whole block was taken. */
  selected?: string;
  /** The user's instruction for this spot. */
  prompt: string;
  url: string;
  at: string;
};

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

/**
 * Parse the deletion trash: a LIFO stack of deleted batches (one per 삭제
 * click, one per 전체 복사 clear). Same never-throw contract as parseBasket.
 */
export function parseTrash(raw: string | null): Annotation[][] {
  if (!raw) return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];
  const batches: Annotation[][] = [];
  for (const batch of parsed) {
    if (!Array.isArray(batch)) continue;
    const items = batch.filter(isAnnotation);
    if (items.length > 0) batches.push(items);
  }
  return batches;
}

/**
 * Decide what a fresh page load starts with. The trash exists to survive a
 * dev-rebuild reload — the component stamps `marker` into sessionStorage when
 * Vite announces one — and nothing else. A load without the marker is a manual
 * refresh or navigation and starts clean, so a stale undo from the previous
 * round cannot linger and get in the way of the next one.
 */
export function restoreTrash(marker: string | null, raw: string | null): Annotation[][] {
  return marker === null ? [] : parseTrash(raw);
}

/** Persist the trash, dropping the key once the last batch is restored. */
export function persistTrash(
  storage: BasketStorage,
  key: string,
  batches: readonly (readonly Annotation[])[],
): void {
  if (batches.length === 0) storage.removeItem(key);
  else storage.setItem(key, JSON.stringify(batches));
}

function isAnnotation(value: unknown): value is Annotation {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === 'string' &&
    typeof v.file === 'string' &&
    typeof v.bodyLine === 'number' &&
    typeof v.block === 'string' &&
    typeof v.text === 'string' &&
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
    ? `본문 ${item.bodyLine}-${item.endBodyLine}행 부근`
    : `본문 ${item.bodyLine}행 부근`;
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
    '아래 인용은 화면에 렌더링된 텍스트라 소스 파일과 표기(따옴표·대시·마커 문법 등)가 다를 수 있다. 표시된 파일과 줄 부근에서 해당 대목을 찾아, 각 요청의 요구사항을 파악해 반영 방안을 제안하라.',
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
      out.push('');
      const fence = fenceFor(item.text);
      out.push(fence, item.text, fence, '');
    }
  }

  return `${out.join('\n').trimEnd()}\n`;
}
