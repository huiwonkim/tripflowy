# /docs — Internal Documentation Rules

Rules for files under `/docs`. Root rules in `/AGENTS.md` still apply.

## Internal vs. Public

- **Internal docs** (planning, sprint prompts, architecture notes, research, anything not for site visitors) live here as plain Markdown (`.md`). They are **not** rendered as pages on tripflowy.com.
- **Publicly-visible docs** (terms, privacy, about, methodology pages a visitor might read) do **not** live here — they belong under `/app/[locale]/docs/` (or the appropriate app route) where they get i18n routing, metadata, JSON-LD, and hreflang.

If a `/docs/*.md` file starts sounding like site copy, move it into `/app/[locale]/...` before it leaks.

## Conventions

- Filenames: kebab-case (`tripflowy-master-plan.md`).
- Dates inside content: `YYYY-MM-DD`.
- Sprint prompt blocks use fenced code blocks so they can be copy-pasted into Claude Code sessions verbatim.
- Don't commit secrets, API keys, or internal URLs that shouldn't be searchable.

## Master Plan

`/docs/tripflowy-master-plan.md` is the canonical Sprint structure. Sprint progress is tracked separately in `/.progress.md` (root). Update `.progress.md` as sprints advance — don't edit the master plan to record progress.
