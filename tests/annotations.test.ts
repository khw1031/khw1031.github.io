import { describe, expect, it } from 'vitest';
import {
  type Annotation,
  addAnnotation,
  buildFeedbackMarkdown,
  parseBasket,
  parseTrash,
  persistBasket,
  persistTrash,
  removeAnnotation,
  restoreTrash,
  updateAnnotation,
} from '../src/lib/annotations';

function fakeStorage() {
  const map = new Map<string, string>();
  const calls: string[] = [];
  return {
    calls,
    getItem: (key: string) => map.get(key) ?? null,
    setItem: (key: string, value: string) => {
      calls.push(`set:${key}`);
      map.set(key, value);
    },
    removeItem: (key: string) => {
      calls.push(`remove:${key}`);
      map.delete(key);
    },
  };
}

function annotation(over: Partial<Annotation> = {}): Annotation {
  return {
    id: 'a1',
    file: 'src/content/notes/foo/index.md',
    bodyLine: 3,
    block: 'li',
    text: '핵심 문장. 뒤따르는 설명.',
    prompt: '6번 항목과 중복',
    url: '/notes/foo/',
    at: '2026-07-30T13:40:00+09:00',
    ...over,
  };
}

describe('annotation basket', () => {
  it('appends without mutating the original list', () => {
    const first = [annotation({ id: 'a1' })];
    const next = addAnnotation(first, annotation({ id: 'a2' }));
    expect(next).toHaveLength(2);
    expect(first).toHaveLength(1);
    expect(next[1]?.id).toBe('a2');
  });

  it('removes by id and leaves unknown ids alone', () => {
    const list = [annotation({ id: 'a1' }), annotation({ id: 'a2' })];
    expect(removeAnnotation(list, 'a1').map((a) => a.id)).toEqual(['a2']);
    expect(removeAnnotation(list, 'nope')).toHaveLength(2);
  });

  // Editing a note must not require re-selecting the text: the anchor stays,
  // only the instruction changes.
  it('rewrites one item prompt and keeps its anchor', () => {
    const list = [annotation({ id: 'a1', prompt: '이전' }), annotation({ id: 'a2' })];
    const next = updateAnnotation(list, 'a1', '이후');
    expect(next[0]?.prompt).toBe('이후');
    expect(next[0]?.bodyLine).toBe(list[0]?.bodyLine);
    expect(next[1]?.prompt).toBe(list[1]?.prompt);
    expect(list[0]?.prompt).toBe('이전');
  });

  it('leaves the list alone when the edited id is unknown', () => {
    const list = [annotation({ id: 'a1', prompt: '이전' })];
    expect(updateAnnotation(list, 'nope', '이후')[0]?.prompt).toBe('이전');
  });
});

describe('persistBasket', () => {
  it('writes the basket while it holds items', () => {
    const storage = fakeStorage();
    persistBasket(storage, 'k', [annotation()]);
    expect(parseBasket(storage.getItem('k'))).toHaveLength(1);
  });

  // An approved-and-copied batch must leave no trace: not the items, and not an
  // empty placeholder either.
  it('removes the key instead of storing an empty basket', () => {
    const storage = fakeStorage();
    persistBasket(storage, 'k', [annotation()]);
    persistBasket(storage, 'k', []);
    expect(storage.getItem('k')).toBeNull();
    expect(storage.calls).toEqual(['set:k', 'remove:k']);
  });

  it('never writes anything for a basket that was empty all along', () => {
    const storage = fakeStorage();
    persistBasket(storage, 'k', []);
    expect(storage.calls).toEqual(['remove:k']);
    expect(storage.getItem('k')).toBeNull();
  });
});

