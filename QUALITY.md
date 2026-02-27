# Quality Baseline — Mazraati

> This document tracks codebase quality standards and migration notes.

## Font Self-Hosting

- **What:** IBM Plex Sans Arabic (weights 400/600/700) is self-hosted under `src/app/fonts/`.
- **Why:** `next/font/google` requires network access during build. Vercel deployments occasionally fail when Google Fonts CDN is unreachable. Self-hosting eliminates this dependency.
- **Fallback:** The CSS variable `--font-arabic` falls back to `system-ui, sans-serif` if the font fails to load.
- **Update:** To update fonts, download new files from [Google Fonts](https://fonts.google.com/specimen/IBM+Plex+Sans+Arabic) and replace the TTF files.

## Proxy Migration (Next.js 16)

- **What:** `middleware.ts` was renamed to `proxy.ts` per Next.js 16 convention.
- **Why:** Next.js 16 deprecated the `middleware` file convention. The function name changed from `middleware()` to `proxy()`.
- **Behavior:** The proxy refreshes Supabase sessions and redirects unauthenticated users to `/landing`. In development/mock mode, all requests pass through without auth.

## Mock Mode

- **Gate:** `isMockMode()` in `src/lib/db/index.ts` — returns `true` if `USE_MOCK=true` or Supabase URL is not configured.
- **Precedence:** `USE_MOCK=true` env flag → missing Supabase URL → fallback to mock data.
- **All action files** in `src/lib/actions/*` use `isMockMode()` to branch between real DB queries and mock data.

## CSS Formatting

- **Rule:** Section headers must use `/* --- Section Name --- */` format (single-line).
- **Forbidden:** Multi-line `/* ========\n TITLE\n ======== */` headers cause CSS optimizer warnings during build.
- **Enforcement:** `npm run build` flags invalid CSS selectors — treat CSS warnings as errors.

## Definition of Done

Before merging any PR, the following checks must pass:

```bash
npm run lint       # 0 errors, 0 warnings
npm run build      # Compiled successfully, 0 warnings
```

CI workflow (`.github/workflows/ci.yml`) enforces both checks automatically on PR and push to `main`.

## Known Risks

| Risk | Mitigation |
|---|---|
| Leaflet Draw types rely on `eslint-disable` comments | `@types/leaflet-draw` doesn't expose all needed types; suppress comments are documented |
| Supabase `as Entity` return casts in actions | Safe — casting known DB schema results; DTO types added for mutation inputs |
| Mock mode bypasses auth in development | Controlled via `USE_MOCK` env flag; proxy enforces auth in production |
