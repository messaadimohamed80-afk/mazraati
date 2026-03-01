"use server";

import { z } from "zod";
import { isMockMode, getDb, getCurrentFarmId } from "@/lib/db";
import type { Well, WellLayer, WaterTank, IrrigationNetwork } from "@/lib/types";
import { ActionResult, ok, err, okVoid } from "@/lib/action-result";
import { createWellSchema, wellRowSchema, wellLayerRowSchema, tankRowSchema, irrigationRowSchema, updateWellSchema, updateTankSchema, updateIrrigationSchema } from "@/lib/validations";

// ============================================================
// WELLS
// ============================================================

export async function getWells(): Promise<ActionResult<Well[]>> {
    try {
        if (isMockMode()) {
            const { MOCK_WELLS } = await import("@/lib/mock/mock-water-data");
            return ok(z.array(wellRowSchema).parse(MOCK_WELLS));
        }

        const supabase = await getDb();
        const farmId = await getCurrentFarmId();
        if (!farmId) return ok([]);

        const { data, error } = await supabase
            .from("wells")
            .select("*")
            .eq("farm_id", farmId)
            .order("name")
            .limit(100);

        if (error) return err(`Failed to fetch wells: ${error.message}`, "DB_ERROR");
        return ok(z.array(wellRowSchema).parse(data));
    } catch (e: unknown) {
        return err(e instanceof Error ? e.message : String(e), "UNKNOWN");
    }
}

export async function getWellLayers(wellId: string): Promise<ActionResult<WellLayer[]>> {
    try {
        if (isMockMode()) {
            const { MOCK_WELL_LAYERS } = await import("@/lib/mock/mock-water-data");
            return ok(z.array(wellLayerRowSchema).parse(MOCK_WELL_LAYERS.filter((l) => l.well_id === wellId)));
        }

        const supabase = await getDb();
        const { data, error } = await supabase
            .from("well_layers")
            .select("*")
            .eq("well_id", wellId)
            .order("depth_from")
            .limit(100);

        if (error) return err(`Failed to fetch well layers: ${error.message}`, "DB_ERROR");
        return ok(z.array(wellLayerRowSchema).parse(data));
    } catch (e: unknown) {
        return err(e instanceof Error ? e.message : String(e), "UNKNOWN");
    }
}

export async function createWell(well: {
    name: string;
    depth_meters: number;
    water_level_meters?: number;
    water_quality?: string;
    status?: string;
    total_cost?: number;
    salinity_ppm?: number;
    latitude?: number;
    longitude?: number;
}): Promise<ActionResult<Well>> {
    try {
        const parsed = createWellSchema.parse(well);
        if (isMockMode()) {
            const { MOCK_WELLS } = await import("@/lib/mock/mock-water-data");
            const newWell: Well = {
                id: crypto.randomUUID(),
                farm_id: "00000000-0000-4000-8000-000000000010",
                name: parsed.name,
                depth_meters: parsed.depth_meters,
                water_level_meters: parsed.water_level_meters,
                total_cost: parsed.total_cost,
                salinity_ppm: parsed.salinity_ppm,
                latitude: parsed.latitude,
                longitude: parsed.longitude,
                created_at: new Date().toISOString(),
                water_quality: (parsed.water_quality as Well["water_quality"]) || "fresh",
                status: (parsed.status as Well["status"]) || "drilling",
            };
            MOCK_WELLS.push(newWell);
            return ok(wellRowSchema.parse(newWell));
        }

        const supabase = await getDb();
        const farmId = await getCurrentFarmId();
        if (!farmId) return err("Not authenticated", "NOT_AUTHENTICATED");

        const { data, error } = await supabase
            .from("wells")
            .insert({ farm_id: farmId, ...parsed })
            .select()
            .single();

        if (error) return err(`Failed to create well: ${error.message}`, "DB_ERROR");
        return ok(wellRowSchema.parse(data));
    } catch (e: unknown) {
        return err(e instanceof Error ? e.message : String(e), (e instanceof Error && e.name === "ZodError") ? "VALIDATION_ERROR" : "UNKNOWN");
    }
}

// ============================================================
// WATER TANKS
// ============================================================

export async function getTanks(): Promise<ActionResult<WaterTank[]>> {
    try {
        if (isMockMode()) {
            const { MOCK_TANKS } = await import("@/lib/mock/mock-water-data");
            return ok(z.array(tankRowSchema).parse(MOCK_TANKS));
        }

        const supabase = await getDb();
        const farmId = await getCurrentFarmId();
        if (!farmId) return ok([]);

        const { data, error } = await supabase
            .from("water_tanks")
            .select("*")
            .eq("farm_id", farmId)
            .order("name");

        if (error) return err(`Failed to fetch tanks: ${error.message}`, "DB_ERROR");
        return ok(z.array(tankRowSchema).parse(data));
    } catch (e: unknown) {
        return err(e instanceof Error ? e.message : String(e), "UNKNOWN");
    }
}

