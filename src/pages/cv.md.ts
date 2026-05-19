import type { APIRoute } from 'astro';
import { cv } from '../data/cv';
import { documentPageToMarkdown } from '../lib/serialize';

export const GET: APIRoute = () =>
  new Response(documentPageToMarkdown(cv), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
