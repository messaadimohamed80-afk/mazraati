# Mazraati — مزرعتي

Farm management platform for Arabic-speaking farmers. Track expenses, crops, tasks, water, livestock, energy, and inventory with an RTL-first interface.

## Quick Start

```bash
npm install
npm run dev          # → http://localhost:3000
```

Runs in **mock mode** by default — no database needed for development.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Production | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Production | Supabase service role key (admin seeding) |
| `USE_MOCK` | Optional | Set `true` to force mock mode even with Supabase configured |

Copy `.env.local.example` to `.env.local` and fill in values:

```bash
cp .env.local.example .env.local
```

## Mock Mode

| Condition | Behavior |
|---|---|
| `USE_MOCK=true` | Mock data, no auth |
| Supabase URL missing/placeholder | Mock data, no auth |
| `NODE_ENV=development` | Auth bypassed (proxy), DB used if configured |
| Production + Supabase configured | Full auth + real DB |
| Production + Supabase **missing** | Fail-closed → redirects to /landing |

Mock entity IDs use RFC 4122 v4 UUID format to match validation schemas.

## Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run lint         # ESLint check
npm run test         # Run test suite (Vitest)
npm run test:watch   # Watch mode
npm run test:ci      # CI mode (verbose reporter)
```

## Quality Gates (CI)

All three must pass on every PR:

```
npm run lint         # 0 errors, 0 warnings
npm run test:ci      # All tests pass
npm run build        # Compiled successfully
```

Enforced by `.github/workflows/ci.yml`.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript 5 (strict mode)
- **UI:** React 19, Vanilla CSS (RTL)
- **State:** TanStack React Query v5
- **Validation:** Zod v4
- **Auth/DB:** Supabase (RLS enabled)
- **Hosting:** Vercel
- **Testing:** Vitest
- **Fonts:** IBM Plex Sans Arabic (self-hosted)

## Project Structure

```
src/
├── app/              # Next.js pages and layouts
├── components/       # React components
├── hooks/            # React Query mutation hooks
├── lib/
│   ├── actions/      # Server actions (per module)
│   ├── db/           # Database client + mock mode
│   ├── mock/         # Mock data (valid UUIDs)
│   ├── supabase/     # Supabase client/middleware
│   ├── types.ts      # Shared TypeScript interfaces
│   ├── validations.ts # Zod schemas
│   └── action-result.ts # ActionResult<T> type
└── types/            # Global type declarations
```

## Supabase Setup

1. Create a Supabase project
2. Run the schema migration (see `supabase/` directory)
3. Enable RLS — policies use farm-membership-based access
4. Seed demo data: `npm run dev` → call `seedDemoData()` from admin

## Troubleshooting

| Issue | Solution |
|---|---|
| Build fails with font errors | Fonts are self-hosted in `src/app/fonts/` — no network needed |
| `middleware` deprecation warning | Already migrated to `proxy.ts` (Next.js 16 convention) |
| Tests fail with UUID errors | Mock IDs must be RFC 4122 v4 format (`...-4...-8...`) |
| Auth bypass in production | Check `NEXT_PUBLIC_SUPABASE_URL` is set — middleware fails-closed |
