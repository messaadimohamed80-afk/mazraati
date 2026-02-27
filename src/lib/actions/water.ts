"use server";

import { isMockMode, getDb, getCurrentFarmId } from "@/lib/db";
import type { Well, WellLayer, WaterTank, IrrigationNetwork } from "@/lib/types";

// ============================================================
// WELLS
// ============================================================

export async function getWells(): Promise<Well[]> {
    if (isMockMode()) {
        const { MOCK_WELLS } = await import("@/lib/mock/mock-water-data");
        return MOCK_WELLS;
    }

    const supabase = await getDb();
    const farmId = await getCurrentFarmId();
    if (!farmId) return [];

    const { data, error } = await supabase
        .from("wells")
        .select("*")
        .eq("farm_id", farmId)
        .order("name")
        .limit(100);

    if (error) throw new Error(`Failed to fetch wells: ${error.message}`);
    return data as Well[];
}

export async function getWellLayers(wellId: string): Promise<WellLayer[]> {
    if (isMockMode()) {
        const { MOCK_WELL_LAYERS } = await import("@/lib/mock/mock-water-data");
        return MOCK_WELL_LAYERS.filter((l) => l.well_id === wellId);
    }

    const supabase = await getDb();
    const { data, error } = await supabase
        .from("well_layers")
        .select("*")
        .eq("well_id", wellId)
        .order("depth_from")
        .limit(100);

    if (error) throw new Error(`Failed to fetch well layers: ${error.message}`);
    return data as WellLayer[];
}

import { createWellSchema } from "@/lib/validations";

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
}): Promise<Well> {
    const parsed = createWellSchema.parse(well);
    if (isMockMode()) {
        const { MOCK_WELLS } = await import("@/lib/mock/mock-water-data");
        const newWell: Well = {
            id: `well-${Date.now()}`,
            farm_id: "farm-1",
            name: well.name,
            depth_meters: well.depth_meters,
            water_level_meters: well.water_level_meters,
            total_cost: well.total_cost,
            salinity_ppm: well.salinity_ppm,
            latitude: well.latitude,
            longitude: well.longitude,
            created_at: new Date().toISOString(),
            water_quality: (well.water_quality as Well["water_quality"]) || "fresh",
            status: (well.status as Well["status"]) || "drilling",
        };
        MOCK_WELLS.push(newWell);
        return newWell;
    }

    const supabase = await getDb();
    const farmId = await getCurrentFarmId();
    if (!farmId) throw new Error("Not authenticated");

    const { data, error } = await supabase
        .from("wells")
        .insert({ farm_id: farmId, ...parsed })
        .select()
        .single();

    if (error) throw new Error(`Failed to create well: ${error.message}`);
    return data as Well;
}

// ============================================================
// WATER TANKS
// ============================================================

export async function getTanks(): Promise<WaterTank[]> {
    if (isMockMode()) {
        const { MOCK_TANKS } = await import("@/lib/mock/mock-water-data");
        return MOCK_TANKS;
    }

    const supabase = await getDb();
    const farmId = await getCurrentFarmId();
    if (!farmId) return [];

    const { data, error } = await supabase
        .from("water_tanks")
        .select("*")
        .eq("farm_id", farmId)
        .order("name");

    if (error) throw new Error(`Failed to fetch tanks: ${error.message}`);
    return data as WaterTank[];
}

export async function createTank(tank: {
    name: string;
    type: string;
    capacity_liters: number;
    current_level_percent?: number;
    source: string;
    status?: string;
    notes?: string;
}): Promise<WaterTank> {
    if (isMockMode()) {
        const { MOCK_TANKS } = await import("@/lib/mock/mock-water-data");
        const newTank: WaterTank = {
            id: `tank-${Date.now()}`,
            farm_id: "farm-1",
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
        return newTank;
    }

    const supabase = await getDb();
    const farmId = await getCurrentFarmId();
    if (!farmId) throw new Error("Not authenticated");

    const { data, error } = await supabase
        .from("water_tanks")
        .insert({ farm_id: farmId, ...tank })
        .select()
        .single();

    if (error) throw new Error(`Failed to create tank: ${error.message}`);
    return data as WaterTank;
}

// ============================================================
// IRRIGATION NETWORKS
// ============================================================

export async function getIrrigation(): Promise<IrrigationNetwork[]> {
    if (isMockMode()) {
        const { MOCK_IRRIGATION } = await import("@/lib/mock/mock-water-data");
        return MOCK_IRRIGATION;
    }

    const supabase = await getDb();
    const farmId = await getCurrentFarmId();
    if (!farmId) return [];

    const { data, error } = await supabase
        .from("irrigation_networks")
        .select("*")
        .eq("farm_id", farmId)
        .order("name");

    if (error) throw new Error(`Failed to fetch irrigation: ${error.message}`);
    return data as IrrigationNetwork[];
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
}): Promise<IrrigationNetwork> {
    if (isMockMode()) {
        const { MOCK_IRRIGATION } = await import("@/lib/mock/mock-water-data");
        const newNet: IrrigationNetwork = {
            id: `irr-${Date.now()}`,
            farm_id: "farm-1",
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
        return newNet;
    }

    const supabase = await getDb();
    const farmId = await getCurrentFarmId();
    if (!farmId) throw new Error("Not authenticated");

    const { data, error } = await supabase
        .from("irrigation_networks")
        .insert({ farm_id: farmId, ...network })
        .select()
        .single();

    if (error) throw new Error(`Failed to create irrigation network: ${error.message}`);
    return data as IrrigationNetwork;
}
