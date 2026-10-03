/**
 * Field-schema walker: decides which leaf strings in a content document are
 * translatable, based on the REAL Tina field schema (scripts/lib/tina-schema.mjs)
 * rather than a hardcoded skip-list, and rebuilds a translated document from
 * a document + a set of translated strings.
 *
 * Rules (in order):
 *   1. `field.ui.translate === false` (tina/shared/fields.ts `doNotTranslate`)
 *      -> never translated. This is the schema-level "do not translate"
 *      marker used for proper nouns (crew.name, boats.name, blogPost.author).
 *   2. Field NAME contains one of a small fixed set of technical-field
 *      substrings (href/url/slug/filename/videosrc/endpoint/path/src) ->
 *      never translated, regardless of type. Catches string fields that
 *      hold a technical value rather than editorial copy (e.g. `videoSrc`)
 *      that the `doNotTranslate` marker hasn't been (and shouldn't need to
 *      be) added to one-by-one.
 *   3. Otherwise, TYPE decides: `string` (and `rich-text`, handled
 *      specially — see below) are translatable; `image`, `boolean`,
 *      `number`, `date`, `datetime`, `reference` are not.
 *   3b. Before rule 2 gets to skip it: a field literally named `href` whose
 *      value is an internal path under the SOURCE locale ("/en/blog/") is
 *      rewritten to the TARGET locale's own path ("/es/blog/") when a target
 *      `locale` is given — deterministic, no DeepL call — so a Spanish page
 *      links to Spanish pages. Anchors ("#customize"), external URLs and
 *      empty strings pass through untouched.
 *   4. `_template` (Tina's discriminator key on polymorphic list items,
 *      e.g. navigation.links, landingPage.blocks) is never a declared
 *      schema field, so it's never visited here and always passes through
 *      untouched by construction.
 *
 * Rich text: every `rich-text` field in this schema (blogPost.body,
 * landingPage's richText block body) is stored in the JSON content files as
 * a **markdown string**, confirmed against real content — not Tina's AST
 * object shape. Parsed into paragraph / blockquote / image blocks; image
 * URLs are reconstructed untouched, alt text and image titles/captions are
 * translated, paragraph and blockquote text is translated as one unit each.
 */

const TECHNICAL_NAME_SUBSTRINGS = ["href", "url", "slug", "filename", "videosrc", "endpoint", "path", "src"];

const SOURCE_LOCALE = "en";
const SOURCE_PREFIX_RE = new RegExp(`^/${SOURCE_LOCALE}(?=/|#|\\?|$)`);

function isHrefField(field) {
  return (field?.name ?? "").toLowerCase() === "href";
}

/** "/en/blog/" -> "/es/blog/"; anything not under the source locale is returned as-is. */
export function localizeInternalHref(value, locale) {
  return SOURCE_PREFIX_RE.test(value) ? value.replace(SOURCE_PREFIX_RE, `/${locale}`) : value;
}

function isSkippableField(field) {
  if (field?.ui?.translate === false) return true;
  const name = (field?.name ?? "").toLowerCase();
  return TECHNICAL_NAME_SUBSTRINGS.some((needle) => name.includes(needle));
}

// ---- markdown (rich-text-as-string) handling -------------------------------

const IMAGE_LINE_RE = /^!\[([^\]]*)\]\(([^\s)]+)(?:\s+"([^"]*)")?\)$/;

function parseMarkdownBlock(raw) {
  const imageMatch = raw.match(IMAGE_LINE_RE);
  if (imageMatch) {
    const [, alt, url, title] = imageMatch;
    return {
      kind: "image",
      url,
      parts: title === undefined ? [{ key: "alt", text: alt }] : [{ key: "alt", text: alt }, { key: "title", text: title }],
    };
  }

  const lines = raw.split("\n");
  const isBlockquote = lines.length > 0 && lines.every((line) => line === ">" || line.startsWith("> "));
  if (isBlockquote) {
    const stripped = lines.map((line) => (line === ">" ? "" : line.slice(2))).join("\n");
    return { kind: "blockquote", parts: [{ key: "text", text: stripped }] };
  }

  // Plain paragraph — also the fallback for any block shape not special-cased
  // above, so an unrecognized block is still translated (as one opaque
  // string) rather than silently dropped.
  return { kind: "paragraph", parts: [{ key: "text", text: raw }] };
}

function renderMarkdownBlock(block) {
  if (block.kind === "image") {
    const alt = block.parts.find((p) => p.key === "alt").text;
    const titlePart = block.parts.find((p) => p.key === "title");
    return titlePart ? `![${alt}](${block.url} "${titlePart.text}")` : `![${alt}](${block.url})`;
  }
  if (block.kind === "blockquote") {
    return block.parts[0].text
      .split("\n")
      .map((line) => (line === "" ? ">" : `> ${line}`))
      .join("\n");
  }
  return block.parts[0].text;
}

function parseMarkdown(markdown) {
  return markdown.split(/\n\n+/).map(parseMarkdownBlock);
}

function renderMarkdown(blocks) {
  return blocks.map(renderMarkdownBlock).join("\n\n");
}

// ---- schema walker ----------------------------------------------------------

