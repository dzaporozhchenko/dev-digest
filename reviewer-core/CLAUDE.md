# `@devdigest/reviewer-core` — agent guide

The review engine: **diff → prompt → LLM → grounded findings**. Consumed by the server
as TypeScript source through a path alias; it never emits JS (`build` = `tsc --noEmit`).

```
src/prompt.ts         assemblePrompt() + wrapUntrusted() + INJECTION_GUARD
src/grounding.ts       groundFindings() — the mandatory citation gate
src/llm/structured.ts  Zod → JSON Schema, extractJson, parseWithRepair
src/llm/openrouter.ts  the one bundled LLMProvider implementation
src/review/run.ts      reviewPullRequest() — single-pass or map-reduce orchestration
src/review/reduce.ts   merge per-file reviews, sliceDiff, scoreFromFindings
src/output/to-review.ts CI payload helper (used from milestone M6)
```

## The purity rule

**No I/O.** No `node:fs`, no DB, no GitHub, no `process.env`, no persistence. The only
side effect permitted is a call to the **injected** `LLMProvider`. Anything that needs
the outside world belongs in the caller (`server/src/modules/reviews/run-executor.ts`).
This is what makes the engine testable with a stub model and reusable from CI later.

Inputs are **resolved values, not references**: the caller turns skill slugs into bodies
and memory ids into strings before calling in. The engine never looks anything up.

## Invariants — do not weaken

- **Grounding is mandatory.** A diff-finding survives only if its `[start_line, end_line]`
  intersects a real hunk for that file; full-file kinds (`secret_leak`, `lethal_trifecta`,
  `phantom`, `hook`) only require the file to be present in the diff. Dropped findings are
  returned with reasons — never silently swallowed.
- **The score is recomputed** from the surviving findings (`scoreFromFindings`). Never
  trust a score or verdict the model returned.
- **All untrusted content is fenced.** Diffs, repo maps, PR descriptions, and spec chunks
  go through `wrapUntrusted()` with the injection guard; only the agent's system prompt is
  trusted. A new prompt section must be wrapped too.
- **Optional prompt slots stay optional.** `skills`, `memory`, `specs`, `callers`,
  `repoMap` are fed by later milestones; when empty, `assemblePrompt` omits the section.
  Don't make any of them required or emit an empty heading.
- `src/index.ts` is the public surface — the server imports from it, not from deep paths.

## Mode selection

`strategy: 'auto'` (default) picks map-reduce only when the diff is **both** over
`DEFAULT_MAP_THRESHOLD_LINES` (400) **and** multi-file; otherwise one call. Cancellation
is cooperative: the caller passes `checkCancelled()` which throws — the engine stays
agnostic about the error type.

## Tests & gotchas

- `npm test` (this package uses npm, not pnpm). Hermetic vitest units with a stubbed
  `LLMProvider` — no keys, no network. `npm run typecheck` doubles as the build.
- `@devdigest/shared` resolves to **`../server/src/vendor/shared`** via tsconfig paths;
  `zod` is pinned to this package's own `node_modules` (also a path alias) — keep the zod
  major in step with the server's, or the shared schemas stop type-checking.
- Changing anything here triggers the server's CI lane too (path filter), because the
  server type-checks against this source.

## Read when

- **Starting any task in this module** → read `INSIGHTS.md` in this folder (past lessons).
- **Changing the pipeline or adding a prompt section** → read `README.md` in this folder.
- **Changing what the server feeds in** → read `server/src/modules/reviews/run-executor.ts`.
