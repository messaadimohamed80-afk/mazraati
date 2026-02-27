"use server";

import { isMockMode, getDb, getCurrentFarmId } from "@/lib/db";
import type { Animal, VaccinationRecord, FeedRecord } from "@/lib/types";
import { ActionResult, ok, err } from "@/lib/action-result";
import { animalRowSchema, vaccinationRowSchema, feedRowSchema } from "@/lib/validations";

// ============================================================
// ANIMALS â€” READ
// ============================================================

export async function getAnimals(): Promise<ActionResult<Animal[]>> {
    try {
        if (isMockMode()) {
            const { MOCK_ANIMALS } = await import("@/lib/mock/mock-livestock-data");
            return ok(z.array(animalRowSchema).parse(MOCK_ANIMALS));
        }

        const supabase = await getDb();
        const farmId = await getCurrentFarmId();
        if (!farmId) return ok([]);

        const { data, error } = await supabase
            .from("animals")
            .select("*")
            .eq("farm_id", farmId)
            .order("created_at", { ascending: false })
            .limit(100);

        if (error) return err(`Failed to fetch animals: ${error.message}`, "DB_ERROR");
        return ok(z.array(animalRowSchema).parse(data));
    } catch (e: unknown) {
        return err(e instanceof Error ? e.message : String(e), "UNKNOWN");
    }
}

// ============================================================
// ANIMALS â€” CREATE / UPDATE / DELETE
// ============================================================

import { createAnimalSchema, updateAnimalSchema } from "@/lib/validations";

export async function createAnimal(animal: {
    name: string;
    type: string;
    breed: string;
    gender: string;
    tag_number: string;
    birth_date?: string;
    weight_kg?: number;
    acquisition_date: string;
    acquisition_type: string;
    purchase_price?: number;
    notes?: string;
}): Promise<ActionResult<Animal>> {
    try {
        const parsed = createAnimalSchema.parse(animal);
        if (isMockMode()) {
            const { MOCK_ANIMALS } = await import("@/lib/mock/mock-livestock-data");
            const newAnimal: Animal = {
                id: crypto.randomUUID(),
                farm_id: "00000000-0000-4000-8000-000000000010",
                name: animal.name,
                breed: animal.breed,
                tag_number: animal.tag_number,
                birth_date: animal.birth_date,
                weight_kg: animal.weight_kg,
                acquisition_date: animal.acquisition_date,
                purchase_price: animal.purchase_price,
                notes: animal.notes,
                status: "healthy" as const,
                created_at: new Date().toISOString(),
                type: parsed.type as Animal["type"],
                gender: parsed.gender as Animal["gender"],
                acquisition_type: parsed.acquisition_type as Animal["acquisition_type"],
            };
            MOCK_ANIMALS.push(newAnimal);
            return ok(animalRowSchema.parse(newAnimal));
        }

        const supabase = await getDb();
        const farmId = await getCurrentFarmId();
        if (!farmId) return err("Not authenticated", "NOT_AUTHENTICATED");

        const { data, error } = await supabase
            .from("animals")
            .insert({ farm_id: farmId, ...parsed })
            .select()
            .single();

        if (error) return err(`Failed to create animal: ${error.message}`, "DB_ERROR");
        return ok(animalRowSchema.parse(data));
    } catch (e: unknown) {
        return err(e instanceof Error ? e.message : String(e), (e instanceof Error && e.name === "ZodError") ? "VALIDATION_ERROR" : "UNKNOWN");
    }
}

export async function updateAnimal(
    id: string,
    updates: Partial<Animal>
): Promise<ActionResult<Animal>> {
    try {
        updateAnimalSchema.parse({ id, ...updates });
        if (isMockMode()) {
            const { MOCK_ANIMALS } = await import("@/lib/mock/mock-livestock-data");
            const idx = MOCK_ANIMALS.findIndex((a) => a.id === id);
            if (idx === -1) return err("Animal not found", "NOT_FOUND");
            Object.assign(MOCK_ANIMALS[idx], updates);
            return ok(animalRowSchema.parse(MOCK_ANIMALS[idx]));
        }

        const supabase = await getDb();
        const { data, error } = await supabase
            .from("animals")
            .update(updates)
            .eq("id", id)
            .select()
            .single();

        if (error) return err(`Failed to update animal: ${error.message}`, "DB_ERROR");
        return ok(animalRowSchema.parse(data));
    } catch (e: unknown) {
        return err(e instanceof Error ? e.message : String(e), (e instanceof Error && e.name === "ZodError") ? "VALIDATION_ERROR" : "UNKNOWN");
    }
}

