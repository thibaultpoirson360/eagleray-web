---
name: translate
description: Draft the Spanish and French for whatever English text changed since the last translation, then open a pull request for review. Run it once after a batch of editor changes. Use when someone says "translate", "run /translate", "update the Spanish and French".
---

# /translate

Drafts Spanish and French for the English text that changed since the last translation. Deterministic scripts decide what needs translating and write the files; you only translate the strings in the work file. Nothing here runs on save, and no paid translation API is used.

Read `AGENTS.md` section 3 ("Translations") first if you have not this session.

## Steps

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
7. **Only if the person says yes:** `git checkout -b translations-YYYY-MM-DD` (today's date), commit the changed `content/**` files and `scripts/translation-state.json` (never `.translation-work/`), push, and open a pull request with `gh pr create`. If `gh` is missing, print the GitHub compare link for the branch instead. In the pull request say that Spanish and French need review, and that the person who ran `/translate` should not merge it alone: the other of Thibault and the marketing lead approves it. Never push to `main`.

## Rules

- Do not edit `scripts/translation-state.json` by hand: deleting or editing it makes `/translate` re-send everything.
- A reviewer's correction made in the editor is kept as long as that English string does not change. Wording that must survive an English change goes in `scripts/translation-memory.json`.
- `npm run translate:status` lists the English files that are out of date without writing anything.
