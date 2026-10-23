---
name: translation-automation-engineer
description: SUPERSEDED. This agent built the GitHub Action that drafted ES/FR translations with DeepL on every push. That flow was replaced by the /translate command (.claude/skills/translate/SKILL.md). Do not use this agent for new work.
tools: Read, Write, Edit, Bash
---

**Obsolete.** Spanish and French are no longer drafted by a GitHub Action on every
push. A person runs `/translate` in Claude Code; the scripts are
`scripts/translate-prepare.mjs` and `scripts/translate-apply.mjs`, and the flow is
described in `docs/translation-workflow.md`.

`.github/workflows/translate-content.yml` now only has a manual `workflow_dispatch`
run that uses the DeepL API (`scripts/translate-content.mjs`, `scripts/lib/deepl.mjs`)
as a fallback. If you are asked to change the translation process, work from
`docs/translation-workflow.md` and `.claude/skills/translate/SKILL.md`, not from the
Session 3 brief this agent used to carry.
