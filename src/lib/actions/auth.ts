"use server";

import { createServerSupabaseClient, createServiceRoleClient } from "@/lib/supabase/server";
import { isMockMode } from "@/lib/db";
import { seedDemoData } from "@/lib/actions/seed";

/**
 * Register a new user and create their farm + farm membership.
 * If fewer than 3 farms exist, seeds demo data for a rich first experience.
 *
 * Uses the service-role client for post-signup operations
 * because the user may not have an active session yet (email confirmation).
 */
export async function registerUser(input: {
    email: string;
    password: string;
    fullName: string;
    farmName: string;
    currency: string;
}): Promise<{ success: boolean; error?: string; needsConfirmation?: boolean }> {
    if (isMockMode()) {
        return { success: true };
    }

    // Use the cookie-based client for auth.signUp (sets session cookies)
    const supabase = await createServerSupabaseClient();

    // 1. Sign up the user (profile is auto-created via DB trigger)
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: input.email,
        password: input.password,
        options: {
            data: {
                full_name: input.fullName,
                farm_name: input.farmName,
                currency: input.currency,
            },
        },
    });

    if (authError) {
        return { success: false, error: authError.message };
    }

    const userId = authData.user?.id;
    if (!userId) {
        // Email confirmation is required â€” user needs to check inbox
        return { success: true, needsConfirmation: true };
    }

    // 2. Use service-role client for admin operations (bypasses RLS)
    //    because the user's session may not be established yet
    const admin = createServiceRoleClient();

    // 3. Create the farm
    const { data: farm, error: farmError } = await admin
        .from("farms")
        .insert({
            owner_id: userId,
            name: input.farmName,
            currency: input.currency,
        })
        .select("id")
        .single();

    if (farmError) {
        console.error("Farm creation failed:", farmError.message);
        return { success: true };
    }

    // 4. Add user as farm owner
    const { error: memberError } = await admin
        .from("farm_members")
        .insert({
            farm_id: farm.id,
            user_id: userId,
            role: "owner",
        });

    if (memberError) {
        console.error("Farm member creation failed:", memberError.message);
    }

    // 5. Seed demo data for the first 3 users
    const { count } = await admin
        .from("farms")
        .select("id", { count: "exact", head: true });

    if ((count ?? 0) <= 3) {
        await seedDemoData(farm.id, userId);
    }

    return { success: true };
}
