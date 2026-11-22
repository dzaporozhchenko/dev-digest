---
name: engineering-insights
description: Read and maintain the per-module INSIGHTS.md files — this repo's durable, append-only memory of what worked, what didn't, and why. Use at the START of any task touching client/, server/, reviewer-core/, e2e/, or repo-wide tooling (read that module's INSIGHTS.md before planning or editing), and again at the END (append anything a future session would act on). Writing nothing is the normal outcome — most sessions add zero entries. This skill does NOT replace CLAUDE.md (conventions) or README.md (reference); never record anything already stated there.
argument-hint: "[consolidate <module>]"
paths: ["client/**", "server/**", "reviewer-core/**", "e2e/**", "scripts/**", ".github/**"]
---

# Engineering Insights

Five `INSIGHTS.md` files hold what past sessions learned the hard way. Each one lives next
to the code it describes, so a session in `server/` reads server lessons, not client ones.

`CLAUDE.md` holds conventions. `README.md` holds reference. **This file holds only what you
could not have known without running something.** If a line belongs in one of the other
two, it does not belong here.

- Worked good/bad entries: [examples.md](examples.md)
- Seed content for a new file: [TEMPLATE.md](TEMPLATE.md)
- Caps, consolidation mode: [maintenance.md](maintenance.md)
- Sources and rationale: [references.md](references.md)

## Routing

| Work touched | File |
|---|---|
| `client/**` | `client/INSIGHTS.md` |
| `server/**` including `src/modules/repo-intel/**` | `server/INSIGHTS.md` |
| `reviewer-core/**` | `reviewer-core/INSIGHTS.md` |
| `e2e/**` | `e2e/INSIGHTS.md` |
| `scripts/`, `.github/`, docker, root config, `vendor/shared` drift, anything cross-package | `INSIGHTS.md` (repo root) |

One insight lives in **exactly one** file — the most specific one that owns it. A lesson
about the server's half of a shared contract goes in `server/INSIGHTS.md`; a lesson about
the two copies drifting goes in the root file. Never copy an entry into two files.

## Phase A — Read (before planning or editing anything)

1. Map the task to a module with the routing table.
2. `Read` that `INSIGHTS.md` **in full**. They are capped at 200 lines — no grep-sniping.
3. Task spans modules → read each. Also read the root file whenever the change crosses
   package boundaries or touches `vendor/shared`, `scripts/`, or CI.
4. When two entries conflict, **the newest wins**.

Do this before you form a plan, not after. The point is to avoid the dead end, not to
recognise it afterwards.

## Phase B — Capture (after the task is finished or abandoned)

Never mid-task. An insight written mid-task is a hypothesis, not a finding.

1. Re-read the target file — it may have changed, and you need it for dedup.
2. Run every candidate through the five gates below. Expect most to die here.
3. Classify each survivor: duplicate / refinement / contradiction / new.
4. Append. **Never edit or delete an existing entry.**
5. Nothing survived → **write nothing and say nothing.** Do not announce the non-event.

## The admission filter

**The Tomorrow Test.** Would a competent engineer who has already read this package's
`CLAUDE.md` and `README.md` take a **different action** tomorrow because of this line?
If no → drop it.

That is subjective alone, so it is operationalised as five binary gates. **All five must be
YES.** Any NO drops the line silently — never soften it and keep it.

| # | Gate | Check |
|---|---|---|
| 1 | **Earned** | Did I learn this by *running* something here — a test, `typecheck`, a query, a request, an e2e flow — rather than by reading docs or reasoning? |
| 2 | **Surprise** | Was I wrong about this 20 minutes ago, or did it cost me ≥1 wasted attempt? A line that corrects no prior belief is a restatement. |
| 3 | **Anchored** | Does it contain ≥1 repo proper noun — file path, exported symbol, table/column, command, config key, or verbatim error string? Zero → drop. |
| 4 | **Actionable** | Does it say what to do or not do next time, in the imperative? "X is confusing" is not an action. |
| 5 | **Absent** | `grep -ri "<key noun>"` this package's `CLAUDE.md` and `README.md`, the root `CLAUDE.md`, `TESTING.md`, and the target `INSIGHTS.md`. A hit means drop — or supersede, never restate. |

**Durability override.** Will this still be true after the current branch merges? If the
insight dies with the fix you just shipped, it is a changelog entry and git already has it.

**Volume cap: 3 entries per session per file.** More candidates than that means the filter
is not being applied — rank by "minutes this would have saved me" and keep the top 3.

**Zero entries is the normal outcome of a normal session. Writing nothing is a success.**

### Never record

- Anything already in a `CLAUDE.md`: migrations not applied on boot · no ESLint/Prettier ·
  M1–M8 deliberately absent · `*.it.test.ts` excluded from the unit lane · `@devdigest/shared`
  has two physical copies · never import another module's `repository.ts` · routes are
  schema-first · every query filters by `workspaceId` · no `fetch` outside
  `client/src/lib/api.ts` · `reviewer-core` does no I/O · agent-browser `chat` is banned.
- Anything in a `README.md` or `TESTING.md` — env tables, route maps, CI lanes.
- Restatements of library docs: that `safeParse` returns a union, that Drizzle has `eq()`.
  If the library behaved **as documented**, there is nothing to record.
- Task narration ("fixed the bug", "added the endpoint") and status ("tests pass").
- Generic wisdom ("prefer small functions"), preferences, vibes ("this module is complex").
- Anything unverified you could have verified in 60 seconds. Run it, then write it, or don't.

## Entry format

```markdown
- **<Imperative claim, one line, bold.>** <2–3 sentences: mechanism, the evidence that
  proved it, what to do instead.> `relative/path` · YYYY-MM-DD
```

Bold claim first — the reader is an agent scanning at session start, so the first six words
must carry the payload. File anchor trailing, **no line number** (lines rot in days, paths
don't). ISO date trailing — the staleness signal and the supersede tiebreaker. No author,
no session id, no ticket: provenance is git blame, and every byte competes with the claim.

**No confidence tiers.** The one permitted marker is `[unverified]`, used only when the
finding was observed once and the mechanism is not understood:
`- **[unverified] <claim>** …`

## The six sections

In file order. `What Doesn't Work` is first on purpose: it is the highest-value section and
the one most often skipped, so it gets the position an agent reads when it reads only the top.

1. **What Doesn't Work** — approaches that looked right and failed, with the reason.
2. **What Works** — non-obvious approaches that succeeded where the obvious one didn't.
3. **Codebase Patterns** — structural facts about this code not written down elsewhere.
4. **Tool & Library Notes** — where a tool behaved *differently from its docs, in this repo*.
5. **Recurring Errors & Fixes** — error string → cause → fix. Seen twice, or non-obvious cause.
6. **Open Questions** — what we don't know, phrased so a future session can answer it.

### Empty sections

Deleting the exact line `_(none yet)_` to write the first entry in a section is **not** a
violation of append-only. Do it without hesitation.

**An empty section is a correct and common state. Never write an entry because a section is
empty.** Four sections still empty after a month is expected, not a gap to fill.

## Dedup and supersede

`grep -i` the target file for the candidate's **key noun** — the most specific proper noun
in the claim (`ivfflat`, `invalidateQueries`, `db:generate`, `readContainedFile`). Then
classify against each hit:

| Outcome | Test | Action |
|---|---|---|
| **Duplicate** | Same claim, same conclusion, however worded | **Write nothing.** |
| **Refinement** | Existing claim is right; you add a condition, boundary, or number | Append an indented sub-bullet under the parent. Inserts a line, never alters the parent. Max one level — a second means supersede instead. |
| **Contradiction** | The existing claim is now wrong, or always was | Append a supersede entry at the bottom of the section. |
| **New** | No hit, or hits are unrelated | Append at the bottom of the section. |

```markdown
- **Supersedes "<verbatim first clause of the old claim>" (2026-11-18): it now does.**
  <What changed and what to do now.> `path` · 2026-12-03
```

Quoting the old claim verbatim means one `grep` surfaces both lines together, so nothing
has to be written onto the old line. Stale entries are inert rather than misleading,
because the file header states that the newest wins.

## Growth and consolidation

Soft caps per section, per file: **What Doesn't Work 20 · Recurring Errors & Fixes 15 ·
What Works / Codebase Patterns / Tool & Library Notes 12 each · Open Questions 8.**
File-level cap **200 lines**. At cap, the default answer is **drop the candidate**.

Read [maintenance.md](maintenance.md) when a section is at cap, when the file is over 200
lines, or when the user explicitly asks for a consolidation pass.
