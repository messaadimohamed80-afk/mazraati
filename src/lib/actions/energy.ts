"use server";

import { z } from "zod";
import { isMockMode, getDb, getCurrentFarmId } from "@/lib/db";
import type { SolarPanel, ElectricityMeter, Generator } from "@/lib/types";
import { ActionResult, ok, err, okVoid } from "@/lib/action-result";
import { createEnergyAssetSchema, solarPanelRowSchema, electricityMeterRowSchema, generatorRowSchema, updateSolarPanelSchema, updateElectricityMeterSchema, updateGeneratorSchema } from "@/lib/validations";

// ============================================================
// SOLAR PANELS
// ============================================================

export async function getSolarPanels(): Promise<ActionResult<SolarPanel[]>> {
    try {
        if (isMockMode()) {
            const { MOCK_SOLAR } = await import("@/lib/mock/mock-energy-data");
            return ok(z.array(solarPanelRowSchema).parse(MOCK_SOLAR));
        }

        const supabase = await getDb();
        const farmId = await getCurrentFarmId();
        if (!farmId) return ok([]);

        const { data, error } = await supabase
            .from("solar_panels")
            .select("*")
            .eq("farm_id", farmId)
            .order("name");

        if (error) return err(`Failed to fetch solar panels: ${error.message}`, "DB_ERROR");
        return ok(z.array(solarPanelRowSchema).parse(data));
    } catch (e: unknown) {
        return err(e instanceof Error ? e.message : String(e), "UNKNOWN");
    }
}

export async function createSolarPanel(panel: {
    name: string;
    capacity_kw: number;
    panel_count: number;
    daily_production_kwh?: number;
    efficiency_percent?: number;
    installation_date?: string;
    inverter_type?: string;
    status?: string;
    total_cost?: number;
    notes?: string;
}): Promise<ActionResult<SolarPanel>> {
    try {
        createEnergyAssetSchema.parse(panel);
        if (isMockMode()) {
            const { MOCK_SOLAR } = await import("@/lib/mock/mock-energy-data");
            const newPanel: SolarPanel = {
                id: `solar-${Date.now()}`,
                farm_id: "00000000-0000-4000-8000-000000000010",
                capacity_kw: panel.capacity_kw,
                panel_count: panel.panel_count,
                daily_production_kwh: panel.daily_production_kwh ?? 0,
                efficiency_percent: panel.efficiency_percent ?? 0,
                installation_date: panel.installation_date ?? "",
                inverter_type: panel.inverter_type ?? "",
                total_cost: panel.total_cost ?? 0,
                name: panel.name,
                notes: panel.notes,
                created_at: new Date().toISOString(),
                status: (panel.status as SolarPanel["status"]) || "inactive",
            };
            MOCK_SOLAR.push(newPanel);
            return ok(solarPanelRowSchema.parse(newPanel));
        }

        const supabase = await getDb();
        const farmId = await getCurrentFarmId();
        if (!farmId) return err("Not authenticated", "NOT_AUTHENTICATED");

        const { data, error } = await supabase
            .from("solar_panels")
            .insert({ farm_id: farmId, ...panel })
            .select()
            .single();

        if (error) return err(`Failed to create solar panel: ${error.message}`, "DB_ERROR");
        return ok(solarPanelRowSchema.parse(data));
    } catch (e: unknown) {
        return err(e instanceof Error ? e.message : String(e), (e instanceof Error && e.name === "ZodError") ? "VALIDATION_ERROR" : "UNKNOWN");
    }
}

// ============================================================
// ELECTRICITY METERS
// ============================================================

