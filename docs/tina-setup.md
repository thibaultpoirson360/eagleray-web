# TinaCMS setup (self-hosted) — architecture notes and runbook

Written so the decisions below never have to be re-derived. Every claim is tagged
**VERIFIED** (I ran it or read the installed package source), **DOCS** (current
published docs, not executed), or **UNVERIFIED** (needs credentials or a real
Vercel deploy). Versions: astro 7.3.2, tinacms 3.13.0, @tinacms/cli 2.7.0,
@tinacms/astro 0.7.0, @tinacms/datalayer 2.0.29, tinacms-authjs 24.0.4,
next-auth 4.24.15. Checked 2026-09-19.

## 0. Status at a glance

| Item | State |
|---|---|
| Schema compiles (`tinacms build --local`), `tina/__generated__/*` produced | VERIFIED |
| `tinacms dev` starts headlessly, `/admin/index.html` returns 200, GraphQL lists all 11 collections, `siteSettings` and `editors` indexed | VERIFIED |
| Sample docs for hero / crew / navPages / funnel round-trip through GraphQL; `_sys.breadcrumbs[0]` is the locale (temp files, removed) | VERIFIED |
| Editor allowlist: `authorize` returns the user for an allowlisted email, `null` for a stranger (local DB) | VERIFIED |
| Backend handler bundles with esbuild; unauthenticated `POST /api/tina/gql` gives 401; Auth.js answers under `/api/tina/auth/*`; Google sign-in URL is built with `redirect_uri=.../api/tina/auth/callback/google` (dummy client id, local Node harness) | VERIFIED |
| Real Google sign-in, session -> allowlist -> 200 on `/gql` | UNVERIFIED (needs Google OAuth client) |
| Commit-author attribution to the signed-in editor | UNVERIFIED (needs GitHub PAT + repo) |
| Upstash Redis index, `tinacms build` indexing on Vercel | UNVERIFIED (needs Upstash DB) |
| `api/tina/backend.ts` + `vercel.json` rewrite actually deployed by Vercel alongside `@astrojs/vercel` | **UNVERIFIED and at risk — see section 2** |
| `astro dev` / `astro build` | Not runnable yet: `redirectToDefaultLocale` needs `src/pages/index.astro` (section 6) |
| Click-to-edit on the Astro site | Not testable yet (no pages); mechanism verified from package source, section 6 |
| Vercel Edit Mode / Content Link with Tina on Astro | UNVERIFIED and probably unsupported — section 7 |

## 1. What self-hosted Tina requires today

Docs (`tina.io/docs/reference/self-hosted/overview` and sub-pages): four pieces, none optional.

| Piece | Job | What we use |
|---|---|---|
| Backend host | one API function serving GraphQL + auth | `api/tina/backend.ts` (Vercel Function) -> `tina/backend.ts` |
| Git provider | writes edits to git; git stays the source of truth | `tinacms-gitprovider-github`, PAT, wrapped in `tina/git-provider.ts` |
| Database adapter | key-value **index** the GraphQL layer queries. The database-adapter doc page states it is a *required* `createDatabase` parameter. Supported: Vercel KV/Upstash Redis, MongoDB | Upstash Redis via `upstash-redis-level` |
| Auth provider | who may call the backend | Auth.js (`tinacms-authjs`) + Google |

