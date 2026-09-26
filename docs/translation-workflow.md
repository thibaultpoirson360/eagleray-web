# Translation automation (DeepL draft PRs)

What `.github/workflows/translate-content.yml` does, for whoever reviews the
PRs it opens (or has to debug a run that failed). One-time setup (getting a
DeepL key, adding the GitHub secret) is `docs/tina-setup.md` section 13, not
here.

## The flow, in one sentence

**A push to `main` that changes English content -> a script drafts ES/FR
translations with DeepL -> those drafts land in a pull request, never
directly on `main` -> a human reviews (and can fix) them, ideally using the
PR's live preview with Tina's editor active -> a human merges.** Nothing in
this pipeline auto-publishes anything.

## 1. Trigger

`on: push` to `main`, path-filtered to:

```
content/**/en.json
content/**/en/*.json
```

This is the exact shape of every EN source file in this repo today —
confirmed against `tina/collections/*.ts` and the actual `content/` tree, not
assumed as `content/en/**` (locale is *inside* each collection's folder here,
not a top-level split):

- **One document per locale** (`hero`, `difference`, `crewSection`,
  `wildlife`, `boatsSection`, `funnel`, `contactPage`, `blogSection`):
  `content/<collection>/en.json`.
- **Multiple documents per locale** (`crew`, `boats`, `blogPost`,
  `landingPage`): `content/<collection>/en/<slug>.json`.

`navigation`, `footer`, `siteSettings`, and `editors` are **not** locale-routed
at all (`ui.global: true`, a single `content/<folder>/index.json`) — they
don't match either pattern and this workflow never touches them. That's a
pre-existing property of the schema (brand facts, nav labels, the editor
allowlist), not something this task changed; if any of those collections are
ever converted to be per-locale, they'd need a schema change first, and this
workflow's path filter would need updating to match.

`workflow_dispatch` is also wired up as a manual escape hatch (e.g. re-run
after fixing a bad `DEEPL_API_KEY`, or to backfill translations once after
this workflow is first added, since it only reacts to *future* pushes).

## 2. Translate

`node --experimental-strip-types scripts/translate-content.mjs` does the
work, with **zero npm dependencies** — `fetch`, `node:fs`, `node:path`,
`node:child_process`, `node:module` only, which is why the Action has no
`npm ci` step.

1. **Resolve which files changed.** Explicit file arguments (used for local
   testing), or `git diff $GIT_BASE_SHA...$GIT_HEAD_SHA` (the workflow sets
   these from `github.event.before` / `github.sha`). If that diff fails for
   any reason — no `before` SHA on a manual run, a brand-new branch's first
   push (`before` is the all-zeros SHA), a shallow checkout — it falls back
   to a full rescan of every EN content file, so a run degrades to
   "translate everything" rather than silently translating nothing.
2. **Load the real Tina schema.** `scripts/lib/tina-schema.mjs` imports every
   `tina/collections/*.ts` file directly (via
   `scripts/lib/ts-resolve-hook.mjs`, a small Node ESM resolve hook — see
   below) and indexes each collection by the folder name in its own `path`
   (e.g. `content/crew` -> `crew`). No `tinacms build`, no Tina credentials.
3. **Walk each changed document against its collection's field schema**
   (`scripts/lib/translatable-content.mjs`) and decide, per field, whether
   it's translatable — see "What gets translated" below.
4. **Send the translatable strings to DeepL** (`scripts/lib/deepl.mjs`, one
   batched request per document per target language) and write the results
   to `content/<collection>/es.json` / `.../fr.json` (or the `<locale>/<slug>.json`
   form for multi-doc collections) — same 2-space-indent + trailing-newline
   format as every other content file.

### Why `--experimental-strip-types` + a resolve hook, not `tinacms build`

Running the real `tina/collections/*.ts` files (rather than re-declaring
which fields are translatable by hand, elsewhere) is the whole point — it's
how the `doNotTranslate` marker and every field's real `type` are read
without drifting out of sync with the actual schema. `tinacms build` would
also read the schema, but needs Tina's local database/GraphQL server (ports,
indexing, `TINA_PUBLIC_IS_LOCAL`) for something that's really just "import a
few plain TypeScript objects." Node can do that natively since 22.6+ with
`--experimental-strip-types`, with one catch: `tina/collections/*.ts` files
import each other with extensionless specifiers (`from "../shared/fields"`),
which real Node ESM resolution rejects (it requires the extension) — the
exact same class of bug `scripts/patch-tina-generated.mjs` already patches
for Tina's own generated output (see that file). `scripts/lib/ts-resolve-hook.mjs`
fixes it the same way, at resolution time instead of via a post-build patch,
since this is source code we don't control.

### What gets translated (and what doesn't) — the schema decides

No hardcoded skip-list of field names lives in the Action. Per field, in order:

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

