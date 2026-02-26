"use server";

import { useMock, getDb, getCurrentFarmId } from "@/lib/db";
import type { Animal, VaccinationRecord, FeedRecord } from "@/lib/types";

// ============================================================
// ANIMALS — READ
// ============================================================

export async function getAnimals(): Promise<Animal[]> {
    if (useMock()) {
        const { MOCK_ANIMALS } = await import("@/lib/mock/mock-livestock-data");
        return MOCK_ANIMALS;
    }

    const supabase = await getDb();
    const farmId = await getCurrentFarmId();
    if (!farmId) return [];

    const { data, error } = await supabase
        .from("animals")
        .select("*")
        .eq("farm_id", farmId)
        .order("created_at", { ascending: false })
        .limit(100);

    if (error) throw new Error(`Failed to fetch animals: ${error.message}`);
    return data as Animal[];
}

// ============================================================
// ANIMALS — CREATE / UPDATE / DELETE
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
}): Promise<Animal> {
    const parsed = createAnimalSchema.parse(animal);
    if (useMock()) {
        const { MOCK_ANIMALS } = await import("@/lib/mock/mock-livestock-data");
        const newAnimal: Animal = {
            id: `animal-${Date.now()}`,
            farm_id: "farm-1",
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
            type: animal.type as Animal["type"],
            gender: animal.gender as Animal["gender"],
            acquisition_type: animal.acquisition_type as Animal["acquisition_type"],
        };
        MOCK_ANIMALS.push(newAnimal);
        return newAnimal;
    }

    const supabase = await getDb();
    const farmId = await getCurrentFarmId();
    if (!farmId) throw new Error("Not authenticated");

    const { data, error } = await supabase
        .from("animals")
        .insert({ farm_id: farmId, ...parsed })
        .select()
        .single();

    if (error) throw new Error(`Failed to create animal: ${error.message}`);
    return data as Animal;
}

export async function updateAnimal(
    id: string,
    updates: Partial<Animal>
): Promise<Animal> {
    updateAnimalSchema.parse({ id, ...updates });
    if (useMock()) {
        const { MOCK_ANIMALS } = await import("@/lib/mock/mock-livestock-data");
        const idx = MOCK_ANIMALS.findIndex((a) => a.id === id);
        if (idx === -1) throw new Error("Animal not found");
        Object.assign(MOCK_ANIMALS[idx], updates);
        return MOCK_ANIMALS[idx];
    }

    const supabase = await getDb();
    const { data, error } = await supabase
        .from("animals")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

    if (error) throw new Error(`Failed to update animal: ${error.message}`);
    return data as Animal;
}

export async function deleteAnimal(id: string): Promise<void> {
    if (useMock()) {
        const { MOCK_ANIMALS } = await import("@/lib/mock/mock-livestock-data");
        const idx = MOCK_ANIMALS.findIndex((a) => a.id === id);
        if (idx !== -1) MOCK_ANIMALS.splice(idx, 1);
        return;
    }

    const supabase = await getDb();
    const { error } = await supabase.from("animals").delete().eq("id", id);
    if (error) throw new Error(`Failed to delete animal: ${error.message}`);
}

// ============================================================
// VACCINATIONS
// ============================================================

export async function getVaccinations(animalId?: string): Promise<VaccinationRecord[]> {
    if (useMock()) {
        const { MOCK_VACCINATIONS } = await import("@/lib/mock/mock-livestock-data");
        return animalId
            ? MOCK_VACCINATIONS.filter((v) => v.animal_id === animalId)
            : MOCK_VACCINATIONS;
    }

    const supabase = await getDb();
    let query = supabase.from("vaccination_records").select("*").order("date", { ascending: false });

    if (animalId) {
        query = query.eq("animal_id", animalId);
    }

    const { data, error } = await query;
    if (error) throw new Error(`Failed to fetch vaccinations: ${error.message}`);
    return data as VaccinationRecord[];
}

export async function createVaccination(record: {
    animal_id: string;
    vaccine_name: string;
    date: string;
    next_due?: string;
    administered_by?: string;
    cost?: number;
    notes?: string;
}): Promise<VaccinationRecord> {
    if (useMock()) {
        const { MOCK_VACCINATIONS } = await import("@/lib/mock/mock-livestock-data");
        const newRec: VaccinationRecord = {
            id: `vax-${Date.now()}`,
            created_at: new Date().toISOString(),
            ...record,
        };
        MOCK_VACCINATIONS.push(newRec);
        return newRec;
    }

    const supabase = await getDb();
    const { data, error } = await supabase
        .from("vaccination_records")
        .insert(record)
        .select()
        .single();

    if (error) throw new Error(`Failed to create vaccination: ${error.message}`);
    return data as VaccinationRecord;
}

// ============================================================
// FEED RECORDS
// ============================================================

export async function getFeedRecords(): Promise<FeedRecord[]> {
    if (useMock()) {
        const { MOCK_FEED } = await import("@/lib/mock/mock-livestock-data");
        return MOCK_FEED;
    }

    const supabase = await getDb();
    const farmId = await getCurrentFarmId();
    if (!farmId) return [];

    const { data, error } = await supabase
        .from("feed_records")
        .select("*")
        .eq("farm_id", farmId)
        .order("purchase_date", { ascending: false });

    if (error) throw new Error(`Failed to fetch feed records: ${error.message}`);
    return data as FeedRecord[];
}

export async function createFeedRecord(record: {
    feed_type: string;
    quantity_kg: number;
    cost_per_kg: number;
    purchase_date: string;
    remaining_kg: number;
    notes?: string;
}): Promise<FeedRecord> {
    if (useMock()) {
        const { MOCK_FEED } = await import("@/lib/mock/mock-livestock-data");
        const newRec: FeedRecord = {
            id: `feed-${Date.now()}`,
            farm_id: "farm-1",
            created_at: new Date().toISOString(),
            ...record,
        };
        MOCK_FEED.push(newRec);
        return newRec;
    }

    const supabase = await getDb();
    const farmId = await getCurrentFarmId();
    if (!farmId) throw new Error("Not authenticated");

    const { data, error } = await supabase
        .from("feed_records")
        .insert({ farm_id: farmId, ...record })
        .select()
        .single();

    if (error) throw new Error(`Failed to create feed record: ${error.message}`);
    return data as FeedRecord;
}