export async function getElectricityMeters(): Promise<ActionResult<ElectricityMeter[]>> {
    try {
        if (isMockMode()) {
            const { MOCK_ELECTRICITY } = await import("@/lib/mock/mock-energy-data");
            return ok(z.array(electricityMeterRowSchema).parse(MOCK_ELECTRICITY));
        }

        const supabase = await getDb();
        const farmId = await getCurrentFarmId();
        if (!farmId) return ok([]);

        const { data, error } = await supabase
            .from("electricity_meters")
            .select("*")
            .eq("farm_id", farmId)
            .order("name");

        if (error) return err(`Failed to fetch meters: ${error.message}`, "DB_ERROR");
        return ok(z.array(electricityMeterRowSchema).parse(data));
    } catch (e: unknown) {
        return err(e instanceof Error ? e.message : String(e), "UNKNOWN");
    }
}

export async function createElectricityMeter(meter: {
    name: string;
    meter_number: string;
    provider: string;
    monthly_consumption_kwh?: number;
    monthly_cost?: number;
    currency?: string;
    tariff_type?: string;
    status?: string;
    total_cost?: number;
    notes?: string;
}): Promise<ActionResult<ElectricityMeter>> {
    try {
        createEnergyAssetSchema.parse(meter);
        if (isMockMode()) {
            const { MOCK_ELECTRICITY } = await import("@/lib/mock/mock-energy-data");
            const newMeter: ElectricityMeter = {
                id: `elec-${Date.now()}`,
                farm_id: "00000000-0000-4000-8000-000000000010",
                name: meter.name,
                meter_number: meter.meter_number,
                provider: meter.provider,
                monthly_consumption_kwh: meter.monthly_consumption_kwh ?? 0,
                monthly_cost: meter.monthly_cost ?? 0,
                currency: meter.currency ?? "TND",
                last_reading_date: "",
                notes: meter.notes,
                created_at: new Date().toISOString(),
                tariff_type: (meter.tariff_type as ElectricityMeter["tariff_type"]) || "agricultural",
                status: (meter.status as ElectricityMeter["status"]) || "active",
            };
            MOCK_ELECTRICITY.push(newMeter);
            return ok(electricityMeterRowSchema.parse(newMeter));
        }

        const supabase = await getDb();
        const farmId = await getCurrentFarmId();
        if (!farmId) return err("Not authenticated", "NOT_AUTHENTICATED");

        const { data, error } = await supabase
            .from("electricity_meters")
            .insert({ farm_id: farmId, ...meter })
            .select()
            .single();

        if (error) return err(`Failed to create meter: ${error.message}`, "DB_ERROR");
        return ok(electricityMeterRowSchema.parse(data));
    } catch (e: unknown) {
        return err(e instanceof Error ? e.message : String(e), (e instanceof Error && e.name === "ZodError") ? "VALIDATION_ERROR" : "UNKNOWN");
    }
}

// ============================================================
// GENERATORS
// ============================================================

export async function getGenerators(): Promise<ActionResult<Generator[]>> {
    try {
        if (isMockMode()) {
            const { MOCK_GENERATORS } = await import("@/lib/mock/mock-energy-data");
            return ok(z.array(generatorRowSchema).parse(MOCK_GENERATORS));
        }

        const supabase = await getDb();
        const farmId = await getCurrentFarmId();
        if (!farmId) return ok([]);

        const { data, error } = await supabase
            .from("generators")
            .select("*")
            .eq("farm_id", farmId)
            .order("name");

        if (error) return err(`Failed to fetch generators: ${error.message}`, "DB_ERROR");
        return ok(z.array(generatorRowSchema).parse(data));
    } catch (e: unknown) {
        return err(e instanceof Error ? e.message : String(e), "UNKNOWN");
    }
}

