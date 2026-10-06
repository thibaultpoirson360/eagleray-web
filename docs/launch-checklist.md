# Launch checklist — Eagle Ray Expeditions (Astro + Tina site)

**First check:** 26 September 2026 (QA agent, full pass). **Fixes and re-check:** 26 September 2026, same day — every fix below was re-tested on a fresh build.
**What was checked:** the site as it would ship: `main` (43452f8, translation PR #4 merged) plus the fixes made after the first check (uncommitted at the time of writing).
**Written for:** the site owner. Technical detail is kept in the "where" parts so a developer can act on it.

---

## Verdict: NOT READY for DNS cutover — the engineering work is done; decisions and real-device checks remain

Every problem the QA pass found that a developer can fix has been fixed and re-tested (list below). **What is left cannot be closed from a laptop.** Two kinds of things remain:

* **Six decisions only the owner can make** (which web address, analytics, which unfinished pages go live, whether Spanish/French go live now, the Mogu trip, the legal text). Section "Still open — decisions".
* **Checks that need a real device, browser or account** (Safari, Firefox, a real phone's autofill, a real Formspree form for tab-close capture, the Vercel/Google settings for the final domain). Section "Still open — checks that need a person".

So this checklist is **not** "entirely green", and it would be untrue to say it is. What is green has evidence next to it.

---

## Summary table

| # | Item | First check | Now | Evidence (after the fixes) |
|---|------|-------------|-----|----------------------------|
| 1 | Build succeeds cleanly | PASS (caveat) | **PASS** (caveat) | `astro build` exit 0, only the known harmless warning. `astro check`: 65 files, **0 errors, 0 warnings, 0 hints** (the old hint is gone). The real Vercel command `npm run build` needs cloud credentials and was not run here. |
| 2 | Three languages are real, separate, indexable pages | PASS | **PASS** | 63 HTML files: 19 pages × 3 languages, plus 404, the root stub, the editor shell and the 3 legal pages. Same 19 routes in each language, correct `<html lang>`, no client-side text swapping. |
| 3 | hreflang correct on every page | PASS (tags) | **PASS** (tags) — one open decision | 33 of 33 indexable pages list en, es, fr and x-default as absolute URLs and every sibling file exists. The www / no-www question (decision 1) is still open. |
| 4 | Sitemap includes all locales | FAIL | **FIXED** | `/sitemap.xml` (33 URLs = 11 page types × 3 languages, each with its language alternates; well-formed; every URL's file exists in the build) and `/robots.txt` (allows the site, keeps crawlers out of `/admin`, `/api/`, `/tina-island/`, points at the sitemap). Submitting it in Search Console is a manual step after launch. |
| 5 | Content parity | FAIL | **BLOCKED — needs decisions** | Structure parity is perfect (40 EN / 40 ES / 40 FR documents, 0 schema problems). Fixed: the three legal pages are served again (interim, see below); the original human SEO copy is back for the home page in all 3 languages; the translation errors the QA found are corrected through a new translation memory (111 Spanish / 109 French approved strings). Still open: legal text approval, unreviewed machine translations, and content the new home page does not have compared with the live one (decisions 3, 4, 6). |
| 6 | Accessibility regressions | FAIL (moderate) | **FIXED** | axe-core, 44 scans (8 page types × languages × desktop/phone): **0 real violations.** 43 scans are clean; the 44th flags a "progress saved" badge caught mid-fade (see "Known/accepted"). Before: colour contrast in 44 of 44 scans, 4 other rules. Reduced-motion and no-JS fallbacks survived. |
| 7 | Funnel works end to end in EN/ES/FR | FAIL | **PASS** (automated) — 2 checks need a human | **49 of 49 scripted checks pass in each language**, including autofill of several fields at once (was the bug), autosave/restore, validation, blur capture, tab-close capture, final submit and the WhatsApp message. Not verifiable here: tab-close capture against the *real* Formspree, and a real autofill on a phone. |
| 8 | Analytics (GA4 + Meta Pixel) | FAIL | **OPEN — decision 2** | No tracker exists in the new site *or* on today's live site. Nothing was added: adding tracking is an owner decision (consent banner + privacy policy). IDs from git history are in the appendix. |
| 9 | Cross-browser / device smoke test | FAIL + not verifiable | **PASS on Chrome** — Safari/Firefox not verifiable | Chrome desktop 1440, tablet 768 and phone 390 on 22 pages: **66 of 66 layout checks OK** — no sideways overflow, nothing under the fixed menu. The Spanish phone overflow is fixed (checked at 390, 375, 360 and 320 px in EN/ES/FR). Safari, Firefox and real phones: a person must test. |
| 10 | Mogu embed on a real trip | PASS (caveats) | **PASS** — one decision | Real trip `numerous-manchester-15970` renders and scrolls, and Mogu allows framing. Now also tested end to end through the site on a scratch page: a slug pasted with `?embed=true&hideLogo=true` produces the correct URL. The editor-side check that rejects a bad slug was written but not exercised in the editor's own screen. Whether that trip should be public is decision 5. |
| 11 | Meta / SEO per page | FAIL | **FIXED** | 33 of 33 indexable pages have a unique title, a description, share tags (Open Graph + Twitter card with image), favicon, theme colour, self-canonical and hreflang. The home page uses the original, human-written title and description in EN/ES/FR. The hero image is preloaded again. |
| 12 | 404, redirects, old URLs | FAIL | **FIXED in configuration** — verify after deploy | `vercel.json` now redirects `/` and `/index.html` to `/en/` (307). The three legal pages answer at their old addresses. `/404.html` is `noindex` and served with status 404. Redirects are a Vercel behaviour and can only be confirmed on a real deployment. |
| 13 | Security / headers / secrets | PASS | **PASS** | Re-scanned the new build: no secret value present (only variable *names* inside server-side code, as before). `robots.txt` now disallows `/admin`. |
| 14 | Deploy / cutover readiness | Not verifiable | **NOT VERIFIABLE HERE** | Human checklist below (Vercel Production variables, Google redirect address, secrets, domain move). |
| 15 | Images / performance | PASS (recommendations) | **PASS** (recommendations) | Hero preload restored. Still recommended: compress `crew-benji.jpeg` (811 KB) and consider a lighter hero video (5.7 MB). |

Numbers behind the table: 33 indexable pages checked for tags; 2,330-link crawl re-run: **0 broken internal links and 0 dead in-page anchors** (was: 3 missing legal pages, 113 dead "Go Sailing" anchors, 1 dead button); 44 axe scans; 66 layout checks; funnel 3 languages × 49 checks; all run against a fresh build of the final code.

---

## What was fixed (and how each fix was verified)

| Problem found | Fix | Verified by |
|---|---|---|
| Legal pages (`/terms.html`, `/privacy.html`, `/creditos.html`) missing from the new site | Copied, with their few dependencies, into `public/` so the same addresses keep working (interim — see decision 6). | Files present in the build; link crawl finds 0 broken internal links. |
| Spanish home page too wide on phones | Buttons may wrap below `sm` (`Button.astro`). This deviates from one line of docs/migration-history.md's locked button mapping on purpose; from `sm` up it is unchanged. | Sideways scroll = 0 at 390/375/360/320 px in EN/ES/FR; 66 layout checks OK. |
| No sitemap / robots.txt | Generated `sitemap.xml` (with language alternates) and `robots.txt`. | Sitemap parsed, 33 URLs, all files exist. |
| No page descriptions, share tags, favicon, home title | `BaseLayout` prints description, Open Graph, Twitter card, favicon, theme colour; every page type feeds it (Tina "Search results & sharing" fields with sensible fallbacks); the home page's original human copy restored. | 33/33 indexable pages pass a tag check. |
| `/` was a 2-second "Redirecting…" page with status 200 | `vercel.json` redirects. | Configuration only — confirm after deploy. |
| "Go Sailing" button and landing buttons did nothing on every page but the home page (113 dead anchors) | `#customize` now resolves to `/<language>/#customize` where it is used away from the home page (`src/lib/links.ts`). Also: the dead "See the wildlife calendar" button (its link was `#`) is no longer drawn until it has a real link. | Crawl: 0 dead anchors; scratch page check. |
| Autofill wiped fields in the customize form | The form's saved copy is updated immediately, not after the redraw (`FunnelForm.tsx`). | Reproduction test now keeps all three fields, and the saved draft agrees. |
| Tab-close capture could be blocked by the browser | The tab-close request is sent form-encoded (a "simple" request, no browser pre-check) instead of JSON. The blur path is unchanged. | Test: exactly one request, type "Ping", form-encoded, **0 pre-checks**. Whether real Formspree accepts it still needs the human test below. |
| Skip link dropped | Re-added as the first tab stop (translatable, in *Site Navigation*). | Keyboard test: it is the first thing Tab reaches. |
| Closed phone menu reachable with Tab on desktop | Marked `inert` while closed. | axe: `aria-hidden-focus` gone; keyboard test. |
| Dropdown pages invisible without JavaScript (6 of 8 menu pages had no link in the HTML) | The dropdown links are always in the page's HTML (hidden until opened; open on hover with JS off). | All 8 menu pages are linked from the static home and contact HTML. |
| Landing pages had no `<h1>` | The first hero block is the `<h1>`; otherwise a hidden `<h1>` with the page title. | axe: `page-has-heading-one` gone. |
| Scrolling boxes and sliders unreachable by keyboard | `tabindex`, `role="group"` and a name on the crew text boxes, boats slider, wildlife gallery, landing gallery. | axe: `scrollable-region-focusable` gone. |
| Heading order (footer labels, blog "More from…") | Footer column labels are no longer headings; blog headings h1 → h2 → h3. | axe: `heading-order` gone. |
| Grey text below the required contrast (176 elements, 3.4–3.9:1) | The muted text colour is now 64% ink instead of 52% (and the extra fades on the footer legal line and the optional-field hint were removed): 5.2:1 on white, 5.1:1 on the cream cards. **This is a small, deliberate design change** — revert by changing `ink/64` back to `ink/52` in the source. | axe: colour contrast 0 real findings. |
| Placeholder title-only menu pages could be indexed | They are `noindex` and left out of the sitemap. | Built HTML; sitemap has none of them. |
| Mogu slug field accepted junk | Editor-side validation (not exercised in the editor screen); the component also cuts anything after the code; optional "hide logo / hide title" switches added. | Scratch page: URL exactly `…/trips/<code>?embed=true`, and `&hideLogo=true&hideTitle=true` when the switches are on. |
| DeepL drafts wrong in short interface texts (e.g. "Retoma la lectura…", "Axe routier", "Bali 4,4", "vosotros", "Salut Thibault", "Charter trips") | A **translation memory** (`scripts/translation-memory.json`): approved human wording, taken from the original site's dictionary, that DeepL can no longer overwrite; applied to the existing Spanish and French files. Documented in `docs/translation-workflow.md`. | The 10 example strings from the first report are gone from every ES/FR file; every file's structure is unchanged. |
| Typos in the English crew intro ("things:how", "don't.Read", "chartercompanies", "it..") | Fixed. | — |
| Untranslated depth-gauge label "Anchorage" | Approved translations (Fondeadero / Mouillage) in the memory. | Gone from ES/FR files. |

Also written this session: **`AGENTS.md`** at the repo root (rules and component library for Thibault and his AI assistant).

---

## Still open — decisions for the owner

1. **Which web address is the real one:** `eaglerayexpeditions.com` or `www.eaglerayexpeditions.com`? The live site today redirects the bare domain to `www`; the new site is built for the bare domain (`site` in `astro.config.mjs`, so every canonical, language tag and the sitemap use it). Search engines ignore language tags that point at an address that redirects. **Recommendation:** keep `www` (it is what search engines and old links already know): change `site` to `https://www.eaglerayexpeditions.com`, and in Vercel make `www` primary with the bare domain redirecting to it.
2. **Analytics: track visitors or not?** Neither the live site nor the new one has any tracker. Git history shows Google Analytics 4 (`G-P589SNMK34`) and the Meta Pixel (`1793759511973118`) were live for three days (7–10 Sept) and removed. If tracking returns, visitors in Europe need a consent banner and the privacy policy (which now says "no analytics trackers or third-party pixels") must be updated.
3. **Which pages go live.** Still on the site as unfinished content: the eight one-line menu pages (now hidden from search engines, but still in the menu), the "Landing Page Sample" (visible text is developer notes: "A scaffold hero block exercising every field…"), three identical "Bay Dreamer" boat cards, photos described as "Wildlife placeholder", and a crew intro paragraph that appears twice (above and below the crew slider). The new home page is also a smaller page than the live one: no routes, day aboard, activities, FAQ, fleet details or final call-to-action (`docs/migration-history.md` deferred them). Publish as is, hide the empty pages from the menu, or finish first?
4. **Are Spanish and French going live now?** They are machine drafts (better since the translation memory, but unreviewed): the interface texts I added this session (crew cards, blog labels, "skip to content") are DeepL drafts too. **Recommendation:** have a native Spanish (Mexico) and French reader go through the customize form, the WhatsApp labels, the footer, and the hero/difference sections **before** setting `PUBLIC_LIVE_LOCALES=en,es,fr` on Production. If not ready, leave it unset (English only) and launch the languages later.
5. **The Mogu trip.** `numerous-manchester-15970` is titled "… copy", is written in French, and shows a named client ("Expédition Ingrid") and a price (USD $6,800). Is it meant to be public?
6. **Legal text.** The three legal pages are the old pages, served as-is until they are rebuilt as editable pages (a separate deliverable in `docs/migration-history.md`). They are English-only apart from a script that swaps the wording in the browser; the terms page still shows a visible "working draft — final wording is pending review" note; the privacy policy says there are no trackers (see decision 2) and gives the address `hello@eagleray.expedition`, not `thibault@eaglerayexpeditions.com`. Approve or correct the text before launch.

## Still open — checks that need a person, a real device or a real account

* **Tab-close lead capture against real Formspree.** On a throw-away Formspree form: type a valid e-mail on the customize form's last step, close the tab, see whether the submission arrives. If it does not, tell a developer (the alternative is `fetch` with `keepalive`).
* **Real autofill** on the customize form's last step in Chrome desktop and on an iPhone (the fix was proven with simulated autofill).
* **Safari (Mac and iPhone), Firefox, a real Android phone.** Look at: the frosted menu bar, the crew pop-up (`<dialog>`), heights on iPhone as the browser toolbar moves, the swipe rows (crew, boats, wildlife), the flag emoji on crew cards, hero video autoplay, date pickers in the customize form. Tailwind 4 needs Safari 16.4 or newer.
* **A native read-through** of Spanish (Mexico) and French (decision 4).
* **Vercel Production settings** (redeploy after changing): `PUBLIC_LIVE_LOCALES=en,es,fr`; `TINA_PUBLIC_IS_LOCAL` unset; `GITHUB_OWNER`, `GITHUB_REPO`, `GITHUB_PERSONAL_ACCESS_TOKEN`; `KV_REST_API_URL`, `KV_REST_API_TOKEN`; `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXTAUTH_SECRET`; **`NEXTAUTH_URL` = `https://<final domain>/api/tina/auth`** (the local `.env` still points at the test host); `CLOUDINARY_*`.
* **Google Cloud Console:** add `https://<final domain>/api/tina/auth/callback/google` as an authorised redirect address.
* **GitHub:** the `DEEPL_API_KEY` secret is set; run the translation workflow once after these changes are merged (they touch English content, so it will open a translation pull request on `staging` by itself).
* **Move the domain** to the Vercel project; set `site` in `astro.config.mjs` to match decision 1.
* **After the first production deploy:** open `/admin/index.html`, sign in, make one edit; check `/`, `/terms.html`, `/privacy.html`, `/creditos.html`, and a made-up address (must show the 404 page with status 404); check the redirect `/` → `/en/`.
* **After launch:** add the property in Search Console and submit `/sitemap.xml`; lower the DNS TTL beforehand and keep the old deployment to roll back to.

## Known and accepted

* **A "progress saved" badge on the customize form** is reported once by axe (mobile, French home) because it was scanned halfway through its fade-out (its text is full-contrast ink; the fade lowers the measured colour). Nothing to fix.
* **No global focus outline / text-selection colour** from the original stylesheet were re-added. Every focusable control on screen still shows a focus ring (the browser's default or the component's own) — low severity, not a launch blocker.
* **The customize form cannot be submitted without JavaScript** (no submit button, no form action). Documented in `Funnel.astro` as a gap carried over from the original site; the WhatsApp link still works.
* **The 404 page is English-only** (one page for every address; the host cannot choose a language).
* **Switching language halfway through the customize form** keeps the saved answers but leaves the option buttons unselected (option values are translated per language). Low severity.

---

## How this was checked (and its limits)

* **Build:** `PUBLIC_LIVE_LOCALES=en,es,fr TINA_PUBLIC_IS_LOCAL=true npx astro build` with Tina's local data server running. Output: `.vercel/output/static`.
* **Behaviour tests** (funnel, accessibility, motion, no-JS, keyboard, layout, links) run against that built output, served by a small local file server and driven with Chrome 153 (headless) through the DevTools protocol. This is not Vercel: redirects and the 404 status are Vercel behaviours, read from configuration.
* **Nothing was sent to real people.** Requests to Formspree and WhatsApp were intercepted and answered with fake replies.
* **Only Chrome** could be run.
* The scratch scripts and results are outside the repo: `/private/tmp/claude-501/-Users-kinich-barcelo-Documents-eagle-eagleray-web/a3c7cd1e-fdad-494c-bcbb-aeabed6e5bc4/scratchpad/qa/`.

---

# Appendix — the original QA findings (as first reported, before the fixes)

> The first check's per-item detail is kept below for the evidence it contains (exact pages, numbers, the analytics history, the translation examples, the Mogu trip details). Where it says FAIL or "expected", read it together with the table above: items marked FIXED there were repaired afterwards. The "suggested fix order" and the old to-do lists were dropped because they are superseded by the sections above.

# Details for every failed or unverifiable item

Each block says: **where**, **what I saw**, **why it matters**, **smallest fix**, **who**.

## Item 1 — Build (PASS, with caveats)

* `npx astro build`: exit 0, about 9 seconds. The only warning is the known harmless one ("Could not render `` from route `/` as it conflicts with higher priority route `/`"). Nothing else.
* `npx astro check`: 62 files, 0 errors, 0 warnings, 1 hint — the known one: `src/components/LandingPageView.astro:28`, `tinaField` is imported but never used.
* Caveat: the command Vercel actually runs is `npm run build` (`tinacms build --skip-cloud-checks && node scripts/patch-tina-generated.mjs && astro build`). It needs the GitHub/Redis credentials, so it was not run here. The test deployment `ere.kbdreams.com` shows this pipeline works on Vercel today.

## Item 2 — Real, separate, indexable locales (PASS)

* The same 19 pages exist in `/en/`, `/es/` and `/fr/`: home, contact, blog list, 6 blog posts, landing sample, passionate-sea-people, and 8 menu placeholder pages (our-story, the-eagle-ray-experience, our-travelers-experience, recalibration-expedition, active-expedition, ad-hoc-expedition, la-paz, boats).
* Text really is in each language in the HTML file itself. Test: I took the 197 English text strings from the content files and looked for them in every built ES and FR page — 0 found (apart from words that are identical by design). ES/FR button labels and accessible names (`aria-label`) are localized. No `data-i18n` or in-browser dictionary exists anywhere in the build. With JavaScript switched off the Spanish home page still shows Spanish text (6,186 characters).
* `<html lang>` is correct on all 57 pages. No `noindex` on any of them. Each has one canonical pointing at itself.
* Note: `/index.html` (the site root) is a redirect stub and is `noindex`; `/404.html` is `noindex`. Both are intended.

## Item 3 — hreflang (PASS on tags; see host mismatch)

* All 57 locale pages carry four tags: `en`, `es`, `fr`, `x-default` (= the English page), all absolute `https://eaglerayexpeditions.com/...`, and every target file exists in the build. 404 has none.
* **Caveat (important):** the live site at `https://eaglerayexpeditions.com/` answers with a **308 redirect to `https://www.eaglerayexpeditions.com/`**. If the new site is put on the same setup, all 57 canonicals and 228 hreflang tags point at an address that redirects. Google ignores language tags that point at redirecting URLs. Fix: decide the one true address. Either make the bare domain primary (and redirect `www` to it), or change `site:` in `astro.config.mjs` to the www address. Then re-deploy. **Who:** owner decides, developer/Vercel admin sets it.

## Item 4 — Sitemap (FAIL)

* **Where:** nowhere. `.vercel/output/static` has no `sitemap*.xml` and no `robots.txt`; `package.json` has no sitemap plugin; `astro.config.mjs` has no sitemap setup; `public/` has neither file. The deployed test site (`ere.kbdreams.com`) also returns 404 for both. The live old site returns 404 for both as well, so nothing is being lost, but nothing is being gained either.
* **Why it matters:** with three languages and 57 pages, a sitemap with language alternates is the main way to get all three versions indexed. It matters more here because 6 of the 8 menu sub-pages are not linked from any page's HTML (see item 6), so crawlers cannot find them any other way.
* **Smallest fix:** add the `@astrojs/sitemap` integration with its `i18n` option (`defaultLocale: 'en'`, locales `en-US`, `es-MX`, `fr-FR`), exclude the sample landing page and 404, and add `public/robots.txt` with a `Sitemap:` line (and, if wanted, `Disallow: /admin` and `/api/`). After launch, submit the sitemap in Google Search Console. **Who:** developer.
* robots.txt state: does not exist. So nothing tells crawlers to stay out of `/admin/index.html` (the login shell has no `noindex` either).

## Item 5 — Content parity (FAIL)

**(a) Structure — PASS.** 123 content files: 40 English documents, each with an ES and an FR twin (80), plus 3 language-neutral files (`settings`, `editors`, `notFoundPage`). Every ES/FR file has exactly the same keys, list lengths and types as its English source; no key outside the current Tina schema (`tina/collections/*.ts`), no missing required field, no orphan translation.

**(b) Still-English text — PASS with 2 small leftovers.** 790 translatable strings compared (395 per language); 57 of them (both languages together) are identical to English. Almost all are correct as-is (numbers "01/02/03/07/09", place names, boat names, "Blog", "Chef", "PADI OWSI", "STCW", "Silver Chef/Gold Chef" — the original site kept those two in English too). Real leftovers:
* `content/difference/es.json` and `fr.json`: `depth.name` = "Anchorage" is still English (the original said "Fondeadero" / "Mouillage"). It is the label shown on the desktop depth gauge at the first section.
* ES/FR funnel e-mail placeholder is `you@email.com` (original ES: `tu@correo.com`).
* Also noticed in the English source itself: the crew intro text has typos, "two things:how" and "We don't.Read their profiles" (`content/crewSection/en.json`, `intro`), and the same paragraph is shown twice on the home page (once above the slider from `intro`, once below from `rolesIntro`).

**(c) Compared with the ORIGINAL site (`lib/i18n.js`, human-written, 273 strings per language).**

*What the migration dropped or never carried over:*
* **SEO copy** (`meta.title`, `meta.description`, `ogTitle`, `ogDescription`) in all 3 languages — there is no place for it in the new schema (item 11).
* **The three legal documents** (terms, privacy, photo credits) and their text (`legal.*`, `credits.*`) — not built (item 5d).
* **The "final call-to-action" section** ("Your Baja expedition starts with a conversation…") and the footer lines "Also based in London · Barcelona · Lisbon" and the Instagram follow label (`finalCta`, `footer.alsoIn*`).
* **Deliberately postponed by `docs/migration-history.md`, but present on today's live page:** routes (3 route cards), "a day aboard", activities, FAQ, the wildlife species selector, the four-fact hero strip (departure / group size / duration / itinerary), and the detailed fleet (specs and included / not-included lists for the boats). The new home page is a smaller page than the live one. Owner should confirm that is intended.
* **Boats:** the content has three identical "Bay Dreamer" placeholder entries. The two boats the funnel talks about (Bali 4.4, Astrea 42) and the other fleet boats are not there.
* Crew "Joining Q4 2026" status survived as a real field (`joiningTag`) on Javier and Flavia, matching the live site (the brief said Javier and Lou; the live site shows Javier and Flavia, and the content matches the live site).
* The migration report the brief refers to (`docs/content-migration-report.md`, from the `content-migrator` agent) **does not exist in the repo**, so I could not cross-check against "what it flagged as missing". The comparison above was done directly against `lib/i18n.js` instead.

*How the current ES/FR (DeepL machine drafts) differ from the original human ES/FR.* Of 124 strings that can be matched one-to-one, 51 (ES) and 49 (FR) are the same as the human text (ignoring capital letters and punctuation); the rest differ. Long marketing prose is mostly fluent and close in meaning. **Short interface texts are where the drafts go wrong**, and those are the texts in the customize form and the WhatsApp message. Examples:

| # | English | Original (human) | Current draft (DeepL) | Judgement |
|---|---------|------------------|-----------------------|-----------|
| 1 | "✓ Picking up where you left off" (form draft restored) | ES "✓ Continuamos donde lo dejaste" | ES "✓ Retoma la lectura donde la dejaste" | **Wrong** — "resume reading"; it is a form, not an article |
| 2 | same (FR) | "✓ Reprise là où vous en étiez" | "✓ Reprendre là où vous vous êtes arrêté" | Awkward (infinitive) |
| 3 | "…diving level…" (notes hint) | ES "nivel de buceo" / FR "niveau de plongée" | ES "profundidad de inmersión" / FR "profondeur de plongée" | **Wrong** — "diving depth" |
| 4 | "Route focus" (WhatsApp label and recap chip) | FR "Itinéraire souhaité" | FR "Axe routier" | **Wrong** — "road axis"; appears in Thibault's WhatsApp text |
| 5 | "How many of you will be aboard?" | ES "¿Cuántos irán a bordo?" | ES "¿Cuántos de vosotros iréis a bordo?" | Spain-only "vosotros"; the audience/`og:locale` is Mexico (es_MX) |
| 6 | FR funnel questions | all "vous" | 3 questions use "tu" ("envisages-tu", "Si tu pouvais…", "Tu as une préférence…") next to "vous" elsewhere | Inconsistent register |
| 7 | "Charter trips" (comparison column title) | ES "Charters tradicionales" / FR "Location classique" | ES "Viajes en barco de alquiler" / FR "Croisières à la demande" | FR changes the meaning ("on-demand cruises") in the site's key comparison |
| 8 | "Where we sail" (section label) | FR "Où nous naviguons" | FR "Nos destinations" | Meaning drift |
| 9 | "Real crew" (hero subtitle) | FR "Un vrai équipage" | FR "Une équipe à taille humaine" | Meaning drift |
| 10 | "Privacy Policy" (footer) | ES "Aviso de Privacidad" | ES "Política de privacidad" | In Mexico the legal term is "Aviso de Privacidad" |
| 11 | Boat name "Bali 4.4" | "Bali 4.4" | ES "Bali 4,4" | Product name corrupted (decimal comma); goes into the WhatsApp message |
| 12 | "from {date}" (dates line when only a start date is given) | ES "desde" / FR "à partir du" | ES "de" / FR "de" | Reads "Fechas: de 2026-12-01" |
| 13 | WhatsApp greeting | FR "Bonjour Thibault !" | FR "Salut Thibault !" | Too casual for a first message from a customer |
| 14 | "Joining Q4 2026" | ES "Se incorporan en Q4 2026" | FR "Entrée en fonction au quatrième trimestre 2026" / ES "Se incorporará en el cuarto trimestre de 2026" | Long enough that on phones it stretches the crew card (item 9) |
| 15 | crew slider dot label "Go to crew member 1" | — | FR "Aller à la page « Membre d'équipage » 1" | Screen readers hear nonsense |

**Judgement:** as a first draft this is fine and saves time, but it is a **quality regression against the human text for the form and WhatsApp strings**, and it has not gone through the human review step described in `docs/translation-workflow.md` ("A human reviews… then merges"). Do not switch ES/FR on for the public until a native reviewer has gone through at least the funnel, the WhatsApp message labels, the footer/legal labels and the hero/difference sections. Who: owner (or a native Spanish [Mexico] and French reviewer), editing in Tina.

**(d) Legal pages and broken links — FAIL.** Crawl of 59 built pages, 2,330 links/images/scripts/styles:

* **Broken (file missing in the build):** `/terms.html`, `/privacy.html`, `/creditos.html` — each linked from 58 pages (the footer). They live only at the repo root (`terms.html`, `privacy.html`, `creditos.html`), which is not part of the Astro build, and they are not in `public/`. Live today: all three return 200.
* **Dead in-page links:** `#customize` (the nav "Go Sailing" button, desktop and phone-menu copy) exists in the header of every page but the target only exists on the home page: **113 dead anchor links on 55 pages** (110 from the two nav buttons on each non-home page + 3 landing-page buttons). Visitors click and nothing happens. Fix: make the navigation link `/{locale}/#customize` (content `content/navigation/*.json` → `cta.href`, or have `Nav.astro` prefix the locale when not on the home page). Who: developer.
* **Other dead links:** the home page "See the wildlife calendar →" button has `href="#"` (all 3 languages; `content/wildlife/*.json`, `cta.href`).
* **Images, CSS, JS and fonts:** 0 broken references.
* **Smallest fix for the legal pages:** put the three pages into the site (as Tina pages, or copy the three files into `public/`). If you copy them into `public/`, first read them: the old privacy policy says the site uses no analytics or pixels (item 8) and gives the e-mail `hello@eagleray.expedition`, not the site's `thibault@eaglerayexpeditions.com`. They are also English-only in the new locales unless translated. **Who:** developer to publish, owner to approve text.

## Item 6 — Accessibility (FAIL, moderate)

**(a) Automated scan (axe-core 4.13.0, 22 pages x desktop 1440 and phone 390 = 44 scans).** Results by rule:

| Rule | Impact | Scans affected | Where | New or old? |
|------|--------|----------------|-------|-------------|
| color-contrast | serious | 44 of 44 (about 1,000 elements) | Grey helper text (`text-ink/52` = #828891 on white = 3.57:1, needs 4.5:1), grey nav text on the solid nav (3.38:1), grey text on the cream cards (3.49:1), the depth-gauge label | **Old.** The original home page had the same problem (41 elements) — it comes from the design colours, not the migration |
| aria-hidden-focus | serious | 39 of 44 | `#nav-mobile` (the full-screen phone menu) is `aria-hidden` but its links can still be reached with Tab, even on desktop (7 invisible tab stops after "Go Sailing") | Same behaviour existed on the original (I confirmed it tabs into the hidden menu there too); still worth fixing |
| scrollable-region-focusable | serious | 15 of 44 | `.boats-grid` (home), wildlife gallery (phone), landing gallery (phone), and **`.crew-full-text` x 10–11 on the Passionate Sea People page** (scrolling text boxes a keyboard user cannot reach) | Home ones existed before (2 on the original); the crew page ones are **new** |
| heading-order | moderate | 32 of 44 | Footer `h4` ("Base") follows an h2 or nothing | Same as the original home (1) |
| page-has-heading-one | moderate | 6 of 44 (all 3 landing pages, both sizes) | `src/components/LandingPageView.astro` lines 39–40: the page's `<h1>` is inside an HTML comment | **New** |

(The original home page also had one *critical* "form control without a label" violation; the new home page does not.)

**(b) `prefers-reduced-motion` — PASS, survived.** With "reduce" switched on: the hero video is hidden and the still image is shown with **no zoom animation** (the original kept an endless zoom running under reduce, so this is better); the pulsing dots and the scroll cue stop; the funnel success scroll uses instant scrolling; slider dots use instant scrolling. Fade-in-on-scroll blocks still fade (the original did too) but none stays hidden: after scrolling the whole page 21 of 21 are visible. Not affected in either version (so not regressions): the pointer-tilt / magnetic-button effects and the one-time text entrance animation do not check the setting. One small difference: the new site no longer sets smooth scrolling for anchor links (`scroll-behavior` is `auto`; the original was `smooth` when motion is allowed) — a cosmetic change, not an accessibility one.

**(c) No JavaScript — mostly PASS.** With scripts disabled: the "js" marker is absent so the fallbacks apply; all 21 fade-in blocks are visible; the customize form shows all four steps at once; pages are not blank (home text 5,000–6,600 characters per language); desktop menu items are visible; the phone hamburger is visible but of course does nothing; crew "Meet X" links are plain links to the crew page (by reading the code; not clicked without JS). Problems:
* **The customize form cannot be submitted without JavaScript** (no submit button visible, no `<form action>`). `Funnel.astro` documents this as a known gap carried over from the original. The WhatsApp "prefer to skip this?" link still works.
* **The two menu dropdowns ("About Us", "Sail with Us") are `<button>`s that need JavaScript**, and their links are only drawn after a click. That means **6 of the 8 menu pages** (our-story, the-eagle-ray-experience, our-travelers-experience, recalibration-expedition, active-expedition, ad-hoc-expedition) have **no link anywhere in any page's HTML** (I searched the home and contact pages). Visitors without JavaScript, and search engines that do not click buttons, cannot find them. In the original the menu items were plain links. Fix: render the dropdown items in the HTML (hide them with CSS, reveal on click) so the links always exist. Who: developer.
* The contact form also has no non-JS fallback (by reading the code: its `<form>` has no `action`; not exercised with scripts off).

**(d) Keyboard.**
* **Skip link — regression, confirmed.** The original had "Skip to content" as the first tab stop. The new site has none (first tab stop is the logo). A `<main id="main">` exists, so the skip target is ready. Fix: re-add the link in `BaseLayout.astro`.
* Global `:focus-visible` outline and `::selection` styling from `styles.css` (lines 159–166) were never ported (`src/styles/global.css` contains neither) — confirmed. **Severity: low.** In Chrome every visible focusable control on the home page still shows a ring (the browser's default blue ring, or the custom ring some components define): 92 focusable elements were tested by focusing each one, and the only ones without an outline were elements that are not on screen at that moment (fields on funnel steps 2–4, Close buttons inside closed crew dialogs, the hamburger button that is hidden on desktop, one hidden link). The look differs from the brand's 2px ink ring, and Safari/Firefox were not checked.
* Language switcher: PASS. Enter opens it, Tab moves into the three languages, Escape closes it and returns focus to the button, Enter on "Español" goes to `/es/contact/`. The menu is marked as an ARIA `menu` but arrow keys do nothing (minor).
* Menu dropdown ("About Us"): opens with Enter, Escape closes and returns focus; it does not close when you Tab away (minor).
* Crew modal: PASS. Enter on "Meet Thibault →" opens a real dialog, focus moves to its Close button, Escape closes it, focus returns to "Meet Thibault →", page scroll is locked and released. It fits the screen: 480x689 on desktop 1440x900, 352x593 on a 390x844 phone.
* Phone menu: PASS. Toggle with Enter, Escape closes it, page scroll is locked and released.

**Smallest fixes for item 6:** re-add the skip link; render dropdown links in HTML; put `inert` (or `visibility:hidden`) on the closed `#nav-mobile`; give the `.crew-full-text` boxes `tabindex="0"` (or stop them scrolling); un-comment the landing page `<h1>`; raise the grey text opacity from 52% to about 65% (a design decision). **Who:** developer; the grey-text change needs the owner/designer.


## Item 7 — The customize form, end to end (FAIL: 1 real bug, 1 unverifiable)

**What was run, in each of EN, ES and FR (49 checks per language, all passing except where noted below).** Built output, Chrome, Formspree/WhatsApp answered by fakes:

| Scenario | Result |
|----------|--------|
| Draft autosave and restore | Every change is saved to the browser under `eagleRayFunnelDraft` (step + 13 fields). Reload → back on step 4 with text, dates, guest count and every option restored, plus the "restored" badge in the visitor's language. |
| Validation | Submitting with an empty name/email shows both error messages (localized) and sends nothing. "abc" and "abc@x" keep the error, "abc@x.com" clears it; typing a name clears the name error. |
| Step navigation | Continue/Back work; Enter on steps 1–3 moves forward; the step counter and progress bar update; the guest counter stops at 2 and 10. |
| Partial-lead capture, **blur path** | Typing a valid e-mail and leaving the field sends **exactly one** `POST` to `siteSettings.leadEndpoint` (`https://formspree.io/f/xwlearnw`) with `_status: "partial : reached contact step, did not submit"`. Leaving the field again, or the page being hidden afterwards, does not send it again. A later final submit still sends "complete" (2 requests in total, as designed). |
| Partial-lead capture, **tab-close path** | With a valid e-mail typed and the cursor still in the field, the page becoming hidden sends **exactly one** `sendBeacon` (recorded as request type "Ping", `application/json`) with `_status: "partial : tab closed after entering email"`. Repeating the hide, or blurring afterwards, sends nothing more. The page-hidden event was simulated (the real `navigator.sendBeacon` ran). With a *real* tab switch, the e-mail field loses focus first, so the normal blur request goes out instead (1 request in each language) — the beacon then does not need to. See caveat 7.2. |
| No contact info | Untouched form hidden: nothing sent. Name but no e-mail: nothing. Invalid e-mail (`foo@bar`) on blur or hide: nothing. |
| Final submission | One `POST` with `_status: "complete"` and all answers; success message "Received — thank you, María Núñez." (localized); draft removed from the browser; nothing sent afterwards when the page is hidden. |
| Server failure | Endpoint answers 500 → localized error message, button usable again, draft kept. |
| Contact page form (`/<locale>/contact/`) | Posts `{name, email, howFound, message, _subject}` to the same endpoint; success message shown in all 3 languages; autofilling 3 fields at once keeps all 3 (this form is not affected by bug 7.1). |

**Request field names.** The lead request uses the **original site's short field names**: `days, who, guests, route, priority, dates, boat, name, email, whatsapp, notes, _status` — not the English names from the rename table in `docs/migration-history.md` (`tripDuration`, `travelingAs`, …). That is a deliberate, documented choice in `src/components/FunnelForm.tsx` (it is what lands in Thibault's inbox, so his inbox rules keep working). The rename-table names are used for the form's own fields and for the saved draft. Confirm that Thibault's inbox/automation still expects the old short names.

**The generated WhatsApp messages** (link `https://wa.me/525568090942?text=…`; the number equals `siteSettings.contact.whatsapp`; opens in a new tab with `rel="noopener"`). Test answers: 10 days or more / Family / 4 guests / first route / last priority / dates 1–8 Dec 2026 + free text "early Dec" / first boat / name María Núñez / e-mail / phone / notes. Every label and every chosen option appears in each message:

English:
```
Hi Thibault! I'd like to customize an Eagle Ray expedition.

• Duration: 10 or more
• For: Family
• Guests: 4
• Route focus: Espíritu Santo — wildlife
• Top priority: A bit of everything
• Dates: 2026-12-01 → 2026-12-08 (early Dec)
• Boat: Bali 4.4

• Name: María Núñez
• Email: maria@example.test
• WhatsApp: +52 55 1234 5678
• Notes: Celebrating & "quotes" ñ
```

Spanish:
```
¡Hola, Thibault! Me gustaría personalizar una expedición de Eagle Ray.

• Duración: 10 o más
• Para: Familia
• Invitados: 4
• Enfoque en la ruta: Espíritu Santo — fauna silvestre
• Prioridad máxima: Un poco de todo
• Fechas: 2026-12-01 → 2026-12-08 (early Dec)
• Barco: Bali 4,4

• Nombre: María Núñez
• Correo electrónico: maria@example.test
• WhatsApp: +52 55 1234 5678
• Notas: Celebrating & "quotes" ñ
```

French:
```
Salut Thibault ! J'aimerais personnaliser une expédition Eagle Ray.

• Durée: 10 ou plus
• Pour: Famille
• Invités: 4
• Axe routier: Espíritu Santo — faune sauvage
• Priorité absolue: Un peu de tout
• Dates: 2026-12-01 → 2026-12-08 (early Dec)
• Bateau: Bali 4.4

• Nom: María Núñez
• E-mail: maria@example.test
• WhatsApp: +52 55 1234 5678
• Remarques: Celebrating & "quotes" ñ
```
(The "early Dec" and the notes are my typed test text. Note the wording problems in the ES/FR labels: "Bali 4,4" and "Axe routier" — see item 5c.)

**Findings**

* **7.1 — Autofill wipes fields (real bug, FAIL).** `src/components/FunnelForm.tsx`: `valuesRef.current` is only refreshed inside a `useEffect` (line 144), after the screen has been redrawn, but `updateField` (line 239) builds the next values from that stale copy. If several fields change in the same instant, only the last one survives. Reproduced by setting name, e-mail and phone and firing each field's `input` event in one go (this is how browser autofill and password managers fill a form): 800 ms later the name and e-mail were empty, only the phone stayed, and the saved draft agreed. A customer using Chrome/Safari autofill on step 4 (the normal way on a phone) would see two of their three fields vanish, and the partial-lead capture would not have their e-mail. **Fix:** in `updateField`, set `valuesRef.current = next` immediately (and in `goTo`), or use `setValues(prev => …)`. **Who:** developer. **Still needed:** one real autofill test on a phone and in desktop Chrome, because I used simulated events.
* **7.2 — Tab-close capture depends on Formspree's answer (NOT VERIFIABLE HERE).** A `sendBeacon` carrying JSON makes Chrome ask the server first ("preflight"). Because beacons count as "with credentials", Chrome refuses the request if the server's answer says `Access-Control-Allow-Origin: *`. I demonstrated this: with a fake server answering `*`, Chrome logs *"…must not be the wildcard '*' when the request's credentials mode is 'include'"* and the beacon is dropped (`Ping net::ERR_FAILED`); with a fake that echoes the site's address and allows credentials, it goes through. The normal-`fetch` (blur) path works with either answer. I could not ask the real Formspree without contacting it. The same code was on the old site, so this is not new, but "tab-close capture works" is unproven. **Test:** on a throw-away Formspree form, type a valid e-mail on the customize step, close the tab, and see whether the submission arrives. **If it does not:** change the beacon to send as `text/plain` (needs no preflight) or use `fetch(..., { keepalive: true })`. **Who:** developer + someone with the Formspree dashboard.
* **7.3 — Switching language in the middle of the form.** The saved draft stores each option's `value`, and in ES/FR those values are translated (`"3–4 days"` vs `"3-4 días"`). A draft saved in one language and opened in another restores the step but leaves all option buttons unselected, and the summary chips and WhatsApp text then show the other language's raw words (visible in my phone screenshot of `/en/` opened with a French draft: "Duration: 3 à 4 jours"). The original site stored language-independent values. **Fix:** make the option `value`s the same in every language (mark them "do not translate"), or store the option number. Low severity.
* **7.4 — Wording problems in the form** are listed in item 5c (restored-draft message, notes hint, route-focus label, "Bali 4,4", formal/informal mix).
* Smaller observations: rapid double-clicks on the guest "+" lose one click (same cause as 7.1; only scripted clicks do that); a visitor whose saved draft already contains a valid e-mail triggers a tab-close send even if they typed nothing this visit (same in the original; can create duplicate leads); the intro text says "WhatsApp opens" at the end but the form shows a button (same as the original); the contact form and the customize form post to the same Formspree inbox.

## Item 8 — Analytics (FAIL)

* **What the live old site serves today** (`https://www.eaglerayexpeditions.com/`, fetched 26 Sep 2026; page, `main.js`, `lib/i18n.js`, `lib/manifest.js`, `styles.css` all searched): **no GA4, no Facebook/Meta Pixel, no Google Tag Manager, no Clarity, Hotjar, Plausible or any other tracker, and no cookie/consent banner.** (Its Vercel Speed Insights script exists at the project but the page does not load it.)
* **What is in the git history:** commit `391f09e` (7 Sep, "added GA code") added Google Analytics 4 — **`G-P589SNMK34`** (gtag.js). Commit `9842b12` (7 Sep, "add meta pixel") added the Meta/Facebook Pixel — **`1793759511973118`** (`PageView` event plus the no-script image). Both were **removed on 10 Sep** by commit `839270e` ("Chnages made by tibo"), a large commit that rewrote `index.html`; the live page (last modified 10 Sep 21:43 GMT) matches that state. Whether the removal was intended is not clear from the history.
* **New site:** zero tracker code in `src/`, `content/`, `tina/`, `public/` and in the built output (searched for gtag, googletagmanager, fbq, fbevents, connect.facebook, Clarity, Hotjar, Plausible, Vercel analytics). No consent code either.
* **Why it matters:** (1) the check "GA4 and Pixel fire correctly on the new site" cannot pass — nothing fires. (2) If the owner expects data from launch day, none will come. (3) If tracking is put back, French/EU visitors need a consent banner, and the old privacy policy §5 ("This website does not use advertising cookies, analytics trackers, or third-party pixels") would become false.
* **Decision needed (owner):** track or not. If yes: developer adds the two snippets (ideally gated by consent) once, in `BaseLayout.astro`; consider firing a "Lead" event when the customize form succeeds (the old Pixel only sent PageView); update the privacy policy; verify with GA4 DebugView and Meta Pixel Helper on the live domain. **Who:** owner decides, developer implements, owner verifies in the two dashboards.

## Item 9 — Devices and browsers (FAIL for Spanish phones; Safari/Firefox NOT VERIFIABLE HERE)

* **Tested:** Chrome 153, desktop 1440x900, tablet 768x1024 (touch), phone 390x844 (touch, 2x), 22 pages each (7 page types x 3 languages + 404) = 66 loads, plus narrower phones (375, 360, 320) for the home pages.
* **Side-to-side overflow:** none anywhere **except the Spanish home page on phones.** The crew section's button ("Te presentamos a nuestra gente apasionada por el mar") is 426 px wide because buttons never wrap (`whitespace-nowrap` in `src/components/ui/Button.astro` line 42), so the page becomes 446 px wide on a 390 px screen. In the phone screenshot the text is cut off, and the whole top bar is stretched so the hamburger sits at x=388–426 — outside the screen. The same happens at 375, 360 and 320 px, and would still happen up to about 466 px. French overflows by 6 px at 320 px only (two buttons). **Fix:** let buttons wrap on small screens (`whitespace-normal text-center sm:whitespace-nowrap`) and/or shorten the Spanish label (`content/crewSection/es.json`, `cta.label`). **Who:** developer.
* **Menu overlap:** the first heading on every non-home page starts below the fixed menu (menu bottom 64–76 px, first heading top ≥ 120 px). No overlaps found.
* **Sliders (phone):** crew, boats and wildlife rows all scroll by touch-swipe and snap into place (scroll position 20→365, 20→442, 20→386); the page still scrolls vertically over them; the dots below crew and boats respond to a tap and highlight the right card (checked on phone and desktop). Reverse swiping was confirmed on the crew row only.
* **Crew modal on a phone:** fits (352x593 inside 390x844).
* **Tablet look:** the contact page shows the founder's photo full-width first, so the heading and form start about 1,000 px down on a 768 px-wide tablet in portrait. Not a bug, but the first screen is only a photo. Owner to judge.
* **Not verifiable here — please test by hand on real devices:**
  * **Safari (macOS and iPhone):** the frosted nav bar (`backdrop-filter`, `backdrop-blur-sm` on the dialog backdrop); the crew card popup (`<dialog>` — works on Safari 15.4+); viewport units (`min-h-svh` on heroes, `92vh`/`70vh`/`60vh` elsewhere — iPhone browser toolbars move); the horizontal scroll-snap rows (crew, boats, wildlife); the flag emoji on the crew "languages" list (`CrewFullCard.astro`); the hero video autoplay with `playsinline`; date pickers in the customize form; Tailwind 4 needs Safari 16.4 or newer (older iPhones will look broken).
  * **Firefox** (desktop and Android): same list, plus the focus rings.
  * **A real Android phone.**

## Item 10 — Mogu proposal embed (PASS for the embed, with caveats)

* **Real trip:** `https://v2.app.moguplatform.com/trips/numerous-manchester-15970?embed=true`.
* **Can it be embedded?** Yes. Response headers: no `X-Frame-Options`; `Content-Security-Policy: … frame-ancestors *`.
* **Does it render and is it usable?** I built a scratch page with the iframe exactly as `src/components/MoguProposal.astro` writes it (`<iframe src=… height=600|700 loading="lazy" class="w-full border-0" title="Trip proposal">`) and loaded it in Chrome. It renders the full proposal (header with logo, title, dates, photo, price box) at desktop (1280 px wide frame) and phone (350 px). The proposal document is about 8,400 px tall (desktop) / 10,900 px (phone) inside a 600 or 700 px window; it scrolls inside the frame (scroll position 0→250 in both) and has no sideways scroll. On the phone the scroll started inside the frame also nudged the outer page (59 px).
* **Caveats:**
  1. **No page on the site contains a Mogu block today.** The sample landing page's last block is a plain button linking to the Mogu URL (`content/landingPage/*/la-paz-sailing-week.json`). So the embed could only be tested on a scratch page, and "through the site itself" is not verifiable. I confirmed by reading the code that Tina's `moguProposal` block (`tina/collections/landingPage.ts`) is dispatched by `LandingPageBlocks.astro` to `LandingMoguProposal.astro`, which passes `tripSlug`, `height` and `iframeTitle` (as `title`) to `MoguProposal.astro`. Not rendered end-to-end.
  2. **The trip itself:** its title is "Une semaine en catamaran au cœur de la mer de Cortez **copy**", it is written in **French** (so it would show French on the EN and ES pages), and it shows a named client expedition ("Expédition Ingrid — Baja California") with a price ("USD $6,800.00"). Please confirm it is meant to be public and is the right trip.
  3. **A window into a long page:** at 600–700 px tall the visitor sees only a slice, and on phones Mogu's own top bar and price bar take much of it. Consider a taller frame, or a link to the full page.
  4. **Mogu's own logo bar** is visible inside the frame. The earlier test embed on the old site used `?embed=true&hideLogo=true&hideTitle=true`; the new component only adds `?embed=true` (the code comment says that is the confirmed pattern). Ask whether the extra options are wanted.
  5. **Slug field is not validated.** An editor already pasted `numerous-manchester-15970?embed=true&hideLogo=true`. Test: that produces `…/trips/numerous-manchester-15970?embed=true&hideLogo=true?embed=true`, which still loads the trip here (the second `?` becomes part of a setting's value), so it did not break — but it is fragile, and a wrong slug is silently accepted: a made-up slug returns HTTP 200 with a "Page not found" screen inside the frame. **Fix:** in `tina/collections/landingPage.ts`, validate the field to letters/digits/hyphens only (or strip everything from the first `?` or `/`), and default the frame title in ES/FR (the fallback "Trip proposal" is English). **Who:** developer.

## Item 11 — Meta and SEO per page (FAIL)

Counted on the 57 locale pages (and 404):
* `<title>`: present on all; 53 distinct (home and "La Paz" share one title across the three languages). The home title is only "Eagle Ray Expeditions" — the old one was "Eagle Ray Expeditions — Private sailing expeditions · La Paz, Baja California Sur". Landing titles are "…Landing Page Sample…".
* **Meta description: 0 of 57.** (Old page had one.)
* **Open Graph** (`og:title`, `og:description`, `og:image`, `og:type`): **0 of 57.** Only `og:locale` and `og:locale:alternate` exist. Twitter cards: 0. Links shared on WhatsApp, Facebook, LinkedIn show no image or description.
* **Favicon: none** (no `<link rel="icon">`, no `/favicon.ico`; the browser console logs a 404 for `favicon.ico` on every page). The old site used `assets/img/logo-mark-navy.png`. Also missing: `theme-color` and `viewport-fit=cover` from the old head.
* Canonical: 57/57 correct (self). `noindex` only on 404 and the root redirect stub.
* The `seo` idea is written down in `docs/tina-setup.md` §5 ("Recommend finalCta, footer, nav, seo in a follow-up") but was never built.
* **Smallest fix:** add `description` and `ogImage` fields to each page type (or one per-locale `seo` document as a default) and print them in `BaseLayout.astro` (`description`, `og:title`, `og:description`, `og:image`, `og:type`, `twitter:card`), copy the old strings from `lib/i18n.js` `meta.*` into EN/ES/FR, add `<link rel="icon" href="/assets/img/logo-mark-navy.png">`. **Who:** developer; owner supplies/approves the texts and the share image.

## Item 12 — 404, redirects, old-URL continuity (FAIL)

* **`/404.html`:** exists, has `noindex`, no canonical or language tags. `.vercel/output/config.json` ends with a catch-all route sending everything unknown to `/404.html` with **status 404**, and the deployed test site confirms it (`/nope` → 404). It is English only (one `notFoundPage` document, not per language).
* **`/` → `/en/`:** there is **no server redirect** in `config.json`. `/` is a small HTML page (`Redirecting to: /en/`) with a **2-second meta refresh** and `noindex`, answered with status **200** (confirmed on `ere.kbdreams.com`). Visitors see a blank "Redirecting" page for two seconds, and search engines get a weaker signal than a real 301/308 for the most important URL on the old site. There is also no language detection (a French visitor lands on `/en/`). **Fix:** add a `redirects` entry in `vercel.json` (`/` → `/en/`, permanent). **Who:** developer.
* **Address mismatch:** the live site redirects the bare domain to `www` (see item 3). Old-site URLs must keep working on whichever address is chosen.
* **Old URLs that will 404 after cutover** (all answer 200 on the live site today): `/terms.html`, `/privacy.html`, `/creditos.html`; plus the old files `/styles.css`, `/main.js`, `/lib/i18n.js`, `/lib/manifest.js` and 12 old image files (`/assets/img/whale-shark.webp`, `mobula-ray.webp`, `sea-lions.webp`, `dolphins.webp`, `manta-ray.webp`, `humpback-whale.webp`, `sea-lion-beach.webp`, `kitesurf-action.webp`, `beach-cove.webp`, `boat-goodmedicine-exterior.webp`, `boat-starofbaja-exterior.webp`, `boat-moorings4500l-exterior.webp`) that any old link or share preview might reference. `/index.html` still works (it is the redirect stub). The old site had no sitemap or robots.txt, so there is no other list of indexed URLs; check Google Search Console for what is actually indexed.
* **Fix:** publish the legal pages at the same URLs (or add permanent redirects from the old `.html` addresses to the new pages). **Who:** developer.

## Item 13 — Security, headers, secrets (PASS, with notes)

* **Secrets:** I read the values in the local `.env` (13 variables; the 12 with real values — Upstash/KV tokens and URLs, GitHub token, Google client id and secret, `NEXTAUTH_SECRET`, `NEXTAUTH_URL` — were searched for; values are not printed here) and searched the 538 files in `.vercel/output/static`, `.vercel/output/functions`, `.vercel/output/_functions`, `public/` and `dist/`: **none of the secret values is present.** Also searched for token patterns (GitHub, Google, private keys, AWS, Stripe, Cloudinary secret): none. The only hit was the repo name "eagleray-web", which is simply the Cloudinary folder name in image URLs. The environment variable *names* appear in one server-side function file (it reads them at run time) — normal. `.env` is not tracked and was never committed (`git log --all -- .env` is empty). **Note:** that `.env` holds real production-grade credentials; keep it off shared drives.
* **Dev leftovers:** no Astro dev toolbar, no `localhost` or `127.0.0.1` reference, no source maps, no `console.log` in the site scripts (outside the admin bundle).
* **Tina admin:** `public/admin` is the Tina admin bundle (expected). In this local build it is the **development** version (it points at `http://localhost:4001`) because Tina's dev server rewrites it; the Vercel build rebuilds it with `tinacms build`. The production admin bundle is therefore **NOT VERIFIABLE HERE** — after the first production deploy open `/admin/index.html` and sign in.
* **Robots:** no `robots.txt` exists (item 4), so `/admin` and `/api/tina` are not disallowed. Read-only checks on the test deployment: `/api/tina/auth/providers` 200 (expected), `/admin/index.html` 200 (login shell, expected), `/api/media/cloudinary` 405 for GET (expected), `/_image` 500 (Astro's image endpoint, unused by any page — harmless, but could be switched off).
* **Page weight from editing markers:** each page carries Tina's `data-tina-field` markers (175 on the home page) and the home page repeats a small inline bridge script 8 times. Harmless; home HTML is 137 KB (21 KB compressed).
* Response headers (security headers such as CSP or X-Frame-Options) are not set by this site's config (`vercel.json` only has the Tina rewrite); Vercel adds HSTS. This is the state of the current live site too.

## Item 14 — Cutover readiness (NOT VERIFIABLE HERE — human checklist)

None of these can be checked from a build machine. Each one, and why it matters:

1. **Vercel Production environment variables** (project settings, scope Production; then redeploy — Vercel does not apply changes to a running deployment):
   * `PUBLIC_LIVE_LOCALES=en,es,fr` — without it the production site builds **English only** (ES/FR pages, language tags and the language switcher's ES/FR entries disappear). The doc says leave it unset on Production until translations are approved. **They are not approved yet** (item 5c) — this is the switch that publishes them.
   * `TINA_PUBLIC_IS_LOCAL` — must be **unset** (never `true` on Vercel: it disables login and uses local files).
   * `GITHUB_OWNER`, `GITHUB_REPO`, `GITHUB_PERSONAL_ACCESS_TOKEN` — how the editor saves to the repo; token has an expiry date, note it. Leave `GITHUB_BRANCH` unset.
   * `KV_REST_API_URL`, `KV_REST_API_TOKEN` — the Upstash Redis index Tina needs at build and run time.
   * `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXTAUTH_SECRET` (a different value from Preview).
   * `NEXTAUTH_URL` = `https://<FINAL production domain>/api/tina/auth` — it must use the final domain and must end in `/api/tina/auth`. Today's local `.env` value points at the test host `ere.kbdreams.com`; if copied unchanged, editors cannot sign in on the real domain.
   * `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_UPLOAD_PRESET` — image uploads in the editor (existing images keep working without it).
2. **Google OAuth:** in Google Cloud Console add `https://<final domain>/api/tina/auth/callback/google` as an authorized redirect URI (exact match, no wildcards) on the same OAuth client. Without it the editor's Google sign-in fails on the new domain.
3. **Editors list:** `content/editors/index.json` must contain the real editors' Google e-mails. Checked in the repo: 3 editors are listed and the placeholder `replace-me@example.com` is gone. Whether those exact addresses match the Google accounts people sign in with cannot be checked here.
4. **GitHub Actions secret `DEEPL_API_KEY`** (repo Settings > Secrets > Actions; not a Vercel variable). Without it, future English edits will not produce translation pull requests. The workflow file is present; it has never been verified end-to-end (per `docs/translation-workflow.md`).
5. **`staging` alias** (branch `staging` → a stable domain, its own redirect URI and `NEXTAUTH_URL` for Preview) — only needed if the team wants to review translations in place.
6. **Move the domain to the Vercel project** and decide the **canonical host (www or not)**. The live site currently redirects bare → `www`. `site` in `astro.config.mjs` is `https://eaglerayexpeditions.com`; it must equal the final address exactly, because all canonical and language tags are built from it (item 3). Also set the redirect from the non-primary host.
7. **Formspree:** in the Formspree dashboard, check the form `xwlearnw` allows the new domain(s), notification e-mails go to the right person, and run the tab-close test from item 7.2.
8. **First production deploy smoke test** from `docs/tina-setup.md` §2: `POST /api/tina/gql` returns 401; `/api/tina/auth/providers` returns the Google provider; then sign in at `/admin/index.html`, make one edit, and check `git log` for the editor's name.
9. **Search Console / analytics:** add the property for the final address, submit the sitemap once it exists, and (if tracking returns) verify GA4/Pixel events on the live domain.
10. **DNS lower TTL** before the switch and keep the old deployment available to roll back.

## Item 15 — Images and performance (PASS, with recommendations)

* **Largest images actually used by pages:** `crew-benji.jpeg` **810,823 bytes (over 500 KB, the only one)**; `crew-juancarlos.png` 373 KB; `crew-monique.png` 226 KB; `whale-shark.jpg` 185 KB (a blog cover); `hero-premium.webp` 163 KB; `crew-lou.jpeg` 152 KB; `crew-antoine.webp` 151 KB; `boat-baydreamer-exterior.webp` 143 KB. The three wildlife photos come from Cloudinary with automatic format/quality (138–344 KB depending on browser). The hero video `hero-loop.mp4` is **5.7 MB** and starts loading immediately with `preload="auto"` on every visit, phones included (same file and setting as the old site). Total media loaded by the home page: about 7.5–7.8 MB.
* **Width/height attributes:** missing on 29 of the home page's 35 `<img>` (only the logos have them). Measured layout shift while loading and scrolling the home page in all 3 languages at desktop and phone size: **0.0006–0.0021** (very good; 0.1 is the "good" limit). So the missing attributes do not cause visible jumps.
* **Lazy loading:** 28 of 35 home images are `loading="lazy"`; the hero image is eager; only logos have no attribute. Fine.
* **Hero image preload:** the old page had `<link rel="preload" as="image" href="assets/img/hero-premium.webp" fetchpriority="high">`; **the new page has none.** The hero image loads only as the video's poster. Recommendation: restore the preload.
* Recommendations (not blockers): resize/compress `crew-benji.jpeg` and the two PNG crew photos (they are shown as small cards); consider `preload="metadata"` (or no video) on phones.

---

# Housekeeping

* The first check changed no file except adding this document. The fixes afterwards changed source, content and configuration (nothing is committed): see `git status`. Two files are auto-generated and were left as they are (`.astro/types.d.ts`).
* Scratch test content (a temporary landing page for the Mogu test) was deleted; the build folders `.vercel/output` and `dist` are git-ignored.
