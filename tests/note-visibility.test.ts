import { describe, expect, it } from 'vitest';
import { classifyDocs, type Doc } from '../scripts/check-note-visibility';

/**
 * These cases pin the classifier to the two list pages it mirrors. If either
 * page changes its filter, one of these fails and the script gets updated with
 * it — that coupling is the point, because a silently drifted mirror is worse
 * than no mirror at all.
 *
 *   src/pages/notes/[...page].astro — production prefix filter over non-draft items
 *   src/pages/idea/index.astro      — /idea/inbox/ removed first, then prefix
 */
function doc(href: string, draft = false): Doc {
  const collection = href.startsWith('/idea/') ? 'idea' : 'notes';
  return { file: `src/content${href.replace(/\/$/, '')}.md`, href, collection, draft };
}

const statusOf = (verdicts: ReturnType<typeof classifyDocs>, href: string) =>
  verdicts.find((v) => v.doc.href === href)?.status;

describe('note visibility classifier', () => {
  it('lists a standalone topic', () => {
    const v = classifyDocs([doc('/notes/alpha/')], 'notes');
    expect(statusOf(v, '/notes/alpha/')).toBe('listed');
  });

  it('lists sibling topics independently', () => {
    const v = classifyDocs([doc('/notes/alpha/'), doc('/notes/beta/')], 'notes');
    expect(statusOf(v, '/notes/alpha/')).toBe('listed');
    expect(statusOf(v, '/notes/beta/')).toBe('listed');
  });

  it('hides a child behind its hub and names the hub', () => {
    const v = classifyDocs([doc('/notes/alpha/'), doc('/notes/alpha/child/')], 'notes');
    expect(statusOf(v, '/notes/alpha/')).toBe('listed');
    const child = v.find((x) => x.doc.href === '/notes/alpha/child/');
    expect(child?.status).toBe('hub-only');
    expect(child?.hiddenBy).toBe('/notes/alpha/');
  });

  it('reproduces the incident that motivated this check', () => {
    // A spec draft written under an existing note's topic directory never
    // appears on /notes/, no matter how many times the dev server restarts.
    const v = classifyDocs(
      [
        doc('/notes/what-to-learn-and-when-to-stop/'),
        doc('/notes/what-to-learn-and-when-to-stop/skill-spec-draft/'),
      ],
      'notes',
    );
    expect(statusOf(v, '/notes/what-to-learn-and-when-to-stop/skill-spec-draft/')).toBe('hub-only');
  });

  it('marks a draft as unlisted regardless of depth', () => {
    const v = classifyDocs([doc('/notes/alpha/', true)], 'notes');
    expect(statusOf(v, '/notes/alpha/')).toBe('draft');
  });

  it('does not let a draft hub hide its child', () => {
    // Production getListItems() strips drafts before the prefix filter runs,
    // so a draft hub is absent and its child surfaces on its own.
    const v = classifyDocs([doc('/notes/alpha/', true), doc('/notes/alpha/child/')], 'notes');
    expect(statusOf(v, '/notes/alpha/child/')).toBe('listed');
  });

  it('routes idea staging captures to /idea/inbox/ rather than /idea/', () => {
    const v = classifyDocs([doc('/idea/inbox/raw-thought/')], 'idea');
    const capture = v.find((x) => x.doc.href === '/idea/inbox/raw-thought/');
    expect(capture?.status).toBe('idea-inbox');
    expect(capture?.listPage).toBe('/idea/inbox/');
  });

  it('does not let a staging capture hide a developed idea sharing its prefix', () => {
    // /idea/ drops the staging area BEFORE the prefix filter, so an inbox entry
    // can never act as a hub for anything.
    const v = classifyDocs([doc('/idea/inbox/'), doc('/idea/inbox/thing/')], 'idea');
    expect(statusOf(v, '/idea/inbox/thing/')).toBe('idea-inbox');
  });

  it('still hides a child of a developed idea', () => {
    const v = classifyDocs([doc('/idea/alpha/'), doc('/idea/alpha/sub/')], 'idea');
    expect(statusOf(v, '/idea/alpha/sub/')).toBe('hub-only');
  });
});
