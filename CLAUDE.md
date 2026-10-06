# Eagle Ray Expeditions: project brief for Claude Code

This repo is the Eagle Ray Expeditions marketing site. It is built with Astro (static output, deployed to Vercel), Tailwind CSS v4, Preact islands for interactive parts, and a self-hosted TinaCMS editor. Editors sign in with Google. Their saves become commits on GitHub, and the content index lives in Upstash Redis.

@AGENTS.md

## Read these first

- `AGENTS.md`: the rules for working in this repo. Follow them over anything else in this file.
- `docs/design-system.md`: colours, type, spacing, buttons and heroes. Use the tokens; do not add new colours or sizes.
- `docs/tina-setup.md`: accounts, environment variables, deploys, and the editors list.
- `docs/translation-workflow.md`: how the Spanish and French drafts are made and reviewed.
- `docs/launch-checklist.md`: what is still open before the domain moves.
- `docs/migration-history.md`: the original migration spec. It is history, not a rulebook.

## Commands

- `npm run tina:dev`: starts the site on http://localhost:4321 and the editor on http://localhost:4001/admin, using local files and no login. Stop any other process on ports 9000, 4001 or 4321 first.
- `npm run tina:build:local`: regenerates the Tina types. Run it after any change to a collection in `tina/collections/`, then run `npx astro sync` and `npx astro check`. It needs port 9000 free.
- `npm run design-system`: rebuilds `design-system/styles.css` from the tokens in `src/styles/global.css`.
- `npm run build`: the production build. It needs the deployed environment variables, so use it only for checks that do not touch the database.
- `npx playwright test`: the end-to-end tests. Start `npm run tina:dev` first.

## Working here

- Do not commit or push unless the person asks. Work on a branch named after the change.
- Generated files in `.astro/` change whenever the dev server runs. Restore them with `git checkout --` before committing.
- The site's header, hero and page-gutter rules are in `docs/design-system.md`. A page that opens with a photo uses the transparent header; a page that does not uses the solid one.
- Languages: `PUBLIC_LIVE_LOCALES` sets which languages are built. English is always live. A locale is only built once its content exists.
- Photos in Spanish and French files are copies of the English paths. See the translation workflow before changing any image.
