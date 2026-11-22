# `@devdigest/e2e` — agent guide

Browser end-to-end flows for the web app, driven by **Vercel agent-browser** (Rust + CDP
CLI). No Playwright, no LLM, no API key.

```
specs/NN-name.flow.json   one flow = ordered list of agent-browser commands
run.ts                    runner: one shared browser session, {BASE} substitution
lib/assert.ts             stdout assertions
agent-browser.json        CLI config
```

## Rules

- **Deterministic locators only** — `--url`, `--text`, `find role|text|label`. The AI
  `chat` command is banned: it would make runs flaky and require a model key.
- **Assertions are the waits.** `wait --text` / `wait --url` exit non-zero on timeout, so
  a flow fails at the step that didn't hold. Add `"assert": { "stdoutIncludes": … }` only
  when stdout carries the signal.
- **Read-only, seeded data only** (`acme/payments-api`, PR #482, the seeded agents).
  Nothing in a flow may trigger an LLM call or mutate state another flow depends on.
- Every step needs a `"label"` — it's what a failure report shows.
- Flows run in filename order against one session; number a new spec accordingly.

## Gotchas

- **Needs a freshly-seeded DB.** Flow `02` follows the home redirect to the *first* repo,
  so it assumes the demo repo is the only one. Running against a dev DB with extra repos
  will fail for the wrong reason — use `../scripts/e2e.sh` (hermetic) or reseed.
- This package uses **npm** (`package-lock.json`), not pnpm, and the CLI is installed
  globally: `npm i -g agent-browser && agent-browser install`.
- `E2E_BASE_URL` overrides `{BASE}` (default `http://localhost:3000`).

## Read when

- **Starting any task in this module** → read `INSIGHTS.md` in this folder (past lessons).
- **Writing or debugging a flow** → read `README.md` in this folder (command format,
  full step vocabulary, CI wiring).
- **A flow broke after a UI change** → read `../client/README.md` for the route map.
