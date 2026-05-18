import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const SOURCE = resolve('src/styles/themes/AppleClassic.itermcolors');
const OUT = resolve('src/styles/theme.generated.css');

interface RgbColor {
  r: number;
  g: number;
  b: number;
}

function parseItermColors(xml: string): Record<string, RgbColor> {
  const out: Record<string, RgbColor> = {};
  const blockRe = /<key>([^<]+)<\/key>\s*<dict>([\s\S]*?)<\/dict>/g;
  for (const match of xml.matchAll(blockRe)) {
    const name = match[1];
    const body = match[2];
    if (!name || !body) continue;
    const r = Number.parseFloat(
      body.match(/<key>Red Component<\/key>\s*<real>([^<]+)<\/real>/)?.[1] ?? 'NaN',
    );
    const g = Number.parseFloat(
      body.match(/<key>Green Component<\/key>\s*<real>([^<]+)<\/real>/)?.[1] ?? 'NaN',
    );
    const b = Number.parseFloat(
      body.match(/<key>Blue Component<\/key>\s*<real>([^<]+)<\/real>/)?.[1] ?? 'NaN',
    );
    if (!Number.isFinite(r) || !Number.isFinite(g) || !Number.isFinite(b)) continue;
    out[name] = { r, g, b };
  }
  return out;
}

function toHex(c: RgbColor): string {
  const h = (v: number) =>
    Math.max(0, Math.min(255, Math.round(v * 255)))
      .toString(16)
      .padStart(2, '0');
  return `#${h(c.r)}${h(c.g)}${h(c.b)}`;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

const TOKEN_MAP: Array<[string, string]> = [
  ['--color-background', 'Background Color'],
  ['--color-foreground', 'Foreground Color'],
  ['--color-muted', 'Ansi 8 Color'],
  ['--color-border', 'Ansi 7 Color'],
  ['--color-surface', 'Selection Color'],
  ['--color-accent', 'Cursor Color'],
  ['--color-link', 'Link Color'],
];

function main(): void {
  const xml = readFileSync(SOURCE, 'utf-8');
  const colors = parseItermColors(xml);

  const sourceRel = SOURCE.replace(`${resolve('.')}/`, '');
  const lines: string[] = [
    `/* Generated from ${sourceRel}.`,
    '   Do not edit by hand. Run `pnpm theme:gen` to regenerate after',
    '   swapping the source .itermcolors file. */',
    '',
    ':root {',
  ];

  for (const [cssVar, itermKey] of TOKEN_MAP) {
    const c = colors[itermKey];
    if (!c) {
      console.warn(`Missing ${itermKey} in iterm file; skipping ${cssVar}`);
      continue;
    }
    lines.push(`  ${cssVar}: ${toHex(c)};`);
  }

  lines.push('}', '', '/* Full iTerm2 palette dump (referenceable) */', ':root {');
  for (const [name, c] of Object.entries(colors)) {
    lines.push(`  --iterm-${slugify(name)}: ${toHex(c)};`);
  }
  lines.push('}', '');

  writeFileSync(OUT, lines.join('\n'));
  console.log(`✓ ${OUT}`);
}

main();
