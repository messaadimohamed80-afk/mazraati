import { createServerSupabaseClient } from "@/lib/supabase/server";
import { cache } from "react";

/**
 * Check whether the app should use mock data.
 * Returns true if USE_MOCK=true or Supabase is not configured.
 */
export function useMock(): boolean {
    if (process.env.USE_MOCK === "true") return true;
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!url || url === "your-supabase-url-here") return true;
    return false;
}

/**
 * Get an authenticated Supabase client for server actions.
 * Cached per-request via React.cache() to avoid creating multiple clients.
 */
export const getDb = cache(async () => {
    if (useMock()) {
        throw new Error("Cannot get DB client in mock mode. Check USE_MOCK env var.");
    }
    return createServerSupabaseClient();
});

/**
 * Get the current authenticated user.
 * Cached per-request — no matter how many server actions call this,
 * it only hits Supabase auth once per request.
 */
const getAuthUser = cache(async () => {
    const supabase = await getDb();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
});

/**
 * Get the current user's ID. Returns null if not authenticated.
 */
export async function getCurrentUserId(): Promise<string | null> {
    if (useMock()) return "00000000-0000-0000-0000-000000000001"; // demo user
    const user = await getAuthUser();
    return user?.id ?? null;
}

/**
 * Get the current user's active farm ID.
 * Cached per-request via getAuthUser() — the auth call is shared
 * across all server actions in the same request.
 */
export const getCurrentFarmId = cache(async (): Promise<string | null> => {
    if (useMock()) return "00000000-0000-0000-0000-000000000010"; // demo farm
    const user = await getAuthUser();
    if (!user) return null;

    const supabase = await getDb();
    const { data } = await supabase
        .from("farm_members")
        .select("farm_id")
        .eq("user_id", user.id)
        .limit(1)
        .single();

    return data?.farm_id ?? null;
});
