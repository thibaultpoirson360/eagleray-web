# Translations (`/translate`)

How the Spanish and French text is made and reviewed. English is the source;
Spanish and French are drafted by the assistant when a person runs `/translate`
in Claude Code on a separate branch, and checked by that person on the local
site before anything is merged. **Nothing is translated automatically when
someone saves in the editor.**

> **Step-by-step for non-developers: `docs/how-to-translate.md`.**

## Who runs it, and when

Whoever finishes a batch of English edits (a new page, a round of changes in
the editor) runs **`/translate`** in Claude Code, once per batch, not once per
save. Until then Spanish and French keep showing their last reviewed text: if
nobody runs it, nothing breaks, the other languages are just behind English.

Before running it, English changes must be committed (editor saves already are,
once pulled). The scripts compare against the commit the translations were last
in sync with.

## What happens

1. **`npm run translate:prepare`** (no network, no AI). For every English file
   it pairs the current Spanish/French with the English they were written from
   (`git show <sha>:<file>`) and decides, string by string:
   - English text that did not change keeps its current translation, **including
     a reviewer's corrections**, even if the string moved (reordered lists);
   - a new or edited string that is in `scripts/translation-memory.json` takes
     the memory's wording;
   - everything else is written to `.translation-work/pending.json`
     (git-ignored), with the field label and the collection as context.
   It prints counts per language and per file, and says plainly when nothing
   needs translating. Large batches are split into whole files; run `/translate`
   again for the rest.
2. **The assistant translates** only those strings into
   `.translation-work/translated.json`, following `scripts/translation-glossary.md`
   and the tone of the approved translations (informal *tú* in Spanish, formal
   *vous* in French, today).
3. **`npm run translate:apply`** checks the result and only then writes the
   files: every id present, no extra ids, no empty text, link and image targets
   unchanged, line breaks unchanged. It warns (does not fail) on text returned
   unchanged, odd length ratios and changed `*`/`` ` `` markers. It also removes
   translations of deleted English documents (see below) and updates
   `scripts/translation-state.json`. If a check fails nothing is written.
4. **The assistant reports** the files written, how many strings were
   translated / reused / taken from the memory, the warnings and any open
   question for a native reviewer.
5. **The assistant commits on a branch** named `translations-YYYY-MM-DD` (made
   from an up-to-date `main` at the start) and pushes it as a backup. It opens
   no pull request.
6. **The person checks locally.** The assistant starts the local site and lists
   the pages that changed in Spanish and French. Corrections are made on the
   branch (through the editor or by asking the assistant).
7. **Only when the person clearly approves**, the assistant merges the branch
   into `main`, pushes `main` and deletes the branch. If the person says no or
   is unsure, `main` is untouched and the branch stays. The person who ran
   `/translate` is the one who approves; having a Spanish and a French speaker
   read the text first is recommended.

`npm run translate:status` lists the English files that are out of date without
writing anything. The first ever run (no `scripts/translation-state.json`)
treats the current Spanish and French as up to date with the current commit. If
the translations are behind, start from an earlier commit instead:
`npm run translate:prepare -- --since <sha>` (first run only).

If a file's earlier English and its translation have a different structure
(the translation is missing fields), the strings are matched **by field path**:
a string is kept only if its English is unchanged and the translation has that
field; everything else is drafted again. The report lists these files; read
them closely.

## Reading the report

- **translated**: new or edited English, translated by the assistant. Review these.
- **reused**: English unchanged since the last sync; the existing translation
  (reviewed or not) was kept as it is.
- **memory**: new or edited English that matched `translation-memory.json`.
- **warning "cannot be paired"**: the English file and its translation did not
  have the same structure, so only the memory and matching strings from other
  files were reused. Check that file closely.
- **warning "returned unchanged"** or **"length ratio"**: probably fine for a
  name or a short label; otherwise look at it.

## Correcting a translation (reviewers)

- **In the editor on the branch, or by asking the assistant**: a correction stays for as long as
  that English string does not change.
- **In `scripts/translation-memory.json`** (`"<exact English>": "<approved text>"`):
  for wording that must survive an English change, or that should be used
  everywhere that exact sentence appears. A reviewer may edit this file and
  `scripts/translation-glossary.md` (names, fixed phrases, tone) without a developer.
- Never edit `scripts/translation-state.json` by hand: deleting it makes
  `/translate` treat everything as in sync again, editing it makes it re-send
  strings.

### What gets translated (and what doesn't) — the schema decides

No hardcoded skip-list of field names lives in the scripts. Per field, in order:

1. **`ui: { translate: false }`** (the `doNotTranslate` helper added to
   `tina/shared/fields.ts`) — never translated, copied through byte-identical.
   This is the schema-level "do not translate" marker for **proper nouns**:
   applied to `crew.name`, `boats.name`, and `blogPost.author`. A future
   field that's a proper noun (or a phone number / email address, if either
   is ever added to a *locale-routed* collection — none currently hold one;
   see below) should get the same marker rather than a name-based guess.
2. **Field name contains a technical substring** (`href`, `url`, `slug`,
   `filename`, `videosrc`, `endpoint`, `path`, `src`) — never translated,
   regardless of type. This catches technical `string` fields that
   the type check alone can't (`background.videoSrc`, every `cta.href`,
   `landingPage`'s `moguProposal.tripSlug`, image `alt`/`src` pairs' `src`
   half, etc.) without hand-listing every one of them per collection.
3. **Otherwise, TYPE decides**: `string` is translatable (including each
   element of a `list: true` string field, e.g. `difference.comparison.usPoints`);
   `image`, `boolean`, `number`, `date`, `datetime`, and `reference` are not.
   Nested `object` fields (single or `list: true`, including polymorphic
   `templates:` blocks like `navigation.links` or `landingPage.blocks`) are
   walked recursively — `_template` itself is never a declared schema field,
   so it's never visited and always passes through untouched.
4. **`rich-text` fields** (`blogPost.body`, and `landingPage`'s `richText`
   block body) are stored in this schema as **markdown strings**, not Tina's
   AST object shape — confirmed against real content files, not just the
   field type. They're parsed into paragraph / blockquote / image blocks:
   paragraph and blockquote text is translated; for an inline image
   (`![alt](url "title")`), the `url` is reconstructed untouched and only
   `alt`/`title` are translated.

**Internal links**: a field literally named `href` whose value is an internal
path in the source language (`/en/blog/`) is rewritten to the target
language's own page (`/es/blog/`) — deterministically, with no translation step — so
a Spanish page links to Spanish pages. Anchors (`#customize`), external URLs
and empty values are left alone.