export async function createGenerator(gen: {
    name: string;
    fuel_type: string;
    capacity_kva: number;
    runtime_hours?: number;
    fuel_consumption_lph?: number;
    last_maintenance?: string;
    next_maintenance_hours?: number;
    status?: string;
    total_cost?: number;
    notes?: string;
}): Promise<ActionResult<Generator>> {
    try {
        createEnergyAssetSchema.parse(gen);
        if (isMockMode()) {
            const { MOCK_GENERATORS } = await import("@/lib/mock/mock-energy-data");
            const newGen: Generator = {
                id: crypto.randomUUID(),
                farm_id: "00000000-0000-4000-8000-000000000010",
                name: gen.name,
                capacity_kva: gen.capacity_kva,
                runtime_hours: gen.runtime_hours ?? 0,
                fuel_consumption_lph: gen.fuel_consumption_lph ?? 0,
                last_maintenance: gen.last_maintenance ?? "",
                next_maintenance_hours: gen.next_maintenance_hours ?? 0,
                total_cost: gen.total_cost ?? 0,
                notes: gen.notes,
                created_at: new Date().toISOString(),
                fuel_type: gen.fuel_type as Generator["fuel_type"],
                status: (gen.status as Generator["status"]) || "standby",
            };
            MOCK_GENERATORS.push(newGen);
            return ok(generatorRowSchema.parse(newGen));
        }

        const supabase = await getDb();
        const farmId = await getCurrentFarmId();
        if (!farmId) return err("Not authenticated", "NOT_AUTHENTICATED");

        const { data, error } = await supabase
            .from("generators")
            .insert({ farm_id: farmId, ...gen })
            .select()
            .single();

        if (error) return err(`Failed to create generator: ${error.message}`, "DB_ERROR");
        return ok(generatorRowSchema.parse(data));
    } catch (e: unknown) {
        return err(e instanceof Error ? e.message : String(e), (e instanceof Error && e.name === "ZodError") ? "VALIDATION_ERROR" : "UNKNOWN");
    }
}

// ============================================================
// UPDATE / DELETE — SOLAR PANELS
// ============================================================

export async function updateSolarPanel(
    id: string,
    updates: Partial<Omit<SolarPanel, "id" | "farm_id" | "created_at">>
): Promise<ActionResult<SolarPanel>> {
    try {
        const parsed = updateSolarPanelSchema.parse({ id, ...updates });
        const { id: _parsedId, ...validatedUpdates } = parsed;
        void _parsedId;
        if (isMockMode()) {
            const { MOCK_SOLAR } = await import("@/lib/mock/mock-energy-data");
            const idx = MOCK_SOLAR.findIndex((p) => p.id === id);
            if (idx === -1) return err("Solar panel not found", "NOT_FOUND");
            Object.assign(MOCK_SOLAR[idx], validatedUpdates);
            return ok(solarPanelRowSchema.parse(MOCK_SOLAR[idx]));
        }

        const supabase = await getDb();
        const { data, error } = await supabase
            .from("solar_panels")
            .update(validatedUpdates)
            .eq("id", id)
            .select()
            .single();

        if (error) return err(`Failed to update solar panel: ${error.message}`, "DB_ERROR");
        return ok(solarPanelRowSchema.parse(data));
    } catch (e: unknown) {
        return err(e instanceof Error ? e.message : String(e), "UNKNOWN");
    }
}

export async function deleteSolarPanel(id: string): Promise<ActionResult<void>> {
    try {
        if (isMockMode()) {
            const { MOCK_SOLAR } = await import("@/lib/mock/mock-energy-data");
            const idx = MOCK_SOLAR.findIndex((p) => p.id === id);
            if (idx === -1) return err("Solar panel not found", "NOT_FOUND");
            MOCK_SOLAR.splice(idx, 1);
            return okVoid();
        }

        const supabase = await getDb();
        const { error } = await supabase.from("solar_panels").delete().eq("id", id);
        if (error) return err(`Failed to delete solar panel: ${error.message}`, "DB_ERROR");
        return okVoid();
    } catch (e: unknown) {
        return err(e instanceof Error ? e.message : String(e), "UNKNOWN");
    }
}

// ============================================================
// UPDATE / DELETE — ELECTRICITY METERS
// ============================================================

