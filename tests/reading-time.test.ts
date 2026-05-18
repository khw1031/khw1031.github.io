import { describe, expect, it } from 'vitest';
import { readingTime } from '../src/lib/reading-time';

describe('readingTime', () => {
  it('returns 0 minutes and 0 words for empty text', () => {
    const result = readingTime('');
    expect(result.minutes).toBe(0);
    expect(result.words).toBe(0);
  });

  it('counts whitespace-separated tokens as words', () => {
    expect(readingTime('one two three').words).toBe(3);
  });

  it('reads exactly 200 words as 1 minute at default 200 wpm', () => {
    const text = 'word '.repeat(200).trim();
    expect(readingTime(text)).toEqual({ minutes: 1, words: 200 });
  });

  it('rounds partial minutes up', () => {
    const text = 'word '.repeat(201).trim();
    expect(readingTime(text).minutes).toBe(2);
  });

  it('respects a custom wordsPerMinute', () => {
    const text = 'word '.repeat(300).trim();
    expect(readingTime(text, { wordsPerMinute: 100 }).minutes).toBe(3);
  });

  it('tokenizes whitespace-separated Korean text', () => {
    expect(readingTime('안녕 하세요 반갑 습니다').words).toBe(4);
  });

  it('collapses repeated whitespace and newlines', () => {
    expect(readingTime('a   b\n\nc\t\td').words).toBe(4);
  });
});