/**
 * Walks `doc` against `fields` (a Tina collection's `fields` array) and
 * returns `{ units, finalize }`:
 *   - `units`: one `{ get(), set(translated) }` per translatable leaf string
 *     found (plain string fields, each element of a list-of-strings field,
 *     and each translatable markdown segment). `get`/`set` close over the
 *     live object/array inside `doc`, so calling `set` mutates `doc` in place.
 *   - `finalize()`: must be called once, after every `unit.set()` has run —
 *     reassembles any markdown fields' blocks back into a single string and
 *     writes it into `doc`. (Plain string/list units write immediately on
 *     `set()` and don't need this; markdown fields batch their sub-parts.)
 *
 * `doc` is walked and mutated directly — callers that want to keep the
 * original untouched should pass a deep clone (see `translateDocument`).
 * `options.locale` is the target locale; it's only used to localize internal
 * `href` fields (rule 3b) and may be omitted.
 */
export function collectTranslationUnits(doc, fields, { locale } = {}) {
  const units = [];
  const finalizers = [];

  function walkObject(obj, fieldDefs) {
    if (obj == null || typeof obj !== "object" || !Array.isArray(fieldDefs)) return;
    for (const field of fieldDefs) {
      if (!field || typeof field.name !== "string") continue;
      if (!(field.name in obj)) continue;
      walkField(obj, field.name, field);
    }
  }

  function walkField(parent, key, field) {
    const value = parent[key];
    if (value === null || value === undefined) return;

    if (field.list) {
      if (!Array.isArray(value)) return;

      if (field.type === "object" && Array.isArray(field.templates)) {
        for (const item of value) {
          if (item == null || typeof item !== "object") continue;
          const template = field.templates.find((t) => t.name === item._template);
          if (!template) continue; // unrecognized template shape — leave untouched
          walkObject(item, template.fields);
        }
        return;
      }

      if (field.type === "object" && Array.isArray(field.fields)) {
        for (const item of value) walkObject(item, field.fields);
        return;
      }

      if (field.type === "string" && !isSkippableField(field)) {
        value.forEach((str, index) => {
          if (typeof str !== "string" || str === "") return;
          units.push({
            get: () => value[index],
            set: (translated) => {
              value[index] = translated;
            },
          });
        });
      }
      // lists of number/boolean/image etc. — not translatable, nothing to do
      return;
    }

    // non-list fields
    if (field.type === "object" && Array.isArray(field.fields)) {
      walkObject(value, field.fields);
      return;
    }

    if (field.type === "rich-text") {
      if (typeof value !== "string") return; // guard: unexpected (AST) shape — leave untouched rather than crash
      const blocks = parseMarkdown(value);
      for (const block of blocks) {
        for (const part of block.parts) {
          if (part.text === "") continue;
          units.push({
            get: () => part.text,
            set: (translated) => {
              part.text = translated;
            },
          });
        }
      }
      finalizers.push(() => {
        parent[key] = renderMarkdown(blocks);
      });
      return;
    }

    if (field.type === "string") {
      if (locale && isHrefField(field) && typeof value === "string") {
        parent[key] = localizeInternalHref(value, locale);
        return;
      }
      if (isSkippableField(field)) return;
      if (typeof value !== "string" || value === "") return;
      units.push({
        get: () => parent[key],
        set: (translated) => {
          parent[key] = translated;
        },
      });
      return;
    }

    // image / boolean / number / date / datetime / reference — not translatable
  }

  walkObject(doc, fields);

  return {
    units,
    finalize: () => finalizers.forEach((fn) => fn()),
  };
}

/**
 * Produces a translated copy of `doc`: deep-clones it, collects every
 * translatable unit per `collectTranslationUnits`, sends all of their
 * current text to `translateFn` in one batched call, writes the results
 * back, and returns the new document. Fields not covered by any unit
 * (images, numbers, booleans, dates, hrefs/slugs/etc., `doNotTranslate`
 * fields, `_template`) come through byte-identical because they were never
 * touched.
 *
 * `options.memory` is the translation memory for the target language,
 * `{ "<exact English string>": "<approved translation>" }`
 * (scripts/translation-memory.json). A unit whose English text is in it is
 * set from the memory and never sent to `translateFn`, so approved human
 * wording survives every redraft.
 *
 * `translateFn` is `(texts: string[]) => Promise<string[]>` — same shape as
 * `deepl.mjs`'s `translateBatch` with its options pre-bound, and easy to
 * swap for a fake in tests (this is exactly how this module was verified —
 * see docs/translation-workflow.md).
 */
export async function translateDocument(doc, fields, translateFn, options = {}) {
  const clone = structuredClone(doc);
  const { units, finalize } = collectTranslationUnits(clone, fields, options);

  const memory = options.memory ?? {};
  const pending = [];
  for (const unit of units) {
    const english = unit.get();
    if (Object.prototype.hasOwnProperty.call(memory, english)) unit.set(memory[english]);
    else pending.push(unit);
  }

  if (pending.length > 0) {
    const originals = pending.map((u) => u.get());
    const translated = await translateFn(originals);
    if (!Array.isArray(translated) || translated.length !== originals.length) {
      throw new Error(
        `translateDocument: translateFn returned ${Array.isArray(translated) ? translated.length : typeof translated} ` +
          `results for ${originals.length} inputs.`
      );
    }
    pending.forEach((unit, i) => unit.set(translated[i]));
  }

  finalize();
  return clone;
}

// Exported for the CLI's own reporting/dry-run output and for tests.
export { isSkippableField, parseMarkdown, renderMarkdown };