**Phone numbers and email addresses**: the brief calls these out explicitly,
but as of this schema, no *locale-routed* collection (the only kind this
workflow ever reads) has a field holding one — `siteSettings.contact.email` /
`.whatsapp` and `footer.contactDisplay.phone` / `.email` all live in the
global, non-localized collections this workflow never touches (see "Trigger"
above). Nothing to skip today, by construction. If a phone/email field is
ever added *inside* a locale-routed collection, mark it `ui: doNotTranslate`
the same way as the proper-noun fields — that's the intended mechanism, not a
name-based guess (a name guess is also actively unsafe here: e.g.
`funnel.step4.whatsappNumber` is an *object* whose `label` field is the
translatable UI copy "WhatsApp number" — a substring match on "whatsapp" or
"email" would wrongly skip real copy like that or `whatsappMessage.emailLabel`
without the mistake being obvious in a smoke test).

### Re-translation semantics (a known, accepted tradeoff)

Every run **overwrites** the ES/FR files for whatever EN files changed, in
full — not a diff-aware "only re-translate the parts that changed" merge. If
a human has hand-edited an ES/FR file after a previous translation PR merged,
and the *same* EN source file changes again later, the next run's draft will
clobber that hand-edit (in the new PR, which still needs review/merge — nothing
is lost until someone approves and merges over it). Given the volume here
(a small marketing site, infrequent content pushes), this was judged an
acceptable simplification rather than building change-tracking/diffing logic
— reviewers should treat every translation PR as a full draft to re-check for
that file, not assume only the "new" parts need a look.

## 3. Pull request — never auto-publish

The workflow opens a PR (`peter-evans/create-pull-request`) only when files
were actually written (`steps.translate.outputs.files_changed == 'true'`),
using the default `GITHUB_TOKEN` (no extra PAT). The PR's head is the
long-lived **`staging`** branch (base: `main`) — every future translation
run updates the *same* branch/PR (until it's merged) instead of piling up a
new PR per push, and it's also what makes the Vercel preview story in
section 4 below viable (a stable branch name is a prerequisite for a stable
preview URL). `permissions: contents: write, pull-requests: write` at the
workflow level is exactly the scope needed for this and nothing more.

Because `staging` is permanent, two things to know:

- The action **resets `staging` to `main` + the new translation commit** on
  every run that has changes (that is how `peter-evans/create-pull-request`
  updates an existing PR branch). Anything on `staging` that isn't in `main`
  — including edits an editor made through the staging alias — is overwritten
  by the next run, so **merge (or discard) the open translation PR before
  pushing more EN content.**
- `delete-branch` is set to `false` in the workflow on purpose. With `true`
  the action deletes the branch when a run finds nothing to change and no
  PR is open, which would take the Vercel alias and OAuth setup down with it.

**Merging is always a manual, human action** — this workflow has no merge
step, no auto-merge label, nothing. Both halves of "never auto-publish" hold:
DeepL's draft never reaches `main` without becoming a normal reviewed PR
first, and translation quality is never assumed — the PR body links to this
doc's review guidance.

## 4. Review — including a live preview with Tina editing

A reviewer should check the diff like any other PR, but a text diff alone
can't show whether translated copy actually *reads* right in place (line
length in a card, an `<em>` split title, a multi-line quote). Two ways to
check the PR, in increasing order of how much they let a reviewer actually do:

- **View the rendered page** — the PR gets a normal Vercel preview deployment
  (Vercel deploys a preview for every push to every branch on the connected
  repo by default; `staging` is not special-cased, and needs no
  extra Vercel configuration to get one). No sign-in needed to *view* the
  static site at `/es/...` / `/fr/...`.
- **Edit it live, in place, with Tina** — this is where the exact-match
  constraint already documented in `docs/tina-setup.md` section 7 matters:
  Google OAuth redirect URIs must be registered exactly, so a random
  `*.vercel.app` preview URL can't complete sign-in. Section 7's fix is to
  give one **stable branch** a permanent Vercel domain alias and register
  *that one URL's* callback once. `staging` being a stable, reused branch
  name (previous paragraph) means this is a **one-time** setup, not per-PR —
  and if the staging alias from `docs/tina-setup.md` section 7 already
  exists, it is already done:
  1. Vercel: Project > Domains > assign a domain/subdomain (e.g.
     `staging.eaglerayexpeditions.com`) to branch `staging`.
  2. Google Cloud Console: add
     `https://staging.eaglerayexpeditions.com/api/tina/auth/callback/google`
     as an authorized redirect URI on the same OAuth client already used for
     production (`docs/tina-setup.md` section 4b).
  3. Vercel env vars, scoped to Preview + branch `staging`:
     `NEXTAUTH_URL=https://staging.eaglerayexpeditions.com/api/tina/auth`.
  4. Check Vercel **Deployment Protection** isn't blocking editors without
     Vercel accounts from reaching that alias (section 7 flags this as a
     standing client decision, not something this workflow changes).

  Once set up, every future translation PR reuses the same alias (same
  branch), so a reviewer can open `/admin/index.html` on that one URL,
  sign in with an allowlisted Google account, and edit the draft ES/FR copy
  **in place with Tina's visual editor** before approving — exactly the
  "adjust the draft translation, not just read a diff" requirement.

  Edits made there commit to the `staging` branch (Tina OSS has no
  "save to a separate branch" workflow — see section 7), which is exactly
  this PR's branch, so an editor's fix becomes part of the same PR
  automatically.

