/**
 * Where English source documents and their Spanish/French counterparts live,
 * shared by scripts/translate-content.mjs (the DeepL fallback) and the
 * /translate scripts (translate-prepare.mjs, translate-apply.mjs).
 * Every function takes the repo `root`, so tests can run on a temporary copy.
 */
import { existsSync, readFileSync, readdirSync, rmSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
export const TARGET_LOCALES = ["es", "fr"];
export const MEMORY_PATH = path.join(REPO_ROOT, "scripts", "translation-memory.json");

// content/<folder>/en.json  (one document per locale, e.g. hero, funnel)
const SINGLE_DOC_RE = /^content\/([^/]+)\/en\.json$/;
// content/<folder>/en/<slug>.json  (multi-document collections, e.g. crew, boats, blogPost)
const MULTI_DOC_RE = /^content\/([^/]+)\/en\/([^/]+)\.json$/;

/** { es: { "<English>": "<approved>" }, fr: {...} } — empty if the file is missing. */
export function loadMemory(memoryPath = MEMORY_PATH) {
  if (!existsSync(memoryPath)) return { es: {}, fr: {} };
  const memory = JSON.parse(readFileSync(memoryPath, "utf8"));
  return { es: memory.es ?? {}, fr: memory.fr ?? {} };
}

/** `content/hero/en.json` -> { file, folder, slug: null }; `content/crew/en/ana.json` -> { file, folder, slug: "ana" }. */
export function parseEnglishPath(repoRelative) {
  const rel = repoRelative.split(path.sep).join("/");
  let m = rel.match(SINGLE_DOC_RE);
  if (m) return { file: rel, folder: m[1], slug: null };
  m = rel.match(MULTI_DOC_RE);
  if (m) return { file: rel, folder: m[1], slug: m[2] };
  return null;
}

export function isEnglishSourcePath(repoRelative) {
  return parseEnglishPath(repoRelative) !== null;
}

/** Every `content/<folder>/en.json` and `content/<folder>/en/<slug>.json`, as repo-relative paths. */
export function listEnglishFiles(root = REPO_ROOT) {
  const contentDir = path.join(root, "content");
  const files = [];
  if (!existsSync(contentDir)) return files;

  for (const entry of readdirSync(contentDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const folder = entry.name;

    const singleDoc = path.join("content", folder, "en.json");
    if (existsSync(path.join(root, singleDoc))) files.push(singleDoc);

    const multiDocDir = path.join(root, "content", folder, "en");
    if (existsSync(multiDocDir) && statSync(multiDocDir).isDirectory()) {
      for (const f of readdirSync(multiDocDir).sort()) {
        if (f.endsWith(".json")) files.push(path.join("content", folder, "en", f));
      }
    }
  }
  return files.map((f) => f.split(path.sep).join("/")).sort();
}

export function outputPathFor(folder, slug, locale) {
  return slug ? path.join("content", folder, locale, `${slug}.json`) : path.join("content", folder, `${locale}.json`);
}

/**
 * Removes ES/FR files whose English source no longer exists, so deleting a
 * document in English (e.g. a blog post in the editor) also removes its
 * translations. Only multi-document collections (`content/<folder>/en/<slug>.json`)
 * are pruned — a single-document file like `en.json` is never deleted by the
 * editor. Safety: a folder is only pruned when `content/<folder>/en/` still
 * holds at least one file, so a missing or emptied English folder can never
 * wipe every translation. Deletions end up in the reviewed pull request, and
 * git history keeps the files if a deletion was a mistake.
 * Returns the repo-relative paths removed. `dryRun` lists without deleting.
 */
export function pruneOrphanTranslations(root = REPO_ROOT, { dryRun = false } = {}) {
  const contentDir = path.join(root, "content");
  const removed = [];
  if (!existsSync(contentDir)) return removed;

  for (const entry of readdirSync(contentDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const enDir = path.join(contentDir, entry.name, "en");
    if (!existsSync(enDir) || !statSync(enDir).isDirectory()) continue;
    const enSlugs = new Set(readdirSync(enDir).filter((f) => f.endsWith(".json")));
    if (enSlugs.size === 0) continue;

    for (const locale of TARGET_LOCALES) {
      const localeDir = path.join(contentDir, entry.name, locale);
      if (!existsSync(localeDir) || !statSync(localeDir).isDirectory()) continue;
      for (const file of readdirSync(localeDir)) {
        if (!file.endsWith(".json") || enSlugs.has(file)) continue;
        if (!dryRun) rmSync(path.join(localeDir, file));
        removed.push(path.join("content", entry.name, locale, file));
      }
    }
  }
  return removed;
}
