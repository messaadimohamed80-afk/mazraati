


/* ===== Types (inline for energy module) ===== */
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

/* ===== Mock Data ===== */
export const MOCK_SOLAR: SolarPanel[] = [
    {
        id: "solar-1",
        farm_id: "00000000-0000-4000-8000-000000000010",
        name: "Ø§Ù„Ù…Ù†Ø¸ÙˆÙ…Ø© Ø§Ù„Ø´Ù…Ø³ÙŠØ© â€” Ø§Ù„Ù…Ø¶Ø®Ø©",
        capacity_kw: 5.5,
        panel_count: 12,
        daily_production_kwh: 22,
        efficiency_percent: 82,
        installation_date: "2024-08-15",
        inverter_type: "Huawei SUN2000",
        status: "active",
        total_cost: 8500,
        notes: "ØªØºØ°ÙŠ Ù…Ø¶Ø®Ø© Ø§Ù„Ø¨Ø¦Ø± Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠ",
        created_at: "2024-08-15T10:00:00Z",
    },
    {
        id: "solar-2",
        farm_id: "00000000-0000-4000-8000-000000000010",
        name: "Ø£Ù„ÙˆØ§Ø­ Ø³Ù‚Ù Ø§Ù„Ù…Ø®Ø²Ù†",
        capacity_kw: 3.2,
        panel_count: 8,
        daily_production_kwh: 14,
        efficiency_percent: 78,
        installation_date: "2025-01-10",
        inverter_type: "Growatt MIN 3000",
        status: "active",
        total_cost: 4200,
        notes: "ØªØºØ°ÙŠ Ø§Ù„Ø¥Ù†Ø§Ø±Ø© ÙˆØ§Ù„Ù…Ø¹Ø¯Ø§Øª Ø§Ù„ØµØºÙŠØ±Ø©",
        created_at: "2025-01-10T09:00:00Z",
    },
    {
        id: "solar-3",
        farm_id: "00000000-0000-4000-8000-000000000010",
        name: "Ù…Ø´Ø±ÙˆØ¹ Ø§Ù„ØªÙˆØ³Ø¹Ø©",
        capacity_kw: 10,
        panel_count: 24,
        daily_production_kwh: 0,
        efficiency_percent: 0,
        installation_date: "",
        inverter_type: "â€”",
        status: "inactive",
        total_cost: 0,
        notes: "Ù…Ø®Ø·Ø· Ù„Ù„Ø±Ø¨Ø¹ Ø§Ù„Ø«Ø§Ù†ÙŠ 2025",
        created_at: "2025-02-01T08:00:00Z",
    },
];

export const MOCK_ELECTRICITY: ElectricityMeter[] = [
    {
        id: "elec-1",
        farm_id: "00000000-0000-4000-8000-000000000010",
        name: "Ø§Ù„Ø¹Ø¯Ø§Ø¯ Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠ",
        meter_number: "TN-2024-889145",
        provider: "Ø§Ù„Ø³ØªØ§Øº",
        monthly_consumption_kwh: 450,
        monthly_cost: 85,
        currency: "TND",
        tariff_type: "agricultural",
        status: "active",
        last_reading_date: "2025-02-01",
        notes: "ØªØ¹Ø±ÙŠÙØ© ÙÙ„Ø§Ø­ÙŠØ©",
        created_at: "2024-01-01T10:00:00Z",
    },
    {
        id: "elec-2",
        farm_id: "00000000-0000-4000-8000-000000000010",
        name: "Ø¹Ø¯Ø§Ø¯ Ø§Ù„Ù…Ø³ÙƒÙ†",
        meter_number: "TN-2024-112847",
        provider: "Ø§Ù„Ø³ØªØ§Øº",
        monthly_consumption_kwh: 180,
        monthly_cost: 42,
        currency: "TND",
        tariff_type: "residential",
        status: "active",
        last_reading_date: "2025-02-01",
        created_at: "2024-01-01T10:00:00Z",
    },
];

