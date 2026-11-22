# Seed template

Copy the block below into a new `INSIGHTS.md`, replace `<TITLE>` and `<SCOPE>`, and leave
every `_(none yet)_` in place. Scope lines are in the table underneath.

---

```markdown
# Engineering Insights — <TITLE>

**Contract.** Append-only, hard-won findings only. Add a line here only if a competent
engineer who has already read `CLAUDE.md` and `README.md` would do something *different*
tomorrow because of it. Already stated in `CLAUDE.md`, a README, or library docs → it does
not belong here. Max 3 new entries per session; **zero is the normal outcome.** Never edit
or delete an existing entry — correct one by appending a `Supersedes:` entry. Newest wins.

**Scope:** <SCOPE>

**Format:** `- **Claim.** Mechanism + evidence + what to do. <path> · YYYY-MM-DD`

**Rules:** `.claude/skills/engineering-insights/SKILL.md`

---

## What Doesn't Work

_Approaches that looked right and failed, with the reason. The highest-value section._

_(none yet)_

## What Works

_Non-obvious approaches that succeeded where the obvious one didn't._

_(none yet)_

## Codebase Patterns

_Structural facts about this code that are not written down elsewhere._

_(none yet)_

## Tool & Library Notes

_Where a tool or library behaved differently from its documentation **in this repo**.
Not a summary of docs._

_(none yet)_

## Recurring Errors & Fixes

_Error string → cause → fix. Only errors seen more than once, or whose cause was
non-obvious._

_(none yet)_

## Open Questions

_What we don't know yet, phrased so a future session can answer it. When one is answered,
append the answer as an entry in the section above and append `Answered:` here._

_(none yet)_
```

---

## Titles and scope lines

| File | `<TITLE>` | `<SCOPE>` |
|---|---|---|
| `INSIGHTS.md` | DevDigest (cross-package) | Cross-package only — the repo as a whole, or the seams between packages: `@devdigest/shared` drift, tsconfig path aliases, CI `paths:` filters, Docker/Postgres, `scripts/*.sh`. True of only one package? Write it in that package's file. |
| `client/INSIGHTS.md` | `@devdigest/web` | Next.js App Router, React 19, TanStack Query, Tailwind 4, the vendored UI system, i18n namespaces. |
| `server/INSIGHTS.md` | `@devdigest/api` | Fastify, Drizzle, Postgres/pgvector, jobs and SSE, DI adapters, and everything under `src/modules/` including `repo-intel`. |
| `reviewer-core/INSIGHTS.md` | `@devdigest/reviewer-core` | Prompt assembly, grounding, structured LLM output, map-reduce, observed model behaviour. |
| `e2e/INSIGHTS.md` | `@devdigest/e2e` | agent-browser CLI, locator stability, seeded-data assumptions, flow ordering. |