export async function updateElectricityMeter(
    id: string,
    updates: Partial<Omit<ElectricityMeter, "id" | "farm_id" | "created_at">>
): Promise<ActionResult<ElectricityMeter>> {
    try {
        const parsed = updateElectricityMeterSchema.parse({ id, ...updates });
        const { id: _parsedId, ...validatedUpdates } = parsed;
        void _parsedId;
        if (isMockMode()) {
            const { MOCK_ELECTRICITY } = await import("@/lib/mock/mock-energy-data");
            const idx = MOCK_ELECTRICITY.findIndex((m) => m.id === id);
            if (idx === -1) return err("Meter not found", "NOT_FOUND");
            Object.assign(MOCK_ELECTRICITY[idx], validatedUpdates);
            return ok(electricityMeterRowSchema.parse(MOCK_ELECTRICITY[idx]));
        }

        const supabase = await getDb();
        const { data, error } = await supabase
            .from("electricity_meters")
            .update(validatedUpdates)
            .eq("id", id)
            .select()
            .single();

        if (error) return err(`Failed to update meter: ${error.message}`, "DB_ERROR");
        return ok(electricityMeterRowSchema.parse(data));
    } catch (e: unknown) {
        return err(e instanceof Error ? e.message : String(e), "UNKNOWN");
    }
}

export async function deleteElectricityMeter(id: string): Promise<ActionResult<void>> {
    try {
        if (isMockMode()) {
            const { MOCK_ELECTRICITY } = await import("@/lib/mock/mock-energy-data");
            const idx = MOCK_ELECTRICITY.findIndex((m) => m.id === id);
            if (idx === -1) return err("Meter not found", "NOT_FOUND");
            MOCK_ELECTRICITY.splice(idx, 1);
            return okVoid();
        }

        const supabase = await getDb();
        const { error } = await supabase.from("electricity_meters").delete().eq("id", id);
        if (error) return err(`Failed to delete meter: ${error.message}`, "DB_ERROR");
        return okVoid();
    } catch (e: unknown) {
        return err(e instanceof Error ? e.message : String(e), "UNKNOWN");
    }
}

// ============================================================
// UPDATE / DELETE — GENERATORS
// ============================================================

export async function updateGenerator(
    id: string,
    updates: Partial<Omit<Generator, "id" | "farm_id" | "created_at">>
): Promise<ActionResult<Generator>> {
    try {
        const parsed = updateGeneratorSchema.parse({ id, ...updates });
        const { id: _parsedId, ...validatedUpdates } = parsed;
        void _parsedId;
        if (isMockMode()) {
            const { MOCK_GENERATORS } = await import("@/lib/mock/mock-energy-data");
            const idx = MOCK_GENERATORS.findIndex((g) => g.id === id);
            if (idx === -1) return err("Generator not found", "NOT_FOUND");
            Object.assign(MOCK_GENERATORS[idx], validatedUpdates);
            return ok(generatorRowSchema.parse(MOCK_GENERATORS[idx]));
        }

        const supabase = await getDb();
        const { data, error } = await supabase
            .from("generators")
            .update(validatedUpdates)
            .eq("id", id)
            .select()
            .single();

        if (error) return err(`Failed to update generator: ${error.message}`, "DB_ERROR");
        return ok(generatorRowSchema.parse(data));
    } catch (e: unknown) {
        return err(e instanceof Error ? e.message : String(e), "UNKNOWN");
    }
}

export async function deleteGenerator(id: string): Promise<ActionResult<void>> {
    try {
        if (isMockMode()) {
            const { MOCK_GENERATORS } = await import("@/lib/mock/mock-energy-data");
            const idx = MOCK_GENERATORS.findIndex((g) => g.id === id);
            if (idx === -1) return err("Generator not found", "NOT_FOUND");
            MOCK_GENERATORS.splice(idx, 1);
            return okVoid();
        }

        const supabase = await getDb();
        const { error } = await supabase.from("generators").delete().eq("id", id);
        if (error) return err(`Failed to delete generator: ${error.message}`, "DB_ERROR");
        return okVoid();
    } catch (e: unknown) {
        return err(e instanceof Error ? e.message : String(e), "UNKNOWN");
    }
}
