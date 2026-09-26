/**
 * Node ESM "resolve" customization hook (registered via `node:module`'s
 * `register()`) that lets a plain `node --experimental-strip-types` process
 * import `tina/collections/*.ts` directly, with zero npm deps.
 *
 * Those files are handwritten as `import { x } from "../shared/fields"` —
 * extensionless relative specifiers, valid under a TS bundler's
 * moduleResolution but NOT under real Node ESM, which requires the file
 * extension on every relative import. That's the exact same class of bug
 * `scripts/patch-tina-generated.mjs` patches for Tina's generated
 * `databaseClient.ts` output (see that file's header) — this hook fixes it
 * at resolution time instead, since we don't control tina/collections'
 * source the way we control a post-build patch step.
 *
 * Only touches relative specifiers with no extension already. Absolute
 * specifiers (bare package names like "tinacms") are left untouched — those
 * imports are all `import type`, so Node's type-stripping erases them before
 * resolution is even attempted; nothing here needs to (or should) resolve
 * "tinacms" itself.
 */
export async function resolve(specifier, context, nextResolve) {
  const isRelative = specifier.startsWith("./") || specifier.startsWith("../");
  const hasExtension = /\.[a-zA-Z0-9]+$/.test(specifier);

  if (isRelative && !hasExtension) {
    try {
      return await nextResolve(`${specifier}.ts`, context);
    } catch {
      // Not a `.ts` sibling after all (e.g. a real extensionless resolution
      // failure for another reason) — fall through to default handling so
      // the real error surfaces instead of this hook's own guess.
    }
  }

  return nextResolve(specifier, context);
}
