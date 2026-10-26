---
name: translate
description: Draft the Spanish and French for whatever English text changed since the last translation, on a separate branch, check it on the local site, and merge to main once the person approves. Run it once after a batch of editor changes. Run it once after a batch of editor changes. Use when someone says "translate", "run /translate", "update the Spanish and French".
---

# /translate

Drafts Spanish and French for the English text that changed since the last translation. Deterministic scripts decide what needs translating and write the files; you only translate the strings in the work file. Nothing here runs on save, and no paid translation API is used.

Read `AGENTS.md` section 3 ("Translations") first if you have not this session.

## Steps

0. **Branch.** Make sure you are on `main` and it is up to date (`git pull`). If there are uncommitted changes, tell the person and stop. Then `git checkout -b translations-YYYY-MM-DD` (today's date; add `-2` if the branch already exists). Everything below happens on this branch; never on `main`.
1. **Prepare.** Run `npm run translate:prepare`.
   - If it says nothing needs translating, tell the person that Spanish and French are up to date and stop.
   - If it stops because English files have uncommitted changes, tell the person to commit or discard them first. Do not commit for them.
   - On the very first run it records the current commit as "in sync" and only translates strings that have no translation yet.
   - If the existing translations are known to be behind, ask the person for the commit they were last in sync with and run `npm run translate:prepare -- --since <sha>` on the very first run (it records that commit instead of the current one).
2. **Read the work file** `.translation-work/pending.json`. Each entry has `id`, `file`, `locale` (`es` or `fr`), `collection`, `path`, `field` (the editor label), `hint` and `english`. Also read `scripts/translation-glossary.md`, and look at a few pairs in `scripts/translation-memory.json` for the tone.
3. **Translate** only the entries in `pending.json`. Write `.translation-work/translated.json` as `{ "<id>": "<translation>" }`, one key for every entry, no others.
   - Never invent entries. Never edit `en` files. Never edit `es` or `fr` files by hand: the apply script writes them.
   - Keep markdown, links, link targets, line breaks (`\n`) and emphasis exactly as in the English. Do not change a URL.
   - Do not translate names, boat names, place names or anything the glossary says not to. (Fields marked `doNotTranslate` never reach the work file.)
   - Tone: match the existing approved translations. Today that is informal **tú** in Spanish and formal **vous** in French. Say what you inferred in your report.
   - Keep the length close to the English where the text is a button, heading, label or card.
   - Use the glossary terms exactly.
4. **Apply.** Run `npm run translate:apply`. If validation fails (missing or extra id, empty text, a changed link, different line breaks), fix `translated.json` and run it again. Nothing is written until it passes.
5. **Repeat.** Run `npm run translate:prepare` again. If it lists more files (large batches are split), go back to step 2. Stop when it says nothing is left.
6. **Report** to the person:
   - the files written, and how many strings were translated, reused and taken from the translation memory, per language;
   - every warning from the apply script;
   - the tone you inferred for each language;
   - any open question for a native reviewer (a term not in the glossary, a guess you made). Add new fixed terms you chose to `scripts/translation-glossary.md`, marked **guess**.
7. **Commit and back up.** Commit the changed `content/**` files and `scripts/translation-state.json` on the branch (never `.translation-work/` or `.translation-report.md`). Push the branch as a backup (`git push -u origin <branch>`). Do not open a pull request.
8. **Check locally.** Start the local site so the person can read the drafts:
   - make sure ports 9000, 4001 and 4321 are free (stop anything else the person agrees to stop);
   - run `TINA_PUBLIC_IS_LOCAL=true npx tinacms dev` in the background, wait about 20 seconds, then `TINA_PUBLIC_IS_LOCAL=true npx astro dev --background` (`npm run tina:dev` can exit early in this setup);
   - give the person links for the pages that changed, in Spanish and French: `hero`, `difference`, `wildlife`, `funnel`, `crewSection` and similar are the home page `/es/`; `boats/<slug>` is `/es/boats/`; `crew/<slug>` and `crewPage` are `/es/passionate-sea-people/`; `blogPost/<slug>` is `/es/blog/<slug>/`; `landingPage/<slug>` is `/es/landing/<slug>/`; `contactPage` is `/es/contact/`; `aboutPage` is `/es/about-us/`; `guestStoriesPage` is `/es/about-us/guest-stories/`; `sailWithUsPage` is `/es/sail-with-us/`; `navigation` and `footer` show on every page (replace `es` with `fr`). The editor is at http://localhost:4001/admin;
   - say you have only checked that each page returns a response, not how it looks.
9. **Corrections.** If the person wants a wording changed, change that value in the Spanish or French file as they ask (this is the one case where you edit those files), commit it on the branch and push. If the wording must survive future English edits, also add it to `scripts/translation-memory.json`, and fixed terms to `scripts/translation-glossary.md`.
10. **Only after the person clearly says to merge** (for example "approved", "merge it"): stop the local servers, then `git checkout main`, `git pull`, `git merge --no-ff <branch>`, `git push origin main`, and delete the branch locally and on GitHub. Tell the person that the pages go live when `main` deploys, and only in the languages listed in `PUBLIC_LIVE_LOCALES`. If they say no, or are not sure, leave the branch as it is and do not touch `main`. Never merge or push `main` on your own judgement.

## Rules

- Do not edit `scripts/translation-state.json` by hand: deleting or editing it makes `/translate` re-send everything.
- A reviewer's correction made in the editor is kept as long as that English string does not change. Wording that must survive an English change goes in `scripts/translation-memory.json`.
- `npm run translate:status` lists the English files that are out of date without writing anything.
