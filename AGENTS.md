# Working on the Eagle Ray site with an AI assistant

This file has two readers.

- **Thibault** — you don't need to code. Read "Start here" and "Asking the assistant for things" below, and use the two checklists.
- **The AI coding assistant** — read every rule in this file before you change anything. When this file and a request disagree, follow this file and tell Thibault why.

For the look and feel (colours, type, buttons, heroes), see `docs/design-system.md` and `design-system/styles.css`. Use those tokens; do not add new colours or sizes.

For migration history and setup, see `CLAUDE.md` (how the site was moved to this stack), `docs/tina-setup.md` (accounts, logins, hosting) and `docs/translation-workflow.md` (Spanish and French drafts). This file is about **day-to-day work**: adding and changing pages without breaking what exists.

---

## Start here (Thibault)

**Most changes need no assistant at all.** If you want to change words, photos, links, menu items or add an article, a crew member or a landing page, use the editor (`/admin`). The step-by-step is in the *Website Editor Guide*. Only use the assistant for things the editor can't do: a new kind of page, a new layout, a new feature.

**Before you build a page with the assistant, try the Landing page builder.** In the editor, *Landing pages* lets you put together a page from ready-made blocks (hero banner, rich text, image gallery, call-to-action banner, trip proposal). No code, and the translation robot picks it up automatically.

**How work is kept safe.** Every change goes through four steps: the assistant works on a **branch** (a private copy), you look at the **preview** it produces, you tick the checklist at the bottom of this file, and only then does it get **merged** into the live site. If you skip the preview, you are testing on real visitors.

**If something goes wrong,** don't keep asking the assistant to fix it. Stop, and see "Undo" at the end of this file.

---

## The rules (assistant: these are not suggestions)

### 1. Work small and show the plan first
1. Before writing code, say in plain language **what you will change and which files**. Wait for a yes.
2. Change **one page or one component at a time.** Finish it, check it, then stop. Never batch several unrelated changes.
3. Work on a branch, never directly on `main`. Name it after the change (`add-our-story-page`).
4. Never commit or push unless Thibault asks. Never force-push.

### 2. Everything visible must be editable in the editor
The site's whole point is that the marketing team edits it by clicking on the page.

- **No hard-coded copy.** Any text, image, link or button label a visitor sees lives in a file under `content/`, is described in `tina/collections/`, and is read by the component. The only exceptions are technical labels (`aria-label`s that already have a field, the "Instagram/WhatsApp/Email" link names).
- **Every editable thing gets a click-to-edit marker:** `data-tina-field={tinaField(obj, "fieldName")}` on the element that shows it. Look at `src/components/CrewFullCard.astro` for the pattern.
- **Every page is wrapped in a `<TinaIsland>`** with an entry in `src/pages/tina-island/[name].ts`, so edits show live. A page without one can't be edited visually.
- Every field needs a plain-English `label` and, when it isn't obvious, a `description` an editor will understand. No jargon.

### 3. Three languages, always
The site is English, Spanish and French. English is the source; Spanish and French are drafted automatically (DeepL) and reviewed by a person.

