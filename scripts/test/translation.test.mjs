/**
 * Tests for the /translate scripts: node --experimental-strip-types --test scripts/test/translation.test.mjs
 * (npm run test:translation). Logic tests use a small fake schema and a temporary
 * git repository; the script tests run translate-prepare/apply on a temporary copy
 * of the real hero content (TRANSLATION_ROOT) and the real Tina schema.
 */
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { after, describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import { pruneOrphanTranslations } from "../lib/translation-files.mjs";
import { ROOT as _unusedRoot } from "../lib/translation-run.mjs"; // registers the .ts import hook
import {
  buildDocument,
  git,
  pendingEntries,
  planFile,
  translatableTexts,
  validateTranslation,
} from "../lib/translation-sync.mjs";

const SCRIPTS = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const REPO = path.resolve(SCRIPTS, "..");
const temps = [];
after(() => temps.forEach((dir) => rmSync(dir, { recursive: true, force: true })));

// ---- helpers ------------------------------------------------------------------

function sh(root, ...args) {
  const r = spawnSync("git", ["-C", root, ...args], { encoding: "utf8" });
  assert.equal(r.status, 0, r.stderr);
  return r.stdout.trim();
}

function makeRepo(files) {
  const root = mkdtempSync(path.join(tmpdir(), "translate-test-"));
  temps.push(root);
  sh(root, "init", "-q");
  sh(root, "config", "user.email", "t@example.com");
  sh(root, "config", "user.name", "t");
  write(root, files);
  commit(root);
  return root;
}

function write(root, files) {
  for (const [file, content] of Object.entries(files)) {
    mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    writeFileSync(path.join(root, file), typeof content === "string" ? content : `${JSON.stringify(content, null, 2)}\n`);
  }
}

function commit(root) {
  sh(root, "add", "-A");
  sh(root, "commit", "-q", "-m", "x");
  return git.head(root);
}

const fakeSchema = new Map([
  [
    "page",
    {
      name: "page",
      fields: [
        { type: "string", name: "title", label: "Title" },
        { type: "string", name: "lede", label: "Intro" },
        { type: "string", name: "boatName", ui: { translate: false } },
        { type: "string", name: "items", list: true },
        { type: "object", name: "cta", fields: [{ type: "string", name: "label" }, { type: "string", name: "href" }] },
        { type: "image", name: "photo" },
      ],
    },
  ],
]);

const FILE = "content/page/en.json";
const base = {
  title: "Hello",
  lede: "The sea is calm.",
  boatName: "Bay Dreamer",
  items: ["one", "two", "three"],
  cta: { label: "Go", href: "/en/contact/" },
  photo: "/a.jpg",
};
const baseEs = { ...base, title: "Hola", lede: "El mar está en calma.", items: ["uno", "dos", "tres"], cta: { label: "Ir", href: "/es/contact/" } };

function plan(root, state, locale = "es", memory = { es: {}, fr: {} }, schema = fakeSchema, file = FILE) {
  return planFile({ root, file, schema, locale, memory, state, getIndex: () => new Map() });
}

function setup(english, spanish, edit) {
  const root = makeRepo({ [FILE]: english, "content/page/es.json": spanish });
  const baseline = git.head(root);
  write(root, { [FILE]: edit });
  commit(root);
  return { root, state: { default: baseline, files: {} } };
}

// ---- what is pending ----------------------------------------------------------

describe("what goes to Claude", () => {
  it("does not list an unchanged string, and lists an edited one", () => {
    const { root, state } = setup(base, baseEs, { ...base, lede: "The sea is very calm today." });
    const p = plan(root, state);
    assert.deepEqual(pendingEntries(p).map((e) => e.english), ["The sea is very calm today."]);
    assert.equal(p.texts[0], "Hola");
  });

  it("lists new strings only for the new file's missing translation", () => {
    const root = makeRepo({ [FILE]: base });
    const p = plan(root, { default: git.head(root), files: {} });
    assert.equal(p.mode, "new");
    assert.deepEqual(pendingEntries(p).map((e) => e.english), ["Hello", "The sea is calm.", "one", "two", "three", "Go"]);
  });

  it("reuses translations when a list is reordered", () => {
    const { root, state } = setup(base, baseEs, { ...base, items: ["three", "one", "two"] });
    const p = plan(root, state);
    assert.equal(p.pending.length, 0);
    const doc = buildDocument(p.cur, p.collection.fields, "es", p.texts);
    assert.deepEqual(doc.items, ["tres", "uno", "dos"]);
  });

  it("keeps a hand-corrected translation for English that did not change", () => {
    const corrected = { ...baseEs, title: "Hola, corregido" };
    const { root, state } = setup(base, corrected, { ...base, lede: "Changed." });
    const memory = { es: { Hello: "Hola (memoria)" }, fr: {} };
    const p = plan(root, state, "es", memory);
    assert.equal(p.texts[0], "Hola, corregido");
    assert.equal(p.sources[0], "reused");
  });

  it("uses the translation memory for a new or edited string, ahead of asking Claude", () => {
    const { root, state } = setup(base, baseEs, { ...base, title: "Welcome" });
    const memory = { es: { Welcome: "Bienvenidos" }, fr: {} };
    const p = plan(root, state, "es", memory);
    assert.equal(p.texts[0], "Bienvenidos");
    assert.equal(p.sources[0], "memory");
    assert.equal(p.pending.length, 0);
  });

  it("never lists a doNotTranslate field, and localises internal hrefs with no translation", () => {
    const { root, state } = setup(base, baseEs, { ...base, boatName: "Other Boat", cta: { label: "Go", href: "/en/boats/" } });
    const p = plan(root, state);
    assert.deepEqual(pendingEntries(p), []);
    const doc = buildDocument(p.cur, p.collection.fields, "es", p.texts);
    assert.equal(doc.boatName, "Other Boat");
    assert.equal(doc.cta.href, "/es/boats/");
  });

  it("falls back and reports the file when the earlier English and the translation do not line up", () => {
    const short = { ...baseEs, items: ["uno", "dos"] };
    const { root, state } = setup(base, short, { ...base, title: "Welcome" });
    const memory = { es: { Welcome: "Bienvenidos" }, fr: {} };
    const p = plan(root, state, "es", memory);
    assert.equal(p.mode, "mismatch");
    assert.match(p.warnings[0], /content\/page\/es\.json/);
    assert.equal(p.texts[0], "Bienvenidos");
    assert.ok(p.pending.length > 0);
  });

  it("matches by field path when the structure differs: keeps what it can, drafts only what is missing", () => {
    const short = { ...baseEs, items: ["uno", "dos"] };
    const { root, state } = setup(base, short, { ...base, title: "Welcome" });
    const p = plan(root, state, "es", { es: { Welcome: "Bienvenidos" }, fr: {} });
    assert.equal(p.mode, "mismatch");
    assert.deepEqual(pendingEntries(p).map((e) => e.english), ["three"]);
    assert.equal(p.texts[1], "El mar está en calma.");
    assert.equal(p.texts[2], "uno");
  });

  it("drafts a field the translation is missing even when the English did not change", () => {
    const short = { ...baseEs };
    delete short.lede;
    const root = makeRepo({ [FILE]: base, "content/page/es.json": short });
    const p = plan(root, { default: git.head(root), files: {} });
    assert.equal(p.mode, "mismatch");
    assert.deepEqual(pendingEntries(p).map((e) => e.english), ["The sea is calm."]);
  });

  it("is a no-op when English did not change", () => {
    const root = makeRepo({ [FILE]: base, "content/page/es.json": baseEs });
    const p = plan(root, { default: git.head(root), files: {} });
    assert.equal(p.mode, "unchanged");
    assert.equal(pendingEntries(p).length, 0);
  });
});

describe("real schema", () => {
  it("leaves doNotTranslate fields (a crew member's name) out of the strings", async () => {
    const { loadTinaSchema } = await import("../lib/tina-schema.mjs");
    const schema = await loadTinaSchema();
    const crew = schema.get("crew");
    const texts = translatableTexts({ name: "Ana Pérez", roles: ["Chef"] }, crew.fields);
    assert.ok(!texts.includes("Ana Pérez"));
    assert.ok(texts.includes("Chef"));
  });
});

// ---- validation -----------------------------------------------------------------

describe("validateTranslation", () => {
  it("rejects empty strings", () => assert.ok(validateTranslation("Hello", "  ").errors.length));
  it("rejects a changed link target", () =>
    assert.ok(validateTranslation("See [the crew](/en/about-us/).", "Mira [el equipo](/es/otra/).").errors[0].includes("link")));
  it("rejects a changed image URL", () =>
    assert.ok(validateTranslation("![Boat](https://x.test/a.jpg)", "![Barco](https://x.test/b.jpg)").errors.length));
  it("rejects different line breaks", () => assert.ok(validateTranslation("a\nb", "a b").errors.length));
  it("accepts a good translation and warns on an unchanged long sentence", () => {
    assert.deepEqual(validateTranslation("See [the crew](/en/about-us/).", "Mira [el equipo](/en/about-us/).").errors, []);
    assert.ok(validateTranslation("This sentence is long enough.", "This sentence is long enough.").warnings.length);
  });
});

// ---- deleted English documents ----------------------------------------------------

describe("pruneOrphanTranslations", () => {
  const post = (name) => ({ [`content/blogPost/en/${name}.json`]: {}, [`content/blogPost/es/${name}.json`]: {}, [`content/blogPost/fr/${name}.json`]: {} });

  it("removes translations of a deleted English document", () => {
    const root = makeRepo({ ...post("keep"), ...post("gone") });
    rmSync(path.join(root, "content/blogPost/en/gone.json"));
    const removed = pruneOrphanTranslations(root);
    assert.deepEqual(removed.sort(), ["content/blogPost/es/gone.json", "content/blogPost/fr/gone.json"]);
    assert.ok(existsSync(path.join(root, "content/blogPost/es/keep.json")));
  });

  it("deletes nothing when the English folder is empty", () => {
    const root = makeRepo(post("a"));
    rmSync(path.join(root, "content/blogPost/en/a.json"));
    assert.deepEqual(pruneOrphanTranslations(root), []);
    assert.ok(existsSync(path.join(root, "content/blogPost/es/a.json")));
  });

  it("never touches single-document files", () => {
    const root = makeRepo({ "content/hero/en.json": {}, "content/hero/es.json": {} });
    assert.deepEqual(pruneOrphanTranslations(root), []);
  });
});

// ---- the scripts end to end -----------------------------------------------------------

describe("translate-prepare and translate-apply", () => {
  function run(root, script) {
    return spawnSync(process.execPath, ["--experimental-strip-types", "--no-warnings", path.join(SCRIPTS, script)], {
      encoding: "utf8",
      env: { ...process.env, TRANSLATION_ROOT: root },
    });
  }

  function heroRepo() {
    const root = makeRepo({ ".gitkeep": "" });
    for (const f of ["en", "es", "fr"]) {
      mkdirSync(path.join(root, "content/hero"), { recursive: true });
      cpSync(path.join(REPO, `content/hero/${f}.json`), path.join(root, `content/hero/${f}.json`));
    }
    commit(root);
    assert.match(run(root, "translate-prepare.mjs").stdout, /First run/);
    commit(root); // the state file
    const en = JSON.parse(readFileSync(path.join(root, "content/hero/en.json"), "utf8"));
    en.subtitle = "Your group and a private boat. See [the crew](/en/about-us/).";
    write(root, { "content/hero/en.json": en });
    commit(root);
    return root;
  }

  function pendingOf(root) {
    return JSON.parse(readFileSync(path.join(root, ".translation-work/pending.json"), "utf8"));
  }

  function translated(root, mutate = () => {}) {
    const entries = pendingOf(root).entries;
    const out = Object.fromEntries(entries.map((e) => [e.id, e.english.replace("Your group and a private boat.", e.locale === "es" ? "Tu grupo y un barco privado." : "Votre groupe et un bateau privé.").replace("See [the crew]", e.locale === "es" ? "Mira [al equipo]" : "Voir [l'équipage]")]));
    mutate(out, entries);
    writeFileSync(path.join(root, ".translation-work/translated.json"), JSON.stringify(out));
  }

  it("lists only the edited sentence, per language, and says so when nothing is left", () => {
    const root = heroRepo();
    const prep = run(root, "translate-prepare.mjs");
    assert.equal(prep.status, 0, prep.stderr);
    const { entries } = pendingOf(root);
    assert.deepEqual(entries.map((e) => `${e.locale}:${e.path}`).sort(), ["es:subtitle", "fr:subtitle"]);
    assert.ok(entries.every((e) => e.collection === "hero" && e.field === "Sub-headline"));
  });

  it("rejects missing ids, extra ids, empty strings and broken links, and writes nothing", () => {
    const root = heroRepo();
    run(root, "translate-prepare.mjs");
    const before = readFileSync(path.join(root, "content/hero/es.json"), "utf8");
    const cases = {
      missing: (out, entries) => delete out[entries[0].id],
      extra: (out) => (out.zzzzzzzzzzzz = "x"),
      empty: (out, entries) => (out[entries[0].id] = ""),
      link: (out, entries) => (out[entries[0].id] = "Mira [al equipo](/es/otra/)."),
    };
    for (const [name, mutate] of Object.entries(cases)) {
      translated(root, mutate);
      const r = run(root, "translate-apply.mjs");
      assert.notEqual(r.status, 0, name);
      assert.match(r.stderr, /Nothing was written/, name);
      assert.equal(readFileSync(path.join(root, "content/hero/es.json"), "utf8"), before, name);
    }
  });

  it("writes the files, keeps everything else byte-identical, and updates the state", () => {
    const root = heroRepo();
    run(root, "translate-prepare.mjs");
    translated(root);
    const r = run(root, "translate-apply.mjs");
    assert.equal(r.status, 0, r.stderr);
    const es = JSON.parse(readFileSync(path.join(root, "content/hero/es.json"), "utf8"));
    assert.equal(es.subtitle, "Tu grupo y un barco privado. Mira [al equipo](/en/about-us/).");
    assert.equal(es.title, JSON.parse(readFileSync(path.join(REPO, "content/hero/es.json"), "utf8")).title);
    const state = JSON.parse(readFileSync(path.join(root, "scripts/translation-state.json"), "utf8"));
    assert.equal(state.files["content/hero/en.json"], pendingOf(root).head);
    assert.match(run(root, "translate-prepare.mjs").stdout, /Nothing needs translating|up to date/);
  });
});
