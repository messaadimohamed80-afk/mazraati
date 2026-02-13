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

