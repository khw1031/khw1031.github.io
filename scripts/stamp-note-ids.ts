/**
 * Stamps a permanent `noteId` into agent-authored content frontmatter.
 *
 * A noteId is transcribed into a paper notebook, so this script is built around
 * one invariant: it NEVER rewrites an id that already exists, and it never
 * reissues a sequence a deleted document once held. Everything else — which
 * category a document gets, when it gets stamped — is a reviewable decision the
 * plan file records.
 *
 * Two steps, on purpose. Choosing a subject category is a judgement call, so it
 * goes through a file a human can read and correct before anything is written:
 *
 *   tsx scripts/stamp-note-ids.ts --plan > note-id-plan.tsv
 *     Emits one TSV row per unstamped document with an empty category column,
 *     plus its collection, date, path, and title as review context.
 *
 *   # fill in the first column, then:
 *   tsx scripts/stamp-note-ids.ts --apply note-id-plan.tsv [--dry-run]
 *     Allocates ids and writes them. Rows with a blank category are skipped, so
 *     a plan can be applied in passes. Refuses to write anything if any row
 *     names an unregistered category or a file that is already stamped.
 *
 * Sequences run in pubDate order within each category-month, so a lower number
 * means an earlier document.
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';
import matter from 'gray-matter';
import {
  allocateNoteId,
  isKnownCategory,
  NOTE_ID_COLLECTIONS,
  noteIdMonth,
} from '../src/lib/note-id';

const CONTENT_ROOT = resolve('src/content');
const TARGET_COLLECTIONS = new Set<string>(NOTE_ID_COLLECTIONS);

interface Doc {
  /** Repo-relative path, the plan file's key. */
  file: string;
  collection: string;
  title: string;
  pubDate: Date;
  noteId?: string;
}

function collectionOf(file: string): string {
  const first = relative(CONTENT_ROOT, file).split(sep)[0];
  return first.endsWith('.md') ? '(root)' : first;
}

