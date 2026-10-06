> **Archived.** This is the original migration spec for the Astro + Tina rebuild, kept for history. The current rules are in `AGENTS.md`; the look is in `docs/design-system.md`; accounts and deploys are in `docs/tina-setup.md`. Where this file says "CLAUDE.md", read "this file".

# Eagle Ray Expeditions — Astro + Tailwind + TinaCMS Migration (v2)

**This supersedes the previous CLAUDE.md.** The previous attempt delegated broad,
multi-part work to Claude Code across autonomous sessions, and components were
skipped as a result. This version changes the working model, not just the
technical decisions below — read "How we work now" before touching any code.

## How we work now

**One component at a time. Full stop between each one.**

1. Confirm which single component you're building, and its exact source: which
   section `id` in `index.html`, which CSS classes in `styles.css`, which
   functions (if any) in `main.js`.
2. Read only the slice of the three source files relevant to that component —
   don't scan-and-guess from memory of a similar-looking section elsewhere.
3. Before writing any code, list out loud every distinct state the component
   has: default, hover, focus, disabled, each breakpoint variant, and every
   piece of content that needs to be Tina-editable. This step is not optional
   — it's the thing that prevents a state or a field from silently getting
   dropped.
4. Build it.
5. Wire TinaCMS visual/contextual editing on every editable field in the
   component — no exceptions, nothing deferred to "later."
6. Render it and confirm it actually matches the source before calling it
   done.
7. **Stop.** Do not start the next component unless explicitly told to. Do not
   batch multiple components into one response even if the next one looks
   trivial.

## Source files (the only source of truth)

Three files, base of this migration:
- `styles.css` — current stylesheet
- `main.js` — current vanilla JS
- `index.html` — current homepage markup (already simplified down to 6
  sections — see below)

This is placeholder-populated scaffold markup, not final content — e.g. the
boats grid currently repeats "Bay Dreamer" three times and the wildlife
gallery uses the same placeholder image three times. Real content (crew,
boats, wildlife, etc.) comes later from the Client's Miro/Drive/spreadsheet
content mapping, not from what's hardcoded in this HTML. Build the
*structure* faithfully; don't treat the placeholder *content* as real.

## Current homepage sections (verified against the actual file — don't assume
parity with any earlier audit)
`hero (#top)` → `difference` → `crew` → `wildlife` → `boats` → `customize`

Routes, day-in-life, activities, FAQ, and the Instagram/"already sailing" CTA
are **not** on this page anymore. `main.js` still contains their handler
functions (`initRutas`, `initManifest`, `initFaq`, and `initFauna` may or may
not still be wired to the current wildlife markup — verify before assuming).
Don't port these into the homepage build. They'll matter once we build the
pages they now belong to.

## New pages — nav items, blank for now

Nav currently lists: **About Us, Passionate Sea People, Sail with Us, La Paz,
Boats, Blog, Contact.** For now, each gets a blank Astro page with just a
title (Tina-editable), nothing else.

⚠ Two of these weren't in the original scope discussion — **"Passionate Sea
People"** likely maps to the crew/"who you sail with" content, but **"Blog" is
new** and wasn't accounted for anywhere before. A blog implies its own content
type and template eventually — flag this back rather than silently building
toward it, since it may need a scope/estimate conversation the same way the
single-page → multi-page change did.

Legal pages (terms, privacy, credits) are separate, already-scoped deliverables
— not part of this nav-blank-page task.

## Stack

- **Astro**, static output.
- **Tailwind CSS.**
- **TinaCMS**, self-hosted, Vercel Functions backend, **Google OAuth** (not
  GitHub — the marketing team has no GitHub accounts).
- **Preact** for every piece of component-level interactivity that needs a
  framework — sliders (boats, crew), route tabs, the fauna selector (if still
  live), the FAQ accordion, and the funnel wizard. One framework instead of
  the earlier three-way Alpine/Preact/vanilla split, and Preact over React
  specifically — Preact was already the vetted choice for the funnel, and
  standardizing there avoids running two React-family frameworks on one small
  site while keeping the smaller runtime. **Flag this back if you actually
  want the full three-way split restored (Alpine for the simple toggles,
  Preact for the funnel only) rather than one consolidated framework.**
- **Vanilla JS**, ported close to as-is, for page chrome only: splash screen,
  scroll-solidifying nav, IntersectionObserver reveals, pointer-tracked tilt,
  magnetic buttons, the canvas depth-gauge ("sounder"), contact-info
  injection. These aren't Tina content blocks — no framework needed.

