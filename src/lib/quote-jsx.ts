const QUOTE_RE = /<Quote\s+url="([^"]+)"[^>]*>([\s\S]*?)<\/Quote>/g;
const TEMPLATE_RE = /\{`([\s\S]*?)`\}/;

function extractTemplate(body: string): string {
  const match = body.match(TEMPLATE_RE);
  if (match) return match[1] ?? '';
  return body.trim();
}

function toBlockquote(text: string, url: string): string {
  const lines = text.split('\n');
  const quoted = lines.map((line) => `> ${line}`.trimEnd()).join('\n');
  return `${quoted}\n>\n> — <${url}>`;
}

export function convertQuoteJsx(input: string): string {
  return input.replace(QUOTE_RE, (_match, url: string, body: string) => {
    const text = extractTemplate(body);
    return toBlockquote(text, url);
  });
}