- Every new page or section needs **content in English** (`content/<collection>/en.json` or `.../en/<slug>.json`). Don't hand-write Spanish or French for new content; the workflow drafts it.
- **Build pages under `src/pages/[locale]/`** and enumerate locales with `liveLocales` in `getStaticPaths` (copy `src/pages/[locale]/contact.astro`). Never create a page under `src/pages/en/`.
- **Never write `/en/...` in code.** Use `localePath(locale, "some/path/")` from `src/i18n/config.ts`. In content, an `href` written as `/en/...` is rewritten for other languages automatically.
- Anything that is a proper noun and must not be translated (a person's name, a boat name) needs `ui: doNotTranslate` on its field (see `tina/shared/fields.ts`).
- **Approved translations are protected.** `scripts/translation-memory.json` holds the human-written (or human-corrected) Spanish and French for English strings; the translation robot uses it instead of DeepL. When a native reviewer corrects a translation, add the corrected pair there (`"<exact English>": "<approved text>"`), otherwise the next redraft can undo it.
- Which languages are public is one setting, `PUBLIC_LIVE_LOCALES`. Don't change it as part of building something.

### 4. Use the design system. Don't invent one.
- **Colours are only** `ink`, `ink-hover`, `surface`, `white`, and opacity versions of those (`text-ink/74`, `border-ink/14`). No other colour, no hex codes in components.
- **Type and spacing come from the tokens** in `src/styles/global.css` (`text-h2`, `text-lede`, `py-section`, `px-pad`, `mb-section-head`, `max-w-site`…). Don't type pixel sizes for section spacing or headings.
- **Breakpoints are Tailwind's defaults only** (`sm md lg xl 2xl`). No custom breakpoints, no `@media` in components.
- **Fonts** are already set (`font-display` for headings, `font-sans` for text, `font-mono` for small labels, `font-serif` for quotes). Headings get their style automatically; don't restyle them per page.
- **No new CSS files, no `<style>` blocks, no inline `style=`** unless there is genuinely no Tailwind way, and then say why.
- **Buttons are always `<Button>`** (`src/components/ui/Button.astro`). Never hand-write a button's classes.
- **A page that opens with a big photo uses `<PageHero>`** (`src/components/ui/PageHero.astro`). A page that doesn't (plain white top) must render the header solid: `<BaseLayout transparentNav={false}>`.
- Interactive pieces are **Preact** (`.tsx`, `client:visible`). Page-wide effects (reveal on scroll, nav, depth gauge) live in `src/scripts/chrome.ts`. Don't add another framework, a jQuery-style library, or a new npm package without asking.

### 5. Quality bars every page must meet
- **One `<h1>` per page**, headings in order (a heading level is never skipped: h1, then h2, then h3).
- **Every page that search engines should find has a title and a description.** Add `seoField()` (from `tina/shared/fields.ts`) to its collection and pass `title` / `description` / `ogTitle` / `ogDescription` to `<BaseLayout>`; the fallback is the page's own title and lead text. A page with nothing on it is `noindex` (see `src/pages/[locale]/[slug].astro`). The sitemap (`src/pages/sitemap.xml.ts`) lists blog posts, landing pages and the fixed pages by itself; a **new kind of page needs a line there**.
- **A link to a section of the homepage** (`#customize`) written in content or in a component that appears on other pages must go through `homeAnchor(locale, href)` (`src/lib/links.ts`), or it does nothing away from the homepage.
- **Anything that scrolls sideways or in a box must be reachable with the keyboard** (`tabindex="0"`, `role="group"`, an `aria-label`).
- **Every image has `alt` text** from a field (an editor writes it), unless it is purely decorative (`alt=""`).
- **Everything works with the keyboard** and has a visible focus. Modals close with Escape.
- **Respect `prefers-reduced-motion`** (`motion-reduce:` classes) and **work without JavaScript** for reading content. Don't hide content that only a script can reveal.
- **Images come from the editor's image library** (they are resized automatically). Never add large image files to the repo.
- **Check it at phone width and laptop width**, in all three languages, before saying it's done.

### 6. Protected areas — never change without an explicit instruction naming the file
| Area | Why |
|---|---|
| `src/components/FunnelForm.tsx`, `Funnel.astro` | The trip-planning form. It captures partial leads when someone leaves a field or closes the tab, autosaves drafts, and builds the WhatsApp message. Small changes break lead capture silently. |
| `content/settings/`, `content/editors/` | The WhatsApp number/email/lead endpoint, and who is allowed to log in. |
| `tina/database.ts`, `tina/config.ts` (auth, media, branch), `api/` | Logins, storage, image uploads. |
| `.github/workflows/`, `scripts/`, `vercel.json` | Deployment and the translation robot. (`scripts/translation-memory.json` is the one file here a reviewer may edit — see "Approved translations" above.) |
| `public/terms.html`, `privacy.html`, `creditos.html`, `styles.css`, `lib/` | The old legal pages, served as-is until they are rebuilt as editable pages. Don't restyle them, and don't build new pages on top of the old `styles.css`. |
| `.env*` | Secrets. Never read out, print, commit or paste them anywhere. |
| `tina/__generated__/`, `public/admin/`, `tina/tina-lock.json` | Generated. Never edit by hand. |
| Field **names** in `tina/collections/*.ts` | Renaming or deleting a field orphans everything editors and translators already wrote. Add new fields; migrate content in the same change if a rename is truly needed. |
| Existing files in `content/` | Real, edited content. Add files; don't rewrite or delete existing ones unless that is the task. |

### 7. Things that need a person's decision first
Adding **analytics or tracking scripts**, **new embeds** (maps, videos, booking widgets), **new forms** that collect personal data, **new npm packages**, or anything that sends visitor data to a third party. These have privacy and legal consequences, especially for visitors in Europe and Mexico. Describe the option and stop.

### 8. Say what you didn't verify
End every task with what you **checked** (build, type-check, which pages and languages you looked at, at which widths) and what you **did not or could not** check. Never say "done" or "works" for something you didn't actually run.

---

## The component library

Reuse these. Before creating a component, look here and in `src/components/`.

### Page shell
| Component | File | Use |
|---|---|---|
| `BaseLayout` | `src/layouts/BaseLayout.astro` | Wraps **every** page: head tags, language links, nav, footer, depth gauge. Props: `title`, `locale`, `path` (page path after the language, e.g. `"contact/"`), `description`, `transparentNav` (default true; set `false` on pages without a hero photo), `noindex` (only the 404). |
| `Nav`, `LangSwitch`, `NavDesktopDropdown`, `NavMobileDropdown` | `src/components/` | The header. Edited in the editor under *Site Navigation*. Don't rebuild. |
| `Footer` | `src/components/Footer.astro` | Footer. Edited under *Site Footer*. |
| `Sounder` | `src/components/Sounder.astro` | The depth gauge on the left. Automatic. |

### Building blocks
| Component | File | Use |
|---|---|---|
| `Button` | `src/components/ui/Button.astro` | The only button. `variant` `"primary"` or `"ghost"`; `context` `"default"` (on white) or `"hero"` (over a photo); `size="sm"`, `wide`. |
| `PageHero` | `src/components/ui/PageHero.astro` | Full-width photo banner with kicker, `<h1>`, sub-headline and optional button. Pass Tina markers through `fields`. |
| `SliderDots` | `src/components/SliderDots.tsx` | Dot navigation for a swipe slider. |
| Rich-text pieces | `src/components/richtext/` | How paragraphs, quotes and images look inside articles. |

### Homepage sections
`Hero`, `Difference`, `Crew`, `Wildlife`, `Boats`, `Funnel` (in `src/components/`). Each one is a section of `src/pages/[locale]/index.astro`. Change their copy in the editor, not in code.

### Pages and their pieces
| Page | Components | Content collection |
|---|---|---|
| Passionate Sea People | `CrewPage`, `CrewFullCard` | `crewPage`, `crew`, `crewSection` |
| Homepage crew slider | `Crew`, `CrewSummaryCard`, `CrewModal` (pop-up) | `crewSection`, `crew` |
| Blog | `BlogListing`, `BlogPostView` | `blogSection`, `blogPost` |
| Contact | `ContactPage`, `ContactForm` | `contactPage` |
| Landing pages (block builder) | `LandingPageView` → `landing/LandingPageBlocks` → `LandingHero`, `LandingRichText`, `LandingImageGallery`, `LandingCta`, `LandingMoguProposal` | `landingPage` |
| Placeholder menu pages | `NavPageView` | `navPages` |
| Page not found | `NotFoundView` | `notFoundPage` |
| Trip proposal embed | `MoguProposal` | (a block in a landing page) |

### Helpers
- `src/i18n/config.ts` — `localePath()`, `liveLocales`, `defaultLocale`.
- `src/lib/content.ts` — one loader per collection (`loadBlogPosts`, `loadCrew`…). Add a loader here for a new collection.
- `src/lib/crew.ts` — small helpers for the crew cards.
- `src/lib/links.ts` — `homeAnchor()`, so a `#customize` link works from any page.
- `tina/shared/fields.ts` — reusable field shapes (`ctaField`, `sectionHeadFields`, `seoField`, `textarea`, `tags`, `doNotTranslate`, `localeRouter`).

### Design tokens (in `src/styles/global.css`)
- Colours: `ink` `#0e1b2b`, `ink-hover` `#1b2f47`, `surface` `#f7f6f1`, `white`.
- Spacing: `pad` (page sides), `section`, `section-head`, `nav`, `nav-solid`, `quote`, `funnel`, `footer-t`, `hero-b`; widths `max-w-site` (80rem), `max-w-form`.
- Type sizes: `text-h2`, `text-hero`, `text-hero-sub`, `text-lede`, `text-quote`, `text-quote-lead`, `text-legend`, `text-footer-claim`, `text-footer-big`, `text-nav-mobile`.
- Corners: `rounded-sm` 3px, `rounded` 6px, `rounded-lg` 10px.

---

## How to add a new page (the recipe the assistant follows)

Only after confirming the Landing page builder can't do the job.

1. **Describe the fields** in a new file `tina/collections/<name>.ts`, copying `contactPage.ts` (one document per language) or `blog.ts` (many documents). Register it in `tina/config.ts`. Give every field a clear `label`.
2. **Add English content** in `content/<name>/en.json`. Do not write Spanish/French by hand.
3. **Add a loader** in `src/lib/content.ts`.
4. **Build the component** in `src/components/<Name>.astro` from the library above, with `tinaField` markers on every editable thing.
5. **Add the route** `src/pages/[locale]/<url>.astro`, copying `contact.astro`: `getStaticPaths` over `liveLocales`, `BaseLayout`, and the component inside `<TinaIsland>`.
6. **Add the island entry** in `src/pages/tina-island/[name].ts` (copy the `contactPage` one).
7. **Link it** from *Site Navigation* (`content/navigation/en.json`) using `/en/<url>/`.
8. **Run the checks** below, then look at the preview in three languages at phone and laptop width.
9. When the pull request is merged, the translation robot opens a second pull request with the Spanish and French drafts. A person reviews those before they go live. Don't merge that one yourself.

### Checks the assistant runs (and reports)
```
npx astro check            # must say 0 errors
npm run tina:dev           # start the local editor + site, open the page, click things
```
`npm run tina:dev` opens the site and the editor on your computer only, so edits there don't go live. Run `npm run tina:build:local` after changing anything in `tina/collections/` so the generated types update.

---

## Asking the assistant for things (Thibault)

Good requests say **what the visitor should see**, **where it lives**, and **what must stay the same**. Examples:

> Add a page at "The Eagle Ray Experience" with a hero photo, three short text sections and a "Plan your trip" button. Use the existing components. Every piece of text must be editable in the editor. Show me the plan before you write code.

> The blog list should show 6 articles per row on large screens instead of 3. Change only the grid. Don't touch anything else.

Things worth saying every time:
- "Follow AGENTS.md."
- "Work on a branch and give me a preview link."
- "Tell me what you tested and what you didn't."

Things to be suspicious of: an answer that says "done" without saying what was tested; a change that touches many files you didn't expect; anything mentioning `.env`, passwords, tokens, or "just disable the check".

---

## Checklist before merging (Thibault)

- [ ] I opened the **preview link** (not just the assistant's description).
- [ ] The page looks right on my **phone** and on a **laptop**.
- [ ] I switched to **Spanish and French** in the header and the page works (drafts are fine; broken layout is not).
- [ ] I can **click the text and photos in the editor** and change them.
- [ ] The **header** is readable at the top of the page (see-through over a photo, white on plain pages).
- [ ] The trip-planning form on the homepage still opens, and its last step still shows the WhatsApp button.
- [ ] The assistant told me what it **checked and didn't check**, and nothing surprising changed (no new tracking, no new packages).

## Undo

- **Not merged yet:** delete the branch. The live site is untouched.
- **Merged and something is wrong:** ask Kinich to *revert the merge* on GitHub (one click, brings back the previous version). Don't ask the assistant to "fix forward" on the live branch while visitors are affected.
- **Content edited in the editor by mistake:** the editor keeps history through GitHub; ask Kinich to restore the file from the previous commit.

---

## Map of the project

```
content/            All the words, links and image choices, as data (edited through the editor)
public/assets/      Fixed images and the hero video
src/pages/          Which URLs exist ([locale]/ = one page per language)
src/components/     The pieces pages are built from (see the library above)
src/layouts/        The shared page shell
src/lib/            Loaders that read content
src/i18n/           Language settings
src/scripts/        Small page-wide effects (scroll reveal, header, depth gauge)
src/styles/         The design tokens (global.css)
tina/collections/   Describes each kind of content and its fields for the editor
scripts/, .github/  The translation robot
docs/               Setup, translation flow, launch checklist
```

**Words to know.** *Branch:* a private copy of the site to work on. *Preview:* a temporary live copy of a branch. *Merge:* accept a branch into the live site. *Collection:* one kind of content (blog posts, crew). *Locale:* a language (`en`, `es`, `fr`). *Island:* a piece of a page the editor can refresh live.

**Who to ask:** Kinich — hosting, logins, translation robot, anything in the "protected areas" table.
