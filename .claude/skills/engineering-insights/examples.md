# Worked examples

Four entries that earn their place, four that don't. The filter is in
[SKILL.md](SKILL.md); this file is what it looks like applied.

Entries below are written as they appear in a file. They are illustrative — none of them
is a claim about the current state of this repo.

## Good

```markdown
## What Doesn't Work

- **A `<->` (L2) query never uses the `code_chunks.embedding` index.** The `ivfflat` index
  is built `WITH (lists=100)` on `vector_cosine_ops`, so an L2 operator silently
  sequential-scans — 1.8s at 40k chunks vs 30ms. Use `cosineDistance()` from `drizzle-orm`
  and confirm with `EXPLAIN ANALYZE` that `Index Scan using code_chunks_embedding_idx`
  appears. `server/src/modules/repo-intel/repository.ts` · 2026-11-18
```

Passes all five: run under `EXPLAIN ANALYZE` (earned), the index looked like it applied
(surprise), names index, operator, and file (anchored), says which call to use (actionable),
and nothing in `CLAUDE.md` or `README.md` mentions operator classes (absent).

```markdown
## Codebase Patterns

- **Invalidate PR lists with the 2-element key, not `['prs']`.** `useRepoPrs` keys on
  `['prs', repoId]`, so `invalidateQueries({ queryKey: ['prs'], exact: true })` after an
  import matches nothing and the list stays stale until remount. Drop `exact`, or pass
  `['prs', repoId]`. `client/src/lib/hooks/use-repo-prs.ts` · 2026-11-18
```

```markdown
## Recurring Errors & Fixes

- **`Cannot read properties of null (reading 'toFixed')` in `ScoreBadge` means the shared
  copies drifted.** `server/src/vendor/shared/contracts/review.ts` declares
  `score: z.number().nullable()`; the client mirror still declares `score: z.number()`, so
  TS never flags the null path. Before trusting a `@devdigest/shared` type in the client,
  `diff -r server/src/vendor/shared client/src/vendor/shared`.
  `client/src/vendor/shared/contracts/review.ts` · 2026-11-19
```

Note what makes this admissible even though "the two copies have drifted" is in the root
`CLAUDE.md`: the entry is the **error string → cause → check**, which is not there.

```markdown
## Tool & Library Notes

- **`pnpm db:generate` emits DROP+ADD for a renamed column, not a rename.** Renaming
  `code_chunks.file_path` → `path` produced `DROP COLUMN`/`ADD COLUMN`, which drops every
  embedding on `db:migrate`. Drizzle Kit's rename prompt only appears in an interactive
  TTY; non-interactive runs silently pick DROP+ADD. Hand-edit the *newly generated*
  migration to `ALTER TABLE … RENAME COLUMN` before applying.
  `server/src/db/migrations/` · 2026-11-20
```

## Bad

```markdown
- Remember that migrations are not applied on boot; run `cd server && pnpm db:migrate`.
```

**Fails gate 5 (Absent).** Verbatim in the root `CLAUDE.md`, twice. Every line like this
teaches the next agent that `INSIGHTS.md` is a place for low-value text, which is how the
file dies.

```markdown
- Promise handling in the repo-intel indexer can be tricky — be careful with async code.
```

**Fails gates 3 and 4 (Anchored, Actionable).** No path, no symbol, no number, no
instruction. Nobody does anything differently tomorrow. The salvageable version names the
pipeline stage, the concurrency limit that broke, and the call that replaced it.

```markdown
- Fixed the 500 on GET /api/repos/:id/prs by adding the missing workspaceId filter in
  repository.ts. Tests pass now.
```

**Fails the durability override and the Tomorrow Test.** This is a commit message. The
generalised form ("every repository query filters by `workspaceId`") is already in
`server/CLAUDE.md`, so even that fails gate 5.

```markdown
- Zod's `.safeParse()` returns `{ success, data | error }` instead of throwing, so prefer
  it over `.parse()` when you want to handle invalid input gracefully.
```

**Fails gates 1 and 2 (Earned, Surprise).** Straight from zod's README. Nothing here was
run to discover it and no prior belief was corrected. Library docs are not insights — only
places where a library **defied** its docs in this codebase are.

## Refinement vs supersede

A refinement nests under the parent and leaves it untouched:

```markdown
- **A `<->` (L2) query never uses the `code_chunks.embedding` index.** …
  `server/src/modules/repo-intel/repository.ts` · 2026-11-18
  - Still true after `0012`: the rebuilt index keeps `lists=100`, which under-partitions
    above ~100k chunks and drops recall to ~0.7. Raise `lists` to `sqrt(rows)` when
    reindexing. · 2026-11-25
```

A supersede goes at the bottom of the section and quotes the old claim verbatim:

```markdown
- **Supersedes "A `<->` (L2) query never uses the `code_chunks.embedding` index"
  (2026-11-18): it now does.** Migration `0014` added an L2 index alongside the HNSW cosine
  one, so both operators are indexed — pick by distance semantics, not by index
  availability. `server/src/db/migrations/0014_dual_vector_index.sql` · 2026-12-03
```
