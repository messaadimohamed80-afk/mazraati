"use server";

import { createServerSupabaseClient, createServiceRoleClient } from "@/lib/supabase/server";
import { isMockMode } from "@/lib/db";
import { seedDemoData } from "@/lib/actions/seed";
import { ActionResult, ok, err } from "@/lib/action-result";

/** Data returned on successful registration */
export interface RegisterResult {
    needsConfirmation: boolean;
}

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
}): Promise<ActionResult<RegisterResult>> {
    if (isMockMode()) {
        return ok({ needsConfirmation: false });
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
        return err(authError.message, "VALIDATION_ERROR");
    }

    const userId = authData.user?.id;
    if (!userId) {
        // Email confirmation is required — user needs to check inbox
        return ok({ needsConfirmation: true });
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
        return err(`Farm creation failed: ${farmError.message}`, "DB_ERROR");
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
        return err(`Farm member creation failed: ${memberError.message}`, "DB_ERROR");
    }

    // 5. Seed demo data for the first 3 users
    const { count } = await admin
        .from("farms")
        .select("id", { count: "exact", head: true });

    if ((count ?? 0) <= 3) {
        await seedDemoData(farm.id, userId);
    }

    return ok({ needsConfirmation: false });
}
