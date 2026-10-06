#!/usr/bin/env node --experimental-strip-types
/**
 * Builds scripts/translation-memory.json: approved, human-written Spanish and
 * French for English strings that are still on the site — so the DeepL
 * drafts never overwrite them.
 *
 * WHERE THE TRANSLATIONS COME FROM: the original site's dictionary
 * (lib/i18n.js — hand-written EN / ES / FR, the wording the client approved
 * before the migration). A current English string is added to the memory
 * when it is the SAME sentence as an original English string (compared
 * ignoring capitals, punctuation, spacing and tags). Strings the client has
 * reworded since are not in the memory, so they still go to DeepL.
 *
 * Skipped on purpose: an original translation that contains HTML tags
 * (`<br>`, `<em>` — the new content splits those into separate fields, so the
 * strings don't correspond 1:1), and any English string whose matches
 * disagree with each other.
 *
 * The memory is a plain JSON file so a native reviewer can also add or fix
 * entries by hand: { "es": { "<exact English string>": "<approved Spanish>" },
 * "fr": { ... } }. Hand edits survive — re-running this script MERGES into
 * the file and never overwrites an existing entry.
 *
 * Usage (from the repo root):
 *   node --experimental-strip-types scripts/build-translation-memory.mjs
 */
import { register } from "node:module";
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "node:fs";
import vm from "node:vm";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
register(pathToFileURL(path.join(HERE, "lib/ts-resolve-hook.mjs")).href, import.meta.url);
const { loadTinaSchema } = await import("./lib/tina-schema.mjs");
const { collectTranslationUnits } = await import("./lib/translatable-content.mjs");

const REPO = path.resolve(HERE, "..");
const MEMORY_PATH = path.join(HERE, "translation-memory.json");

// ---- the original dictionary, flattened per language ----
const sandbox = { window: {}, document: {}, console };
vm.createContext(sandbox);
vm.runInContext(readFileSync(path.join(REPO, "lib/i18n.js"), "utf8"), sandbox);
const dict = sandbox.window.I18N ?? Object.values(sandbox.window)[0];
const flatten = (o, prefix = "", out = {}) => {
  for (const [k, v] of Object.entries(o)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) flatten(v, key, out);
    else if (typeof v === "string") out[key] = v;
  }
  return out;
};
const orig = { en: flatten(dict.en), es: flatten(dict.es), fr: flatten(dict.fr) };

const ENTITIES = { amp: "&", mdash: "—", ndash: "–", nbsp: " ", hellip: "…", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“", middot: "·", apos: "'", quot: '"' };
function decode(s) {
  return s.replace(/&(#\d+|[a-z]+);/gi, (m, e) => {
    if (e[0] === "#") return String.fromCodePoint(Number(e.slice(1)));
    return ENTITIES[e.toLowerCase()] ?? m;
  });
}
const norm = (s) =>
  decode(s.replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, ""))
    .toLowerCase()
    .replace(/[\s ]+/g, " ")
    .replace(/[^\p{L}\p{N} ]/gu, "")
    .trim();

// original EN (normalised) -> the original keys that have that text
const byNorm = new Map();
for (const [key, text] of Object.entries(orig.en)) {
  const n = norm(text);
  if (n.length < 3) continue;
  if (!byNorm.has(n)) byNorm.set(n, []);
  byNorm.get(n).push(key);
}

// ---- the current English strings that are translatable ----
const schema = await loadTinaSchema();
const CONTENT = path.join(REPO, "content");
const enStrings = new Set();
for (const folder of readdirSync(CONTENT)) {
  const dir = path.join(CONTENT, folder);
  if (!statSync(dir).isDirectory() || !schema.has(folder)) continue;
  const files = [];
  if (existsSync(path.join(dir, "en.json"))) files.push(path.join(dir, "en.json"));
  if (existsSync(path.join(dir, "en"))) for (const f of readdirSync(path.join(dir, "en"))) if (f.endsWith(".json")) files.push(path.join(dir, "en", f));
  for (const file of files) {
    const { units } = collectTranslationUnits(JSON.parse(readFileSync(file, "utf8")), schema.get(folder).fields);
    for (const u of units) enStrings.add(u.get());
  }
}

// ---- match ----
const memory = existsSync(MEMORY_PATH) ? JSON.parse(readFileSync(MEMORY_PATH, "utf8")) : { es: {}, fr: {} };
const stats = { es: { added: 0, skippedTags: 0, conflicts: 0 }, fr: { added: 0, skippedTags: 0, conflicts: 0 } };
for (const en of enStrings) {
  const keys = byNorm.get(norm(en));
  if (!keys) continue;
  for (const lang of ["es", "fr"]) {
    if (memory[lang][en]) continue; // never overwrite a reviewed/hand-edited entry
    const candidates = new Set(keys.map((k) => orig[lang][k]).filter(Boolean));
    const clean = [...candidates].filter((t) => {
      if (/<[a-z/]/i.test(t)) { stats[lang].skippedTags++; return false; }
      return true;
    });
    if (clean.length === 0) continue;
    if (new Set(clean.map((t) => norm(decode(t)))).size > 1) { stats[lang].conflicts++; continue; }
    memory[lang][en] = decode(clean[0]).trim();
    stats[lang].added++;
  }
}

writeFileSync(MEMORY_PATH, `${JSON.stringify(memory, null, 2)}\n`);
console.log(`translation-memory.json: es ${Object.keys(memory.es).length} entries, fr ${Object.keys(memory.fr).length} entries`);
console.log(JSON.stringify(stats));
