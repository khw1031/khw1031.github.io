import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { describe, expect, it } from 'vitest';
import { rehypePlugins, remarkPlugins } from '../src/lib/markdown-plugins';

async function render(markdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkPlugins)
    .use(remarkRehype)
    .use([...rehypePlugins])
    .use(rehypeStringify)
    .process(markdown);
  return String(file);
}

describe('markdown pipeline', () => {
  it('assigns slug ids to headings', async () => {
    const html = await render('# Hello World');
    expect(html).toContain('id="hello-world"');
  });

  it('wraps headings in an autolink anchor', async () => {
    const html = await render('## Section Title');
    expect(html).toMatch(/<a[^>]+href="#section-title"/);
  });

  it('marks external links with target=_blank and rel noopener noreferrer', async () => {
    const html = await render('[ext](https://example.com)');
    expect(html).toMatch(/<a[^>]+href="https:\/\/example\.com"/);
    expect(html).toContain('target="_blank"');
    expect(html).toMatch(/rel="[^"]*noopener[^"]*"/);
    expect(html).toMatch(/rel="[^"]*noreferrer[^"]*"/);
  });

  it('leaves relative links unchanged', async () => {
    const html = await render('[about](/about)');
    expect(html).not.toContain('target="_blank"');
  });

  it('renders GFM tables', async () => {
    const html = await render('| a | b |\n| - | - |\n| 1 | 2 |');
    expect(html).toContain('<table>');
    expect(html).toContain('<th>a</th>');
  });

  it('renders GFM task lists', async () => {
    const html = await render('- [ ] todo\n- [x] done');
    expect(html).toContain('type="checkbox"');
    expect(html).toContain('checked');
  });

  it('applies smartypants to ASCII quotes', async () => {
    const html = await render('"hello"');
    expect(html).toContain('“hello”');
  });

  it('applies smartypants to em-dash', async () => {
    const html = await render('a --- b');
    expect(html).toContain('—');
  });
});
