

import type { SolarPanel, ElectricityMeter, Generator } from "../types";

/* ===== Mock Data ===== */
export const MOCK_SOLAR: SolarPanel[] = [
    {
        id: "00000000-0000-4000-8000-00000000f001",
        farm_id: "00000000-0000-4000-8000-000000000010",
        name: "المنظومة الشمسية – المضخة",
        capacity_kw: 5.5,
        panel_count: 12,
        daily_production_kwh: 22,
        efficiency_percent: 82,
        installation_date: "2024-08-15",
        inverter_type: "Huawei SUN2000",
        status: "active",
        total_cost: 8500,
        notes: "تغذي مضخة البئر الرئيسي",
        created_at: "2024-08-15T10:00:00Z",
    },
    {
        id: "00000000-0000-4000-8000-00000000f002",
        farm_id: "00000000-0000-4000-8000-000000000010",
        name: "ألواح سقف المخزن",
        capacity_kw: 3.2,
        panel_count: 8,
        daily_production_kwh: 14,
        efficiency_percent: 78,
        installation_date: "2025-01-10",
        inverter_type: "Growatt MIN 3000",
        status: "active",
        total_cost: 4200,
        notes: "تغذي الإنارة والمعدات الصغيرة",
        created_at: "2025-01-10T09:00:00Z",
    },
    {
        id: "00000000-0000-4000-8000-00000000f003",
        farm_id: "00000000-0000-4000-8000-000000000010",
        name: "مشروع التوسعة",
        capacity_kw: 10,
        panel_count: 24,
        daily_production_kwh: 0,
        efficiency_percent: 0,
        installation_date: "",
        inverter_type: "–",
        status: "inactive",
        total_cost: 0,
        notes: "مخطط للربع الثاني 2025",
        created_at: "2025-02-01T08:00:00Z",
    },
];

export const MOCK_ELECTRICITY: ElectricityMeter[] = [
    {
        id: "00000000-0000-4000-8000-00000000f101",
        farm_id: "00000000-0000-4000-8000-000000000010",
        name: "العداد الرئيسي",
        meter_number: "TN-2024-889145",
        provider: "الستاغ",
        monthly_consumption_kwh: 450,
        monthly_cost: 85,
        currency: "TND",
        tariff_type: "agricultural",
        status: "active",
        last_reading_date: "2025-02-01",
        notes: "تعريفة فلاحية",
        created_at: "2024-01-01T10:00:00Z",
    },
    {
        id: "00000000-0000-4000-8000-00000000f102",
        farm_id: "00000000-0000-4000-8000-000000000010",
        name: "عداد المسكن",
        meter_number: "TN-2024-112847",
        provider: "الستاغ",
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
        id: "00000000-0000-4000-8000-00000000f201",
        farm_id: "00000000-0000-4000-8000-000000000010",
        name: "المولد الرئيسي",
        fuel_type: "diesel",
        capacity_kva: 15,
        runtime_hours: 1240,
        fuel_consumption_lph: 3.5,
        last_maintenance: "2025-01-20",
        next_maintenance_hours: 1500,
        status: "standby",
        total_cost: 4800,
        notes: "مولد كمنز – احتياطي عند انقطاع الكهرباء",
        created_at: "2024-03-10T10:00:00Z",
    },
    {
        id: "00000000-0000-4000-8000-00000000f202",
        farm_id: "00000000-0000-4000-8000-000000000010",
        name: "مولد الري المحمول",
        fuel_type: "gasoline",
        capacity_kva: 5,
        runtime_hours: 680,
        fuel_consumption_lph: 1.8,
        last_maintenance: "2024-12-15",
        next_maintenance_hours: 750,
        status: "maintenance",
        total_cost: 1200,
        notes: "يحتاج تغيير فلتر الزيت",
        created_at: "2024-06-20T14:00:00Z",
    },
];

/* ===== Status Maps ===== */
export const SOLAR_STATUS_MAP: Record<string, { label: string; color: string; icon: string }> = {
    active: { label: "نشط", color: "#10b981", icon: "☀️" },
    maintenance: { label: "صيانة", color: "#f59e0b", icon: "🔧" },
    inactive: { label: "غير مفعّل", color: "#64748b", icon: "⏸️" },
};

export const ELEC_STATUS_MAP: Record<string, { label: string; color: string }> = {
    active: { label: "نشط", color: "#10b981" },
    suspended: { label: "موقوف", color: "#f59e0b" },
    disconnected: { label: "مقطوع", color: "#ef4444" },
};

export const ELEC_TARIFF_MAP: Record<string, string> = {
    agricultural: "فلاحي",
    residential: "منزلي",
    commercial: "تجاري",
};

export const GEN_STATUS_MAP: Record<string, { label: string; color: string; icon: string }> = {
    running: { label: "يعمل", color: "#10b981", icon: "🟢" },
    standby: { label: "احتياطي", color: "#3b82f6", icon: "🔵" },
    maintenance: { label: "صيانة", color: "#f59e0b", icon: "🔧" },
    broken: { label: "معطّل", color: "#ef4444", icon: "🔴" },
};

export const FUEL_TYPE_MAP: Record<string, { label: string; icon: string }> = {
    diesel: { label: "ديزل", icon: "⛽" },
    gasoline: { label: "بنزين", icon: "🛢️" },
    gas: { label: "غاز", icon: "🔥" },
};
