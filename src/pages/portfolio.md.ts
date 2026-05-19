import type { APIRoute } from 'astro';
import { portfolio } from '../data/portfolio';
import { documentPageToMarkdown } from '../lib/serialize';

export const GET: APIRoute = () =>
  new Response(documentPageToMarkdown(portfolio), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
