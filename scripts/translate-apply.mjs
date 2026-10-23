#!/usr/bin/env node --experimental-strip-types
/**
 * Step 3 of /translate. Reads .translation-work/translated.json ({ id: text }),
 * checks every translation against .translation-work/pending.json, and only if
 * everything passes writes the Spanish and French files, removes translations
 * of deleted English documents and records what is now in sync in
 * scripts/translation-state.json. Nothing is written when a check fails.
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { PENDING_PATH, ROOT, TRANSLATED_PATH, git, loadContext, readState, writeFileSync, writeState } from "./lib/translation-run.mjs";
import { pruneOrphanTranslations } from "./lib/translation-files.mjs";
import { buildDocument, entryId, pendingEntries, planAll, serialize, sha, validateTranslation } from "./lib/translation-sync.mjs";

function fail(lines) {
  console.error(`${lines.join("\n")}\n\nNothing was written. Fix translated.json and run translate:apply again.`);
  process.exit(1);
}

if (!existsSync(PENDING_PATH)) fail(["No .translation-work/pending.json. Run `npm run translate:prepare` first."]);
if (!existsSync(TRANSLATED_PATH)) fail(["No .translation-work/translated.json. Write the translations as { id: text } first."]);

const pending = JSON.parse(readFileSync(PENDING_PATH, "utf8"));
let translated;
try {
  translated = JSON.parse(readFileSync(TRANSLATED_PATH, "utf8"));
} catch (err) {
  fail([`translated.json is not valid JSON: ${err.message}`]);
}

const { schema, memory } = await loadContext();
const state = readState(ROOT);
if (!state) fail(["No scripts/translation-state.json. Run `npm run translate:prepare` first."]);

const errors = [];
const warnings = [];

// The English must still be what prepare saw, or the translations would be saved against the wrong text.
for (const { file, englishSha256 } of pending.files) {
  const current = sha(readFileSync(path.join(ROOT, file), "utf8"));
  if (current !== englishSha256) errors.push(`${file} changed after translate:prepare. Run it again.`);
}
if (errors.length > 0) fail(errors);

// Plan again from the same state: the pending set must be exactly what prepare listed.
const plans = planAll({ root: ROOT, schema, memory, state, files: pending.files.map((f) => f.file) });
const expected = new Map();
for (const { locales } of plans) for (const plan of locales) for (const entry of pendingEntries(plan)) expected.set(entry.id, entry);

const listed = new Set(pending.entries.map((e) => e.id));
for (const id of expected.keys()) if (!listed.has(id)) errors.push(`pending.json is out of date (missing ${id}). Run translate:prepare again.`);
for (const id of listed) if (!expected.has(id)) errors.push(`pending.json is out of date (unknown ${id}). Run translate:prepare again.`);
for (const id of listed) if (!(id in translated)) errors.push(`missing translation for ${id}: "${expected.get(id)?.english?.slice(0, 60)}"`);
for (const id of Object.keys(translated)) if (!listed.has(id)) errors.push(`extra id ${id} is not in pending.json`);

for (const [id, entry] of expected) {
  if (!(id in translated)) continue;
  const result = validateTranslation(entry.english, translated[id]);
  result.errors.forEach((e) => errors.push(`${entry.file} [${entry.locale}] ${entry.path}: ${e}`));
  result.warnings.forEach((w) => warnings.push(`${entry.file} [${entry.locale}] ${entry.path}: ${w}`));
}
if (errors.length > 0) fail(errors);

const written = [];
const counts = { es: { translated: 0, reused: 0, memory: 0 }, fr: { translated: 0, reused: 0, memory: 0 } };
for (const { locales } of plans) {
  for (const plan of locales) {
    for (const w of plan.warnings) warnings.push(w);
    if (plan.mode === "unchanged") continue;
    const texts = plan.texts.map((text, i) => (text !== null ? text : translated[entryId(plan.file, plan.locale, i, plan.english[i])]));
    plan.sources.forEach((source) => {
      counts[plan.locale][source === "pending" ? "translated" : source] += 1;
    });
    const out = path.join(ROOT, plan.outFile);
    const next = serialize(buildDocument(plan.cur, plan.collection.fields, plan.locale, texts));
    if (!existsSync(out) || readFileSync(out, "utf8") !== next) {
      writeFileSync(out, next);
      written.push(plan.outFile);
    }
  }
}

const removed = pruneOrphanTranslations(ROOT);
for (const { file } of pending.files) state.files[file] = pending.head;
writeState(state);

console.log("Applied.");
console.log(`Files written (${written.length}):\n${written.map((f) => `  ${f}`).join("\n") || "  none"}`);
if (removed.length > 0) console.log(`Removed (English source deleted) (${removed.length}):\n${removed.map((f) => `  ${f}`).join("\n")}`);
for (const locale of ["es", "fr"]) {
  const c = counts[locale];
  console.log(`${locale}: ${c.translated} translated, ${c.reused} reused from existing translations, ${c.memory} from the translation memory`);
}
if (warnings.length > 0) console.log(`\nWarnings (${warnings.length}):\n${warnings.map((w) => `  - ${w}`).join("\n")}`);
console.log("\nNext: run `npm run translate:prepare` again; it says when nothing is left.");
