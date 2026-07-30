import { describe, expect, it } from 'vitest';
import {
  type Annotation,
  addAnnotation,
  buildFeedbackMarkdown,
  parseBasket,
  persistBasket,
  removeAnnotation,
  resolveSourceLine,
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
    sourceText: '1. ==핵심 문장.== 뒤따르는 설명.',
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

// data-line counts against the body Astro parsed, which drops the blank line
// after the frontmatter that gray-matter (and so raw.md) keeps. Measured on the
// built site: every one of 50 stamped blocks sits at raw.md[data-line + 1]. The
// shift is a property of the file's blank lines, not a constant, so the line is
// resolved by verifying against what the browser rendered.
describe('resolveSourceLine', () => {
  it('takes the hint when it already matches', () => {
    const lines = ['첫 줄이다.', '둘째 줄이다.'];
    expect(resolveSourceLine(lines, 2, '둘째 줄이다.')).toEqual({
      line: 2,
      text: '둘째 줄이다.',
      delta: 0,
    });
  });

  it('recovers the real line when the hint is one short', () => {
    const lines = ['', '1. ==핵심 문장.== 뒤따르는 설명.'];
    const found = resolveSourceLine(lines, 1, '핵심 문장. 뒤따르는 설명.');
    expect(found).toEqual({ line: 2, text: '1. ==핵심 문장.== 뒤따르는 설명.', delta: 1 });
  });

  it('matches through smartypants quote and dash rewrites', () => {
    const lines = ['그는 "왜"라고 물었다 -- 두 번.'];
    expect(resolveSourceLine(lines, 1, '그는 “왜”라고 물었다 – 두 번.')?.line).toBe(1);
  });

  it('matches through marker, emphasis, and link syntax', () => {
    const lines = ['- **강조**와 [링크](https://example.com)가 섞인 줄.'];
    expect(resolveSourceLine(lines, 1, '강조와 링크가 섞인 줄.')?.line).toBe(1);
  });

  it('gives up rather than guessing when nothing near the hint matches', () => {
    const lines = ['전혀 다른 내용', '역시 다른 내용'];
    expect(resolveSourceLine(lines, 1, '없는 문장이다')).toBeNull();
  });

  it('stays inside the search radius', () => {
    const lines = ['목표 문장이다.', 'a', 'b', 'c', 'd'];
    expect(resolveSourceLine(lines, 5, '목표 문장이다.', 1)).toBeNull();
    expect(resolveSourceLine(lines, 5, '목표 문장이다.', 4)?.line).toBe(1);
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

  it('carries the prompt and the verbatim source line', () => {
    const out = buildFeedbackMarkdown([annotation()]);
    expect(out).toContain('요청: 6번 항목과 중복');
    expect(out).toContain('1. ==핵심 문장.== 뒤따르는 설명.');
    expect(out).toContain('src/content/notes/foo/index.md');
    expect(out).toContain('(li)');
  });

  it('includes the selected span only when there is one', () => {
    expect(buildFeedbackMarkdown([annotation({ selected: '핵심 문장' })])).toContain(
      '선택: 핵심 문장',
    );
    expect(buildFeedbackMarkdown([annotation()])).not.toContain('선택:');
  });

  it('labels a multi-line anchor as a range', () => {
    const out = buildFeedbackMarkdown([annotation({ bodyLine: 3, endBodyLine: 5 })]);
    expect(out).toContain('본문 3-5행');
  });

  // Notes contain inline code, so a naive triple-backtick fence would be
  // closed early by the source line itself.
  it('opens a fence longer than any backtick run in the source', () => {
    const out = buildFeedbackMarkdown([annotation({ sourceText: '앞 ```코드``` 뒤' })]);
    expect(out).toContain('````\n앞 ```코드``` 뒤\n````');
  });

  it('tells the agent the source block is greppable', () => {
    expect(buildFeedbackMarkdown([annotation()])).toContain('정확히 일치');
  });

  // An item whose source line could not be verified must not travel under the
  // "matches the file exactly" promise the header makes.
  it('flags an unverified item instead of passing it off as source', () => {
    const out = buildFeedbackMarkdown([annotation({ unverified: true })]);
    expect(out).toContain('소스 줄 확인 실패');
    expect(out).toContain('렌더링된 텍스트');
  });
});
