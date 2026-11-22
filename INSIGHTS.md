# Engineering Insights — DevDigest (cross-package)

**Contract.** Append-only, hard-won findings only. Add a line here only if a competent
engineer who has already read `CLAUDE.md` and `README.md` would do something *different*
tomorrow because of it. Already stated in `CLAUDE.md`, a README, or library docs → it does
not belong here. Max 3 new entries per session; **zero is the normal outcome.** Never edit
or delete an existing entry — correct one by appending a `Supersedes:` entry. Newest wins.

**Scope:** Cross-package only — the repo as a whole, or the seams between packages: `@devdigest/shared` drift, tsconfig path aliases, CI `paths:` filters, Docker/Postgres, `scripts/*.sh`. True of only one package? Write it in that package's file.

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

- **Install `client/` with `npx pnpm@10`, never the ambient pnpm 12.** `client/package.json`
  is the only package carrying a `pnpm.overrides` field (`postcss ^8.5.23`, `katex ^0.18.2`);
  pnpm ≥12 no longer reads it, so a plain install rewrites `pnpm-lock.yaml` without those
  pins and `--frozen-lockfile` aborts with `ERR_PNPM_LOCKFILE_CONFIG_MISMATCH`, while any
  script fails first with `ERR_PNPM_VERIFY_DEPS_BEFORE_RUN`. `npx -y pnpm@10 install
  --frozen-lockfile` installs correctly and leaves the lockfile byte-identical (verified by
  checksum). `client/package.json` · 2026-11-22
- **A failing `server/ pnpm typecheck` is usually just missing `reviewer-core` deps.** The
  tsconfig path alias pulls `../reviewer-core/src/**` into the server program, so without
  `reviewer-core/node_modules` you get 7 errors blaming `openai`/`zod` plus bogus
  `TS2322 unknown is not assignable to T` in `adapters/llm/*.ts`. Run `cd reviewer-core &&
  npm ci` first; the gate then passes with zero errors. `server/tsconfig.json` · 2026-11-22

## Recurring Errors & Fixes

_Error string → cause → fix. Only errors seen more than once, or whose cause was
non-obvious._

_(none yet)_

## Open Questions

_What we don't know yet, phrased so a future session can answer it. When one is answered,
append the answer as an entry in the section above and append `Answered:` here._

_(none yet)_