export const MOCK_GENERATORS: Generator[] = [
    {
        id: "gen-1",
        farm_id: "00000000-0000-4000-8000-000000000010",
        name: "Ø§Ù„Ù…ÙˆÙ„Ø¯ Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠ",
        fuel_type: "diesel",
        capacity_kva: 15,
        runtime_hours: 1240,
        fuel_consumption_lph: 3.5,
        last_maintenance: "2025-01-20",
        next_maintenance_hours: 1500,
        status: "standby",
        total_cost: 4800,
        notes: "Ù…ÙˆÙ„Ø¯ ÙƒÙ…Ù†Ø² â€” Ø§Ø­ØªÙŠØ§Ø·ÙŠ Ø¹Ù†Ø¯ Ø§Ù†Ù‚Ø·Ø§Ø¹ Ø§Ù„ÙƒÙ‡Ø±Ø¨Ø§Ø¡",
        created_at: "2024-03-10T10:00:00Z",
    },
    {
        id: "gen-2",
        farm_id: "00000000-0000-4000-8000-000000000010",
        name: "Ù…ÙˆÙ„Ø¯ Ø§Ù„Ø±ÙŠ Ø§Ù„Ù…Ø­Ù…ÙˆÙ„",
        fuel_type: "gasoline",
        capacity_kva: 5,
        runtime_hours: 680,
        fuel_consumption_lph: 1.8,
        last_maintenance: "2024-12-15",
        next_maintenance_hours: 750,
        status: "maintenance",
        total_cost: 1200,
        notes: "ÙŠØ­ØªØ§Ø¬ ØªØºÙŠÙŠØ± ÙÙ„ØªØ± Ø§Ù„Ø²ÙŠØª",
        created_at: "2024-06-20T14:00:00Z",
    },
];

/* ===== Status Maps ===== */
export const SOLAR_STATUS_MAP: Record<string, { label: string; color: string; icon: string }> = {
    active: { label: "Ù†Ø´Ø·", color: "#10b981", icon: "â˜€ï¸" },
    maintenance: { label: "ØµÙŠØ§Ù†Ø©", color: "#f59e0b", icon: "ðŸ”§" },
    inactive: { label: "ØºÙŠØ± Ù…ÙØ¹Ù‘Ù„", color: "#64748b", icon: "â¸ï¸" },
};

export const ELEC_STATUS_MAP: Record<string, { label: string; color: string }> = {
    active: { label: "Ù†Ø´Ø·", color: "#10b981" },
    suspended: { label: "Ù…ÙˆÙ‚ÙˆÙ", color: "#f59e0b" },
    disconnected: { label: "Ù…Ù‚Ø·ÙˆØ¹", color: "#ef4444" },
};

export const ELEC_TARIFF_MAP: Record<string, string> = {
    agricultural: "ÙÙ„Ø§Ø­ÙŠ",
    residential: "Ù…Ù†Ø²Ù„ÙŠ",
    commercial: "ØªØ¬Ø§Ø±ÙŠ",
};

export const GEN_STATUS_MAP: Record<string, { label: string; color: string; icon: string }> = {
    running: { label: "ÙŠØ¹Ù…Ù„", color: "#10b981", icon: "ðŸŸ¢" },
    standby: { label: "Ø§Ø­ØªÙŠØ§Ø·ÙŠ", color: "#3b82f6", icon: "ðŸ”µ" },
    maintenance: { label: "ØµÙŠØ§Ù†Ø©", color: "#f59e0b", icon: "ðŸ”§" },
    broken: { label: "Ù…Ø¹Ø·Ù‘Ù„", color: "#ef4444", icon: "ðŸ”´" },
};

export const FUEL_TYPE_MAP: Record<string, { label: string; icon: string }> = {
    diesel: { label: "Ø¯ÙŠØ²Ù„", icon: "â›½" },
    gasoline: { label: "Ø¨Ù†Ø²ÙŠÙ†", icon: "ðŸ›¢ï¸" },
    gas: { label: "ØºØ§Ø²", icon: "ðŸ”¥" },
};
