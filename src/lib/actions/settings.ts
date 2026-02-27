"use server";

import { isMockMode, getCurrentFarmId, getCurrentUserId } from "@/lib/db";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface FarmSettings {
    farmName: string;
    ownerName: string;
    phone: string;
    email: string;
    location: string;
    currency: string;
}

// â”€â”€ Read â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/**
 * Get the current farm's settings (name, owner, currency, etc.)
 */
export async function getFarmSettings(): Promise<FarmSettings> {
    if (isMockMode()) {
        return {
            farmName: "Ù…Ø²Ø±Ø¹Ø© Ø§Ù„Ø£Ù…Ù„",
            ownerName: "Ù…Ø­Ù…Ø¯ Ø¨Ù† Ø¹Ù„ÙŠ",
            phone: "+216 71 123 456",
            email: "farm@example.com",
            location: "Ø¨Ø§Ø¬Ø©ØŒ ØªÙˆÙ†Ø³",
            currency: "TND",
        };
    }

    const supabase = await createServerSupabaseClient();
    const farmId = await getCurrentFarmId();
    const userId = await getCurrentUserId();

    if (!farmId || !userId) {
        // Fallback
        return {
            farmName: "",
            ownerName: "",
            phone: "",
            email: "",
            location: "",
            currency: "TND",
        };
    }

    // Get farm data
    const { data: farm } = await supabase
        .from("farms")
        .select("name, location_text, currency")
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

    return {
        farmName: farm?.name ?? "",
        ownerName: profile?.full_name ?? "",
        phone: profile?.phone ?? "",
        email: user?.email ?? "",
        location: farm?.location_text ?? "",
        currency: farm?.currency ?? "TND",
    };
}

// â”€â”€ Write â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/**
 * Update farm settings (name, location, currency) and profile (name, phone).
 */
export async function updateFarmSettings(settings: FarmSettings): Promise<{ success: boolean; error?: string }> {
    if (isMockMode()) {
        return { success: true };
    }

    const supabase = await createServerSupabaseClient();
    const farmId = await getCurrentFarmId();
    const userId = await getCurrentUserId();

    if (!farmId || !userId) {
        return { success: false, error: "Not authenticated" };
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
        return { success: false, error: farmError.message };
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
        return { success: false, error: profileError.message };
    }

    return { success: true };
}
