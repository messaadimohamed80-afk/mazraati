import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { getSupabaseEnv, getServiceRoleKey } from "@/lib/env";

/**
 * Cookie-based Supabase client for authenticated user operations.
 * Uses the anon key + user session from cookies.
 */
export async function createServerSupabaseClient() {
    const cookieStore = await cookies();
    const { url, anonKey } = getSupabaseEnv();

    return createServerClient(url, anonKey, {
        cookies: {
            getAll() {
                return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        cookieStore.set(name, value, options)
                    );
                } catch {
                    // Called from Server Component — ignore
                }
            },
        },
    });
}

/**
 * Service-role Supabase client that bypasses RLS.
 * Use ONLY for admin operations (registration, seeding, etc.)
 * where no user session exists or elevated privileges are needed.
 * NEVER expose this to the browser.
 */
export function createServiceRoleClient() {
    const { url } = getSupabaseEnv();
    const serviceKey = getServiceRoleKey();

    return createClient(url, serviceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}
