// KST (Asia/Seoul) is the authoring-timezone ground truth for pubDate/updatedDate
// across this project. This module has no Astro-runtime dependency (no
// astro:content) so it stays importable from plain unit tests (e.g. jsonld.ts's
// consumers), unlike collections.ts.

// Render the calendar date in KST. A plain toISOString().slice(0,10) formats in
// UTC, which shows the previous day for notes authored 00:00-09:00 KST — the
// off-by-one this project has explicitly fixed. en-CA yields a YYYY-MM-DD string.
const KST_DATE = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Seoul',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

export function formatDate(d: Date): string {
  return KST_DATE.format(d);
}

// Same KST ground truth as formatDate, but as a full offset-carrying ISO 8601
// string (+09:00) instead of Z/UTC. Consumers like jsonld's datePublished use
// this so the calendar date in structured data matches the KST date rendered
// on the page — toISOString() would show the previous day for the same
// 00:00-09:00 KST window formatDate already accounts for.
const KST_DATETIME = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Seoul',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
});

export function toKSTISOString(d: Date): string {
  const parts = Object.fromEntries(KST_DATETIME.formatToParts(d).map((p) => [p.type, p.value]));
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}+09:00`;
}
