# Insights maintenance

Rules for when a file gets full, and for the one mode in which append-only lifts.
Loaded from [SKILL.md](SKILL.md); you rarely need it.

## Growth

Soft caps per section, per file: **What Doesn't Work 20 · Recurring Errors & Fixes 15 ·
What Works / Codebase Patterns / Tool & Library Notes 12 each · Open Questions 8.**
File-level cap **200 lines**.

At cap, run the **displacement test**: find the weakest entry in that section (most
superseded, most stale, least anchored) and compare it to the candidate.

- Candidate not clearly stronger → **drop the candidate.** The common case, and correct.
- Clearly stronger → append it, *and* append a retirement nomination to the consolidation
  queue at the bottom of the file. It is an HTML comment: invisible when rendered, free to
  scan, and pure append for you.

```markdown
<!-- consolidation-queue
- retire: "Invalidate PR lists with the 2-element key" (2026-11-18) — folded into 2026-12-03.
-->
```

Over the file cap, say it **once** at the end of the session — *"`server/INSIGHTS.md` is at
214 lines with 2 retirement nominations queued; consider a consolidation pass"* — then stop.
No nagging, no auto-cleanup.

## Consolidation mode

Append-only binds your *autonomous* behaviour, not the file. It lifts only in a session
whose sole task is consolidation, started explicitly by a human
(`/engineering-insights consolidate server`). In that mode you may:

- delete entries named in the consolidation queue, then empty the queue;
- delete a superseded original whose supersede entry is ≥30 days old;
- merge a parent entry with its nested refinements into one line.

You may **not** invent, reword, or weaken a surviving claim. A merge keeps the strongest
variant's wording and its earliest date. The consolidation commit is the diff a human
reviews, and git history is the real archive — nothing is ever lost.
