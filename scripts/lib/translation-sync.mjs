/**
 * The logic behind /translate: work out, string by string, which English text
 * needs a new Spanish or French translation, and rebuild the translated
 * documents once those translations exist. No network, no AI here — this file
 * is deterministic so it can be tested. The Tina schema (via
 * translatable-content.mjs) decides what is translatable; this file never
 * restates those rules.
 *
 * For each English file and each target locale, the current translation is
 * paired with the English it was written from (the file as it was at the last
 * synced commit, `git show <sha>:<file>`). That gives "previous English ->
 * current translation", human corrections included. Every current English
 * string is then resolved in this order:
 *   1. its English text appears in that map (unchanged, even if it moved)
 *      -> keep the existing translation;
 *   2. it is new or edited and is in translation-memory.json -> the memory;
 *   3. otherwise it is pending: Claude translates it.
 * If the previous English and the current translation do not have the same
 * number of translatable strings they cannot be paired; the file is reported
 * and falls back to memory, then to the pairs found in other files, then pending.
 */
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { collectTranslationUnits } from "./translatable-content.mjs";
import { TARGET_LOCALES, listEnglishFiles, outputPathFor, parseEnglishPath } from "./translation-files.mjs";

// ---- git ----------------------------------------------------------------------

export const git = {
  head(root) {
    const r = spawnSync("git", ["-C", root, "rev-parse", "HEAD"], { encoding: "utf8" });
    if (r.status !== 0) throw new Error(`git rev-parse HEAD failed: ${r.stderr}`);
    return r.stdout.trim();
  },
  /** The file's text at `sha`, or null if the commit or file is not there. */
  show(root, sha, file) {
    const r = spawnSync("git", ["-C", root, "show", `${sha}:${file}`], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
    return r.status === 0 ? r.stdout : null;
  },
  /** English source files with uncommitted changes (their baseline would be wrong). */
  dirtyEnglishFiles(root) {
    const r = spawnSync("git", ["-C", root, "status", "--porcelain", "--", "content"], { encoding: "utf8" });
    if (r.status !== 0) return [];
    return r.stdout
      .split("\n")
      .map((line) => line.slice(3).trim())
      .filter((f) => f && parseEnglishPath(f));
  },
};

// ---- state ---------------------------------------------------------------------

export const STATE_PATH = "scripts/translation-state.json";

/** { default: "<sha>", files: { "<english file>": "<sha>" } }, or null when never initialised. */
export function readState(root) {
  const file = path.join(root, STATE_PATH);
  return existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : null;
}

export function baselineFor(state, file) {
  return state.files?.[file] ?? state.default;
}

// ---- strings -------------------------------------------------------------------

export function sha(text) {
  return createHash("sha256").update(text).digest("hex");
}

/** The translatable English strings of a document, in schema order. */
export function translatableTexts(doc, fields) {
  return collectTranslationUnits(structuredClone(doc), fields).units.map((u) => u.get());
}

/** A copy of `cur` (English) with `texts` written into its translatable units and internal hrefs localised. */
export function buildDocument(cur, fields, locale, texts) {
  const clone = structuredClone(cur);
  const { units, finalize } = collectTranslationUnits(clone, fields, { locale });
  if (units.length !== texts.length) throw new Error(`buildDocument: ${units.length} units but ${texts.length} texts`);
  units.forEach((unit, i) => unit.set(texts[i]));
  finalize();
  return clone;
}

export function serialize(doc) {
  return `${JSON.stringify(doc, null, 2)}\n`;
}

/**
 * Where each translatable unit sits, for context in the work file:
 * [{ path: "blocks[1].title", label: "Headline", hint: "…" }]. Found by writing a
 * marker into every unit and looking for the markers, so the translatable rules
 * stay in translatable-content.mjs.
 */
export function describeUnits(cur, fields) {
  const clone = structuredClone(cur);
  const { units, finalize } = collectTranslationUnits(clone, fields);
  units.forEach((unit, i) => unit.set(`\u0001${i}\u0002`));
  finalize();
  const found = new Array(units.length).fill(null);

  function walk(node, parts) {
    if (typeof node === "string") {
      for (const m of node.matchAll(/\u0001(\d+)\u0002/g)) found[Number(m[1])] ??= parts;
    } else if (Array.isArray(node)) {
      node.forEach((child, i) => walk(child, [...parts, i]));
    } else if (node && typeof node === "object") {
      for (const [key, child] of Object.entries(node)) walk(child, [...parts, key]);
    }
  }
  walk(clone, []);

  return found.map((parts) => {
    if (!parts) return { path: "", label: "", hint: "" };
    const meta = fieldMeta(fields, cur, parts);
    return { path: formatPath(parts), label: meta.label, hint: meta.hint };
  });
}

function formatPath(parts) {
  return parts.map((p, i) => (typeof p === "number" ? `[${p}]` : i === 0 ? p : `.${p}`)).join("");
}

function fieldMeta(fields, doc, parts) {
  let defs = fields;
  let node = doc;
  let holder = null;
  let meta = { label: "", hint: "" };
  for (const part of parts) {
    if (typeof part === "number") {
      node = node?.[part];
      if (holder?.templates && node?._template) defs = holder.templates.find((t) => t.name === node._template)?.fields ?? defs;
      continue;
    }
    const field = defs?.find((f) => f.name === part);
    if (!field) break;
    meta = { label: field.label ?? field.name, hint: field.description ?? "" };
    node = node?.[part];
    holder = field;
    if (field.fields) defs = field.fields;
  }
  return meta;
}

// ---- planning ------------------------------------------------------------------

function readJson(file) {
  return JSON.parse(readFileSync(file, "utf8"));
}

/**
 * Pairs from every English file whose previous English and current translation
 * line up: english -> translation. Used only when one file cannot be paired.
 */
function buildReuseIndex({ root, schema, state, locale }) {
  const index = new Map();
  for (const file of listEnglishFiles(root)) {
    const info = parseEnglishPath(file);
    const collection = schema.get(info.folder);
    const out = path.join(root, outputPathFor(info.folder, info.slug, locale));
    if (!collection || !existsSync(out)) continue;
    const prevRaw = git.show(root, baselineFor(state, file), file);
    if (prevRaw === null) continue;
    const prev = translatableTexts(JSON.parse(prevRaw), collection.fields);
    const target = translatableTexts(readJson(out), collection.fields);
    if (prev.length !== target.length) continue;
    prev.forEach((english, i) => {
      if (!index.has(english)) index.set(english, target[i]);
    });
  }
  return index;
}

/**
 * The plan for one English file and one locale.
 * Returns { file, locale, outFile, mode, texts, sources, pending, warnings, doc } where
 *   mode    "new" (no translation yet) | "changed" | "unchanged" | "mismatch"
 *   texts   the resolved text per unit, or null where it is still pending
 *   sources per unit: "reused" | "memory" | "pending"
 */
export function planFile({ root, file, schema, locale, memory, state, getIndex }) {
  const info = parseEnglishPath(file);
  const collection = schema.get(info.folder);
  const outFile = outputPathFor(info.folder, info.slug, locale).split(path.sep).join("/");
  const outAbs = path.join(root, outFile);
  const curRaw = readFileSync(path.join(root, file), "utf8");
  const cur = JSON.parse(curRaw);
  const english = translatableTexts(cur, collection.fields);
  const warnings = [];

  let mode = "new";
  let pairing = null;
  if (existsSync(outAbs)) {
    const prevRaw = git.show(root, baselineFor(state, file), file);
    if (prevRaw === curRaw) {
      return { file, locale, outFile, mode: "unchanged", texts: [], sources: [], pending: [], warnings, doc: null, collection, cur };
    }
    const target = translatableTexts(readJson(outAbs), collection.fields);
    const previous = prevRaw === null ? null : translatableTexts(JSON.parse(prevRaw), collection.fields);
    if (previous && previous.length === target.length) {
      pairing = new Map();
      previous.forEach((text, i) => {
        if (!pairing.has(text)) pairing.set(text, target[i]);
      });
      mode = "changed";
    } else {
      mode = "mismatch";
      warnings.push(
        previous === null
          ? `${outFile}: no earlier English version to compare with; reusing only the memory and matching strings from other files.`
          : `${outFile}: the earlier English has ${previous.length} strings but the translation has ${target.length}; they cannot be paired, so only the memory and matching strings from other files are reused.`
      );
    }
  }

  const index = mode === "mismatch" ? getIndex(locale) : null;
  const sources = [];
  const texts = english.map((text) => {
    if (pairing?.has(text)) {
      sources.push("reused");
      return pairing.get(text);
    }
    if (Object.prototype.hasOwnProperty.call(memory[locale] ?? {}, text)) {
      sources.push("memory");
      return memory[locale][text];
    }
    if (index?.has(text)) {
      sources.push("reused");
      return index.get(text);
    }
    sources.push("pending");
    return null;
  });

  const pending = english.map((text, i) => i).filter((i) => sources[i] === "pending");
  return { file, locale, outFile, mode, english, texts, sources, pending, warnings, collection, cur };
}

/** Plans every English file for every locale. Files with nothing to do have `mode: "unchanged"` for both locales. */
export function planAll({ root, schema, memory, state, files = listEnglishFiles(root), skipped = [] }) {
  const indexes = new Map();
  const getIndex = (locale) => {
    if (!indexes.has(locale)) indexes.set(locale, buildReuseIndex({ root, schema, state, locale }));
    return indexes.get(locale);
  };
  const plans = [];
  for (const file of files) {
    const info = parseEnglishPath(file);
    if (!info || !schema.get(info.folder)) {
      skipped.push(file);
      continue;
    }
    plans.push({ file, locales: TARGET_LOCALES.map((locale) => planFile({ root, file, schema, locale, memory, state, getIndex })) });
  }
  return plans;
}

export function entryId(file, locale, index, english) {
  return createHash("sha1").update(`${file}|${locale}|${index}|${english}`).digest("hex").slice(0, 12);
}

/** The work-file entries for one locale plan. */
export function pendingEntries(plan) {
  const described = plan.pending.length > 0 ? describeUnits(plan.cur, plan.collection.fields) : [];
  return plan.pending.map((i) => ({
    id: entryId(plan.file, plan.locale, i, plan.english[i]),
    file: plan.file,
    locale: plan.locale,
    collection: plan.collection.name,
    path: described[i]?.path ?? "",
    field: described[i]?.label ?? "",
    hint: described[i]?.hint ?? "",
    english: plan.english[i],
  }));
}

/** Does writing this plan change the existing translation file? (False for "unchanged".) */
export function planNeedsWrite(root, plan, translatedById = {}) {
  if (plan.mode === "unchanged") return false;
  const texts = plan.texts.map((text, i) => text ?? translatedById[entryId(plan.file, plan.locale, i, plan.english[i])] ?? plan.english[i]);
  const built = serialize(buildDocument(plan.cur, plan.collection.fields, plan.locale, texts));
  const out = path.join(root, plan.outFile);
  return !existsSync(out) || readFileSync(out, "utf8") !== built;
}

// ---- validation ----------------------------------------------------------------

const LINK_TARGET_RE = /\]\(([^)\s]*)[^)]*\)/g;