export async function deleteAnimal(id: string): Promise<ActionResult<void>> {
    try {
        if (isMockMode()) {
            const { MOCK_ANIMALS } = await import("@/lib/mock/mock-livestock-data");
            const idx = MOCK_ANIMALS.findIndex((a) => a.id === id);
            if (idx !== -1) MOCK_ANIMALS.splice(idx, 1);
            return ok(undefined);
        }

        const supabase = await getDb();
        const { error } = await supabase.from("animals").delete().eq("id", id);
        if (error) return err(`Failed to delete animal: ${error.message}`, "DB_ERROR");
        return ok(undefined);
    } catch (e: unknown) {
        return err(e instanceof Error ? e.message : String(e), "UNKNOWN");
    }
}

// ============================================================
// VACCINATIONS
// ============================================================

import { z } from "zod";

export async function getVaccinations(animalId?: string): Promise<ActionResult<VaccinationRecord[]>> {
    try {
        if (isMockMode()) {
            const { MOCK_VACCINATIONS } = await import("@/lib/mock/mock-livestock-data");
            const data = animalId
                ? MOCK_VACCINATIONS.filter((v) => v.animal_id === animalId)
                : MOCK_VACCINATIONS;
            return ok(z.array(vaccinationRowSchema).parse(data));
        }

        const supabase = await getDb();
        let query = supabase.from("vaccination_records").select("*").order("date", { ascending: false });

        if (animalId) {
            query = query.eq("animal_id", animalId);
        }

        const { data, error } = await query;
        if (error) return err(`Failed to fetch vaccinations: ${error.message}`, "DB_ERROR");
        return ok(z.array(vaccinationRowSchema).parse(data));
    } catch (e: unknown) {
        return err(e instanceof Error ? e.message : String(e), "UNKNOWN");
    }
}

export async function createVaccination(record: {
    animal_id: string;
    vaccine_name: string;
    date: string;
    next_due?: string;
    administered_by?: string;
    cost?: number;
    notes?: string;
}): Promise<ActionResult<VaccinationRecord>> {
    try {
        if (isMockMode()) {
            const { MOCK_VACCINATIONS } = await import("@/lib/mock/mock-livestock-data");
            const newRec: VaccinationRecord = {
                id: crypto.randomUUID(),
                created_at: new Date().toISOString(),
                ...record,
            };
            MOCK_VACCINATIONS.push(newRec);
            return ok(vaccinationRowSchema.parse(newRec));
        }

        const supabase = await getDb();
        const { data, error } = await supabase
            .from("vaccination_records")
            .insert(record)
            .select()
            .single();

        if (error) return err(`Failed to create vaccination: ${error.message}`, "DB_ERROR");
        return ok(vaccinationRowSchema.parse(data));
    } catch (e: unknown) {
        return err(e instanceof Error ? e.message : String(e), "UNKNOWN");
    }
}

// ============================================================
// FEED RECORDS
// ============================================================

export async function getFeedRecords(): Promise<ActionResult<FeedRecord[]>> {
    try {
        if (isMockMode()) {
            const { MOCK_FEED } = await import("@/lib/mock/mock-livestock-data");
            return ok(z.array(feedRowSchema).parse(MOCK_FEED));
        }

        const supabase = await getDb();
        const farmId = await getCurrentFarmId();
        if (!farmId) return ok([]);

        const { data, error } = await supabase
            .from("feed_records")
            .select("*")
            .eq("farm_id", farmId)
            .order("purchase_date", { ascending: false });

        if (error) return err(`Failed to fetch feed records: ${error.message}`, "DB_ERROR");
        return ok(z.array(feedRowSchema).parse(data));
    } catch (e: unknown) {
        return err(e instanceof Error ? e.message : String(e), "UNKNOWN");
    }
}

export async function createFeedRecord(record: {
    feed_type: string;
    quantity_kg: number;
    cost_per_kg: number;
    purchase_date: string;
    remaining_kg: number;
    notes?: string;
}): Promise<ActionResult<FeedRecord>> {
    try {
        if (isMockMode()) {
            const { MOCK_FEED } = await import("@/lib/mock/mock-livestock-data");
            const newRec: FeedRecord = {
                id: crypto.randomUUID(),
                farm_id: "00000000-0000-4000-8000-000000000010",
                created_at: new Date().toISOString(),
                ...record,
            };
            MOCK_FEED.push(newRec);
            return ok(feedRowSchema.parse(newRec));
        }

        const supabase = await getDb();
        const farmId = await getCurrentFarmId();
        if (!farmId) return err("Not authenticated", "NOT_AUTHENTICATED");

        const { data, error } = await supabase
            .from("feed_records")
            .insert({ farm_id: farmId, ...record })
            .select()
            .single();

        if (error) return err(`Failed to create feed record: ${error.message}`, "DB_ERROR");
        return ok(feedRowSchema.parse(data));
    } catch (e: unknown) {
        return err(e instanceof Error ? e.message : String(e), "UNKNOWN");
    }
}
