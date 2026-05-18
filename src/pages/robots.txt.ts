import type { APIContext } from 'astro';

const FRIENDLY_BOTS = ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended', 'CCBot'];

export function GET(context: APIContext): Response {
  const siteUrl = (context.site ?? new URL('https://khw1031.github.io/')).toString();
  const sitemap = new URL('sitemap-index.xml', siteUrl).toString();

  const lines = [
    'User-agent: *',
    'Allow: /',
    '',
    ...FRIENDLY_BOTS.flatMap((bot) => [`User-agent: ${bot}`, 'Allow: /', '']),
    `Sitemap: ${sitemap}`,
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
