# Eagle Ray Expeditions — Claude Code Session Prompts

Copy-paste the relevant block into Claude Code at the start of each session.
`CLAUDE.md` and everything in `.claude/agents/` should already be in the repo
before Session 1 starts.

## Session 1 — Foundation.

```
Set up the foundation for the Eagle Ray Expeditions Astro migration, per CLAUDE.md.

1. Use the tina-schema-architect agent to set up self-hosted TinaCMS — the GraphQL
   backend on Vercel Functions, the multi-user auth provider (GitHub or Google OAuth),
   and the full collection schema (routes, boats, crew, wildlife, day-in-life, FAQ,
   site settings, the 3 legal pages, and a landingPages block collection).

2. Use the css-tailwind-auditor agent to produce the complete, verified CSS-to-Tailwind
   migration audit against the actual repository — don't just trust the preliminary
   audit in CLAUDE.md, confirm it against the real files.

3. Scaffold the Astro project with the resulting Tailwind config, and set up i18n
   routing (/en/, /es/, /fr/) with correct hreflang tags.

4. Confirm TinaCMS Visual Editing works on a Vercel Preview Deployment before moving on.

Acceptance for this session: a working Astro + Tailwind + self-hosted Tina scaffold,
with the schema defined, auth working for at least one test user, and a preview
deployment showing live visual editing.
```

## Session 2 — Components & Content Migration

```
Build the component library and migrate the site's content, per CLAUDE.md.

1. Use the content-migrator agent to extract all EN/ES/FR content from the current
   site into the Tina schema from Session 1 — apply the English field-rename table
   in CLAUDE.md exactly, and produce the migration report.

2. Use the component-builder agent to build the full component set, following the
   Alpine/Preact/vanilla interactivity split decided in CLAUDE.md. Read the audit
   and schema output from Session 1 before starting — don't re-derive decisions
   already made.

3. Wire up contextual/visual editing on every component so Thibault's team can
   click-to-edit on the live page.

Acceptance for this session: the full site renders correctly in all three languages,
visually matching the current live site, with content coming from Tina rather than
hardcoded, and the content-migration report showing no unresolved gaps.
```

## Session 3 — Landing Pages, Mogu Embed, Translation Automation

```
Build the remaining content-authoring tools, per CLAUDE.md.

1. Use the component-builder agent to build the landing-page block templates and
   the MoguProposal iframe embed component (tripSlug + height as Tina fields).

2. Use the translation-automation-engineer agent to build the GitHub Action:
   triggers on source-language content changes, calls the DeepL API, opens a
   review-gated PR — confirm it produces a working Vercel preview with Tina
   Visual Editing active before considering this done.

Acceptance for this session: Thibault could build a new landing page from Tina
blocks with no code, embed a Mogu proposal by pasting a trip slug, and a real
content change produces a translation PR that's actually reviewable, not just
a diff.
```

## Session 4 — Vibe-Coding Layer, Training Prep, QA & Launch

```
Finish the guardrails and verify the site is ready to launch, per CLAUDE.md.

1. Write an AGENTS.md at the repo root aimed at Thibault (non-technical) — project
   conventions, the component library, and guardrails for using an AI coding
   assistant to build new pages safely within the existing system. This is a
   different document from CLAUDE.md — it's for Thibault's own future use, not
   for this migration work.

2. Use the qa-release-engineer agent to work through the full launch checklist —
   build integrity, indexability, content parity, accessibility, the funnel's
   full behavior (including the partial-lead-capture paths), analytics, and the
   Mogu embed on a real trip.

3. Fix anything the QA pass flags before calling this session done.

Acceptance for this session: docs/launch-checklist.md is entirely green, and the
site is ready for DNS cutover.
```