function readDocs(): Doc[] {
  if (!existsSync(CONTENT_ROOT)) return [];
  const docs: Doc[] = [];
  for (const entry of readdirSync(CONTENT_ROOT, { recursive: true, withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
    const abs = join(entry.parentPath, entry.name);
    const collection = collectionOf(abs);
    if (!TARGET_COLLECTIONS.has(collection)) continue;
    const data = matter(readFileSync(abs, 'utf-8')).data as Record<string, unknown>;
    const pubDate = new Date(data.pubDate as string | number | Date);
    if (Number.isNaN(pubDate.getTime())) {
      throw new Error(`${relative(process.cwd(), abs)}: missing or invalid pubDate`);
    }
    docs.push({
      file: relative(process.cwd(), abs),
      collection,
      title: String(data.title ?? ''),
      pubDate,
      noteId: typeof data.noteId === 'string' ? data.noteId : undefined,
    });
  }
  // pubDate order decides sequence order; the path breaks same-timestamp ties
  // so a re-run of --apply on the same plan produces identical ids.
  return docs.sort(
    (a, b) => a.pubDate.valueOf() - b.pubDate.valueOf() || a.file.localeCompare(b.file),
  );
}

/** Tabs and newlines would break the TSV; titles are context only, so flatten. */
function tsvCell(value: string): string {
  return value.replace(/[\t\r\n]+/g, ' ').trim();
}

function emitPlan(docs: Doc[]): void {
  const pending = docs.filter((d) => !d.noteId);
  process.stdout.write('# category\tcollection\tpubDate\tfile\ttitle\n');
  process.stdout.write(
    `# ${pending.length} unstamped of ${docs.length}. Fill the category column; blank rows are skipped.\n`,
  );
  for (const doc of pending) {
    process.stdout.write(
      `\t${doc.collection}\t${doc.pubDate.toISOString().slice(0, 10)}\t${doc.file}\t${tsvCell(doc.title)}\n`,
    );
  }
}

/** file → category, from the plan's first two meaningful columns. */
function readPlan(path: string): Map<string, string> {
  const assignments = new Map<string, string>();
  const lines = readFileSync(path, 'utf-8').split('\n');
  for (const [index, line] of lines.entries()) {
    if (!line.trim() || line.startsWith('#')) continue;
    const cells = line.split('\t');
    const category = (cells[0] ?? '').trim();
    const file = (cells[3] ?? '').trim();
    if (!file) throw new Error(`${path}:${index + 1}: no file path in column 4`);
    if (!category) continue; // deliberately deferred
    if (assignments.has(file)) throw new Error(`${path}:${index + 1}: ${file} listed twice`);
    assignments.set(file, category);
  }
  return assignments;
}

function apply(docs: Doc[], planPath: string, dryRun: boolean): void {
  const assignments = readPlan(planPath);
  const byFile = new Map(docs.map((d) => [d.file, d]));

  // Validate the whole plan before touching a file: a half-applied plan leaves
  // permanent ids behind that a corrected re-run cannot reclaim.
  const problems: string[] = [];
  for (const [file, category] of assignments) {
    const doc = byFile.get(file);
    if (!doc) problems.push(`${file}: not a stampable content file`);
    else if (doc.noteId)
      problems.push(`${file}: already stamped ${doc.noteId} (ids are permanent)`);
    if (!isKnownCategory(category)) {
      problems.push(`${file}: unregistered category '${category}'`);
    }
  }
  if (problems.length > 0) {
    process.stderr.write(
      `✗ plan rejected, nothing written:\n${problems.map((p) => `  ${p}\n`).join('')}`,
    );
    process.exit(1);
  }

  // Seed from every id in the repo — including files outside this plan — so a
  // sequence is never handed out twice.
  const taken = new Set(docs.map((d) => d.noteId).filter((id): id is string => Boolean(id)));

  let stamped = 0;
  for (const doc of docs) {
    const category = assignments.get(doc.file);
    if (!category) continue;
    const id = allocateNoteId(category, noteIdMonth(doc.pubDate), taken);
    taken.add(id);
    if (dryRun) {
      process.stdout.write(`  ${id}\t${doc.file}\n`);
    } else {
      writeNoteId(doc.file, id);
    }
    stamped += 1;
  }

  const verb = dryRun ? 'would stamp' : 'stamped';
  process.stdout.write(`✓ ${verb} ${stamped} file(s)\n`);
}

/**
 * Insert `noteId:` into the frontmatter block by string surgery.
 *
 * gray-matter's stringify would reformat every other field (quoting, key order,
 * date serialization) across 250 files, burying the one line that changed. The
 * id lands right after `pubDate`, which is always a single-line scalar, so the
 * two identity fields sit together; a file without one gets it appended.
 */
function writeNoteId(file: string, id: string): void {
  const raw = readFileSync(file, 'utf-8');
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) throw new Error(`${file}: no frontmatter block`);
  const block = match[1];
  if (/^noteId:/m.test(block)) throw new Error(`${file}: already has a noteId`);
  const line = `noteId: ${id}`;
  const next = /^pubDate:.*$/m.test(block)
    ? block.replace(/^(pubDate:.*)$/m, `$1\n${line}`)
    : `${block}\n${line}`;
  writeFileSync(file, raw.replace(block, next));
}

function main(): void {
  const args = process.argv.slice(2);
  const docs = readDocs();

  if (args.includes('--plan')) {
    emitPlan(docs);
    return;
  }

  const applyIndex = args.indexOf('--apply');
  if (applyIndex !== -1) {
    const planPath = args[applyIndex + 1];
    if (!planPath || planPath.startsWith('--')) {
      process.stderr.write('✗ --apply needs a plan file path\n');
      process.exit(1);
    }
    apply(docs, planPath, args.includes('--dry-run'));
    return;
  }

  const stamped = docs.filter((d) => d.noteId).length;
  process.stdout.write(
    `${stamped}/${docs.length} stampable documents carry a noteId.\n` +
      'Usage: --plan | --apply <plan.tsv> [--dry-run]\n',
  );
}

main();
