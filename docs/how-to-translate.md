# How to update the Spanish and French (step by step)

For Thibault and the marketing team. You do not need to code. The technical details are in `docs/translation-workflow.md`.

## When to do it

After you finish a batch of changes in the editor (a new page, new boats, a round of edits to English text). Do it **once per batch, not after every save.** Until you do, Spanish and French keep showing their last reviewed text. Nothing breaks if you wait.

## Before you start

1. Finish and save your English edits in the editor (`/admin`). Every save is already stored on GitHub.
2. Open the project in **Claude Code** (the VS Code extension or the app). Claude will switch to `main`, bring it up to date and make a new branch for you. If anything in the project is half-edited, it tells you and stops. Save or discard those changes first.
3. Make sure nothing else is running on your computer on ports 9000, 4001 or 4321 (a leftover `npm run tina:dev`, for example). Claude needs them to show you the site.

## Run it

1. In the Claude Code chat, type:

   ```
   /translate
   ```

2. Claude creates a branch named `translations-YYYY-MM-DD` (today's date). This is a separate copy of the site: **the live site is not touched.**
3. Claude works out which English text changed since the last translation and says how many strings need translating, per language and per file. If nothing changed, it tells you Spanish and French are up to date and stops.
4. Claude translates only those strings, checks its own work (links, line breaks, nothing empty) and writes the Spanish and French files. A large batch is done in several rounds. You do not need to do anything while it works.
5. Claude saves the work on the branch and uploads the branch to GitHub as a backup. **It does not open a pull request.**
6. Claude gives you a **report**:
   - how many strings it translated, how many it kept from the existing translations and how many it took from the approved translation list;
   - **warnings**, such as a file it matched by field because its structure had changed. Look at those pages first;
   - **questions** for a native reviewer, such as a word it was not sure about.

## Check it on your computer

1. Claude starts the site on your computer and gives you links to the pages that changed, in Spanish and French, for example `http://localhost:4321/es/boats/`. Nothing here is public.
2. Read the new text. If you can, ask a Spanish speaker and a French speaker to read it too. Look at the pages on a phone-sized window and on a laptop, in both languages. Watch for English text that is still there, long words that break a button or a card, and names that were changed by mistake.
3. To fix a word, tell Claude in the chat (*"in the Boats page, change X to Y in Spanish"*), or change it in the editor at `http://localhost:4001/admin` and tell Claude you did. Claude saves the fix on the branch.
4. If a fix must survive future edits to the English, say so: *"keep this wording permanently."* Claude adds it to `scripts/translation-memory.json`. Names and fixed phrases go in `scripts/translation-glossary.md`.

## Approve and merge

1. When you are happy, tell Claude clearly: **"approved, merge it."**
2. Only then does Claude merge the branch into `main`, stop the local site and delete the branch. The new text goes live when the site deploys, and only for the languages that are turned on (`PUBLIC_LIVE_LOCALES` in Vercel, set by Kinich). Check the live site in Spanish and French once the deploy has finished.
3. If you are not sure, or say no, Claude leaves everything as it is. `main` is not touched, and you can come back to the branch later.

## Useful extras

Ask Claude any of these in the chat:

- *"Which Spanish and French files are out of date?"* lists them without changing anything.
- *"Show me what `/translate` would translate."* prints the strings and a character count without writing anything.

## If something goes wrong

- **Claude says there are changes that are not saved:** save or discard them first.
- **The site will not start:** something else is using port 4321 or 4001. Close the other terminal, or ask Claude to find and stop it.
- **The result looks wrong:** do not approve. Tell Claude what is wrong, or say no and ask Kinich. Nothing reaches `main` until you approve.
- **Never edit `scripts/translation-state.json` by hand.** It records what is already translated. Deleting or changing it makes the next run translate everything again.
- **A page is missing in Spanish or French:** it was probably created after the last run. Run `/translate`.

Ask Kinich for anything about hosting, logins or the scripts.