function linkTargets(text) {
  return [...text.matchAll(LINK_TARGET_RE)].map((m) => m[1]).sort();
}

/** Checks one translated string against its English. Returns { errors, warnings }. */
export function validateTranslation(english, translated) {
  const errors = [];
  const warnings = [];
  if (typeof translated !== "string" || translated.trim() === "") {
    errors.push("empty translation");
    return { errors, warnings };
  }
  const want = linkTargets(english);
  const got = linkTargets(translated);
  if (want.join("\n") !== got.join("\n")) {
    errors.push(`link or image targets differ (English: ${want.join(", ") || "none"}; translation: ${got.join(", ") || "none"})`);
  }
  const lines = (s) => s.split("\n").length;
  if (lines(english) !== lines(translated)) errors.push(`line breaks differ (English ${lines(english) - 1}, translation ${lines(translated) - 1})`);
  const count = (s, ch) => s.split(ch).length - 1;
  if (count(english, "*") !== count(translated, "*") || count(english, "`") !== count(translated, "`")) {
    warnings.push("emphasis or code markers (* or `) differ from the English");
  }
  if (translated === english && english.length >= 20 && /\s/.test(english)) warnings.push("returned unchanged (still English?)");
  if (english.length >= 20 && translated.length >= 20) {
    const ratio = translated.length / english.length;
    if (ratio > 2.2 || ratio < 0.45) warnings.push(`length ratio ${ratio.toFixed(2)} is unusual`);
  }
  return { errors, warnings };
}
