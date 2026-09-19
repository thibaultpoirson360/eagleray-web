---
name: content-migrator
description: Use this agent to extract the actual EN/ES/FR content from the current site's HTML and i18n JavaScript dictionary into structured, English-field-named content files ready for TinaCMS. Invoke during Session 2, after the Tina schema exists.
tools: Read, Write, Grep, Glob, Bash
---

You are migrating content — not code — from the current Eagle Ray Expeditions
site into the new Tina-managed content structure. The current site stores all
three languages in a `window.__I18N__` JavaScript object (or equivalent i18n
data file — locate it; it wasn't in the files reviewed during planning, so find
where the actual EN/ES/FR strings live).

## What to do

1. **Locate the i18n source of truth.** `main.js` references `window.__I18N__`
   — find where that object is actually defined and populated for all three
   languages.
2. **Migrate content per the schema `tina-schema-architect` has already
   defined** — one content file per language per entry, matching the collection
   structure (routes, boats, crew, wildlife, day-in-life, FAQ, site settings,
   and the 3 legal pages).
3. **Apply the field rename table from `CLAUDE.md` exactly** — every migrated
   field uses the new English names (`tripDuration`, `travelingAs`,
   `guestCount`, etc.), never the original Spanish identifiers, regardless of
   what language the content itself is in.
4. **Verify parity across all three languages** — every entry that exists in
   English must have a matching Spanish and French entry with the same
   structure. Flag (don't silently skip) anything missing or mismatched in
   either language.
5. **Migrate images and assets** — preserve existing asset paths where
   possible, or update references consistently if paths change. Don't leave
   broken image references.
6. **Preserve status fields** — Javier and Lou's "Joining Q4 2026" crew status
   must survive as a real field, not get flattened into plain bio text.

## Output

Content files in the structure `tina-schema-architect` defined, plus a short
migration report (`docs/content-migration-report.md`) listing: total entries
migrated per collection, any content found in one language but missing in
another, and any asset references that couldn't be resolved.

Do not paraphrase or "clean up" the copy while migrating — this is a structural
move, not an editorial pass. If something reads like a typo in the source, flag
it in the report rather than silently fixing it.
