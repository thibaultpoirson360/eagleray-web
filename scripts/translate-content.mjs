#!/usr/bin/env node --experimental-strip-types
/**
 * Drafts ES/FR translations of changed EN source content and writes them
 * straight to content/<collection>/<locale>[.json | /<slug>.json] — never
 * commits or opens a PR itself (see .github/workflows/translate-content.yml
 * for that; this script only writes files to the working tree).
 *
 * Usage:
 *   node --experimental-strip-types scripts/translate-content.mjs [file...]
 *
 * Scope (env `TRANSLATE_SCOPE`, only when no file arguments are given):
 *   - `changed` (default) — only the EN files the triggering push changed.
 *   - `missing` — every EN file, but only writes the locale files that don't
 *     exist yet. Never touches an existing (possibly reviewed/hand-edited)
 *     translation. This is what to use to bring a whole site to a new
 *     language, or to fill gaps.
 *   - `all` — every EN file, overwriting every existing translation.
 *
 *   - With explicit file arguments: translates exactly those files (must be
 *     EN source paths, see EN_SOURCE below).
 *   - With no arguments: resolves changed files from
 *     `git diff $GIT_BASE_SHA...$GIT_HEAD_SHA` (falls back to `HEAD^...HEAD`
 *     for a local/manual run), and if that diff itself fails for any reason
 *     (e.g. a shallow checkout with no history), falls back to a full
 *     rescan of every `content/**\/en.json` / `content/**\/en/*.json` file
 *     so the run degrades to "translate everything" rather than silently
 *     translating nothing.
 *
 * Translation memory: scripts/translation-memory.json holds approved,
 * human-written translations of English strings (built from the original
 * site's dictionary by scripts/build-translation-memory.mjs, and editable by
 * hand). Any string found there is used as-is and never sent to DeepL, so
 * approved wording survives redrafts. `--apply-memory` applies the memory to
 * the ES/FR files that already exist, with no DeepL call and no API key.
 *
 * Requires `DEEPL_API_KEY` in the environment (a GitHub Actions secret in
 * CI — see docs/translation-workflow.md). Requires `node --experimental-strip-types`
 * because scripts/lib/tina-schema.mjs imports tina/collections/*.ts directly,
 * so the real schema — including the `doNotTranslate` marker — decides what
 * gets translated, not a hardcoded skip-list here.
 *
 * Zero npm dependencies: `fetch`, `node:fs`, `node:path`, `node:child_process`
 * only. That's why the Action that runs this has no `npm ci` step.
 */
import { register } from "node:module";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync, appendFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

// Must run before anything imports tina/collections/*.ts (loadTinaSchema,
// below) — see scripts/lib/ts-resolve-hook.mjs for why.
register(pathToFileURL(path.join(path.dirname(fileURLToPath(import.meta.url)), "lib/ts-resolve-hook.mjs")).href, import.meta.url);

const { loadTinaSchema } = await import("./lib/tina-schema.mjs");
const { translateDocument, collectTranslationUnits } = await import("./lib/translatable-content.mjs");
const { translateBatch } = await import("./lib/deepl.mjs");

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TARGET_LOCALES = ["es", "fr"];

const MEMORY_PATH = path.join(path.dirname(fileURLToPath(import.meta.url)), "translation-memory.json");
/** { es: { "<English>": "<approved>" }, fr: {...} } — empty if the file is missing. */
function loadMemory() {
  if (!existsSync(MEMORY_PATH)) return { es: {}, fr: {} };
  const memory = JSON.parse(readFileSync(MEMORY_PATH, "utf8"));
  return { es: memory.es ?? {}, fr: memory.fr ?? {} };
}

// content/<folder>/en.json  (one document per locale, e.g. hero, funnel)
const SINGLE_DOC_RE = /^content\/([^/]+)\/en\.json$/;
// content/<folder>/en/<slug>.json  (multi-document collections, e.g. crew, boats, blogPost)
const MULTI_DOC_RE = /^content\/([^/]+)\/en\/([^/]+)\.json$/;

function toRepoRelative(filePath) {
  const abs = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);
  return path.relative(REPO_ROOT, abs).split(path.sep).join("/");
}

function parseEnSourcePath(filePath) {
  const rel = toRepoRelative(filePath);
  let m = rel.match(SINGLE_DOC_RE);
  if (m) return { file: rel, folder: m[1], slug: null };
  m = rel.match(MULTI_DOC_RE);
  if (m) return { file: rel, folder: m[1], slug: m[2] };
  return null;
}

