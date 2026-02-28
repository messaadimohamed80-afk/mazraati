/**
 * Typed environment variable access.
 * Throws descriptive error if a required variable is missing at runtime.
 */

/** Require a single environment variable by name. */
export function requireEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(
            `Missing required environment variable: ${name}. ` +
            `Set it in .env.local or your deployment environment.`
        );
    }
    return value;
}

/**
 * Supabase environment config.
 * Lazily resolves from process.env — call at runtime, not import time,
 * so mock mode can bypass this without crashing.
 */
export function getSupabaseEnv() {
    return {
        url: requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
        anonKey: requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    };
}

/** Service role key — only available server-side. */
export function getServiceRoleKey(): string {
    return requireEnv("SUPABASE_SERVICE_ROLE_KEY");
}
