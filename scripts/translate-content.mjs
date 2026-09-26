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
const { translateDocument } = await import("./lib/translatable-content.mjs");
const { translateBatch } = await import("./lib/deepl.mjs");

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TARGET_LOCALES = ["es", "fr"];

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
export function resolveChangedEnFiles(explicitFiles = []) {
  let candidates;

  if (explicitFiles.length > 0) {
    candidates = explicitFiles.map(toRepoRelative);
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
export async function translateFile(entry, schema, translateFnFactory) {
  const { file, folder, slug } = entry;
  const collection = schema.get(folder);
  if (!collection) {
    console.warn(`[translate-content] No Tina collection found for content folder "${folder}" (from ${file}) — skipping.`);
    return [];
  }

  const doc = JSON.parse(readFileSync(path.join(REPO_ROOT, file), "utf8"));
  const written = [];

  for (const locale of TARGET_LOCALES) {
    const translated = await translateDocument(doc, collection.fields, translateFnFactory(locale));
    const outRelative = outputPathFor(folder, slug, locale);
    const outAbsolute = path.join(REPO_ROOT, outRelative);
    mkdirSync(path.dirname(outAbsolute), { recursive: true });
    // 2-space indent + trailing newline, matching every existing content/ file.
    writeFileSync(outAbsolute, `${JSON.stringify(translated, null, 2)}\n`);
    written.push(outRelative);
  }

  return written;
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

export async function main() {
  const explicitFiles = process.argv.slice(2);
  const entries = resolveChangedEnFiles(explicitFiles);

  if (entries.length === 0) {
    console.log("[translate-content] No changed source-language content files found — nothing to translate.");
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

  const allWritten = [];
  for (const entry of entries) {
    console.log(`[translate-content] Translating ${entry.file} -> ${TARGET_LOCALES.join(", ")}`);
    const written = await translateFile(entry, schema, translateFnFactory);
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
