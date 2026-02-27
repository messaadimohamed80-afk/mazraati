import { Well, WellLayer, WaterTank, IrrigationNetwork } from "../types";

/* ===== Wells ===== */
export const MOCK_WELLS: Well[] = [
    {
        id: "well-1",
        farm_id: "00000000-0000-4000-8000-000000000010",
        name: "Ø§Ù„Ø¨Ø¦Ø± Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠ",
        depth_meters: 120,
        water_level_meters: 45,
        water_quality: "fresh",
        status: "active",
        total_cost: 42800,
        salinity_ppm: 320,
        latitude: 36.8065,
        longitude: 10.1815,
        created_at: "2024-06-15T10:00:00Z",
    },
    {
        id: "well-2",
        farm_id: "00000000-0000-4000-8000-000000000010",
        name: "Ø¨Ø¦Ø± Ø§Ù„Ù‚Ø·Ø¹Ø© Ø§Ù„Ø¬Ù†ÙˆØ¨ÙŠØ©",
        depth_meters: 85,
        water_level_meters: 32,
        water_quality: "fresh",
        status: "active",
        total_cost: 18500,
        salinity_ppm: 410,
        latitude: 36.8070,
        longitude: 10.1820,
        created_at: "2024-09-20T14:00:00Z",
    },
    {
        id: "well-3",
        farm_id: "00000000-0000-4000-8000-000000000010",
        name: "Ø¨Ø¦Ø± Ø§Ù„Ù‚Ø·Ø¹Ø© Ø§Ù„Ø´Ù…Ø§Ù„ÙŠØ©",
        depth_meters: 150,
        water_level_meters: 68,
        water_quality: "brackish",
        status: "testing",
        total_cost: 35200,
        salinity_ppm: 980,
        latitude: 36.8080,
        longitude: 10.1800,
        created_at: "2025-01-10T08:00:00Z",
    },
    {
        id: "well-4",
        farm_id: "00000000-0000-4000-8000-000000000010",
        name: "Ø§Ù„Ø¨Ø¦Ø± Ø§Ù„Ù‚Ø¯ÙŠÙ…",
        depth_meters: 60,
        water_level_meters: 55,
        water_quality: "saline",
        status: "inactive",
        total_cost: 8000,
        salinity_ppm: 2400,
        created_at: "2023-03-01T09:00:00Z",
    },
];

/* ===== Well Layers (for well-1) ===== */
export const MOCK_WELL_LAYERS: WellLayer[] = [
    { id: "wl-1", well_id: "well-1", depth_from: 0, depth_to: 8, layer_type: "soil", notes: "ØªØ±Ø¨Ø© Ø²Ø±Ø§Ø¹ÙŠØ©" },
    { id: "wl-2", well_id: "well-1", depth_from: 8, depth_to: 25, layer_type: "clay", notes: "Ø·ÙŠÙ† Ø£Ø­Ù…Ø±" },
    { id: "wl-3", well_id: "well-1", depth_from: 25, depth_to: 45, layer_type: "rock", notes: "ØµØ®Ø± ÙƒÙ„Ø³ÙŠ" },
    { id: "wl-4", well_id: "well-1", depth_from: 45, depth_to: 52, layer_type: "sand" },
    { id: "wl-5", well_id: "well-1", depth_from: 52, depth_to: 78, layer_type: "water", notes: "Ø·Ø¨Ù‚Ø© Ù…Ø§Ø¦ÙŠØ© Ø±Ø¦ÙŠØ³ÙŠØ©" },
    { id: "wl-6", well_id: "well-1", depth_from: 78, depth_to: 95, layer_type: "gravel" },
    { id: "wl-7", well_id: "well-1", depth_from: 95, depth_to: 120, layer_type: "rock", notes: "ØµØ®Ø± ØµÙ„Ø¨" },
];

