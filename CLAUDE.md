# DevDigest — agent guide

Local-first AI pull-request review. **This repo is a teaching starter**: it ships
exactly one end-to-end flow (add repo → index → import PRs → run an agent review).
Milestones M1–M8 in `README.md` are *deliberately absent* — never "restore" a
missing feature unless the task asks for it. The DB schema already declares every
future table; empty tables are expected, not a bug.

## Stack

Node ≥22 · TypeScript 5.9 (`strict`, `noUncheckedIndexedAccess`) · Zod 3.25

| Package | Dir | Stack | Pkg manager |
|---|---|---|---|
| `@devdigest/api` :3001 | `server/` | Fastify 5 · Drizzle 0.45 · Postgres 16 + pgvector | pnpm |
| `@devdigest/web` :3000 | `client/` | Next.js 15 App Router · React 19 · TanStack Query 5 · Tailwind 4 | pnpm |
| `@devdigest/reviewer-core` | `reviewer-core/` | pure TS review engine (no I/O) | npm |
| `@devdigest/e2e` | `e2e/` | Vercel agent-browser (JSON specs, no Playwright) | npm |

## Commands

```sh
./scripts/dev.sh                      # zero → running stack (--no-seed --no-client --db-only)
cd server && pnpm db:migrate          # migrations are NOT applied on boot — always run manually
cd server && pnpm db:generate         # after editing src/db/schema/*.ts
cd server && pnpm exec vitest run --exclude '**/*.it.test.ts'   # unit (no Docker)
cd server && pnpm exec vitest run .it.test                      # integration (needs Docker)
cd client && pnpm test && pnpm typecheck
cd reviewer-core && npm test
```

`typecheck` is the only static gate — **there is no ESLint/Prettier/Biome in this
repo**. Do not add lint configs or reformat files you are not changing.

## Structure

```
server/         Fastify API + engine; repo-intel indexer lives in src/modules/repo-intel
client/         Next.js studio
reviewer-core/  diff → prompt → LLM → grounded findings (no DB/GitHub/FS)
e2e/            deterministic browser flows
docs/agent-prompts/   system prompts shipped with the built-in review agents
scripts/        dev.sh (local bootstrap) · e2e.sh (hermetic e2e)
.claude/skills/ vendored skills, pinned by hash in skills-lock.json
```

Each package has its own `CLAUDE.md` with its conventions — they are **not**
duplicated here and load lazily when you work in that directory.

## Project-wide rules

- **Not a monorepo workspace.** Each package has its own `package.json` + lockfile.
  Cross-package code is shared through **tsconfig path aliases consuming TypeScript
  source** (`@devdigest/shared`, `@devdigest/reviewer-core`, `@devdigest/ui`) — never
  publish, build, or import across packages by relative path.
- **`@devdigest/shared` exists as two physical copies**: `server/src/vendor/shared`
  (canonical) and `client/src/vendor/shared` (mirror). A contract used by both sides
  must be edited in **both** copies in the same change; they have already drifted in
  places, so diff before assuming they match.
- **Extend contracts, don't rewrite them.** Add a new file under `contracts/` and
  re-export it from the barrel; existing exported shapes are a stable API.
- Secrets never live in git, `.env` of record, or the DB — see `server/CLAUDE.md`.
- Keep a change inside one package when possible; a cross-package change must update
  the CI `paths:` filters in `.github/workflows/*` if a new dependency edge appears.

## Insights

Before working in a module, read its `INSIGHTS.md` (root, `client/`, `server/`,
`reviewer-core/`, `e2e/`) — durable, append-only lessons from past sessions that are not
conventions (`CLAUDE.md`) or reference (`README.md`). At the end of a task, append anything
a future session would act on; most sessions add nothing, and that is the expected outcome.
Rules and the admission filter: `.claude/skills/engineering-insights/SKILL.md`.

## Gotchas

- Postgres runs in Docker; API and web run on the host. Only `docker compose up -d`.
- `server/clones/` is runtime data (cloned repos, git-ignored) — never read it as
  project source, never commit it.
- DB-backed tests **must** be named `*.it.test.ts`; the unit lane excludes that glob.
- `agent-runner/dist/` is intentionally un-ignored in `.gitignore` (future milestone).
- Agent system prompts have two homes: `docs/agent-prompts/*.md` are the reviewable
  originals, but `agents.system_prompt` in the DB is what runs. Editing one without the
  other leaves them out of sync.

## Do not touch

- `server/src/db/migrations/**` — generated; add a new migration, never edit applied SQL.
- `.claude/skills/**` and `skills-lock.json` — vendored upstream, hash-pinned.
- `client/src/vendor/ui/**` — vendored design system; change it only when the task is
  explicitly about the design system.
- `LICENSE`, lockfiles (unless the task adds a dependency).

## Read when

- **Changing the review pipeline or prompt** → read `reviewer-core/README.md`.
- **Adding or changing an HTTP route, env var, or adapter** → read `server/README.md`
  (API map + full env table).
- **Writing or debugging tests, or touching CI** → read `TESTING.md`.
- **Adding a UI route or component** → read `client/README.md` and
  `client/src/vendor/ui/README.md`.
- **Authoring a review agent's system prompt** → read `docs/agent-prompts/README.md`.
