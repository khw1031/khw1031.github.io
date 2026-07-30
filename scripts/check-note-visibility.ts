/**
 * List-visibility reporter for the tree-shaped content collections.
 *
 * The problem it exists for: `notes` and `idea` are topic trees whose list pages
 * deliberately hide child documents, so a freshly authored child is reachable
 * ONLY from its hub's auto-rendered TOC. That is by design, not a defect — but
 * it is invisible at authoring time, and the symptom it produces ("I wrote the
 * doc, I refreshed, it is not in the list") is indistinguishable from a stale
 * dev server. Chasing it as a cache bug costs far more than the write did.
 *
 * Why a script and not a rule: AGENTS.md already documented the hiding rule and
 * it still got misdiagnosed as a dev-server cache problem, because the rule
 * lives in prose while the symptom shows up as a URL. This turns the same fact
 * into a named list of documents you can read in one line.
 *
 * No duplicated rule: the collapse itself is `collapseToHubs` in
 * src/lib/listing.ts, called by this reporter AND by both list pages
 * (src/pages/notes/[...page].astro, src/pages/idea/index.astro), so the report
 * cannot drift away from what the site renders. Only the per-page context is
 * restated here — /idea/ drops its staging area before collapsing, and
 * getListItems() drops `draft: true` before either page sees it. Drafts are
 * reported too, because a draft produces the identical "it is not there"
 * symptom for an entirely different reason.
 *
 * `inbox` and `sources` are flat collections with no prefix filter, so they are
 * out of scope: every document in them lists.
 *
 * Warning-only: NEVER blocks a push (always exit 0), matching
 * check-stray-script and check-notes-polish. Being hub-only is a legitimate
 * state; the point is that it is stated out loud, not that it is forbidden.
 *
 * Usage:
 *   tsx scripts/check-note-visibility.ts                  # whole tree
 *   tsx scripts/check-note-visibility.ts src/content/notes/foo/bar.md
 *   tsx scripts/check-note-visibility.ts --json           # machine-readable
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { relative, resolve, sep } from 'node:path';
import matter from 'gray-matter';
import { collapseToHubs } from '../src/lib/listing';

/** Collections whose list page hides children behind a hub. */
const TREE_COLLECTIONS = ['notes', 'idea'] as const;
type TreeCollection = (typeof TREE_COLLECTIONS)[number];

export type Doc = {
  /** Repo-relative source path. */
  file: string;
  /** Public URL, mirroring entryToItem: `/${collection}/${id}/` with /index folded. */
  href: string;
  collection: TreeCollection;
  draft: boolean;
};

export type Verdict = {
  doc: Doc;
  /** Where the document actually surfaces. */
  status: 'listed' | 'hub-only' | 'draft' | 'idea-inbox';
  /** For hub-only: the href of the hub that hides it. */
  hiddenBy?: string;
  /** The list page this document does (or would) appear on. */
  listPage: string;
};

function sourceFiles(collection: TreeCollection): string[] {
  const dir = resolve('src/content', collection);
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { recursive: true, encoding: 'utf-8' })
    .filter((name) => name.endsWith('.md'))
    .sort();
}

function toDoc(collection: TreeCollection, relFile: string): Doc {
  const id = relFile
    .split(sep)
    .join('/')
    .replace(/\.md$/, '')
    .replace(/\/index$/, '');
  const file = `src/content/${collection}/${relFile.split(sep).join('/')}`;
  const raw = readFileSync(resolve(file), 'utf-8');
  return {
    file,
    href: `/${collection}/${id}/`,
    collection,
    draft: matter(raw).data?.draft === true,
  };
}

/**
 * Pure classifier. The collapse rule itself comes from src/lib/listing.ts, the
 * same module both list pages call, so this reporter cannot drift away from
 * what the site actually renders. What stays here is the surrounding context
 * each page applies before collapsing: drafts are gone before getListItems()
 * returns, and /idea/ removes its staging area first.
 */
export function classifyDocs(docs: Doc[], collection: TreeCollection): Verdict[] {
  const listPage = `/${collection}/`;
  const isStaging = (d: Doc) => collection === 'idea' && d.href.startsWith('/idea/inbox/');

  const candidates = docs.filter((d) => !d.draft && !isStaging(d));
  const listed = new Set(collapseToHubs(candidates).map((d) => d.href));

  return docs.map((doc): Verdict => {
    if (doc.draft) return { doc, status: 'draft', listPage };
    if (isStaging(doc)) return { doc, status: 'idea-inbox', listPage: '/idea/inbox/' };
    if (listed.has(doc.href)) return { doc, status: 'listed', listPage };
    const hub = candidates.find((o) => o.href !== doc.href && doc.href.startsWith(o.href));
    return { doc, status: 'hub-only', hiddenBy: hub?.href, listPage };
  });
}

function classify(collection: TreeCollection): Verdict[] {
  return classifyDocs(
    sourceFiles(collection).map((f) => toDoc(collection, f)),
    collection,
  );
}

function report(args: string[]): void {
  const asJson = args.includes('--json');
  const scope = args.filter((a) => !a.startsWith('--')).map((a) => relative('.', resolve(a)));

  const all = TREE_COLLECTIONS.flatMap(classify).filter(
    (v) =>
      scope.length === 0 || scope.some((s) => v.doc.file === s || v.doc.file.startsWith(`${s}/`)),
  );

  if (asJson) {
    console.log(JSON.stringify(all, null, 2));
    return;
  }

  if (all.length === 0) {
    console.log('✓ note-visibility: no documents in scope');
    return;
  }

  // Only documents that reach NO list page are worth printing. An /idea/inbox/
  // capture lists at /idea/inbox/, so surfacing it here every run would bury the
  // one line that matters under seven that never change.
  const hidden = all.filter((v) => v.status === 'hub-only' || v.status === 'draft');

  if (hidden.length === 0) {
    console.log(`✓ note-visibility: all ${all.length} document(s) reach a list page`);
    return;
  }

  console.log(
    `note-visibility: ${all.length - hidden.length} on a list page, ${hidden.length} NOT listed anywhere`,
  );
  console.log('');
  for (const v of hidden) {
    console.log(`  ${v.doc.file}`);
    console.log(`    URL      ${v.doc.href}`);
    if (v.status === 'hub-only') {
      console.log(`    NOT on   ${v.listPage}  (child of ${v.hiddenBy}; the list shows hubs only)`);
      console.log(`    reach it ${v.hiddenBy}  (hub TOC), or the URL above`);
    } else {
      console.log(`    NOT on   ${v.listPage}  (draft: true)`);
      console.log('    reach it the URL above');
    }
    console.log('');
  }
  console.log('Hub-only is a valid layout. Promote it to a top-level topic only if the');
  console.log('document should stand on its own in the list. Say which one applies.');
}

// Importing this module (the test does) must not run the CLI.
if (process.argv[1] !== undefined && resolve(process.argv[1]) === resolve(import.meta.filename)) {
  report(process.argv.slice(2));
}