**Divergence from the planning question** ("does it read/write directly through the
GitHub API?"): it writes through GitHub, but it also *needs* the index database.
Content is never only in Redis — `tinacms build` rebuilds the index from git on every
deploy, so the Redis instance is disposable. It is one more service to provision.

## 2. GraphQL backend as Vercel Functions — read this before the first deploy

- **Tina's docs** (`reference/self-hosted/tina-backend/vercel-functions`) say: put the
  backend in `api/tina/backend.ts`, add a `vercel.json` rewrite
  `/api/tina/:path*` -> `/api/tina/backend` (Vercel Functions have no catch-all), point
  the config at it. That is exactly what is in the repo. The reference demo
  (`tinacms/tina-self-hosted-static-demo`) uses this with a **non-Astro static site**.
- **Vercel's own Astro guide** (`vercel.com/docs/frameworks/frontend/astro`) says
  Astro Server Endpoints are "the best way to define API routes with Astro on Vercel", and
  that **`vercel.json` rewrites are "not officially supported" with Astro projects**
  ("inconsistent behavior"). It does not mention root `api/` folders alongside the
  adapter at all. `@astrojs/vercel` emits a Build Output API directory; I could not
  confirm that a root `api/` folder is merged into it.

So the client's decision ("Vercel Functions alongside Astro") is honoured, but the exact
mechanism (root `api/` + rewrite) is **the single riskiest unverified item**. Two
docs disagree and I cannot deploy from here.

**Smoke test — run on the very first Vercel deploy, before anything else:**

```
curl -i -X POST https://<deployment>/api/tina/gql -H 'content-type: application/json' -d '{}'
#  expected: HTTP 401  {"error":"Unauthorized"}     -> mechanism works
curl -s https://<deployment>/api/tina/auth/providers
#  expected: {"google":{... "callbackUrl":"https://<deployment>/api/tina/auth/callback/google"}}
#  404 / HTML from either  -> mechanism does NOT work, use a fallback
```

**Fallbacks if it 404s** (in preference order):
1. Mount the same handler as an Astro endpoint: `src/pages/api/tina/[...routes].ts`
   with `export const prerender = false`, calling `tina/backend.ts`. Astro endpoints get a
   Web `Request`; Tina + Auth.js want Node `req`/`res` (`req.query`, `req.body`,
   `res.status/json/redirect`), so a small Web<->Node shim is needed. `tina/backend.ts` is
   deliberately a plain `(req, res)` function so only the shim is new. Untested.
2. Separate Vercel project for the backend only. Not recommended: cross-origin admin
   -> cookies (`SameSite`), CORS, second domain to register with Google.
3. Drop `@astrojs/vercel` (pure static + root `api/`, the demo's model). Rejected: the
   island endpoint that makes click-to-edit work on a static Astro site is on-demand.

Other deploy notes for `api/`:
- `package.json` is `"type": "module"`. The generated `tina/__generated__/databaseClient.ts`
  imports `../database` without an extension. It bundles fine with esbuild (verified) but
  Vercel's TS handling for an ESM package is UNVERIFIED. If the function crashes with
  `ERR_MODULE_NOT_FOUND`, that is why.
- Function bundle size: `next-auth` lazily `require("next/headers")`; `next` is only a
  peer dependency of `tinacms-authjs`, kept in devDependencies. Watch the function size on
  first deploy.
- `tinacms-authjs` logs "Catch-all api route ... with specified Auth.js provider ['Google']
  not supported" on cold start. It is a `console.warn` from its `initialize()`; the local
  harness confirmed the Google flow is served regardless. Expect it in the logs.

## 3. Auth: Auth.js + Google, and how it is mounted

CLAUDE.md overrides the earlier GitHub choice: the marketing team has no GitHub accounts.
The earlier reasoning (GitHub OAuth = same identity as the git provider) no longer applies.
Google is a documented Auth.js login provider; Tina has no first-class "Google provider".
Google was the simpler option here for the actual reason above, plus editors already have
Google accounts (Workspace or personal).

- **Authentication**: Google, via Auth.js (next-auth v4), `tina/auth.ts`. Unverified
  Google emails are refused.
- **Authorization**: `content/editors/index.json`, the `editors` collection, marked
  `isAuthCollection` (a Tina requirement — a plain "users" collection is not enough). On
  sign-in `tinacms-authjs` runs Tina's `authorize` query with `uidProp: "email"`; a match
  gives role `user`, otherwise `guest` (the backend returns 403). Not `isDetached`: the
  list lives in git, so it is reviewable and `tinacms build` re-syncs it.
- **Mount path differs from the old branch.** tinacms 3.13's admin hard-codes its Auth.js
  `SessionProvider` to `basePath: "/api/tina/auth"`, and the Tina backend serves Auth.js
  itself through its `auth` extra route. So there is **no** `api/auth/[...nextauth].ts`
  (the old branch had one; it would have been the wrong URL). Consequences:
  - Google redirect URI = `https://<host>/api/tina/auth/callback/google`
  - `NEXTAUTH_URL` = `https://<host>/api/tina/auth` — the **path is required**
    (next-auth derives its base path from it; without it, on Vercel it silently falls back
    to `/api/auth`).
- The backend must import the **generated** `tina/__generated__/databaseClient`. The old
  branch imported `tina/database.ts` directly, which has no `authorize()` and no schema.
- Sessions are JWT, 8 hours (`tina/auth.ts`). The role is stamped into the JWT at sign-in
  and not re-checked, so **removing an editor does not end a session they already have**;
  the 8-hour cap bounds it. Immediate revoke = rotate `NEXTAUTH_SECRET` (signs everyone out).
- Any signed-in editor can edit the `editors` list from the admin (Tina OSS has no
  per-collection permissions). If the allowlist should be changeable only through git,
  the collection cannot be removed (auth needs it); an untested option is to give its
  `users` field `ui: { component: "hidden" }` so it is not editable in the UI, then manage
  `content/editors/index.json` by PR.

### Audit trail — what you actually get

The stock GitHub provider commits everything as the **PAT owner** with the fixed message
"Edited with TinaCMS". With per-editor Google logins that would hide who changed what.

Mitigation implemented (`tina/git-provider.ts`, `tina/backend.ts`): after Auth.js
authorizes a request, the editor's name/email are held in an `AsyncLocalStorage` store;
the provider sets the commit **author** to the editor and appends
`Edited-by: Name <email>` to the message (the PAT owner remains committer). Result in
`git log`: author = the editor, no GitHub avatar (they have no GitHub accounts; GitHub only
links an author to a profile when the email matches a verified GitHub email). UNVERIFIED
against a real repo. Use a dedicated bot/machine GitHub account for the PAT so "committer"
is not a person. Other sources of truth: Vercel function logs per request.

## 4. Provisioning checklist (I cannot do any of these)

### 4a. GitHub PAT
1. Use a machine/bot account (or an org owner you accept as committer of record).
2. github.com/settings/personal-access-tokens/new -> **Fine-grained**, resource owner = the
   repo owner, **only this repository**, permission **Contents: Read and write**. Set an
   expiry (max 1 year) and put the renewal date in a calendar.
3. Save as `GITHUB_PERSONAL_ACCESS_TOKEN`; also set `GITHUB_OWNER`, `GITHUB_REPO`.
4. If `main` has branch protection that blocks pushes, the PAT user must be allowed to
   push (Tina commits straight to the branch).

### 4b. Google OAuth client
(Console menu names are from memory and Google renames them often; the intent is what matters.)
1. console.cloud.google.com -> create/select a project (e.g. "Eagle Ray CMS").
2. **Google Auth Platform** (formerly "OAuth consent screen") -> configure: app name, support
   email. User type **Internal** if the team is on one Google Workspace domain (no
   verification; only that domain can sign in) else **External** and publish to
   *In production* (scopes are only `openid email profile`, no Google verification review is
   normally needed for those).
3. **Clients / Credentials -> Create OAuth client ID -> Web application.**
4. **Authorized redirect URIs** (exact, no wildcards) — add one per environment:
   - `https://eaglerayexpeditions.com/api/tina/auth/callback/google` (production; adjust
     to the real domain)
   - `https://<staging-alias>/api/tina/auth/callback/google` (only if you use the staging
     flow in section 7)
   Authorized JavaScript origins are not needed (server-side code flow).
5. Copy client ID and secret into `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`.
6. Edit `content/editors/index.json`: replace the `replace-me@example.com` placeholder
   with the first admin's exact Google email, **lowercase** (this must be committed before
   anyone can sign in; the placeholder currently locks everyone out on purpose).

### 4c. Upstash Redis (database adapter)
1. Vercel dashboard -> Storage / Marketplace -> **Upstash** -> Redis (free tier should be
   plenty; check current limits). Tina's doc page is titled "Vercel KV" but says it uses the
   Upstash Redis REST client, so a plain Upstash database works the same way.
2. Connect it to this project. The integration injects env vars; the ones Tina's adapter
   reads are `KV_REST_API_URL` and `KV_REST_API_TOKEN`. If the integration names them
   `UPSTASH_REDIS_REST_URL` / `_TOKEN`, add the two `KV_*` names with the same values
   (`tina/database.ts` reads `KV_*`).

### 4d. Vercel project
1. Import the repo, framework preset **Astro**, Node >= 22.12.
2. Build command: `npm run build` (= `tinacms build --skip-cloud-checks && astro build`).
   It **needs the env vars at build time** (Build scope): `tinacms build` indexes the
   branch's content into Redis and generates the client the site's data loaders use.
3. Env vars — in the table, P = Production, V = Preview:

| Variable | Scope | Notes |
|---|---|---|
| `TINA_PUBLIC_IS_LOCAL` | none | **Never set on Vercel.** Unset means real auth + real DB. |
| `GITHUB_OWNER`, `GITHUB_REPO`, `GITHUB_PERSONAL_ACCESS_TOKEN` | P, V | mark the token Sensitive |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` | P, V | |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | P, V | secret = Sensitive |
| `NEXTAUTH_SECRET` | P, V | `openssl rand -base64 32`; use a different value per environment |
| `NEXTAUTH_URL` | P: `https://<prod-domain>/api/tina/auth`; V: the staging alias URL + `/api/tina/auth` | must end in `/api/tina/auth` |
| `GITHUB_BRANCH` | leave **unset** | production resolves to `main`; a preview resolves to its own branch via `VERCEL_GIT_COMMIT_REF` |

4. Redeploy after any env change (Vercel does not hot-reload env vars).
5. Run the smoke test in section 2.
6. First sign-in test: open `/admin/index.html`, click sign in, use the allowlisted Google
   account, edit a field, save, and check `git log` for an "Edited-by:" trailer.

## 5. Schema

Only the homepage scope is modelled (CLAUDE.md). All field names are English; funnel
fields use the rename table. Layout: `content/<collection>/<locale>/<slug>.json` for item
collections, `content/<collection>/<locale>.json` for one-doc-per-locale sections (e.g.
`content/hero/en.json`). Only `en` is populated. All `format: "json"`, so **no MDX
integration is needed** (removed `@astrojs/mdx` from the old branch). The first breadcrumb
is always the locale, which `ui.router` uses to open the right page in the editor.

| Collection | Path | Fields (top level) |
|---|---|---|
| `hero` | `content/hero/<loc>.json` | metaLine, title, subtitle, primaryCta{label,href}, secondaryCta{label,href}, background{videoSrc, image, imageAlt}, scrollCueLabel |
| `difference` | `content/difference/<loc>.json` | depth{meters,name}, kickerNumber, kicker, title, titleEmphasis, lede, comparison{usTitle, usPoints[], axisLabel, themTitle, themPoints[]}, founderQuote{kicker, quote, cite} |
| `crewSection` | `content/crewSection/<loc>.json` | depth, kickerNumber, kicker, title, titleEmphasis, intro, rolesIntro, cta |
| `crew` | `content/crew/<loc>/<slug>.json` | name, role, bio, photo, photoAlt, cardLabel, joiningTag, order |
| `wildlife` | `content/wildlife/<loc>.json` | depth, kickerNumber, kicker, title, titleEmphasis, lede, gallery[{image, alt, href}], cta |
| `boatsSection` | `content/boatsSection/<loc>.json` | depth, kickerNumber, kicker, title, titleEmphasis, cta |
| `boats` | `content/boats/<loc>/<slug>.json` | name, tagline, description, photo, photoAlt, order |
| `funnel` | `content/funnel/<loc>.json` | depth, heading fields, lede, escapeText, step1{legend, tripDuration{question,options[{label,value}]}, travelingAs{...}, guestCount{question,min,max,defaultValue,hint,fewerLabel,moreLabel}}, step2{legend, routeFocus{...}, topPriority{...}}, step3{legend, dateFromLabel, dateToLabel, flexibleDates{label,placeholder}, boatPreference{...}}, step4{legend, fullName{label,placeholder,error}, email{...,error}, whatsappNumber{label,placeholder,optionalHint}, notes{label,placeholder}, privacy}, ui{stepCounter, autosaveRestored, autosaveSaved, back, continue, submit, sending, submitError, recapTitle}, success{title, body, whatsappButton}, whatsappMessage{intro, *Label per field, datesFrom, datesToBeConfirmed} |
| `navPages` | `content/navPages/<loc>/<slug>.json` | title (7 files: about-us, passionate-sea-people, sail-with-us, la-paz, boats, blog, contact) |
| `siteSettings` | `content/settings/index.json` (singleton, global) | name, base, coords, contact{whatsapp,email,instagram}, sounder{maxDepth,surfaceLabel}, funnelIntro, leadEndpoint |
| `editors` | `content/editors/index.json` (auth allowlist) | users[]{email (uid), name} |

Modelling notes for content-migrator and component builders:
- `<br><em>` titles are two fields: `title` + `titleEmphasis` (no HTML in content).
  Multi-line plain strings (`founderQuote.kicker`) use `\n`, rendered as `<br>`.
- Source strings contain HTML entities (`&amp;`, `&mdash;` style) in `lib/i18n.js`;
  decode them when migrating.
- `kickerNumber` is content: the source numbers are 01, 02, 03, 07, 09 (placeholder
  scaffold numbering), so they are editable rather than computed.
- `depth` = the sounder's `data-depth-stop` / `data-depth-name` per section.
- `funnel` option `value` is what is sent in the lead / WhatsApp message; `label` is the
  button text (they differ in the source, e.g. "10 or more" vs "10 days or more").
- Boats and crew slugs: `slugify` on name (lowercase, hyphens); `order` sorts cards.
- `wildlife` keeps gallery items inside the section document (no per-species pages yet).
  `main.js` still has `initFauna` but the current markup is a plain gallery.
- Kept out of scope per the brief: routes, dayInLife, FAQ, legal pages, landingPages/blocks.
  **Blog: no content type is modelled**, only a blank `blog` navPage. A blog needs its own
  collection and template — raise as a scope/estimate conversation.
- Present in `index.html` but **not** in the agreed schema (still hardcoded until added):
  the `final-cta` section, footer copy/links, nav link labels and the page `<title>` /
  description / og tags. Recommend `finalCta`, `footer`, `nav`, `seo` in a follow-up.

## 6. Visual / contextual editing on Astro — what is real

Verified from `@tinacms/astro` 0.7.0 source and its GETTING_STARTED.md, and Tina's Astro
page. This is **not** Next.js's `useTina` mechanism and needs no React in the page tree.

Works (by design; needs pages to test):
- Click a field in the live page -> the matching form field focuses. Mechanism:
  `requestWithMetadata()` loaders + `tinaField(obj, "field")` on elements
  (`data-tina-field`), including nested objects and list items.
- Static output is supported, **on the condition** that every editable region is wrapped in
  `<TinaIsland name=... params=... [primary]>` and registered in an island registry, with an
  on-demand endpoint `src/pages/tina-island/[name].ts` (`export const prerender = false`).
  That endpoint is why an SSR adapter (`@astrojs/vercel`) is installed even though output is
  `static`. Mark exactly one island per page `primary`.
- Production visitors' HTML is unchanged except pages using `<TinaIsland>` carry one inline
  bootstrap script that only activates inside the admin iframe.
- `tina()` is wired in `astro.config.mjs`; `tinaAdminDevRedirect()` makes `/admin` work in dev.

Limits and gotchas found:
- The island endpoint uses `experimental_createIslandRoute` from
  `@tinacms/astro/experimental`, built on Astro's unstable `experimental_AstroContainer`.
  Editing depends on an experimental API.
- Astro 6+ needed for new entries to appear in dev without a restart (we are on 7).
- **`src/pages/index.astro` must exist**: with `redirectToDefaultLocale: true` Astro throws
  `MissingIndexForInternationalizationError` otherwise (hit while testing the config).
- **Build-time data loading**: in a deployed config the generated `client.ts` URL is the
  relative `/api/tina/gql`, which does not resolve in Node during `astro build`. Static
  builds must read through `tina/__generated__/databaseClient` (same query shape:
  `databaseClient.queries.hero({ relativePath: "en.json" })`), which needs the KV/GitHub
  env at build. Locally `databaseClient` talks to the level server that `tinacms dev`
  starts, so run pages under `npm run tina:dev`.
- Islands endpoint and the admin are same-origin, so `PUBLIC_TINA_ADMIN_ORIGIN` is not
  needed. Only set it if the admin ever lives on another origin.
- Per CLAUDE.md, "every component editable": every field in a component needs
  `data-tina-field`, and each component must be inside a registered island.

## 7. Vercel Preview + Vercel Edit Mode (formerly "Visual Editing")

- The doc path in the brief (`vercel.com/docs/workflow-collaboration/visual-editing`) has moved
  to `vercel.com/docs/edit-mode`. Vercel's feature is now **Edit Mode / Content Link**
  in the Vercel Toolbar, which needs content source maps (stega-encoded strings) from the CMS.
  Vercel lists TinaCMS as a supported Content Link CMS and links to Tina's contextual-editing
  page; the Vercel changelog entry says Tina support is for **Enterprise** customers. Edit
  Mode also lists "permissions required" (paid Vercel plan feature).
- I found **no** source-map/stega or `data-vercel-edit-target` code in `@tinacms/astro`,
  `@tinacms/bridge` or `tinacms` 3.13, and Tina's contextual-editing overview only documents
  React (`useTina`). **Conclusion: do not assume Edit Mode works on Astro + self-hosted Tina.**
  It is unverified and probably unsupported; confirm with Tina/Vercel before promising it.
- What does work on previews is **Tina's own visual editor**: `tinacms build` writes the admin
  to `public/admin`, so every deployment (including previews) serves `/admin/index.html`
  and its own backend. Constraints found:
  - Google redirect URIs are exact-match, so a random `*.vercel.app` preview URL cannot sign
    in. Use one **stable alias**: give a long-lived branch (e.g. `staging`) a domain
    (Project > Domains > assign to branch), register that alias's callback URI, and scope
    `NEXTAUTH_URL` (Preview, branch `staging`) to it.
  - Vercel **Deployment Protection** covers previews: editors without Vercel accounts are
    blocked unless protection is relaxed (Protection Bypass / turned off for that alias).
    This is a decision for the client; nothing here changes it.
  - Edits on a preview commit to **that preview's branch** (`VERCEL_GIT_COMMIT_REF`) and
    use their own Redis namespace (the branch name). Tina OSS has no editorial workflow /
    "save to branch then PR" like Tina Cloud, so promoting staging edits to `main` is a
    normal git merge done by a developer.
  - Extra branches leave extra namespaces in Redis; it is small, but delete stale ones.
- Recommended v1: editors use production `/admin` (edits land on `main`, Vercel redeploys).
  Add the staging alias only if the client wants review-before-publish.

## 8. Media (divergence found)

Tina's repo-media (`media.tina`) is a Tina Cloud feature. On a self-hosted backend the admin
throws "Self-hosted TinaCMS can't serve media from your repo through TinaCloud" (message is
in `tinacms` 3.13). The old branch's config would have broken every image field. Config now:
`media.tina.static: true` in deployed builds = read-only picker over files already committed
under `public/assets/` (matches the existing `/assets/img/...` URLs); uploads work only
under `tinacms dev`. Image files reach production by being committed. If editors must upload
from the admin, add an external store via `media.loadCustomStore` (Cloudinary, S3, Vercel
Blob) — a decision/cost for the client. Videos (`hero.background.videoSrc`) are a plain
path string.

## 9. Local development

```
npm run tina:dev          # tinacms dev -c "astro dev" with TINA_PUBLIC_IS_LOCAL=true
npm run tina:build:local  # schema/compile check; no cloud, no Redis
```
Local mode: no login, no GitHub, no Redis, filesystem content, `contentApiUrlOverride`
unset so GraphQL is served by the CLI on `localhost:4001`, admin at
`/admin/index.html`. `tinacms dev` uses ports 4001 (GraphQL) and 9000 (level datalayer);
if either is taken it fails with "Datalayer server is busy on port 9000" — use
`--datalayer-port` / `-p`. **A stale `tinacms dev` process from 12:13 today (PID 10872)
holds both ports in this checkout; stop it before running `tina:dev`.**
`tina/tina-lock.json` is only written by `tinacms dev`, is only used for Tina Cloud, and is
harmless here (not gitignored; commit or ignore as you like).

## 10. Adding and removing editors

1. In the admin: **Editors (who can sign in)** -> add/remove a row with the person's exact
   Google email (lowercase). Save. It is a normal commit, effective immediately.
2. Or edit `content/editors/index.json` in GitHub and merge; the next build re-indexes it.
3. Removal does not kill an open session (up to 8 hours). For an immediate lockout rotate
   `NEXTAUTH_SECRET`.
4. Lockout recovery (someone deleted every valid email): fix `content/editors/index.json` in
   GitHub and redeploy.
5. The placeholder `replace-me@example.com` must be replaced before first use.

## 11. Credential rotation

| Credential | How | Effect |
|---|---|---|
| `NEXTAUTH_SECRET` | `openssl rand -base64 32`, update in Vercel, redeploy | signs every editor out (also the emergency revoke) |
| Google client secret | Console -> the OAuth client -> add a new secret, update `GOOGLE_CLIENT_SECRET`, redeploy, then disable the old secret | none if done in that order |
| GitHub PAT | create a new fine-grained token (same scope), update `GITHUB_PERSONAL_ACCESS_TOKEN`, redeploy, then delete the old one. It expires — track the date | expired/revoked token = saves fail with 401/403 from GitHub |
| Upstash token | reset in the Upstash console, update `KV_REST_API_*`, redeploy | index is rebuildable from git: if in doubt, flush the DB and redeploy |
| Google OAuth client ID | rarely; needs new redirect URIs registered first | |

Vercel does not apply env changes to running deployments; always redeploy.
Never commit real values: `.env` is gitignored, `.env.example` has placeholders only.

## 12. Divergences from the earlier attempt (`feature/migration`, 50129e7) and from CLAUDE.md assumptions

- Backend imports the generated `databaseClient`, not `tina/database.ts` (old code could not
  have authorized anyone).
- Auth.js served at `/api/tina/auth/*` (admin's hard-coded basePath); no `api/auth/[...nextauth]`.
- Auth collection must be `isAuthCollection` with a single uid-keyed list; the old
  free-form `tinaUsers` would have been ignored. Renamed `editors`, keyed on email.
- `namespace` now passed to `createDatabase` (current CLI template) instead of `RedisLevel`.
- `media.tina` cannot work in production (section 8).
- Google instead of GitHub (per CLAUDE.md). Commit attribution added (section 3).
- No Alpine, no `@astrojs/mdx`, no `next-auth` "pages-style route", no landingPages/blocks/
  routes/dayInLife/FAQ/legal (out of scope now).
- `tsconfig.json` excludes `tina/collections|shared|config.ts` from `astro check` (Tina's own
  guidance: its literal-typed field unions are noisy); `tinacms build` validates them.