export async function createTank(tank: {
    name: string;
    type: string;
    capacity_liters: number;
    current_level_percent?: number;
    source: string;
    status?: string;
    notes?: string;
}): Promise<ActionResult<WaterTank>> {
    try {
        if (isMockMode()) {
            const { MOCK_TANKS } = await import("@/lib/mock/mock-water-data");
            const newTank: WaterTank = {
                id: crypto.randomUUID(),
                farm_id: "00000000-0000-4000-8000-000000000010",
                name: tank.name,
                capacity_liters: tank.capacity_liters,
                current_level_percent: tank.current_level_percent ?? 0,
                source: tank.source,
                notes: tank.notes,
                created_at: new Date().toISOString(),
                type: tank.type as WaterTank["type"],
                status: (tank.status as WaterTank["status"]) || "active",
            };
            MOCK_TANKS.push(newTank);
            return ok(tankRowSchema.parse(newTank));
        }

        const supabase = await getDb();
        const farmId = await getCurrentFarmId();
        if (!farmId) return err("Not authenticated", "NOT_AUTHENTICATED");

        const { data, error } = await supabase
            .from("water_tanks")
            .insert({ farm_id: farmId, ...tank })
            .select()
            .single();

        if (error) return err(`Failed to create tank: ${error.message}`, "DB_ERROR");
        return ok(tankRowSchema.parse(data));
    } catch (e: unknown) {
        return err(e instanceof Error ? e.message : String(e), "UNKNOWN");
    }
}

// ============================================================
// IRRIGATION NETWORKS
// ============================================================

export async function getIrrigation(): Promise<ActionResult<IrrigationNetwork[]>> {
    try {
        if (isMockMode()) {
            const { MOCK_IRRIGATION } = await import("@/lib/mock/mock-water-data");
            return ok(z.array(irrigationRowSchema).parse(MOCK_IRRIGATION));
        }

        const supabase = await getDb();
        const farmId = await getCurrentFarmId();
        if (!farmId) return ok([]);

        const { data, error } = await supabase
            .from("irrigation_networks")
            .select("*")
            .eq("farm_id", farmId)
            .order("name");

        if (error) return err(`Failed to fetch irrigation: ${error.message}`, "DB_ERROR");
        return ok(z.array(irrigationRowSchema).parse(data));
    } catch (e: unknown) {
        return err(e instanceof Error ? e.message : String(e), "UNKNOWN");
    }
}

export async function createIrrigation(network: {
    name: string;
    type: string;
    coverage_hectares: number;
    source_name: string;
    source_id?: string;
    status?: string;
    flow_rate_lph?: number;
    notes?: string;
}): Promise<ActionResult<IrrigationNetwork>> {
    try {
        if (isMockMode()) {
            const { MOCK_IRRIGATION } = await import("@/lib/mock/mock-water-data");
            const newNet: IrrigationNetwork = {
                id: crypto.randomUUID(),
                farm_id: "00000000-0000-4000-8000-000000000010",
                name: network.name,
                coverage_hectares: network.coverage_hectares,
                source_name: network.source_name,
                source_id: network.source_id,
                flow_rate_lph: network.flow_rate_lph,
                notes: network.notes,
                created_at: new Date().toISOString(),
                type: network.type as IrrigationNetwork["type"],
                status: (network.status as IrrigationNetwork["status"]) || "planned",
            };
            MOCK_IRRIGATION.push(newNet);
            return ok(irrigationRowSchema.parse(newNet));
        }

        const supabase = await getDb();
        const farmId = await getCurrentFarmId();
        if (!farmId) return err("Not authenticated", "NOT_AUTHENTICATED");

        const { data, error } = await supabase
            .from("irrigation_networks")
            .insert({ farm_id: farmId, ...network })
            .select()
            .single();

        if (error) return err(`Failed to create irrigation network: ${error.message}`, "DB_ERROR");
        return ok(irrigationRowSchema.parse(data));
    } catch (e: unknown) {
        return err(e instanceof Error ? e.message : String(e), "UNKNOWN");
    }
}

// ============================================================
// UPDATE / DELETE — WELLS
// ============================================================

export async function updateWell(
    id: string,
    updates: Partial<Omit<Well, "id" | "farm_id" | "created_at">>
): Promise<ActionResult<Well>> {
    try {
        const parsed = updateWellSchema.parse({ id, ...updates });
        const { id: _parsedId, ...validatedUpdates } = parsed;
        void _parsedId;
        if (isMockMode()) {
            const { MOCK_WELLS } = await import("@/lib/mock/mock-water-data");
            const idx = MOCK_WELLS.findIndex((w) => w.id === id);
            if (idx === -1) return err("Well not found", "NOT_FOUND");
            Object.assign(MOCK_WELLS[idx], validatedUpdates);
            return ok(wellRowSchema.parse(MOCK_WELLS[idx]));
        }

        const supabase = await getDb();
        const { data, error } = await supabase
            .from("wells")
            .update(validatedUpdates)
            .eq("id", id)
            .select()
            .single();

        if (error) return err(`Failed to update well: ${error.message}`, "DB_ERROR");
        return ok(wellRowSchema.parse(data));
    } catch (e: unknown) {
        return err(e instanceof Error ? e.message : String(e), "UNKNOWN");
    }
}

