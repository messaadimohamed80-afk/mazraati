"use server";

import { useMock, getDb, getCurrentFarmId } from "@/lib/db";
import {
    MOCK_SOLAR,
    MOCK_ELECTRICITY,
    MOCK_GENERATORS,
} from "@/lib/mock-energy-data";
import type { SolarPanel, ElectricityMeter, Generator } from "@/lib/mock-energy-data";

// ============================================================
// SOLAR PANELS
// ============================================================

export async function getSolarPanels(): Promise<SolarPanel[]> {
    if (useMock()) return MOCK_SOLAR;

    const supabase = await getDb();
    const farmId = await getCurrentFarmId();
    if (!farmId) return [];

    const { data, error } = await supabase
        .from("solar_panels")
        .select("*")
        .eq("farm_id", farmId)
        .order("name");

    if (error) throw new Error(`Failed to fetch solar panels: ${error.message}`);
    return data as SolarPanel[];
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
}): Promise<SolarPanel> {
    if (useMock()) {
        const newPanel: SolarPanel = {
            id: `solar-${Date.now()}`,
            farm_id: "farm-1",
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
        return newPanel;
    }

    const supabase = await getDb();
    const farmId = await getCurrentFarmId();
    if (!farmId) throw new Error("Not authenticated");

    const { data, error } = await supabase
        .from("solar_panels")
        .insert({ farm_id: farmId, ...panel })
        .select()
        .single();

    if (error) throw new Error(`Failed to create solar panel: ${error.message}`);
    return data as SolarPanel;
}

// ============================================================
// ELECTRICITY METERS
// ============================================================

export async function getElectricityMeters(): Promise<ElectricityMeter[]> {
    if (useMock()) return MOCK_ELECTRICITY;

    const supabase = await getDb();
    const farmId = await getCurrentFarmId();
    if (!farmId) return [];

    const { data, error } = await supabase
        .from("electricity_meters")
        .select("*")
        .eq("farm_id", farmId)
        .order("name");

    if (error) throw new Error(`Failed to fetch meters: ${error.message}`);
    return data as ElectricityMeter[];
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
    notes?: string;
}): Promise<ElectricityMeter> {
    if (useMock()) {
        const newMeter: ElectricityMeter = {
            id: `elec-${Date.now()}`,
            farm_id: "farm-1",
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
        return newMeter;
    }

    const supabase = await getDb();
    const farmId = await getCurrentFarmId();
    if (!farmId) throw new Error("Not authenticated");

    const { data, error } = await supabase
        .from("electricity_meters")
        .insert({ farm_id: farmId, ...meter })
        .select()
        .single();

    if (error) throw new Error(`Failed to create meter: ${error.message}`);
    return data as ElectricityMeter;
}

// ============================================================
// GENERATORS
// ============================================================

export async function getGenerators(): Promise<Generator[]> {
    if (useMock()) return MOCK_GENERATORS;

    const supabase = await getDb();
    const farmId = await getCurrentFarmId();
    if (!farmId) return [];

    const { data, error } = await supabase
        .from("generators")
        .select("*")
        .eq("farm_id", farmId)
        .order("name");

    if (error) throw new Error(`Failed to fetch generators: ${error.message}`);
    return data as Generator[];
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
}): Promise<Generator> {
    if (useMock()) {
        const newGen: Generator = {
            id: `gen-${Date.now()}`,
            farm_id: "farm-1",
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
        return newGen;
    }

    const supabase = await getDb();
    const farmId = await getCurrentFarmId();
    if (!farmId) throw new Error("Not authenticated");

    const { data, error } = await supabase
        .from("generators")
        .insert({ farm_id: farmId, ...gen })
        .select()
        .single();

    if (error) throw new Error(`Failed to create generator: ${error.message}`);
    return data as Generator;
}
