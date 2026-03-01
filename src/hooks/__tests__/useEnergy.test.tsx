import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEnergy } from "@/hooks/useEnergy";
import type { SolarPanel, ElectricityMeter, Generator } from "@/lib/types";

/* ---- Mocks ---- */
const mockAddToast = vi.fn();

vi.mock("@/components/Toast", () => ({
    useToast: () => ({ addToast: mockAddToast, toasts: [], removeToast: vi.fn() }),
}));

const mockGetSolar = vi.fn();
const mockGetMeters = vi.fn();
const mockGetGenerators = vi.fn();
const mockCreateSolar = vi.fn();
const mockCreateMeter = vi.fn();
const mockCreateGenerator = vi.fn();

vi.mock("@/lib/actions/energy", () => ({
    getSolarPanels: (...args: unknown[]) => mockGetSolar(...args),
    getElectricityMeters: (...args: unknown[]) => mockGetMeters(...args),
    getGenerators: (...args: unknown[]) => mockGetGenerators(...args),
    createSolarPanel: (...args: unknown[]) => mockCreateSolar(...args),
    createElectricityMeter: (...args: unknown[]) => mockCreateMeter(...args),
    createGenerator: (...args: unknown[]) => mockCreateGenerator(...args),
}));

/* ---- Helpers ---- */
const INITIAL_SOLAR: SolarPanel[] = [
    {
        id: "00000000-0000-4000-8000-00000000f001", farm_id: "f1",
        name: "المنظومة الشمسية", capacity_kw: 5.5, panel_count: 12,
        daily_production_kwh: 22, efficiency_percent: 82,
        installation_date: "2024-08-15", inverter_type: "Huawei",
        status: "active", total_cost: 8500, created_at: "2024-08-15T10:00:00Z",
    },
];

const INITIAL_METERS: ElectricityMeter[] = [
    {
        id: "00000000-0000-4000-8000-00000000f101", farm_id: "f1",
        name: "العداد الرئيسي", meter_number: "TN-2024-889145",
        provider: "الستاغ", monthly_consumption_kwh: 450, monthly_cost: 85,
        currency: "TND", tariff_type: "agricultural", status: "active",
        last_reading_date: "2025-02-01", created_at: "2024-01-01T10:00:00Z",
    },
];

const INITIAL_GENERATORS: Generator[] = [
    {
        id: "00000000-0000-4000-8000-00000000f201", farm_id: "f1",
        name: "المولد الرئيسي", fuel_type: "diesel", capacity_kva: 15,
        runtime_hours: 1240, fuel_consumption_lph: 3.5,
        last_maintenance: "2025-01-20", next_maintenance_hours: 1500,
        status: "standby", total_cost: 4800, created_at: "2024-03-10T10:00:00Z",
    },
];

function createWrapper() {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    function Wrapper({ children }: { children: React.ReactNode }) {
        return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    }
    return Wrapper;
}

describe("useEnergy hook behavior", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockGetSolar.mockResolvedValue({ ok: true, data: INITIAL_SOLAR });
        mockGetMeters.mockResolvedValue({ ok: true, data: INITIAL_METERS });
        mockGetGenerators.mockResolvedValue({ ok: true, data: INITIAL_GENERATORS });
    });

    it("returns initial solar, meters, and generators data", () => {
        const { result } = renderHook(
            () => useEnergy(INITIAL_SOLAR, INITIAL_METERS, INITIAL_GENERATORS),
            { wrapper: createWrapper() },
        );

        expect(result.current.solarPanels).toHaveLength(1);
        expect(result.current.meters).toHaveLength(1);
        expect(result.current.generators).toHaveLength(1);
        expect(result.current.solarPanels[0].name).toBe("المنظومة الشمسية");
    });

    it("creates solar panel optimistically (appears before server responds)", async () => {
        mockCreateSolar.mockReturnValue(new Promise(() => { }));

        const { result } = renderHook(
            () => useEnergy(INITIAL_SOLAR, INITIAL_METERS, INITIAL_GENERATORS),
            { wrapper: createWrapper() },
        );

        act(() => {
            result.current.createSolarPanel({
                name: "ألواح جديدة", capacity_kw: 3, panel_count: 8,
                daily_production_kwh: 14, efficiency_percent: 78,
                installation_date: "2025-03-01", inverter_type: "Growatt",
                status: "active", total_cost: 4000,
            });
        });

        await waitFor(() => {
            expect(result.current.solarPanels.length).toBe(2);
        });
    });

    it("shows success toast after solar panel creation", async () => {
        mockCreateSolar.mockResolvedValue({ ok: true, data: { ...INITIAL_SOLAR[0], id: "new" } });

        const { result } = renderHook(
            () => useEnergy(INITIAL_SOLAR, INITIAL_METERS, INITIAL_GENERATORS),
            { wrapper: createWrapper() },
        );

        act(() => {
            result.current.createSolarPanel({
                name: "x", capacity_kw: 1, panel_count: 4,
                daily_production_kwh: 5, efficiency_percent: 80,
                installation_date: "", inverter_type: "–",
                status: "active", total_cost: 0,
            });
        });

        await waitFor(() => {
            expect(mockAddToast).toHaveBeenCalledWith("success", expect.stringContaining("تم إضافة"));
        });
    });

    it("shows error toast and rolls back on solar panel creation failure", async () => {
        mockCreateSolar.mockResolvedValue({ ok: false, error: { code: "UNKNOWN", message: "خطأ" } });

        const { result } = renderHook(
            () => useEnergy(INITIAL_SOLAR, INITIAL_METERS, INITIAL_GENERATORS),
            { wrapper: createWrapper() },
        );

        act(() => {
            result.current.createSolarPanel({
                name: "fail", capacity_kw: 1, panel_count: 4,
                daily_production_kwh: 5, efficiency_percent: 80,
                installation_date: "", inverter_type: "–",
                status: "active", total_cost: 0,
            });
        });

        await waitFor(() => {
            expect(mockAddToast).toHaveBeenCalledWith("error", expect.stringContaining("فشل"));
        });

        await waitFor(() => {
            expect(result.current.solarPanels).toHaveLength(1);
        });
    });

    it("creates electricity meter optimistically", async () => {
        mockCreateMeter.mockReturnValue(new Promise(() => { }));

        const { result } = renderHook(
            () => useEnergy(INITIAL_SOLAR, INITIAL_METERS, INITIAL_GENERATORS),
            { wrapper: createWrapper() },
        );

        act(() => {
            result.current.createMeter({
                name: "عداد جديد", meter_number: "TN-999",
                provider: "الستاغ", monthly_consumption_kwh: 100,
                monthly_cost: 30, currency: "TND",
                tariff_type: "residential", status: "active",
            });
        });

        await waitFor(() => {
            expect(result.current.meters.length).toBe(2);
        });
    });
});
