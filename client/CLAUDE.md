# `@devdigest/web` — agent guide

Next.js 15 (App Router) studio for DevDigest. `pnpm dev` → `:3000`; talks to the
Fastify API at `NEXT_PUBLIC_API_BASE` (default `http://localhost:3001`).

## Where code goes

```
src/app/<route>/page.tsx          thin — layout + one feature component, no logic
src/app/<route>/_components/<Name>/   one folder per component:
                                      <Name>.tsx + index.ts barrel + <Name>.test.tsx,
                                      plus constants.ts / helpers.ts / styles.ts as needed
src/components/<name>/            cross-route components (app-shell, diff-viewer, …)
src/lib/hooks/*.ts                every data hook (TanStack Query)
src/lib/api.ts                    the only module that calls fetch
src/vendor/ui/                    @devdigest/ui design system (vendored)
src/vendor/shared/                @devdigest/shared contracts (mirror copy)
messages/en/<ns>.json             every user-visible string
```

## Rules that are not obvious from the code

- **No `fetch` outside `src/lib/api.ts`.** Components call hooks from
  `src/lib/hooks/*`, hooks call `apiFetch`. This is what keeps `ApiError`
  (status + code + details) usable for the toast/inline/full-screen error taxonomy.
- **Only pass a body when you have one.** `apiFetch` sets `content-type: application/json`
  only when `init.body != null` — a body-less POST with that header trips Fastify's
  "Body cannot be empty". Don't add the header back unconditionally.
- **Import UI only from the `@devdigest/ui` barrel**, never from a layer file
  (`@devdigest/ui/primitives/Button`). The barrel is the public surface.
- **No hard-coded colors or spacing values.** Visual tokens are CSS variables in
  `src/vendor/ui/styles.css`; severity/category colors come from the `SEV` / `CAT` maps.
- **Every user-visible string lives in `messages/en/<ns>.json`** and is read with
  `useTranslations("<ns>")` / `getTranslations("<ns>")`. Add a **new namespace file** for a
  new feature instead of growing `common.json` — namespaces are merged automatically by
  `src/i18n/request.ts`, so no shared file needs editing. Single locale, no locale routing.
- **Types come from `@devdigest/shared`**, not hand-written interfaces mirroring the API.
  That copy is a mirror of the server's — see the root `CLAUDE.md` before editing it.
- Server Components by default; add `"use client"` only where hooks/state/DOM are used.
  TanStack Query providers live in `src/lib/providers.tsx`.

## Tests

vitest + jsdom + React Testing Library, `fetch` mocked — tests need no API, DB, or
browser. Setup lives in `src/test/setup.ts`. Test behaviour at the seam (rendered output
and interaction), not internals. Real browser journeys belong in `../e2e`, not here.

## Gotchas

- `src/vendor/ui` and `src/vendor/shared` are vendored, not npm packages; the aliases are
  defined in `tsconfig.json`. Treat `vendor/ui` as read-only unless the task is about the
  design system itself.
- `mermaid` and `recharts` are client-only; render them behind `"use client"` components
  (`src/components/mermaid-diagram`) to avoid SSR breakage.
- Tailwind 4 runs through `@tailwindcss/postcss` — there is no `tailwind.config.js`.

## Read when

- **Starting any task in this module** → read `INSIGHTS.md` in this folder (past lessons).
- **Adding a route or wiring new API data** → read `README.md` in this folder (route map
  + which endpoints each screen uses).
- **Adding or restyling a component** → read `src/vendor/ui/README.md` (layers, tokens,
  theming rules).
- **Changing a request/response shape** → read `../server/README.md` for the API contract.
