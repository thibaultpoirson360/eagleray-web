/**
 * Loads the REAL Tina schema (tina/collections/*.ts) at runtime — no
 * `tinacms build`, no npm deps, no Tina credentials — so the translation
 * script always reflects the actual field shapes/types and the `doNotTranslate`
 * marker (tina/shared/fields.ts), instead of a hand-maintained skip-list that
 * can drift out of sync with the schema.
 *
 * Requires the caller to have already registered scripts/lib/ts-resolve-hook.mjs
 * (see that file) and to be running under `node --experimental-strip-types`.
 */
import { readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const COLLECTIONS_DIR = path.resolve(__dirname, "../../tina/collections");

function looksLikeCollection(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    typeof value.name === "string" &&
    typeof value.path === "string" &&
    Array.isArray(value.fields)
  );
}

/**
 * Returns a Map keyed by content-FOLDER name (the last path segment of the
 * collection's own `path`, e.g. "content/crew" -> "crew"), not by
 * `collection.name` — those differ for siteSettings (name "siteSettings",
 * folder "settings"), and the translate script only ever has a folder name
 * to go on (it's resolving from a changed file path under content/).
 */
export async function loadTinaSchema() {
  const files = readdirSync(COLLECTIONS_DIR).filter((f) => f.endsWith(".ts"));
  const byFolder = new Map();

  for (const file of files) {
    const url = pathToFileURL(path.join(COLLECTIONS_DIR, file)).href;
    const mod = await import(url);

    for (const exported of Object.values(mod)) {
      if (!looksLikeCollection(exported)) continue;

      const folder = exported.path.split("/").pop();
      if (byFolder.has(folder)) {
        const existing = byFolder.get(folder);
        throw new Error(
          `tina-schema: collections "${existing.name}" and "${exported.name}" both resolve to ` +
            `content folder "${folder}" — translate-content.mjs can't tell them apart.`
        );
      }
      byFolder.set(folder, exported);
    }
  }

  return byFolder;
}
