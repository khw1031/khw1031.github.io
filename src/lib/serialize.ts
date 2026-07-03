import type { DocumentPage } from '../data/types';

export function documentPageToMarkdown(page: DocumentPage): string {
  const out: string[] = [];

  out.push(`# ${page.title}`, '', page.description, '');

  for (const section of page.sections) {
    out.push(`## ${section.title}`, '');

    for (const detail of section.details) {
      if (detail.title) {
        const heading = detail.url ? `[${detail.title}](${detail.url})` : detail.title;
        out.push(`### ${heading}`);
      }

      if (detail.subtitle) out.push(`*${detail.subtitle}*`);

      const meta: string[] = [];
      if (detail.role) meta.push(detail.role);
      if (detail.period) meta.push(detail.period);
      if (detail.ect) meta.push(`※ ${detail.ect}`);

      const singleContent = detail.content.length === 1 ? detail.content[0] : undefined;
      const inlineContentTitle =
        singleContent?.title && singleContent.description.length === 0
          ? singleContent.title
          : undefined;
      if (inlineContentTitle) meta.push(inlineContentTitle);

      if (meta.length > 0) out.push(meta.join(' · '));

      out.push('');

      const blockContent = inlineContentTitle ? [] : detail.content;
      for (const item of blockContent) {
        if (item.title) out.push(`#### ${item.title}`, '');

        if (item.description.length > 0) {
          if (item.kind === 'prose') {
            for (const line of item.description) out.push(line, '');
          } else {
            for (const line of item.description) out.push(`- ${line}`);
            out.push('');
          }
        }
      }
    }
  }

  if (page.keywords.length > 0) {
    out.push('## 기술 스택', '', page.keywords.join(' · '), '');
  }

  return `${out
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trimEnd()}\n`;
}
