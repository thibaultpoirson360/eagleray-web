# Eagle Ray Expeditions — Website

Marketing site and booking funnels for Eagle Ray Expeditions (ERE), a small-group
sailing charter operator running expeditions out of La Paz, Baja California Sur,
Mexico. Live at [eaglerayexpeditions.com](https://eaglerayexpeditions.com).

The repo is a hybrid: a static HTML/CSS/vanilla-JS marketing site (the original
build, still serving the homepage as-is) wrapped by a Next.js app that adds two
dynamic pieces — a Friends & Family conversion funnel and per-prospect VIP pages
backed by Airtable.

## What's actually in here

| Route | What it is | Stack |
|---|---|---|
| `/` | Homepage — hero, difference, crew, wildlife, routes, fleet, FAQ, booking form | Static HTML/CSS/JS, `public/index.html` |
| `/creditos`, `/privacy`, `/terms` | Legal / credits pages | Static HTML, rewritten from `public/*.html` |
| `/friends-family` | Conversion landing page for warm leads who already know Thibault — 7-question conversational intake form (Tally-embedded) | Next.js (`app/friends-family/`) |
| `/vip/[slug]` | Personalized pre-booking page generated per prospect (their name, pitch, assigned boat/leader, Stripe deposit link) | Next.js + Airtable (`app/vip/`) |

The static homepage isn't legacy cruft — it's deliberately still the source of
truth for the main site. `next.config.ts` rewrites `/` to `/index.html` so it
keeps serving byte-for-byte as before while the Next.js side grows independently.

## Requirements

- Node.js 20+
- An Airtable base if you're touching `/vip/[slug]` (see [AIRTABLE_SETUP.md](AIRTABLE_SETUP.md))

## Running it locally

```bash
npm install
npm run dev
```

Opens on `http://localhost:3000`. The homepage, `/friends-family`, `/creditos`
etc. all work immediately — no environment variables needed for those.

`/vip/[slug]` needs Airtable credentials to render real data. Without them it'll
throw a clear "Airtable is not configured" error rather than a silent blank page.
Two ways to get it working:

**Point at the real base** — copy `.env.example` to `.env.local`, fill in
`AIRTABLE_API_KEY` / `AIRTABLE_BASE_ID` (see [AIRTABLE_SETUP.md](AIRTABLE_SETUP.md)
for the full schema and how to get a token).

**Or point at the mock** — no credentials needed, useful for UI work without
touching the real base:

```bash
node scripts/mock-airtable.mjs        # separate terminal, listens on :4400
```

```bash
AIRTABLE_API_KEY=mock AIRTABLE_BASE_ID=appMock AIRTABLE_ENDPOINT_URL=http://127.0.0.1:4400 npm run dev
```

Then visit `/vip/ingrid-baja` (direct leader override) or `/vip/fallback-test`
(leader/boat inherited from the linked expedition) — both fixtures are defined
in the mock script.

## Other scripts

```bash
npm run build          # production build
npm run typecheck       # tsc --noEmit
npm run lint             # next lint
npm run airtable:inspect # prints the real Airtable base's field names, for
                          # reconciling against lib/airtable-schema.ts
```

`scripts/fetch-drive-assets.mjs` and `scripts/sync-boat-photos.mjs` are one-off
tools for pulling marketing photos from Google Drive into `public/assets/img/`
— not part of the app's runtime, safe to ignore unless you're doing asset work.

## What's inside `/public`

Everything here is served statically and verbatim — nothing in `/public` is
processed by Next.js at build time except for the rewrite rules that point a
few top-level routes at the `.html` files.

```
public/
├── index.html          the homepage — hero, crew, fleet, FAQ, booking form
├── creditos.html        credits page
├── privacy.html          privacy policy
├── terms.html             terms of service
├── main.js                 homepage interactivity (nav, reveals, form logic — vanilla JS)
├── lib/
│   ├── i18n.js               all homepage copy, in EN / ES / FR — see below
│   ├── credits-render.js      renders public/assets/credits.json onto creditos.html
│   └── manifest.js             contact config (phone, email, socials) — WhatsApp
│                                 links and the booking form read from here
└── assets/
    ├── img/                    homepage photos: crew portraits, boat exteriors, misc
    ├── barcos/                  boat photos for the /friends-family carousel —
    │                             naming convention `[section]-[order]-[content]`,
    │                             e.g. `bd-1-exterior.jpg`, `astrea-2-cubierta.jpg`
    ├── hero/                     hero images for /friends-family (desktop + mobile)
    ├── secciones/                 section imagery for /friends-family
    ├── photos/                     general photo library
    ├── video/                       hero background video
    └── credits.json                  data consumed by credits-render.js
```

**`public/lib/i18n.js` is the one file worth knowing about before editing
homepage copy.** The homepage is trilingual (EN/ES/FR); every visible string
lives in this file under three top-level blocks (`en`, `es`, `fr`) that must
stay in sync — the same keys, same structure, in each language. `main.js`
walks the DOM for `data-i18n="some.key"` attributes and swaps in the matching
string based on the active language. If you add a new piece of copy to
`index.html`, add the matching key to all three blocks in `i18n.js` — a
missing key doesn't error, it just quietly renders nothing.

Asset naming and rights-clearance rules (what can be published, where photos
come from, why some are missing) are documented in [CLAUDE.md](CLAUDE.md).
