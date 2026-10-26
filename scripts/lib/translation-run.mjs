/** Setup shared by translate-prepare.mjs and translate-apply.mjs. */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { register } from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { REPO_ROOT, loadMemory } from "./translation-files.mjs";
import { STATE_PATH, git, readState } from "./translation-sync.mjs";

// Needed before tina/collections/*.ts can be imported (see scripts/lib/ts-resolve-hook.mjs).
register(pathToFileURL(path.join(path.dirname(fileURLToPath(import.meta.url)), "ts-resolve-hook.mjs")).href, import.meta.url);

export const ROOT = process.env.TRANSLATION_ROOT ? path.resolve(process.env.TRANSLATION_ROOT) : REPO_ROOT;
export const WORK_DIR = path.join(ROOT, ".translation-work");
export const PENDING_PATH = path.join(WORK_DIR, "pending.json");
export const TRANSLATED_PATH = path.join(WORK_DIR, "translated.json");

export async function loadContext() {
  const { loadTinaSchema } = await import("./tina-schema.mjs");
  return { root: ROOT, schema: await loadTinaSchema(), memory: loadMemory(path.join(ROOT, "scripts", "translation-memory.json")) };
}

export function writeState(state) {
  const file = path.join(ROOT, STATE_PATH);
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, `${JSON.stringify(state, null, 2)}\n`);
}

export { git, readState, mkdirSync, readFileSync, writeFileSync };
