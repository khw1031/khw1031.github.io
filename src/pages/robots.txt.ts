import type { APIContext } from 'astro';

const FRIENDLY_BOTS = ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended', 'CCBot'];

export function GET(context: APIContext): Response {
  const siteUrl = (context.site ?? new URL('https://khw1031.github.io/')).toString();
  const sitemap = new URL('sitemap-index.xml', siteUrl).toString();

  const disallowed = [
    'Disallow: /notes/',
    'Disallow: /inbox/',
    'Disallow: /specs/',
    'Disallow: /idea/',
  ];
  const block = (ua: string): string[] => [`User-agent: ${ua}`, 'Allow: /', ...disallowed, ''];
  const lines = [
    ...block('*'),
    ...FRIENDLY_BOTS.flatMap((bot) => block(bot)),
    `Sitemap: ${sitemap}`,
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
