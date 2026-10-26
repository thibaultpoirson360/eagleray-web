#!/usr/bin/env node --experimental-strip-types
/**
 * Step 1 of /translate. Works out which English strings need a new Spanish or
 * French translation and writes them to .translation-work/pending.json.
 * Makes no network call and writes no content file.
 *
 *   npm run translate:prepare   write the work file
 *   npm run translate:status    only list the English files that are out of date
 *
 * The first run (no scripts/translation-state.json yet) treats the existing
 * Spanish and French files as in sync with the current commit, or with the
 * commit given as `--since <sha>` (use it when the translations are behind).
 * A batch holds whole files, up to MAX_ENTRIES strings; run /translate again
 * for the rest.
 */
import { spawnSync } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import { PENDING_PATH, ROOT, WORK_DIR, git, loadContext, mkdirSync, readState, writeFileSync, writeState } from "./lib/translation-run.mjs";
import { baselineFor, pendingEntries, planAll, planNeedsWrite, sha } from "./lib/translation-sync.mjs";
import { readFileSync } from "node:fs";
import path from "node:path";

const MAX_ENTRIES = 150;
const statusOnly = process.argv.includes("--status");

const { schema, memory } = await loadContext();
const head = git.head(ROOT);

let state = readState(ROOT);
const sinceIndex = process.argv.indexOf("--since");
const since = sinceIndex > 0 ? process.argv[sinceIndex + 1] : null;
if (since && state) {
  console.error("--since only works on the first run, before scripts/translation-state.json exists.");
  process.exit(1);
}
if (!state) {
  let baseline = head;
  if (since) {
    const r = spawnSync("git", ["-C", ROOT, "rev-parse", "--verify", `${since}^{commit}`], { encoding: "utf8" });
    if (r.status !== 0) {
      console.error(`--since: "${since}" is not a commit in this repository.`);
      process.exit(1);
    }
    baseline = r.stdout.trim();
  }
  state = { default: baseline, files: {} };
  if (statusOnly) {
    console.log(`No scripts/translation-state.json yet: counting changes since ${baseline.slice(0, 7)}${since ? "" : " (the current commit, so nothing)"}.`);
  } else {
    writeState(state);
    console.log(
      since
        ? `First run: recorded ${baseline.slice(0, 7)} (--since) as the point the translations are in sync with, so English changed after it will be translated (scripts/translation-state.json).`
        : `First run: recorded ${baseline.slice(0, 7)} as the point the translations are in sync with (scripts/translation-state.json).`
    );
  }
}

if (!statusOnly) {
  const dirty = git.dirtyEnglishFiles(ROOT);
  if (dirty.length > 0) {
    console.error(`These English files have changes that are not committed yet:\n${dirty.map((f) => `  ${f}`).join("\n")}\nCommit or discard them first, so the translations are matched to a commit.`);
    process.exit(1);
  }
}

const skipped = [];
const plans = planAll({ root: ROOT, schema, memory, state, skipped });
for (const file of skipped) console.warn(`No Tina collection for ${file}; skipped.`);

const work = [];
for (const { file, locales } of plans) {
  const pending = locales.reduce((n, p) => n + p.pending.length, 0);
  const writes = locales.some((p) => p.pending.length > 0 || planNeedsWrite(ROOT, p));
  if (writes) work.push({ file, locales, pending });
}

const stale = work.length;
console.log(stale === 0 ? "" : `${stale} English file(s) out of date:`);
for (const { file, locales, pending } of work) {
  const detail = locales.map((p) => `${p.locale}: ${p.pending.length} to translate (${p.mode})`).join(", ");
  console.log(`  ${file}: ${pending} string(s); ${detail}`);
  for (const p of locales) for (const w of p.warnings) console.warn(`    warning: ${w}`);
}

if (statusOnly) {
  if (stale === 0) console.log("Spanish and French are up to date with English.");
  process.exit(0);
}

if (existsSync(PENDING_PATH)) rmSync(PENDING_PATH);
const needTranslating = work.filter((w) => w.pending > 0);
const onlyWrites = work.filter((w) => w.pending === 0);

if (stale === 0) {
  console.log("Nothing needs translating. Spanish and French are up to date with English.");
  process.exit(0);
}

// One batch = whole files, at least one, up to MAX_ENTRIES strings. Files that only need
// reused text written ride along with the first batch (they cost nothing to translate).
const batch = [];
let count = 0;
for (const item of needTranslating) {
  if (batch.length > 0 && count + item.pending > MAX_ENTRIES) break;
  batch.push(item);
  count += item.pending;
}
const batchFiles = [...batch, ...(batch.length === 0 || batch.length === needTranslating.length ? onlyWrites : [])];
const remainingFiles = work.length - batchFiles.length;

const entries = batch.flatMap((item) => item.locales.flatMap((p) => pendingEntries(p)));
mkdirSync(WORK_DIR, { recursive: true });
writeFileSync(
  PENDING_PATH,
  `${JSON.stringify(
    {
      version: 1,
      head,
      createdAt: new Date().toISOString(),
      files: batchFiles.map((item) => ({
        file: item.file,
        baseline: baselineFor(state, item.file),
        englishSha256: sha(readFileSync(path.join(ROOT, item.file), "utf8")),
      })),
      entries,
    },
    null,
    2
  )}\n`
);

const perLocale = { es: 0, fr: 0 };
for (const entry of entries) perLocale[entry.locale] += 1;
console.log(`\nWrote ${path.relative(ROOT, PENDING_PATH)}: ${entries.length} string(s) to translate (es ${perLocale.es}, fr ${perLocale.fr}) in ${batch.length} file(s).`);
if (onlyWrites.length > 0 && batchFiles.length > batch.length) console.log(`${onlyWrites.length} more file(s) only need existing translations carried over; apply will write them.`);
if (entries.length === 0) console.log("No string needs a new translation; apply will only carry existing translations over.");
if (remainingFiles > 0) console.log(`${remainingFiles} more file(s) are waiting: run /translate again after this batch is applied.`);
