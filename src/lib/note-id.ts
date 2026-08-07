/**
 * Stable, hand-transcribable identifiers for agent-authored documents.
 *
 * A noteId exists so a paper notebook can point at a document in this repo:
 * you write `AI-2608-014` in the margin and expect it to still resolve years
 * later. That single requirement drives every rule here.
 *
 *   - It is STAMPED, not derived. `scripts/stamp-note-ids.ts` writes it into
 *     frontmatter once and never rewrites it, so moving a file between
 *     collections, editing its pubDate, or renaming its slug leaves the id
 *     alone. A derived id would silently break the handwritten reference.
 *   - The category is the document's SUBJECT, not its collection. `notes`,
 *     `inbox`, `sources`, `idea`, and `wiki` all draw from one namespace, so a
 *     note that graduates from inbox to notes keeps its id.
 *   - Sequences are never reused. `allocateNoteId` counts past gaps left by
 *     deleted documents rather than filling them.
 *
 * `posts` and `read-and-write` are deliberately out of scope: they are the
 * public timeline, addressed by URL, and were never part of the paper workflow.
 *
 * No Astro imports here — `src/content/schemas.ts`, the checker script, and the
 * stamp script all need this module outside the Astro runtime.
 */

import { formatDate } from './kst';

/**
 * The closed set of subject categories an id may use.
 *
 * Registered here rather than accepted free-form because a handwritten index is
 * only searchable if the prefixes stay few and stable — `AI` drifting into
 * `AI-CODE`/`LLM`/`AGENTIC` would make the paper notebook useless. Adding a
 * category is a deliberate one-line edit; `scripts/check-frontmatter.ts` rejects
 * any id whose prefix is not listed.
 *
 * Codes are permanent. Renaming one invalidates every id already stamped with
 * it (and every margin note in the paper notebook), so prefer adding a new code
 * over re-scoping an old one.
 */
export const NOTE_ID_CATEGORIES = {
  AI: 'LLM 원리·모델·연구·해석',
  AGENT: '에이전트·하네스·에이전틱 코딩·MCP·프롬프팅',
  DEV: '개발 도구·워크플로·생산성',
  ARCH: '소프트웨어 아키텍처·백엔드·데이터',
  FE: '프론트엔드·브라우저·웹 성능·네트워크',
  DS: '디자인 시스템·디자인 토큰·design-to-code',
  UX: 'UI/UX 원리·타이포그래피·레이아웃·사용성',
  LEARN: '학습과학·교육·학습법',
  BIZ: '비즈니스 전략·창업·제품·시장 진입',
  CAREER: '커리어·조직·채용·평가',
  SELF: '자기관리·생산성 습관·정체성',
  GAME: '게임 기획·개발',
  SEC: '보안·암호',
  SCI: '과학 일반',
  STOCK: '투자·시장',
  MATH: '수학',
} as const;

export type NoteIdCategory = keyof typeof NOTE_ID_CATEGORIES;

/**
 * Collections whose documents carry a noteId. Kept here (not in
 * `src/lib/collections.ts`) so the plain-tsx scripts can read it without
 * pulling in `astro:content`.
 */
export const NOTE_ID_COLLECTIONS = ['notes', 'inbox', 'sources', 'idea', 'wiki'] as const;

export type NoteIdCollection = (typeof NOTE_ID_COLLECTIONS)[number];

/**
 * `{CATEGORY}-{YYMM}-{NNN}`.
 *
 * The category is matched loosely (any uppercase code) so a parse still
 * succeeds for an id whose category was later removed from the registry —
 * reporting "unknown category" beats reporting "malformed id". Registry
 * membership is a separate check (`isKnownCategory`).
 */
export const NOTE_ID_PATTERN = /^([A-Z][A-Z0-9]{1,7})-(\d{4})-(\d{3})$/;

/** Highest sequence the 3-digit field can hold within one category-month. */
const MAX_SEQ = 999;

export interface ParsedNoteId {
  category: string;
  /** Two-digit year + two-digit month, in KST (e.g. `2608`). */
  yymm: string;
  /** 1-based position within the category's month; not zero-padded. */
  seq: number;
}

export function parseNoteId(value: string): ParsedNoteId | null {
  const match = NOTE_ID_PATTERN.exec(value);
  if (!match) return null;
  return { category: match[1], yymm: match[2], seq: Number(match[3]) };
}

export function formatNoteId(category: string, yymm: string, seq: number): string {
  if (!Number.isInteger(seq) || seq < 1 || seq > MAX_SEQ) {
    throw new Error(`noteId sequence out of range (1-${MAX_SEQ}): ${seq}`);
  }
  return `${category}-${yymm}-${String(seq).padStart(3, '0')}`;
}

/**
 * The `YYMM` an id gets from a document's pubDate.
 *
 * KST, via the project's single date-formatting source. A UTC month would file
 * documents authored 00:00–09:00 KST on the 1st under the previous month.
 */
export function noteIdMonth(date: Date): string {
  const iso = formatDate(date); // YYYY-MM-DD in Asia/Seoul
  return iso.slice(2, 4) + iso.slice(5, 7);
}

export function isKnownCategory(code: string): code is NoteIdCategory {
  return Object.hasOwn(NOTE_ID_CATEGORIES, code);
}

/**
 * The next free id for a category-month, given every id already in use.
 *
 * Counts from the highest sequence taken rather than the count of ids, so a
 * deleted document's number is retired instead of being handed to a different
 * document later — the one thing that would make a handwritten reference lie.
 */
export function allocateNoteId(category: string, yymm: string, taken: Iterable<string>): string {
  let highest = 0;
  for (const value of taken) {
    const parsed = parseNoteId(value);
    if (!parsed || parsed.category !== category || parsed.yymm !== yymm) continue;
    if (parsed.seq > highest) highest = parsed.seq;
  }
  if (highest >= MAX_SEQ) {
    throw new Error(`noteId space exhausted for ${category}-${yymm} (max ${MAX_SEQ})`);
  }
  return formatNoteId(category, yymm, highest + 1);
}
