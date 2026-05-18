import { describe, expect, it } from 'vitest';
import { convertLegacyFrontmatter } from '../src/lib/legacy-frontmatter';

describe('convertLegacyFrontmatter', () => {
  it('renames publishedAt to pubDate', () => {
    const out = convertLegacyFrontmatter({ title: 'x', publishedAt: '2025-01-01' });
    expect(out).toMatchObject({ title: 'x', pubDate: '2025-01-01' });
  });

  it('renames updatedAt to updatedDate when different from publishedAt', () => {
    const out = convertLegacyFrontmatter({
      title: 'x',
      publishedAt: '2025-01-01',
      updatedAt: '2025-02-01',
    });
    expect(out.updatedDate).toBe('2025-02-01');
  });

  it('omits updatedDate when equal to publishedAt', () => {
    const out = convertLegacyFrontmatter({
      title: 'x',
      publishedAt: '2025-01-01',
      updatedAt: '2025-01-01',
    });
    expect('updatedDate' in out).toBe(false);
  });

  it('omits an empty description', () => {
    const out = convertLegacyFrontmatter({
      title: 'x',
      publishedAt: '2025-01-01',
      description: '',
    });
    expect('description' in out).toBe(false);
  });

  it('preserves a non-empty description', () => {
    const out = convertLegacyFrontmatter({
      title: 'x',
      publishedAt: '2025-01-01',
      description: 'd',
    });
    expect(out.description).toBe('d');
  });

  it('maps wip:true to draft:true', () => {
    const out = convertLegacyFrontmatter({ title: 'x', publishedAt: '2025-01-01', wip: true });
    expect(out.draft).toBe(true);
  });

  it('omits draft when wip is false', () => {
    const out = convertLegacyFrontmatter({ title: 'x', publishedAt: '2025-01-01', wip: false });
    expect('draft' in out).toBe(false);
  });

  it('drops empty summary', () => {
    const out = convertLegacyFrontmatter({ title: 'x', publishedAt: '2025-01-01', summary: '' });
    expect('summary' in out).toBe(false);
  });

  it('throws when title is missing', () => {
    expect(() => convertLegacyFrontmatter({ publishedAt: '2025-01-01' })).toThrow(/title/);
  });

  it('throws when publishedAt is missing', () => {
    expect(() => convertLegacyFrontmatter({ title: 'x' })).toThrow(/publishedAt/);
  });
});