/* ===== Water Tanks ===== */
export const MOCK_TANKS: WaterTank[] = [
    {
        id: "tank-1",
        farm_id: "00000000-0000-4000-8000-000000000010",
        name: "Ø§Ù„Ø®Ø²Ø§Ù† Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠ",
        type: "elevated",
        capacity_liters: 10000,
        current_level_percent: 72,
        source: "Ø§Ù„Ø¨Ø¦Ø± Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠ",
        status: "active",
        last_filled: "2025-02-09",
        notes: "Ø®Ø²Ø§Ù† Ø¨Ù„Ø§Ø³ØªÙŠÙƒÙŠ 10 Ù…Â³",
        created_at: "2024-07-01T10:00:00Z",
    },
    {
        id: "tank-2",
        farm_id: "00000000-0000-4000-8000-000000000010",
        name: "Ø®Ø²Ø§Ù† Ø§Ù„Ø±ÙŠ",
        type: "ground",
        capacity_liters: 25000,
        current_level_percent: 45,
        source: "Ø¨Ø¦Ø± Ø§Ù„Ù‚Ø·Ø¹Ø© Ø§Ù„Ø¬Ù†ÙˆØ¨ÙŠØ©",
        status: "active",
        last_filled: "2025-02-07",
        notes: "Ø­ÙˆØ¶ Ø®Ø±Ø³Ø§Ù†ÙŠ",
        created_at: "2024-08-15T12:00:00Z",
    },
    {
        id: "tank-3",
        farm_id: "00000000-0000-4000-8000-000000000010",
        name: "Ø®Ø²Ø§Ù† Ù…ÙŠØ§Ù‡ Ø§Ù„Ø£Ù…Ø·Ø§Ø±",
        type: "underground",
        capacity_liters: 50000,
        current_level_percent: 88,
        source: "Ù…ÙŠØ§Ù‡ Ø£Ù…Ø·Ø§Ø±",
        status: "active",
        last_filled: "2025-01-28",
        notes: "Ù…Ø§Ø¬Ù„ ØªØ­Øª Ø£Ø±Ø¶ÙŠ",
        created_at: "2024-05-20T09:00:00Z",
    },
    {
        id: "tank-4",
        farm_id: "00000000-0000-4000-8000-000000000010",
        name: "Ø®Ø²Ø§Ù† Ø§Ø­ØªÙŠØ§Ø·ÙŠ",
        type: "ground",
        capacity_liters: 5000,
        current_level_percent: 0,
        source: "â€”",
        status: "empty",
        notes: "Ù…Ø¹Ø·Ù‘Ù„ Ù…Ø¤Ù‚ØªØ§Ù‹",
        created_at: "2024-11-01T08:00:00Z",
    },
];

/* ===== Irrigation Networks ===== */
export const MOCK_IRRIGATION: IrrigationNetwork[] = [
    {
        id: "irr-1",
        farm_id: "00000000-0000-4000-8000-000000000010",
        name: "Ø´Ø¨ÙƒØ© Ø§Ù„Ø±ÙŠ Ø¨Ø§Ù„ØªÙ†Ù‚ÙŠØ· â€” Ø§Ù„Ø²ÙŠØªÙˆÙ†",
        type: "drip",
        coverage_hectares: 2.5,
        source_id: "tank-2",
        source_name: "Ø®Ø²Ø§Ù† Ø§Ù„Ø±ÙŠ",
        status: "active",
        flow_rate_lph: 800,
        last_maintenance: "2025-01-15",
        notes: "Ø®Ø±Ø§Ø·ÙŠÙ… 16mm Ù…Ø¹ Ù†Ù‚Ø§Ø·Ø§Øª ÙƒÙ„ 60 Ø³Ù…",
        created_at: "2024-09-01T10:00:00Z",
    },
    {
        id: "irr-2",
        farm_id: "00000000-0000-4000-8000-000000000010",
        name: "Ø±Ø´Ø§Ø´Ø§Øª Ø§Ù„Ø­Ø¯ÙŠÙ‚Ø©",
        type: "sprinkler",
        coverage_hectares: 0.5,
        source_id: "tank-1",
        source_name: "Ø§Ù„Ø®Ø²Ø§Ù† Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠ",
        status: "active",
        flow_rate_lph: 1200,
        last_maintenance: "2025-02-01",
        created_at: "2024-10-15T14:00:00Z",
    },
    {
        id: "irr-3",
        farm_id: "00000000-0000-4000-8000-000000000010",
        name: "Ø±ÙŠ Ø§Ù„Ù‚Ø·Ø¹Ø© Ø§Ù„Ø¬Ù†ÙˆØ¨ÙŠØ©",
        type: "flood",
        coverage_hectares: 1.0,
        source_id: "well-1",
        source_name: "Ø§Ù„Ø¨Ø¦Ø± Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠ",
        status: "maintenance",
        flow_rate_lph: 3000,
        last_maintenance: "2024-12-20",
        notes: "ÙŠØ­ØªØ§Ø¬ Ø¥ØµÙ„Ø§Ø­ Ø§Ù„Ù‚Ù†ÙˆØ§Øª",
        created_at: "2024-07-20T08:00:00Z",
    },
    {
        id: "irr-4",
        farm_id: "00000000-0000-4000-8000-000000000010",
        name: "Ø´Ø¨ÙƒØ© Ø§Ù„ØªÙ†Ù‚ÙŠØ· â€” Ø§Ù„Ø®Ø¶Ø±ÙˆØ§Øª",
        type: "drip",
        coverage_hectares: 0.8,
        source_name: "Ø®Ø²Ø§Ù† Ù…ÙŠØ§Ù‡ Ø§Ù„Ø£Ù…Ø·Ø§Ø±",
        status: "planned",
        notes: "Ù…Ø®Ø·Ø· Ù„Ù„Ù…ÙˆØ³Ù… Ø§Ù„Ù‚Ø§Ø¯Ù…",
        created_at: "2025-02-05T11:00:00Z",
    },
];

