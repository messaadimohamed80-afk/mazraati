import { createServerSupabaseClient } from "@/lib/supabase/server";

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
 * Throws if called when USE_MOCK is true.
 */
export async function getDb() {
    if (useMock()) {
        throw new Error("Cannot get DB client in mock mode. Check USE_MOCK env var.");
    }
    return createServerSupabaseClient();
}

/**
 * Get the current user's ID. Returns null if not authenticated.
 */
export async function getCurrentUserId(): Promise<string | null> {
    if (useMock()) return "00000000-0000-0000-0000-000000000001"; // demo user
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id ?? null;
}

/**
 * Get the current user's active farm ID.
 * For now, returns the first farm they belong to.
 * TODO: Add farm switching support.
 */
export async function getCurrentFarmId(): Promise<string | null> {
    if (useMock()) return "00000000-0000-0000-0000-000000000010"; // demo farm
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data } = await supabase
        .from("farm_members")
        .select("farm_id")
        .eq("user_id", user.id)
        .limit(1)
        .single();

    return data?.farm_id ?? null;
}
