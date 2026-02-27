"use server";

import { isMockMode, getCurrentFarmId, getCurrentUserId } from "@/lib/db";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ActionResult, ok, err } from "@/lib/action-result";

// —— Types ————————————————————————————————————————————————

export interface FarmSettings {
    farmName: string;
    ownerName: string;
    phone: string;
    email: string;
    location: string;
    currency: string;
    /** Budget for reports — stored in farm settings */
    budget?: number;
}

// —— Read ———————————————————————————————————————————————————

/**
 * Get the current farm's settings (name, owner, currency, etc.)
 */
export async function getFarmSettings(): Promise<ActionResult<FarmSettings>> {
    try {
        if (isMockMode()) {
            return ok({
                farmName: "مزرعة الأمل",
                ownerName: "محمد بن علي",
                phone: "+216 71 123 456",
                email: "farm@example.com",
                location: "باجة، تونس",
                currency: "TND",
                budget: 99000,
            });
        }

        const supabase = await createServerSupabaseClient();
        const farmId = await getCurrentFarmId();
        const userId = await getCurrentUserId();

        if (!farmId || !userId) {
            return ok({
                farmName: "",
                ownerName: "",
                phone: "",
                email: "",
                location: "",
                currency: "TND",
                budget: 0,
            });
        }

        // Get farm data
        const { data: farm } = await supabase
            .from("farms")
            .select("name, location_text, currency, budget")
            .eq("id", farmId)
            .single();

        // Get profile data
        const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, phone")
            .eq("id", userId)
            .single();

        // Get email from auth
        const { data: { user } } = await supabase.auth.getUser();

        return ok({
            farmName: farm?.name ?? "",
            ownerName: profile?.full_name ?? "",
            phone: profile?.phone ?? "",
            email: user?.email ?? "",
            location: farm?.location_text ?? "",
            currency: farm?.currency ?? "TND",
            budget: farm?.budget ?? 0,
        });
    } catch (e: unknown) {
        return err(e instanceof Error ? e.message : String(e), "UNKNOWN");
    }
}

// —— Write ——————————————————————————————————————————————————

/**
 * Update farm settings (name, location, currency) and profile (name, phone).
 */
export async function updateFarmSettings(settings: FarmSettings): Promise<ActionResult<void>> {
    try {
        if (isMockMode()) {
            return ok(undefined);
        }

        const supabase = await createServerSupabaseClient();
        const farmId = await getCurrentFarmId();
        const userId = await getCurrentUserId();

        if (!farmId || !userId) {
            return err("Not authenticated", "NOT_AUTHENTICATED");
        }

        // Update farm
        const { error: farmError } = await supabase
            .from("farms")
            .update({
                name: settings.farmName,
                location_text: settings.location,
                currency: settings.currency,
            })
            .eq("id", farmId);

        if (farmError) {
            return err(farmError.message, "DB_ERROR");
        }

        // Update profile
        const { error: profileError } = await supabase
            .from("profiles")
            .update({
                full_name: settings.ownerName,
                phone: settings.phone,
            })
            .eq("id", userId);

        if (profileError) {
            return err(profileError.message, "DB_ERROR");
        }

        return ok(undefined);
    } catch (e: unknown) {
        return err(e instanceof Error ? e.message : String(e), "UNKNOWN");
    }
}