## 5. Merge

A normal PR merge, by a human, once the reviewer is satisfied — same as any
other change to `main`. No special-casing.

## Keeping the DeepL key safe

- Stored only as the GitHub Actions repo secret `DEEPL_API_KEY` (setup:
  `docs/tina-setup.md` section 13). Never committed — `.env.example` only
  documents the variable name with an explicit note that it's a GitHub
  secret, not a Vercel env var (the workflow never runs on Vercel).
- `scripts/lib/deepl.mjs` never includes the key value in an error message
  (a DeepL API error surfaces the response status/body only), and the
  workflow only ever references it as `${{ secrets.DEEPL_API_KEY }}` in an
  `env:` block — GitHub Actions automatically redacts any log line
  containing a registered secret's literal value.

## Usage volume

Free tier (~500K characters/month) is assumed sufficient at this project's
volume — a small marketing site with infrequent content pushes, not a
high-frequency content pipeline. No usage-tracking or rate-limiting logic is
built, deliberately: at this volume it would be speculative complexity with
nothing to actually guard against yet. If usage ever approaches the free
tier's limit, DeepL's own dashboard shows current usage — that's the signal
to revisit this, not something to pre-build.

## Verification performed (and what's still unverified)

**Verified in this environment:**
- `node --check` clean on all 5 script files
  (`scripts/translate-content.mjs`, `scripts/lib/{ts-resolve-hook,tina-schema,translatable-content,deepl}.mjs`).
- `actionlint` v1.7.12 on the workflow YAML: exit 0, zero findings. Also
  parsed cleanly with `js-yaml` and PyYAML (PyYAML resolves the bare `on:`
  key to the boolean `True` per YAML 1.1 — a well-known, harmless quirk of
  that specific parser/spec version; GitHub's own parser and `actionlint`,
  which uses the same YAML library GitHub's runner does, both read it as
  the literal key `"on"`, which is what actually matters).
- Ran the real script — both by importing its functions directly with an
  injected fake `translateFn`, and as a real subprocess
  (`node --experimental-strip-types scripts/translate-content.mjs <files>`,
  with `scripts/lib/deepl.mjs` temporarily given an env-gated mock branch,
  removed immediately after) — against real repo content (`content/hero/en.json`,
  `content/crew/en/javier.json`, `content/boats/en/bay-dreamer.json`,
  `content/blogPost/en/a-morning-under-sail-on-the-astrea.json`, plus
  `difference`, `contactPage`, `wildlife`, `funnel`, and the unrelated
  `landingPage` collection's polymorphic `blocks` field as an extra
  real-world test of the `templates:` walker). Confirmed: `href`s,
  image/video paths, `_template`, numbers/booleans/dates, and the
  `doNotTranslate`-marked names (`"Javier"`, `"Bay Dreamer"`) came through
  byte-identical, every copy field was sent to the translator, the blog
  body's image URL/markdown syntax survived untouched while its alt/caption
  translated, and output files matched the project's real 2-space-indent +
  trailing-newline convention. All generated test fixtures were deleted
  afterward and `scripts/lib/deepl.mjs`'s temporary mock branch fully
  removed — `git status` shows only the intended file changes.
- `TINA_PUBLIC_IS_LOCAL=true npx tinacms build --local --skip-cloud-checks`
  after adding `doNotTranslate` to the schema: "Tina build complete", no
  indexing errors. Ran `node scripts/patch-tina-generated.mjs` after, per
  the normal build convention. Checked ports 4001/9000 were free before
  starting and confirmed no process was left listening after.
- A real network call to DeepL's live API with an invalid key: got a real
  `403 Forbidden` from `api.deepl.com`, the script exited cleanly with code
  1, and wrote zero partial files — confirms the endpoint, auth header, and
  error path all work against DeepL's real infrastructure.
- The `$GITHUB_OUTPUT` multi-line-value syntax (`files_changed`, `file_list`)
  written and read back correctly from a real file.
- The git-diff-failure fallback (full content rescan) triggers correctly and
  found every EN content file in the repo.

**Not verified in this environment** (needs things it doesn't have):
- A real DeepL translation — actual ES/FR text quality, `preserve_formatting`
  behavior against DeepL's real model (vs. the mock used above), a valid
  key's real usage/billing dashboard.
- A real GitHub Actions run of the workflow itself — the `push`/`paths`
  trigger actually firing on GitHub's infrastructure, `github.event.before`
  resolving as assumed across a normal push vs. a branch-creation push,
  `peter-evans/create-pull-request` actually opening/updating a PR with
  these permissions on a real repo.
- A real Vercel preview on a PR this workflow opens, and Tina's visual
  editor actually working on it end-to-end (sign-in through the stable-alias
  setup in section 4, editing, and the edit landing back on the `staging`
  branch as expected). This depends entirely on this project's pre-existing
  Tina-on-Vercel-preview setup (`docs/tina-setup.md` section 7), which that
  doc already marks as needing a real deploy to confirm — nothing new this
  workflow introduces changes that risk, but nothing here re-verifies it either.
