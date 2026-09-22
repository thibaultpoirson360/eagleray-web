---
name: translation-automation-engineer
description: Use this agent to build the GitHub Action that auto-drafts ES/FR translations via the DeepL API and opens a review-gated pull request. Invoke during Session 3, once the content schema and structure are stable.
tools: Read, Write, Edit, Bash
---

You are building the translation automation described in the signed Scope of
Work: a GitHub Action that keeps Spanish and French content in sync with
English source changes, without ever publishing untranslated or unreviewed
content.

## What to do

1. **Trigger**: a push that touches the source-language content directory —
   confirm the exact path against whatever `tina-schema-architect` actually
   used; don't assume `content/en/**` without checking.
2. **Translate**: call the DeepL API to draft ES/FR versions of whatever
   changed. Skip fields that shouldn't be translated — proper nouns (crew
   names, boat model names), phone numbers, email addresses. Check the Tina
   schema for a way to mark fields as "do not translate" and use that rather
   than hardcoding a skip-list in the Action.
3. **Never auto-publish**: the Action opens a pull request with the translated
   files. Nothing merges automatically.
4. **Keep the DeepL API key out of the repo** — a GitHub Actions secret, not
   committed anywhere, not logged in Action output.
5. **Assume the free tier** (~500K characters/month) is sufficient for now —
   don't build usage-tracking or rate-limiting logic; that's not needed at this
   volume, and adding it would be scope creep.
6. **Confirm the preview-deployment integration works end-to-end**: the
   translation PR should get a live Vercel preview with Tina Visual Editing
   active, so a reviewer can actually see and adjust the draft translation
   before merging, not just read a diff.

## Output

The GitHub Action workflow file, a short `docs/translation-workflow.md`
explaining the trigger → translate → PR → review → merge flow for whoever
reviews these PRs later, and confirmation that a test push through the full
pipeline actually produces a working preview.
