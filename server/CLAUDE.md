# `@devdigest/api` — agent guide

Fastify 5 + Drizzle/Postgres engine: repos, PRs, agents, reviews, and the
`repo-intel` code indexer. Runs on `:3001` via `pnpm dev` (tsx watch).

## Module anatomy

Every feature is a self-contained Fastify plugin under `src/modules/<name>/`:

```
routes.ts      zod-validated HTTP surface (the only layer that knows about req/res)
service.ts     orchestration + business rules
repository.ts  the ONLY place that touches that module's tables
constants.ts   tunables (thresholds, job kinds) — no magic numbers in services
```

Register a new module with one import + one `app.register` in `src/modules/index.ts`.
Cross-module data access goes through shared repositories on the container
(`container.agentsRepo`, `container.reviewRepo`) — never import another module's
`repository.ts` directly.

## Rules that are not obvious from the code

- **Routes are schema-first.** Use `app.withTypeProvider<ZodTypeProvider>()` and declare
  `params`/`body`/`response` zod schemas; never `Schema.parse(req.body)` inside a handler.
  Invalid input is rejected with 422 before the handler runs.
- **Tenancy is mandatory.** Every handler resolves `const { workspaceId, userId } =
  await getContext(container, req)` and every repository query filters by `workspaceId`.
  A query without that filter is a bug even when auth is a no-op locally.
- **Errors are thrown, not replied.** Throw `NotFoundError` / `ValidationError` /
  `ExternalServiceError` / `ConfigError` from `platform/errors.ts`; the app-level handler
  renders the `{ error: { code, message, details } }` envelope. No bare `reply.code(500)`.
- **Everything external goes through an adapter resolved from the DI container**
  (`container.llm(...)`, `.github`, `.git`, `.codeIndex`, `.secrets`, `.repoIntel`).
  Never instantiate an SDK client inside a service — that breaks mock injection.
- **Secrets never touch the DB or `AppConfig`.** Read them only via
  `container.secrets` (`~/.devdigest/secrets.json`, mode 0600, `process.env` fallback).
  `GITHUB_TOKEN` is canonical, `GITHUB_PAT` is a legacy fallback.
- **Reading any file out of a clone must use `readContainedFile`**
  (`platform/contained-read.ts`). A cloned repo is untrusted input: a committed symlink
  can otherwise read `~/.env` into a prompt. Never `readFile(join(clone, rel))`.
- **The API is local-only by design**: bound to 127.0.0.1 plus `Host`/`Origin` checks in
  `platform/local-only.ts` (DNS-rebinding guard). Do not relax those checks or widen CORS.
- **Long work is a job, not a request.** Use `container.jobs` (JobRunner) and stream
  progress over `container.runBus` (SSE); routes return immediately with a run id.

## Database

Domain tables live in `src/db/schema/<domain>.ts` and are re-exported from
`src/db/schema.ts` (barrel + the `schema` object used for client typing). After editing:
`pnpm db:generate` → review the generated SQL → `pnpm db:migrate`. Migrations are never
applied on boot, and never hand-edited after they land. pgvector is enabled by migration
`0000`. `pnpm db:seed` is idempotent demo data (`acme/payments-api`, PR #482, 2 agents).

## Tests

Hermetic by default — reach for `src/adapters/mocks.ts` (MockLLMProvider, MockGitClient)
instead of network or keys. DB-backed tests must be named `*.it.test.ts`, use
`test/helpers/pg.ts`, and self-skip without Docker. `buildApp()` is exported so tests use
`app.inject()` with no port. Global rate limiting is off under `NODE_ENV=test`.

## Gotchas

- `@devdigest/shared` physically lives here (`src/vendor/shared`) and is **mirrored** into
  the client — see the root `CLAUDE.md` before editing a contract.
- `@ast-grep/napi` is a native module; the Windows typecheck job in CI exists to catch a
  missing prebuilt. Keep its version pinned exactly (no `^`).
- `REPO_INTEL_ENABLED` defaults to **true**, but repo-map sections stay empty until the
  repo is indexed — enrichment degrades silently rather than failing a run.
- The indexer self-watches a ~110s soft budget and finishes `partial` before the job's
  hard timeout; don't replace that with a plain try/catch.

## Read when

- **Starting any task in this module** → read `INSIGHTS.md` in this folder (past lessons).
- **Adding a route, env var, or adapter** → read `README.md` in this folder (API map,
  full env table, DI diagram).
- **Touching the indexer** → read the file header of
  `src/modules/repo-intel/pipeline/full.ts` (pipeline stages + budget rules).
- **Changing prompt inputs or grounding** → read `../reviewer-core/README.md`.
- **Writing tests or changing CI lanes** → read `../TESTING.md`.