**Phone numbers and email addresses**: the brief calls these out explicitly.
`siteSettings.contact.email` / `.whatsapp` live in the global collection this
workflow never reads. `footer.contactDisplay.phone` / `.email` are inside a
locale-routed collection, so they are marked `ui: doNotTranslate` — and so is
`navigation.brand.wordmarkAlt`. If a phone/email field is ever added *inside*
a locale-routed collection, mark it `ui: doNotTranslate` the same way as the
proper-noun fields — that's the intended mechanism, not a
name-based guess (a name guess is also actively unsafe here: e.g.
`funnel.step4.whatsappNumber` is an *object* whose `label` field is the
translatable UI copy "WhatsApp number" — a substring match on "whatsapp" or
"email" would wrongly skip real copy like that or `whatsappMessage.emailLabel`
without the mistake being obvious in a smoke test).

### Deleted English documents

When an English document in a multi-document collection
(`content/<collection>/en/<slug>.json`: blog posts, crew, boats, landing pages)
is deleted, `translate:apply` also deletes
`content/<collection>/{es,fr}/<slug>.json`, and the assistant lists the deletions
in its report. Safety: a collection is only pruned while its `en/` folder still
contains at least one file. If an English file was deleted by mistake, restore
it in git **and** its translations from the previous commit; do not approve the
merge of a branch that deletes them.

## Going live: enabling a language

Whether a language is *published* is separate from whether its content exists.
It is controlled by one build-time variable, `PUBLIC_LIVE_LOCALES`
(`.env.example`, `src/i18n/config.ts`): the `[locale]` routes, hreflang and the
language switcher only cover the locales listed there. Unset means English
only, so merging translations or routes can never expose a half-finished
language.

To bring the site to Spanish and French the first time:

1. Run `/translate` (a language with no files yet gets every string drafted) and
   check the result on the local site before approving the merge.
2. Set `PUBLIC_LIVE_LOCALES=en,es,fr` in Vercel for *Preview* first, check
   home, contact, blog, landing pages, nav and footer in both languages, then
   set it for *Production* and redeploy. One language at a time works too
   (`en,es`). To roll back, remove the variable and redeploy: the content stays
   in the repo.

A locale listed in `PUBLIC_LIVE_LOCALES` needs a complete set of documents.

## Manual DeepL fallback

`.github/workflows/translate-content.yml` can still be started by hand (Actions
> Run workflow). It uses the DeepL API (`DEEPL_API_KEY`, `scripts/translate-content.mjs`,
`scripts/lib/deepl.mjs`) and **commits straight to `main` with no review**.
Nothing triggers it automatically any more. It is only for the case where
`/translate` cannot be used. If the `DEEPL_API_KEY` secret is removed, only that
manual run stops working (it fails at once with a clear message); `/translate`
and everything else are unaffected. Do not use it on a language a reviewer has
already corrected unless the scope is `missing`: `changed` and `all` overwrite
existing translations.