export async function deleteWell(id: string): Promise<ActionResult<void>> {
    try {
        if (isMockMode()) {
            const { MOCK_WELLS } = await import("@/lib/mock/mock-water-data");
            const idx = MOCK_WELLS.findIndex((w) => w.id === id);
            if (idx === -1) return err("Well not found", "NOT_FOUND");
            MOCK_WELLS.splice(idx, 1);
            return okVoid();
        }

        const supabase = await getDb();
        const { error } = await supabase.from("wells").delete().eq("id", id);
        if (error) return err(`Failed to delete well: ${error.message}`, "DB_ERROR");
        return okVoid();
    } catch (e: unknown) {
        return err(e instanceof Error ? e.message : String(e), "UNKNOWN");
    }
}

// ============================================================
// UPDATE / DELETE — WATER TANKS
// ============================================================

export async function updateTank(
    id: string,
    updates: Partial<Omit<WaterTank, "id" | "farm_id" | "created_at">>
): Promise<ActionResult<WaterTank>> {
    try {
        const parsed = updateTankSchema.parse({ id, ...updates });
        const { id: _parsedId, ...validatedUpdates } = parsed;
        void _parsedId;
        if (isMockMode()) {
            const { MOCK_TANKS } = await import("@/lib/mock/mock-water-data");
            const idx = MOCK_TANKS.findIndex((t) => t.id === id);
            if (idx === -1) return err("Tank not found", "NOT_FOUND");
            Object.assign(MOCK_TANKS[idx], validatedUpdates);
            return ok(tankRowSchema.parse(MOCK_TANKS[idx]));
        }

        const supabase = await getDb();
        const { data, error } = await supabase
            .from("water_tanks")
            .update(validatedUpdates)
            .eq("id", id)
            .select()
            .single();

        if (error) return err(`Failed to update tank: ${error.message}`, "DB_ERROR");
        return ok(tankRowSchema.parse(data));
    } catch (e: unknown) {
        return err(e instanceof Error ? e.message : String(e), "UNKNOWN");
    }
}

export async function deleteTank(id: string): Promise<ActionResult<void>> {
    try {
        if (isMockMode()) {
            const { MOCK_TANKS } = await import("@/lib/mock/mock-water-data");
            const idx = MOCK_TANKS.findIndex((t) => t.id === id);
            if (idx === -1) return err("Tank not found", "NOT_FOUND");
            MOCK_TANKS.splice(idx, 1);
            return okVoid();
        }

        const supabase = await getDb();
        const { error } = await supabase.from("water_tanks").delete().eq("id", id);
        if (error) return err(`Failed to delete tank: ${error.message}`, "DB_ERROR");
        return okVoid();
    } catch (e: unknown) {
        return err(e instanceof Error ? e.message : String(e), "UNKNOWN");
    }
}

// ============================================================
// UPDATE / DELETE — IRRIGATION NETWORKS
// ============================================================

export async function updateIrrigation(
    id: string,
    updates: Partial<Omit<IrrigationNetwork, "id" | "farm_id" | "created_at">>
): Promise<ActionResult<IrrigationNetwork>> {
    try {
        const parsed = updateIrrigationSchema.parse({ id, ...updates });
        const { id: _parsedId, ...validatedUpdates } = parsed;
        void _parsedId;
        if (isMockMode()) {
            const { MOCK_IRRIGATION } = await import("@/lib/mock/mock-water-data");
            const idx = MOCK_IRRIGATION.findIndex((n) => n.id === id);
            if (idx === -1) return err("Irrigation network not found", "NOT_FOUND");
            Object.assign(MOCK_IRRIGATION[idx], validatedUpdates);
            return ok(irrigationRowSchema.parse(MOCK_IRRIGATION[idx]));
        }

        const supabase = await getDb();
        const { data, error } = await supabase
            .from("irrigation_networks")
            .update(validatedUpdates)
            .eq("id", id)
            .select()
            .single();

        if (error) return err(`Failed to update irrigation: ${error.message}`, "DB_ERROR");
        return ok(irrigationRowSchema.parse(data));
    } catch (e: unknown) {
        return err(e instanceof Error ? e.message : String(e), "UNKNOWN");
    }
}

export async function deleteIrrigation(id: string): Promise<ActionResult<void>> {
    try {
        if (isMockMode()) {
            const { MOCK_IRRIGATION } = await import("@/lib/mock/mock-water-data");
            const idx = MOCK_IRRIGATION.findIndex((n) => n.id === id);
            if (idx === -1) return err("Irrigation network not found", "NOT_FOUND");
            MOCK_IRRIGATION.splice(idx, 1);
            return okVoid();
        }

        const supabase = await getDb();
        const { error } = await supabase.from("irrigation_networks").delete().eq("id", id);
        if (error) return err(`Failed to delete irrigation: ${error.message}`, "DB_ERROR");
        return okVoid();
    } catch (e: unknown) {
        return err(e instanceof Error ? e.message : String(e), "UNKNOWN");
    }
}
