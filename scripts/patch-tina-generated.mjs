#!/usr/bin/env node
/**
 * `tinacms build` regenerates tina/__generated__/databaseClient.ts on every
 * build (local and Vercel) and always emits an extensionless relative
 * import: `import database from "../database";`. Under this project's
 * package.json `"type": "module"`, Vercel's api/ Functions run as real
 * Node ESM (confirmed in production: ERR_MODULE_NOT_FOUND for
 * '/var/task/tina/backend' from the same class of extensionless import in
 * our own code — see docs/tina-setup.md). Node's ESM resolver requires the
 * extension on relative specifiers; Tina's codegen doesn't add one.
 *
 * This is a small, targeted post-processing step run right after every
 * `tinacms build` (see package.json scripts) so the generated file is
 * always patched before `astro build` / a Vercel deploy uses it. It is
 * idempotent and a no-op if the line is already fixed or if a future
 * @tinacms/cli release changes the generated output (it warns instead of
 * silently doing nothing, and never throws, so a build never fails on it).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const repoRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const target = path.join(repoRoot, "tina/__generated__/databaseClient.ts");

const BROKEN = 'import database from "../database";';
const FIXED = 'import database from "../database.js";';

let src;
try {
  src = readFileSync(target, "utf8");
} catch (err) {
  console.warn(`[patch-tina-generated] Could not read ${target}: ${err.message}`);
  process.exit(0);
}

if (src.includes(FIXED)) {
  // Already patched (re-running the script, or a previous run already fixed it).
  process.exit(0);
}

if (!src.includes(BROKEN)) {
  console.warn(
    "[patch-tina-generated] Expected extensionless `../database` import not found in " +
      "databaseClient.ts — @tinacms/cli's generated output may have changed. " +
      "Check whether the ERR_MODULE_NOT_FOUND workaround is still needed."
  );
  process.exit(0);
}

writeFileSync(target, src.replace(BROKEN, FIXED));
console.log("[patch-tina-generated] Patched extensionless import in databaseClient.ts");