function runGitDiff(base, head) {
  const result = spawnSync("git", ["diff", "--name-only", "--diff-filter=ACMR", `${base}...${head}`], {
    cwd: REPO_ROOT,
    encoding: "utf8",
  });
  if (result.status !== 0) {
    throw new Error(result.stderr || `git diff ${base}...${head} exited ${result.status}`);
  }
  return result.stdout
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

/** Every `content/<folder>/en.json` and `content/<folder>/en/<slug>.json` in the repo. */
function fullRescan() {
  const contentDir = path.join(REPO_ROOT, "content");
  const files = [];
  if (!existsSync(contentDir)) return files;

  for (const entry of readdirSync(contentDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const folder = entry.name;

    const singleDoc = path.join("content", folder, "en.json");
    if (existsSync(path.join(REPO_ROOT, singleDoc))) files.push(singleDoc);

    const multiDocDir = path.join(REPO_ROOT, "content", folder, "en");
    if (existsSync(multiDocDir) && statSync(multiDocDir).isDirectory()) {
      for (const f of readdirSync(multiDocDir)) {
        if (f.endsWith(".json")) files.push(path.join("content", folder, "en", f));
      }
    }
  }
  return files;
}

/**
 * Resolves the list of changed EN source documents to translate, as
 * `{ file, folder, slug }`. `explicitFiles` (CLI args) take priority over
 * git-diff resolution; deleted files (no longer on disk) are dropped rather
 * than erroring, since there's nothing left to translate.
 */
export function resolveChangedEnFiles(explicitFiles = [], scope = "changed") {
  let candidates;

  if (explicitFiles.length > 0) {
    candidates = explicitFiles.map(toRepoRelative);
  } else if (scope !== "changed") {
    candidates = fullRescan();
  } else {
    const base = process.env.GIT_BASE_SHA || "HEAD^";
    const head = process.env.GIT_HEAD_SHA || "HEAD";
    try {
      candidates = runGitDiff(base, head);
    } catch (err) {
      console.warn(
        `[translate-content] git diff ${base}...${head} failed (${err.message}); falling back to a full rescan of content/**/en*.json.`
      );
      candidates = fullRescan();
    }
  }

  const parsed = [];
  for (const file of candidates) {
    const info = parseEnSourcePath(file);
    if (!info) continue;
    if (!existsSync(path.join(REPO_ROOT, info.file))) continue; // deleted — nothing to translate
    parsed.push(info);
  }
  return parsed;
}

function outputPathFor(folder, slug, locale) {
  return slug ? path.join("content", folder, locale, `${slug}.json`) : path.join("content", folder, `${locale}.json`);
}

/**
 * Translates one EN source document into every target locale and writes
 * the results to disk. `translateFnFactory(locale) -> (texts) => Promise<string[]>`
 * — injected so tests can pass a fake translator instead of calling DeepL.
 * Returns the list of repo-relative paths written.
 */
export async function translateFile(entry, schema, translateFnFactory, { skipExisting = false, memory = { es: {}, fr: {} } } = {}) {
  const { file, folder, slug } = entry;
  const collection = schema.get(folder);
  if (!collection) {
    console.warn(`[translate-content] No Tina collection found for content folder "${folder}" (from ${file}) — skipping.`);
    return [];
  }

  const doc = JSON.parse(readFileSync(path.join(REPO_ROOT, file), "utf8"));
  const written = [];

  for (const locale of TARGET_LOCALES) {
    const outRelative = outputPathFor(folder, slug, locale);
    const outAbsolute = path.join(REPO_ROOT, outRelative);
    if (skipExisting && existsSync(outAbsolute)) continue;
    const translated = await translateDocument(doc, collection.fields, translateFnFactory(locale), {
      locale,
      memory: memory[locale],
    });
    mkdirSync(path.dirname(outAbsolute), { recursive: true });
    // 2-space indent + trailing newline, matching every existing content/ file.
    writeFileSync(outAbsolute, `${JSON.stringify(translated, null, 2)}\n`);
    written.push(outRelative);
  }

  return written;
}

/**
 * Applies the translation memory to the ES/FR files that already exist,
 * in place, without calling DeepL. The English and the translated document
 * have the same structure, so their translatable strings line up one to one;
 * wherever the English string is in the memory, the translated string is set
 * to the approved one. A file whose two sides don't line up is left alone and
 * reported. Returns the repo-relative paths that changed.
 */
export function applyMemoryToFile(entry, schema, memory) {
  const { file, folder, slug } = entry;
  const collection = schema.get(folder);
  if (!collection) return { changed: [], skipped: [] };
  const english = collectTranslationUnits(JSON.parse(readFileSync(path.join(REPO_ROOT, file), "utf8")), collection.fields).units.map((u) => u.get());
  const changed = [];
  const skipped = [];

  for (const locale of TARGET_LOCALES) {
    const rel = outputPathFor(folder, slug, locale);
    const abs = path.join(REPO_ROOT, rel);
    if (!existsSync(abs)) continue;
    const before = readFileSync(abs, "utf8");
    const doc = JSON.parse(before);
    const { units, finalize } = collectTranslationUnits(doc, collection.fields, { locale });
    if (units.length !== english.length) {
      skipped.push(rel);
      continue;
    }
    units.forEach((unit, i) => {
      const approved = memory[locale][english[i]];
      if (approved !== undefined && unit.get() !== approved) unit.set(approved);
    });
    finalize();
    const after = `${JSON.stringify(doc, null, 2)}\n`;
    if (after !== before) {
      writeFileSync(abs, after);
      changed.push(rel);
    }
  }
  return { changed, skipped };
}

function setGithubOutput(name, value) {
  const outputPath = process.env.GITHUB_OUTPUT;
  if (!outputPath) return; // not running in Actions (local/manual run) — nothing to write
  const delimiter = `ghadelim_${Math.random().toString(36).slice(2)}`;
  appendFileSync(outputPath, `${name}<<${delimiter}\n${value}\n${delimiter}\n`);
}

function realTranslateFnFactory(apiKey) {
  return (locale) => (texts) => translateBatch(texts, locale.toUpperCase(), { apiKey });
}

const SCOPES = ["changed", "missing", "all"];

async function applyMemory() {
  const schema = await loadTinaSchema();
  const memory = loadMemory();
  let changedCount = 0;
  for (const entry of resolveChangedEnFiles([], "all")) {
    const { changed, skipped } = applyMemoryToFile(entry, schema, memory);
    changed.forEach((f) => console.log(`[translate-content] memory applied: ${f}`));
    skipped.forEach((f) => console.warn(`[translate-content] structure differs from English, left alone: ${f}`));
    changedCount += changed.length;
  }
  console.log(`[translate-content] translation memory applied to ${changedCount} file(s).`);
}

export async function main() {
  if (process.argv.includes("--apply-memory")) return applyMemory();
  const explicitFiles = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  const scope = (process.env.TRANSLATE_SCOPE || "changed").trim();
  if (!SCOPES.includes(scope)) {
    throw new Error(`TRANSLATE_SCOPE must be one of ${SCOPES.join(", ")} (got "${scope}").`);
  }
  const entries = resolveChangedEnFiles(explicitFiles, scope);

  if (entries.length === 0) {
    console.log("[translate-content] No source-language content files found to translate — nothing to do.");
    setGithubOutput("files_changed", "false");
    setGithubOutput("file_list", "");
    return;
  }

  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) {
    throw new Error(
      "DEEPL_API_KEY is not set. Add it as a GitHub Actions secret (see docs/translation-workflow.md) — refusing to run with no key."
    );
  }

  const schema = await loadTinaSchema();
  const translateFnFactory = realTranslateFnFactory(apiKey);
  const memory = loadMemory();

  const allWritten = [];
  for (const entry of entries) {
    console.log(`[translate-content] Translating ${entry.file} -> ${TARGET_LOCALES.join(", ")}`);
    const written = await translateFile(entry, schema, translateFnFactory, { skipExisting: scope === "missing", memory });
    allWritten.push(...written);
  }

  console.log(
    allWritten.length > 0
      ? `[translate-content] Wrote ${allWritten.length} file(s):\n${allWritten.map((f) => `  - ${f}`).join("\n")}`
      : "[translate-content] Matched changed files, but none had a registered Tina collection — nothing written."
  );

  setGithubOutput("files_changed", allWritten.length > 0 ? "true" : "false");
  setGithubOutput("file_list", allWritten.join("\n"));
}

const isMain = process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url;
if (isMain) {
  main().catch((err) => {
    console.error(`[translate-content] ${err.stack || err.message}`);
    process.exit(1);
  });
}
