# Quality Baseline — Mazraati

> This document tracks codebase quality standards, migration notes, and quality gates.

## Quality Gates

All four must pass before merging any PR:

```bash
npm run lint         # 0 errors, 0 warnings
npm run typecheck    # tsc --noEmit, 0 errors
npm run test:ci      # All tests pass (127+ tests)
npm run build        # Compiled successfully, 0 warnings
```

CI workflow (`.github/workflows/ci.yml`) enforces lint → typecheck → test → build on every PR and push to `main`.

## Test Coverage

| Area | Tests | Coverage |
|------|-------|----------|
| Validation schemas | 34 | Zod parse/reject for all entity types |
| Action results | 4 | `ok()`, `err()`, `okVoid()` helpers |
| DB middleware | 7 | Mock mode detection, farm/user resolution |
| Auth + Settings | 5 | `registerUser`, `updateFarmSettings` |
| Water CRUD actions | 16 | Full CRUD for wells, tanks, irrigation + NOT_FOUND |
| Energy CRUD actions | 16 | Full CRUD for solar, meters, generators + NOT_FOUND |
| Component (Expenses) | 9 | Rendering, search, filter, modal, delete, stats |
| Component (Crops) | 8 | Rendering, search, status filter, modal, create |
| Component (Tasks) | 8 | Rendering, search, status filter, badges, assignee |
| Hook behavior (Expenses) | 5 | Optimistic create, success/error toast, rollback, delete |
| Hook behavior (Crops) | 5 | Optimistic create/update, success/error toast, rollback |
| Hook behavior (Tasks) | 6 | Optimistic create/update/delete, success/error toast |
| Hook exports | 8 | Module export verification for all 7 hooks |

## CRUD Completeness

All 6 entity types now have full CRUD (Create, Read, Update, Delete):

| Entity | Actions File | Operations |
|--------|-------------|------------|
| Expenses | `expenses.ts` | get, create, update, delete |
| Crops | `crops.ts` | get, create, update |
| Tasks | `crops.ts` | get, create, update, delete |
| Wells / Tanks / Irrigation | `water.ts` | get, create, update, delete |
| Solar / Meters / Generators | `energy.ts` | get, create, update, delete |
| Animals / Vaccines / Feed | `livestock.ts` | get, create |

## Action Result Pattern

Server actions in `src/lib/action-result.ts` provide:

```typescript
type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ActionError }
```

Helpers: `ok(data)`, `err(message, code)`, `okVoid()` (for delete actions).

## Font Self-Hosting

- **What:** IBM Plex Sans Arabic (weights 400/600/700) is self-hosted under `src/app/fonts/`.
- **Why:** `next/font/google` requires network access during build. Self-hosting eliminates this dependency.
- **Fallback:** The CSS variable `--font-arabic` falls back to `system-ui, sans-serif` if the font fails to load.

## Proxy Migration (Next.js 16)

- **What:** `middleware.ts` was renamed to `proxy.ts` per Next.js 16 convention.
- **Function:** `middleware()` → `proxy()`.

## Auth Security Model

| Environment | Behavior |
|---|---|
| Development (`NODE_ENV=development`) | Auth bypassed for convenience |
| Mock mode (`USE_MOCK=true`) | Auth bypassed |
| Production + Supabase configured | Full auth with session refresh |
| **Production + Supabase MISSING** | **Fail-closed** — redirects to `/landing` + CRITICAL log |

## Mock Mode

- **Gate:** `isMockMode()` in `src/lib/db/index.ts`
- **Precedence:** `USE_MOCK=true` → missing Supabase URL → fallback to mock data
- **UUID parity:** All mock IDs use RFC 4122 v4 format — validated by the same Zod schemas as real data

## CSS Formatting

- **Rule:** Section headers must use `/* --- Section Name --- */` format (single-line).
- **Forbidden:** Multi-line `/* ===== */` headers cause CSS optimizer warnings during build.

## Known Risks

| Risk | Mitigation |
|---|---|
| Leaflet Draw types rely on `eslint-disable` comments | `@types/leaflet-draw` doesn't expose all needed types |
| Supabase `as Entity` return casts in actions | Safe for known schema; DTO types constrain inputs |
| `process.env!` non-null assertions (6 total) | Acceptable: env vars always present in Vercel + local dev |
| Energy schema uses `.passthrough()` | Acceptable in prototype; tighten for production |
