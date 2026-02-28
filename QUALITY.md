# Quality Baseline — Mazraati

> Tracks codebase quality standards, migration notes, and quality gates.

## Quality Gates

All four must pass before merging any PR:

```bash
npm run lint         # 0 errors, 0 warnings
npm run typecheck    # tsc --noEmit, 0 errors
npm run test:ci      # All tests pass (140+ tests)
npm run build        # Compiled successfully
```

CI workflow (`.github/workflows/ci.yml`) enforces lint → typecheck → test → build on every PR and push to `main`.

## Test Coverage

| Area | Tests | Coverage |
|------|-------|----------|
| Validation schemas | 34 | Zod parse/reject for all entity types |
| Action results | 4 | `ok()`, `err()`, `okVoid()` helpers |
| Environment helper | 7 | `requireEnv`, `getSupabaseEnv`, `getServiceRoleKey` |
| DB middleware | 7 | Mock mode detection, farm/user resolution |
| Auth + Settings | 5 | `registerUser`, `updateFarmSettings` |
| Water CRUD actions | 16 | Full CRUD for wells, tanks, irrigation + NOT_FOUND |
| Energy CRUD actions | 16 | Full CRUD for solar, meters, generators + NOT_FOUND |
| Component (Expenses) | 12 | Rendering, search, category filter, sort, modal, delete, stats, empty state |
| Component (Crops) | 8 | Rendering, search, status filter, modal, create |
| Component (Tasks) | 8 | Rendering, search, status filter, badges, assignee |
| Component (SearchCommand) | 6 | ARIA dialog, Escape dismiss, overlay click, empty results |
| Hook behavior (Expenses) | 5 | Optimistic create, success/error toast, rollback, delete |
| Hook behavior (Crops) | 5 | Optimistic create/update, success/error toast, rollback |
| Hook behavior (Tasks) | 6 | Optimistic create/update/delete, success/error toast |
| Hook exports | 8 | Module export verification for all 7 hooks |

## CRUD Completeness

| Entity | Actions File | Create | Read | Update | Delete |
|--------|-------------|--------|------|--------|--------|
| Expenses | `expenses.ts` | ✅ | ✅ | ✅ | ✅ |
| Categories | `expenses.ts` | — | ✅ | — | — |
| Crops | `crops.ts` | ✅ | ✅ | ✅ | — |
| Tasks | `crops.ts` | ✅ | ✅ | ✅ | ✅ |
| Wells | `water.ts` | ✅ | ✅ | ✅ | ✅ |
| Tanks | `water.ts` | ✅ | ✅ | ✅ | ✅ |
| Irrigation | `water.ts` | ✅ | ✅ | ✅ | ✅ |
| Solar Panels | `energy.ts` | ✅ | ✅ | ✅ | ✅ |
| Electricity Meters | `energy.ts` | ✅ | ✅ | ✅ | ✅ |
| Generators | `energy.ts` | ✅ | ✅ | ✅ | ✅ |
| Animals | `livestock.ts` | ✅ | ✅ | — | — |
| Inventory | `inventory.ts` | ✅ | ✅ | — | — |

## Action Result Pattern

```typescript
type ActionResult<T> = { ok: true; data: T } | { ok: false; error: ActionError }
```

Helpers: `ok(data)`, `err(message, code)`, `okVoid()` (for delete actions).

## Environment Safety

All Supabase env vars go through `src/lib/env.ts`:

- `requireEnv(name)` — throws descriptive error if var is missing
- `getSupabaseEnv()` — returns `{ url, anonKey }`
- `getServiceRoleKey()` — returns service role key (server-side only)

No `process.env!` non-null assertions remain in supabase clients.

## Accessibility

| Feature | Implementation |
|---------|---------------|
| Focus trap | ExpenseModal, CropModal, SearchCommand |
| `role="dialog"` + `aria-modal` | ExpenseModal, CropModal, SearchCommand |
| Arabic `aria-label` | 10+ interactive elements |
| `prefers-reduced-motion` | Disables animations in `animations.css` |
| Keyboard dismiss (Escape) | All modals and search dialog |

## Known Risks

| Risk | Mitigation |
|---|---|
| Leaflet Draw types rely on `eslint-disable` | `@types/leaflet-draw` incomplete |
| Supabase `as Entity` return casts | Safe for known schema |
| Energy schema uses `.passthrough()` | Acceptable in prototype |
