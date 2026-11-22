# Engineering Insights — `@devdigest/web`

**Contract.** Append-only, hard-won findings only. Add a line here only if a competent
engineer who has already read `CLAUDE.md` and `README.md` would do something *different*
tomorrow because of it. Already stated in `CLAUDE.md`, a README, or library docs → it does
not belong here. Max 3 new entries per session; **zero is the normal outcome.** Never edit
or delete an existing entry — correct one by appending a `Supersedes:` entry. Newest wins.

**Scope:** Next.js App Router, React 19, TanStack Query, Tailwind 4, the vendored UI system, i18n namespaces.

**Format:** `- **Claim.** Mechanism + evidence + what to do. <path> · YYYY-MM-DD`

**Rules:** `.claude/skills/engineering-insights/SKILL.md`

---

## What Doesn't Work

_Approaches that looked right and failed, with the reason. The highest-value section._

- **`borderColor` + `borderLeftColor` still trips React's shorthand warning.** `FindingCard`'s
  `s.card` claims to be "all-longhand", but `borderColor` is itself a shorthand for the four
  side colours, so every rerender that flips `focused` logs "Updating a style property during
  rerender (borderColor) when a conflicting property is set (borderLeftColor)" — seen in
  `pnpm test` once `FindingsPanel` filters started moving focus. For a per-side accent, set
  `borderTopColor`/`borderRightColor`/`borderBottomColor` individually, never `borderColor`.
  `client/src/app/repos/[repoId]/pulls/[number]/_components/FindingCard/styles.ts` · 2026-11-22

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
