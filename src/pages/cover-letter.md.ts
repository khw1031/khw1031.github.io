import type { APIRoute } from 'astro';
import { coverLetter } from '../data/cover-letter';
import { documentPageToMarkdown } from '../lib/serialize';

export const GET: APIRoute = () =>
  new Response(documentPageToMarkdown(coverLetter), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