/* ===== Helper Maps ===== */
export const WELL_STATUS_MAP: Record<string, { label: string; color: string; icon: string }> = {
    drilling: { label: "Ù‚ÙŠØ¯ Ø§Ù„Ø­ÙØ±", color: "#f59e0b", icon: "â›ï¸" },
    testing: { label: "Ù‚ÙŠØ¯ Ø§Ù„Ø§Ø®ØªØ¨Ø§Ø±", color: "#3b82f6", icon: "ðŸ”¬" },
    active: { label: "Ù†Ø´Ø·", color: "#10b981", icon: "âœ…" },
    inactive: { label: "Ù…Ø¹Ø·Ù‘Ù„", color: "#64748b", icon: "â¸ï¸" },
};

export const WATER_QUALITY_MAP: Record<string, { label: string; color: string }> = {
    fresh: { label: "Ø¹Ø°Ø¨Ø©", color: "#10b981" },
    brackish: { label: "Ù…Ø§Ù„Ø­Ø© Ù‚Ù„ÙŠÙ„Ø§Ù‹", color: "#f59e0b" },
    saline: { label: "Ù…Ø§Ù„Ø­Ø©", color: "#ef4444" },
};

export const TANK_TYPE_MAP: Record<string, { label: string; icon: string }> = {
    ground: { label: "Ø£Ø±Ø¶ÙŠ", icon: "ðŸ—ï¸" },
    elevated: { label: "Ù…Ø±ØªÙØ¹", icon: "ðŸ—¼" },
    underground: { label: "ØªØ­Øª Ø£Ø±Ø¶ÙŠ", icon: "ðŸ•³ï¸" },
};

export const TANK_STATUS_MAP: Record<string, { label: string; color: string }> = {
    active: { label: "Ù†Ø´Ø·", color: "#10b981" },
    maintenance: { label: "ØµÙŠØ§Ù†Ø©", color: "#f59e0b" },
    empty: { label: "ÙØ§Ø±Øº", color: "#ef4444" },
    inactive: { label: "Ù…Ø¹Ø·Ù‘Ù„", color: "#64748b" },
};

export const IRRIGATION_TYPE_MAP: Record<string, { label: string; icon: string }> = {
    drip: { label: "ØªÙ†Ù‚ÙŠØ·", icon: "ðŸ’§" },
    sprinkler: { label: "Ø±Ø´Ø§Ø´Ø§Øª", icon: "ðŸŒ§ï¸" },
    flood: { label: "ØºÙ…Ø±", icon: "ðŸŒŠ" },
    pivot: { label: "Ù…Ø­ÙˆØ±ÙŠ", icon: "ðŸ”„" },
};

export const IRRIGATION_STATUS_MAP: Record<string, { label: string; color: string }> = {
    active: { label: "Ù†Ø´Ø·", color: "#10b981" },
    maintenance: { label: "ØµÙŠØ§Ù†Ø©", color: "#f59e0b" },
    inactive: { label: "Ù…Ø¹Ø·Ù‘Ù„", color: "#64748b" },
    planned: { label: "Ù…Ø®Ø·Ø·", color: "#3b82f6" },
};
