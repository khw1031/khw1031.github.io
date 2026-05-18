import { describe, expect, it } from 'vitest';
import { convertQuoteJsx } from '../src/lib/quote-jsx';

describe('convertQuoteJsx', () => {
  it('converts a single <Quote> to a blockquote with citation', () => {
    const input = '<Quote url="https://example.com">\n{`hello world`}\n</Quote>';
    const out = convertQuoteJsx(input);
    expect(out).toContain('> hello world');
    expect(out).toContain('— <https://example.com>');
    expect(out).not.toContain('<Quote');
  });

  it('preserves multi-line quote content with blockquote prefix', () => {
    const input = '<Quote url="https://e.com">\n{`line one\nline two`}\n</Quote>';
    const out = convertQuoteJsx(input);
    expect(out).toContain('> line one');
    expect(out).toContain('> line two');
  });

  it('keeps blank lines inside a quote as bare ">"', () => {
    const input = '<Quote url="https://e.com">\n{`first\n\nsecond`}\n</Quote>';
    const out = convertQuoteJsx(input);
    expect(out).toMatch(/> first\n>\n> second/);
  });

  it('converts multiple <Quote> blocks independently', () => {
    const input =
      '<Quote url="https://a.com">{`a`}</Quote>\n\n<Quote url="https://b.com">{`b`}</Quote>';
    const out = convertQuoteJsx(input);
    expect(out).toContain('— <https://a.com>');
    expect(out).toContain('— <https://b.com>');
    expect(out).not.toContain('<Quote');
  });

  it('returns text unchanged when no Quote is present', () => {
    const input = '# Hello\n\nplain text';
    expect(convertQuoteJsx(input)).toBe(input);
  });
});
