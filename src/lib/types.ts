/* ===== Database Types ===== */

export interface Profile {
    id: string;
    full_name: string;
    phone?: string;
    avatar_url?: string;
    preferred_currency: "TND" | "DZD" | "SAR" | "EGP" | "MAD" | "USD";
    created_at: string;
}

export interface Farm {
    id: string;
    owner_id: string;
    name: string;
    location_text?: string;
    latitude?: number;
    longitude?: number;
    area_hectares?: number;
    currency: string;
    created_at: string;
}

export interface FarmMember {
    farm_id: string;
    user_id: string;
    role: "owner" | "manager" | "worker" | "viewer";
}

export interface Category {
    id: string;
    farm_id: string;
    name: string;
    icon: string;
    color: string;
    budget_planned?: number;
    created_at: string;
}

export interface Expense {
    id: string;
    farm_id: string;
    category_id: string;
    amount: number;
    currency: string;
    description: string;
    notes?: string;
    date: string;
    receipt_url?: string;
    created_by: string;
    created_at: string;
    // Joined
    category?: Category;
}

export interface Well {
    id: string;
    farm_id: string;
    name: string;
    depth_meters: number;
    water_level_meters?: number;
    water_quality: "fresh" | "brackish" | "saline";
    status: "drilling" | "testing" | "active" | "inactive";
    total_cost?: number;
    salinity_ppm?: number;
    latitude?: number;
    longitude?: number;
    created_at: string;
}

export interface WellLayer {
    id: string;
    well_id: string;
    depth_from: number;
    depth_to: number;
    layer_type: "soil" | "rock" | "clay" | "water" | "sand" | "gravel";
    notes?: string;
}

export interface WaterTank {
    id: string;
    farm_id: string;
    name: string;
    type: "ground" | "elevated" | "underground";
    capacity_liters: number;
    current_level_percent: number;
    source: string; // e.g. "بئر 1", "مياه أمطار"
    status: "active" | "maintenance" | "empty" | "inactive";
    last_filled?: string;
    notes?: string;
    created_at: string;
}

export interface IrrigationNetwork {
    id: string;
    farm_id: string;
    name: string;
    type: "drip" | "sprinkler" | "flood" | "pivot";
    coverage_hectares: number;
    source_id?: string; // well or tank id
    source_name: string;
    status: "active" | "maintenance" | "inactive" | "planned";
    flow_rate_lph?: number; // liters per hour
    last_maintenance?: string;
    notes?: string;
    created_at: string;
}

export interface Crop {
    id: string;
    farm_id: string;
    crop_type: string;
    variety?: string;
    field_name?: string;
    area_hectares?: number;
    planting_date?: string;
    expected_harvest?: string;
    actual_harvest?: string;
    yield_kg?: number;
    status: "planned" | "planted" | "growing" | "harvested";
    current_stage?: string;
    latitude?: number;
    longitude?: number;
    notes?: string;
    created_at: string;
}

export interface Task {
    id: string;
    farm_id: string;
    crop_id?: string;
    title: string;
    description?: string;
    assigned_to?: string;
    due_date?: string;
    completed_at?: string;
    priority: "low" | "medium" | "high" | "urgent";
    status: "pending" | "in_progress" | "done";
    recurring: boolean;
    recurrence_rule?: string;
    created_at: string;
}

/* ===== Energy Types ===== */

export interface SolarPanel {
    id: string;
    farm_id: string;
    name: string;
    capacity_kw: number;
    panel_count: number;
    daily_production_kwh: number;
    efficiency_percent: number;
    installation_date: string;
    inverter_type: string;
    status: "active" | "maintenance" | "inactive";
    total_cost: number;
    notes?: string;
    created_at: string;
}

export interface ElectricityMeter {
    id: string;
    farm_id: string;
    name: string;
    meter_number: string;
    provider: string;
    monthly_consumption_kwh: number;
    monthly_cost: number;
    currency: string;
    tariff_type: "agricultural" | "residential" | "commercial";
    status: "active" | "suspended" | "disconnected";
    last_reading_date: string;
    notes?: string;
    created_at: string;
}

export interface Generator {
    id: string;
    farm_id: string;
    name: string;
    fuel_type: "diesel" | "gasoline" | "gas";
    capacity_kva: number;
    runtime_hours: number;
    fuel_consumption_lph: number;
    last_maintenance: string;
    next_maintenance_hours: number;
    status: "running" | "standby" | "maintenance" | "broken";
    total_cost: number;
    notes?: string;
    created_at: string;
}

/* ===== Livestock Types ===== */

export interface Animal {
    id: string;
    farm_id: string;
    name: string;
    type: "sheep" | "cattle" | "poultry" | "goat";
    breed: string;
    gender: "male" | "female";
    birth_date?: string;
    weight_kg?: number;
    tag_number: string;
    status: "healthy" | "sick" | "pregnant" | "sold" | "deceased";
    mother_id?: string;
    acquisition_date: string;
    acquisition_type: "born" | "purchased";
    purchase_price?: number;
    notes?: string;
    created_at: string;
}

export interface VaccinationRecord {
    id: string;
    animal_id: string;
    vaccine_name: string;
    date: string;
    next_due?: string;
    administered_by?: string;
    cost?: number;
    notes?: string;
    created_at: string;
}

export interface FeedRecord {
    id: string;
    farm_id: string;
    feed_type: string;
    quantity_kg: number;
    cost_per_kg: number;
    purchase_date: string;
    remaining_kg: number;
    notes?: string;
    created_at: string;
}

/* ===== Inventory Types ===== */

export interface InventoryItem {
    id: string;
    farm_id: string;
    name: string;
    category: "equipment" | "chemicals" | "seeds" | "tools" | "supplies" | "spare_parts";
    quantity: number;
    unit: string;
    min_stock: number;
    location: string;
    purchase_date: string;
    purchase_price: number;
    condition: "new" | "good" | "fair" | "needs_repair" | "broken";
    last_maintenance?: string;
    next_maintenance?: string;
    notes?: string;
    created_at: string;
}

/* ===== Mutation DTO Types ===== */

/** Fields auto-generated by the server — excluded from create inputs */
type ServerFields = "id" | "farm_id" | "created_at" | "created_by";

export type CreateExpenseInput = Omit<Expense, ServerFields | "category">;
export type UpdateExpenseInput = Partial<CreateExpenseInput>;

export type CreateCropInput = Omit<Crop, ServerFields>;
export type UpdateCropInput = Partial<CreateCropInput>;

export type CreateTaskInput = Omit<Task, ServerFields>;
export type UpdateTaskInput = Partial<CreateTaskInput>;

export type CreateAnimalInput = Omit<Animal, ServerFields>;
export type UpdateAnimalInput = Partial<CreateAnimalInput>;

export type CreateWellInput = Omit<Well, ServerFields>;
export type CreateTankInput = Omit<WaterTank, ServerFields>;
export type CreateIrrigationInput = Omit<IrrigationNetwork, ServerFields>;

export type CreateSolarPanelInput = Omit<SolarPanel, ServerFields>;
export type CreateMeterInput = Omit<ElectricityMeter, ServerFields>;
export type CreateGeneratorInput = Omit<Generator, ServerFields>;

export type CreateInventoryInput = Omit<InventoryItem, ServerFields>;
export type UpdateInventoryInput = Partial<CreateInventoryInput>;