// Deleted items go into a trash of batches so 삭제 and 전체 복사 are undoable.
// It lives in sessionStorage: a dev-server rebuild reloads the page and would
// wipe an in-memory history, while per-tab storage survives the reload and
// still disappears when the tab closes.
describe('deletion trash', () => {
  it('round-trips batches through storage', () => {
    const storage = fakeStorage();
    const batches = [
      [annotation({ id: 'a1' })],
      [annotation({ id: 'a2' }), annotation({ id: 'a3' })],
    ];
    persistTrash(storage, 'k', batches);
    const restored = parseTrash(storage.getItem('k'));
    expect(restored).toHaveLength(2);
    expect(restored[1]?.map((a) => a.id)).toEqual(['a2', 'a3']);
  });

  it('removes the key when the trash empties', () => {
    const storage = fakeStorage();
    persistTrash(storage, 'k', [[annotation()]]);
    persistTrash(storage, 'k', []);
    expect(storage.getItem('k')).toBeNull();
    expect(storage.calls).toEqual(['set:k', 'remove:k']);
  });

  // A corrupt or stale value must not throw — same contract as parseBasket.
  it('drops corrupt values, non-batches, and empty batches', () => {
    expect(parseTrash(null)).toEqual([]);
    expect(parseTrash('not json')).toEqual([]);
    expect(parseTrash('{"a":1}')).toEqual([]);
    expect(parseTrash(JSON.stringify([['no'], [], [annotation()]]))).toHaveLength(1);
  });

  // The trash may only cross a dev-rebuild reload, which the component marks
  // via vite:beforeFullReload. A load without the marker is a manual refresh
  // or navigation and starts clean — a stale undo lingering past a refresh is
  // exactly what blocked the next round of comments.
  it('keeps the trash only when the rebuild marker is present', () => {
    const raw = JSON.stringify([[annotation()]]);
    expect(restoreTrash('1', raw)).toHaveLength(1);
    expect(restoreTrash(null, raw)).toEqual([]);
  });
});

describe('buildFeedbackMarkdown', () => {
  it('returns an empty string for an empty basket', () => {
    expect(buildFeedbackMarkdown([])).toBe('');
  });

  it('reports the item count', () => {
    const out = buildFeedbackMarkdown([annotation({ id: 'a1' }), annotation({ id: 'a2' })]);
    expect(out).toContain('2건');
  });

  it('groups by file and orders by body line inside each file', () => {
    const out = buildFeedbackMarkdown([
      annotation({ id: 'a1', file: 'b.md', bodyLine: 5 }),
      annotation({ id: 'a2', file: 'a.md', bodyLine: 9 }),
      annotation({ id: 'a3', file: 'a.md', bodyLine: 2 }),
    ]);
    expect(out.indexOf('a.md')).toBeLessThan(out.indexOf('b.md'));
    expect(out.indexOf('본문 2행')).toBeLessThan(out.indexOf('본문 9행'));
    // Numbering is sequential across the whole batch, in emitted order.
    expect(out).toContain('### 1. 본문 2행');
    expect(out).toContain('### 3. 본문 5행');
  });

  it('carries the prompt and the quoted block text', () => {
    const out = buildFeedbackMarkdown([annotation()]);
    expect(out).toContain('요청: 6번 항목과 중복');
    expect(out).toContain('핵심 문장. 뒤따르는 설명.');
    expect(out).toContain('src/content/notes/foo/index.md');
    expect(out).toContain('(li)');
  });

  it('includes the selected span only when there is one', () => {
    expect(buildFeedbackMarkdown([annotation({ selected: '핵심 문장' })])).toContain(
      '선택: 핵심 문장',
    );
    expect(buildFeedbackMarkdown([annotation()])).not.toContain('선택:');
  });

  // Line numbers are the stamped data-line — a hint, not a verified fact —
  // so the label must say 부근 rather than promise the exact line.
  it('labels the anchor as approximate', () => {
    expect(buildFeedbackMarkdown([annotation({ bodyLine: 3 })])).toContain('본문 3행 부근');
    expect(buildFeedbackMarkdown([annotation({ bodyLine: 3, endBodyLine: 5 })])).toContain(
      '본문 3-5행 부근',
    );
  });

  // Notes contain inline code, so a naive triple-backtick fence would be
  // closed early by the quoted text itself.
  it('opens a fence longer than any backtick run in the quote', () => {
    const out = buildFeedbackMarkdown([annotation({ text: '앞 ```코드``` 뒤' })]);
    expect(out).toContain('````\n앞 ```코드``` 뒤\n````');
  });

  // The quotes are rendered text: smartypants rewrites quotes/dashes and
  // marker/link syntax is gone, so the header must warn that the wording may
  // differ from the source file instead of promising a verbatim match.
  it('warns that quotes are rendered text, and asks for a proposal', () => {
    const out = buildFeedbackMarkdown([annotation()]);
    expect(out).toContain('렌더링된 텍스트');
    expect(out).toContain('제안');
    expect(out).not.toContain('정확히 일치');
    expect(out).not.toContain('편집하라');
  });
});
