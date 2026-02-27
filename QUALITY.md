# Quality Baseline — Mazraati

> This document tracks codebase quality standards, migration notes, and quality gates.

## Quality Gates

All three must pass before merging any PR:

```bash
npm run lint         # 0 errors, 0 warnings
npm run test:ci      # All tests pass
npm run build        # Compiled successfully, 0 warnings
```

CI workflow (`.github/workflows/ci.yml`) enforces lint → test → build on every PR and push to `main`.

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

## Action Result Pattern

Server actions in `src/lib/action-result.ts` provide:

```typescript
type ActionResult<T> = 
  | { ok: true; data: T }
  | { ok: false; error: ActionError }
```

Use `ok(data)` and `err(message, code)` helpers for consistent error handling.

## CSS Formatting

- **Rule:** Section headers must use `/* --- Section Name --- */` format (single-line).
- **Forbidden:** Multi-line `/* ===== */` headers cause CSS optimizer warnings during build.

## Known Risks

| Risk | Mitigation |
|---|---|
| Leaflet Draw types rely on `eslint-disable` comments | `@types/leaflet-draw` doesn't expose all needed types |
| Supabase `as Entity` return casts in actions | Safe for known schema; DTO types constrain inputs |
| `createCrop` in `crops.ts` should use `parsed` result | Tracked for refactor |
| Energy schema uses `.passthrough()` | Acceptable in prototype; tighten for production |
