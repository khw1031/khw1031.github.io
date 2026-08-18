import { describe, expect, it } from 'vitest';
import {
  allocateNoteId,
  formatNoteId,
  highWaterIds,
  isKnownCategory,
  NOTE_ID_CATEGORIES,
  noteIdMonth,
  parseNoteId,
} from '../src/lib/note-id';

/**
 * A noteId is written into a paper notebook by hand, so the only property that
 * really matters is that it never changes once stamped. These cases pin the
 * three things that could silently break that: the shape it parses/formats,
 * the KST month it derives, and the sequence allocator that must never hand
 * out an ID that is already taken.
 */

describe('parseNoteId', () => {
  it('splits a well-formed id into category, month, and sequence', () => {
    expect(parseNoteId('AI-2608-014')).toEqual({ category: 'AI', yymm: '2608', seq: 14 });
  });

  it('accepts categories of different lengths', () => {
    expect(parseNoteId('FE-2601-001')?.category).toBe('FE');
    expect(parseNoteId('STOCK-2607-002')?.category).toBe('STOCK');
  });

  it('keeps the sequence numeric so leading zeros do not create two ids', () => {
    expect(parseNoteId('AI-2608-007')?.seq).toBe(7);
  });

  it('rejects shapes that are not the stamped format', () => {
    for (const bad of [
      'AI-2608-14', // sequence must be 3 digits
      'AI-260808-014', // month, not a date
      'ai-2608-014', // lowercase
      'AI_2608_014', // wrong separator
      'AI-2608', // no sequence
      '2608-014', // no category
      'AI-2608-014 ', // trailing space
      '',
    ]) {
      expect(parseNoteId(bad), bad).toBeNull();
    }
  });
});

describe('formatNoteId', () => {
  it('zero-pads the sequence to three digits', () => {
    expect(formatNoteId('AI', '2608', 1)).toBe('AI-2608-001');
    expect(formatNoteId('AI', '2608', 42)).toBe('AI-2608-042');
    expect(formatNoteId('AI', '2608', 999)).toBe('AI-2608-999');
  });

  it('round-trips through parseNoteId', () => {
    const id = formatNoteId('STOCK', '2612', 7);
    expect(parseNoteId(id)).toEqual({ category: 'STOCK', yymm: '2612', seq: 7 });
  });

  it('refuses a sequence that would not fit the format', () => {
    expect(() => formatNoteId('AI', '2608', 0)).toThrow();
    expect(() => formatNoteId('AI', '2608', 1000)).toThrow();
  });
});

describe('noteIdMonth', () => {
  it('derives YYMM from the KST calendar, not UTC', () => {
    // 2026-07-31 23:30 UTC is already 2026-08-01 08:30 in KST. Using UTC here
    // would file an August note under July and shift every later sequence.
    expect(noteIdMonth(new Date('2026-07-31T23:30:00Z'))).toBe('2608');
    expect(noteIdMonth(new Date('2026-08-01T08:30:00+09:00'))).toBe('2608');
  });

  it('keeps a mid-month date in its own month', () => {
    expect(noteIdMonth(new Date('2026-08-08T12:00:00+09:00'))).toBe('2608');
    expect(noteIdMonth(new Date('2026-12-01T00:00:00+09:00'))).toBe('2612');
  });
});

describe('isKnownCategory', () => {
  it('accepts every code in the registry', () => {
    for (const code of Object.keys(NOTE_ID_CATEGORIES)) {
      expect(isKnownCategory(code), code).toBe(true);
    }
  });

  it('rejects an unregistered code so typos cannot become permanent ids', () => {
    expect(isKnownCategory('NOPE')).toBe(false);
    expect(isKnownCategory('ai')).toBe(false);
  });

  it('describes every registered category with non-empty Korean prose', () => {
    for (const [code, label] of Object.entries(NOTE_ID_CATEGORIES)) {
      expect(label.trim().length, code).toBeGreaterThan(0);
    }
  });
});

describe('allocateNoteId', () => {
  it('starts a category-month at 001', () => {
    expect(allocateNoteId('AI', '2608', [])).toBe('AI-2608-001');
  });

  it('continues after the highest sequence already taken', () => {
    const taken = ['AI-2608-001', 'AI-2608-002', 'AI-2608-003'];
    expect(allocateNoteId('AI', '2608', taken)).toBe('AI-2608-004');
  });

  it('fills past a gap rather than reusing a freed number', () => {
    // 002 was stamped and later deleted. Reusing it would point a handwritten
    // reference at a different document, so the allocator keeps counting up.
    expect(allocateNoteId('AI', '2608', ['AI-2608-001', 'AI-2608-003'])).toBe('AI-2608-004');
  });

  it('counts each category and month separately', () => {
    const taken = ['AI-2608-001', 'AI-2608-002', 'FE-2608-001', 'AI-2607-009'];
    expect(allocateNoteId('FE', '2608', taken)).toBe('FE-2608-002');
    expect(allocateNoteId('STOCK', '2608', taken)).toBe('STOCK-2608-001');
    expect(allocateNoteId('AI', '2607', taken)).toBe('AI-2607-010');
  });

  it('ignores entries that are not valid ids', () => {
    expect(allocateNoteId('AI', '2608', ['', 'garbage', 'AI-2608-002'])).toBe('AI-2608-003');
  });

  it('refuses to allocate past the 3-digit ceiling instead of colliding', () => {
    expect(() => allocateNoteId('AI', '2608', ['AI-2608-999'])).toThrow();
  });

  it('continues past a deleted tail when the ledger still remembers it', () => {
    // 021-024 were stamped and the documents later deleted, so the repo only
    // still contains 020. Without the ledger the allocator would hand 021 back
    // out and every margin note from 021 to 024 would point somewhere else.
    const present = ['LEARN-2608-020'];
    const ledger = ['LEARN-2608-024'];
    expect(allocateNoteId('LEARN', '2608', [...present, ...ledger])).toBe('LEARN-2608-025');
  });
});

describe('highWaterIds', () => {
  it('keeps only the highest id per category-month', () => {
    expect(highWaterIds(['AI-2608-001', 'AI-2608-014', 'AI-2608-007'])).toEqual(['AI-2608-014']);
  });

  it('tracks each category and month separately', () => {
    expect(highWaterIds(['AI-2608-002', 'FE-2608-005', 'AI-2607-009', 'AI-2608-001'])).toEqual([
      'AI-2607-009',
      'AI-2608-002',
      'FE-2608-005',
    ]);
  });

  it('retains a category-month whose documents were all deleted', () => {
    // The ledger's whole job: yesterday's high-water survives into today's list
    // even though no document carries that id any more.
    const previous = ['LEARN-2608-024'];
    const present: string[] = [];
    expect(highWaterIds([...present, ...previous])).toEqual(['LEARN-2608-024']);
  });

  it('never lowers a high-water mark that a live document has already passed', () => {
    expect(highWaterIds(['LEARN-2608-024', 'LEARN-2608-030'])).toEqual(['LEARN-2608-030']);
  });

  it('ignores entries that are not valid ids', () => {
    expect(highWaterIds(['', 'garbage', 'AI-2608-002'])).toEqual(['AI-2608-002']);
  });

  it('sorts the result so the ledger diff stays small between runs', () => {
    const a = highWaterIds(['FE-2608-001', 'AI-2607-002', 'AI-2608-003']);
    const b = highWaterIds(['AI-2608-003', 'FE-2608-001', 'AI-2607-002']);
    expect(a).toEqual(b);
    expect(a).toEqual(['AI-2607-002', 'AI-2608-003', 'FE-2608-001']);
  });
});