## Breakpoints — Tailwind defaults only

Do **not** replicate the original CSS's custom breakpoints (720px, 960px,
1280px, etc.). Use Tailwind's defaults everywhere:

| Tailwind | Min-width |
|---|---|
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |
| `2xl` | 1536px |

Where the original design has a custom breakpoint, use the nearest Tailwind
default rather than an arbitrary value. **The sounder gauge was desktop-only
above a custom 1280px threshold — it now shows at `lg:` (1024px) and above.**

## Locked design tokens (verified against the full CSS, not just documented
custom properties)

Every color in the entire stylesheet is `#0e1b2b` (ink), `#ffffff` (white), or
an opacity variant of one of those two — with exactly one real outlier.

```js
// tailwind.config.js
theme: {
  extend: {
    colors: {
      ink: '#0e1b2b',
      'ink-hover': '#1b2f47', // btn-primary hover — the one real outlier, not an opacity variant
      surface: '#f7f6f1',
      // white is Tailwind's built-in `white` — covers the old --bg and --on-ink
    },
    borderRadius: {
      sm: '3px',
      DEFAULT: '6px',
      lg: '10px',
    },
    transitionTimingFunction: {
      out: 'cubic-bezier(0.16, 1, 0.3, 1)',
      soft: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
  },
}
```

Every old `--ink-2` / `--mute` / `--line` / `--line-2` / `--line-strong` usage
becomes Tailwind's opacity modifier on `ink` (`text-ink/74`, `border-ink/14`,
etc.). Same for every white-opacity value in the hero/nav/footer — direct
`text-white/60`, `bg-white/12`, no token needed.

## Locked button mapping

Base (shared): `inline-flex items-center justify-center gap-2 rounded px-7
py-4 text-sm font-medium whitespace-nowrap border border-transparent
transition duration-500 ease-soft`

| Variant | Default context | Inside `.hero` |
|---|---|---|
| Primary | `bg-ink text-white hover:bg-ink-hover hover:-translate-y-0.5` | `bg-white text-ink hover:bg-surface hover:-translate-y-0.5` |
| Ghost | `border-ink/26 text-ink hover:bg-surface hover:border-ink hover:-translate-y-0.5` | `border-white/45 text-white hover:bg-white/12 hover:border-white hover:-translate-y-0.5` |

Build one `<Button>` component with a `context="default" | "hero"` prop rather
than duplicating both class sets at every call site. `btn-sm` → `px-5 py-2.5
text-xs`. `btn-wide` → `w-full`. Disabled state uses Tailwind's native
`disabled:opacity-35 disabled:pointer-events-none`.

`.lang-btn` is related but separate — it inherits the nav's own light/dark
scroll-state swap, not the hero-context pattern above. Decide how to handle
that specifically when building Nav, not now.

## Field rename table (Spanish → English) — unchanged from before

| Current (Spanish) | New (English) |
|---|---|
| `dias` | `tripDuration` |
| `quien` | `travelingAs` |
| `invitados` | `guestCount` |
| `foco` | `routeFocus` |
| `prioridad` | `topPriority` |
| `desde` / `hasta` | `dateFrom` / `dateTo` |
| `fechas_libres` | `flexibleDates` |
| `barco` | `boatPreference` |
| `nombre` | `fullName` |
| `contacto` | `whatsappNumber` |
| `extra` | `notes` |

All code in English regardless of what language the content displays in —
unchanged ground rule from before.

## Non-negotiable ground rules

1. All code in English (see above).
2. **Every component must be editable via TinaCMS's visual/contextual
   editor** — click on the live page, edit in place. Not just a bare form
   somewhere else. This is the actual objective of this pass.
3. Tailwind default breakpoints only (see above).
4. This pass's goal: **a fully editable homepage** — every one of the 6
   current sections driven by Tina content, nothing hardcoded, before moving
   to the nav pages or anything else.
5. Preserve exactly: the funnel's partial-lead capture (blur + `sendBeacon` on
   tab-close), draft autosave/restore (`localStorage`), the dynamic WhatsApp
   message generation, `prefers-reduced-motion` and no-JS fallbacks.

## Out of scope for this pass

Routes, day-in-life, activities, FAQ — not on the current homepage, don't
build them now. Mogu embed, translation automation, and QA/launch checks are
separate, later work — see prior session planning once the homepage is fully
componentized.
