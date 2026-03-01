import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useWater } from "@/hooks/useWater";
import type { Well, WaterTank, IrrigationNetwork } from "@/lib/types";

/* ---- Mocks ---- */
const mockAddToast = vi.fn();

vi.mock("@/components/Toast", () => ({
    useToast: () => ({ addToast: mockAddToast, toasts: [], removeToast: vi.fn() }),
}));

const mockGetWells = vi.fn();
const mockGetTanks = vi.fn();
const mockGetIrrigation = vi.fn();
const mockCreateWell = vi.fn();
const mockCreateTank = vi.fn();
const mockCreateIrrigation = vi.fn();

vi.mock("@/lib/actions/water", () => ({
    getWells: (...args: unknown[]) => mockGetWells(...args),
    getTanks: (...args: unknown[]) => mockGetTanks(...args),
    getIrrigation: (...args: unknown[]) => mockGetIrrigation(...args),
    createWell: (...args: unknown[]) => mockCreateWell(...args),
    createTank: (...args: unknown[]) => mockCreateTank(...args),
    createIrrigation: (...args: unknown[]) => mockCreateIrrigation(...args),
}));

/* ---- Helpers ---- */
const INITIAL_WELLS: Well[] = [
    {
        id: "00000000-0000-4000-8000-00000000e001", farm_id: "f1",
        name: "البئر الرئيسي", depth_meters: 120, water_level_meters: 40,
        water_quality: "fresh", status: "active", total_cost: 35000,
        created_at: "2025-01-01T10:00:00Z",
    },
];

const INITIAL_TANKS: WaterTank[] = [
    {
        id: "00000000-0000-4000-8000-00000000e101", farm_id: "f1",
        name: "خزان رئيسي", type: "ground", capacity_liters: 10000,
        current_level_percent: 75, source: "البئر", status: "active",
        created_at: "2025-01-01T10:00:00Z",
    },
];

const INITIAL_IRRIGATION: IrrigationNetwork[] = [
    {
        id: "00000000-0000-4000-8000-00000000e201", farm_id: "f1",
        name: "شبكة الزيتون", type: "drip", coverage_hectares: 3.5,
        source_name: "البئر", status: "active",
        created_at: "2025-01-01T10:00:00Z",
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

describe("useWater hook behavior", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockGetWells.mockResolvedValue({ ok: true, data: INITIAL_WELLS });
        mockGetTanks.mockResolvedValue({ ok: true, data: INITIAL_TANKS });
        mockGetIrrigation.mockResolvedValue({ ok: true, data: INITIAL_IRRIGATION });
    });

    it("returns initial wells, tanks, and irrigation data", () => {
        const { result } = renderHook(
            () => useWater(INITIAL_WELLS, INITIAL_TANKS, INITIAL_IRRIGATION),
            { wrapper: createWrapper() },
        );

        expect(result.current.wells).toHaveLength(1);
        expect(result.current.tanks).toHaveLength(1);
        expect(result.current.irrigation).toHaveLength(1);
        expect(result.current.wells[0].name).toBe("البئر الرئيسي");
    });

    it("creates well optimistically (appears before server responds)", async () => {
        mockCreateWell.mockReturnValue(new Promise(() => { }));

        const { result } = renderHook(
            () => useWater(INITIAL_WELLS, INITIAL_TANKS, INITIAL_IRRIGATION),
            { wrapper: createWrapper() },
        );

        act(() => {
            result.current.createWell({
                name: "بئر جديد", depth_meters: 80, water_quality: "fresh",
                status: "drilling",
            });
        });

        await waitFor(() => {
            expect(result.current.wells.length).toBe(2);
        });

        const newWell = result.current.wells.find(w => w.name === "بئر جديد");
        expect(newWell).toBeDefined();
    });

    it("shows success toast after well creation", async () => {
        mockCreateWell.mockResolvedValue({ ok: true, data: { ...INITIAL_WELLS[0], id: "new-id" } });

        const { result } = renderHook(
            () => useWater(INITIAL_WELLS, INITIAL_TANKS, INITIAL_IRRIGATION),
            { wrapper: createWrapper() },
        );

        act(() => {
            result.current.createWell({
                name: "x", depth_meters: 10, water_quality: "fresh", status: "drilling",
            });
        });

        await waitFor(() => {
            expect(mockAddToast).toHaveBeenCalledWith("success", expect.stringContaining("تم إضافة"));
        });
    });

    it("shows error toast and rolls back on well creation failure", async () => {
        mockCreateWell.mockResolvedValue({ ok: false, error: { code: "UNKNOWN", message: "خطأ" } });

        const { result } = renderHook(
            () => useWater(INITIAL_WELLS, INITIAL_TANKS, INITIAL_IRRIGATION),
            { wrapper: createWrapper() },
        );

        act(() => {
            result.current.createWell({
                name: "fail", depth_meters: 10, water_quality: "fresh", status: "drilling",
            });
        });

        await waitFor(() => {
            expect(mockAddToast).toHaveBeenCalledWith("error", expect.stringContaining("فشل"));
        });

        await waitFor(() => {
            expect(result.current.wells).toHaveLength(1);
        });
    });

    it("creates tank optimistically", async () => {
        mockCreateTank.mockReturnValue(new Promise(() => { }));

        const { result } = renderHook(
            () => useWater(INITIAL_WELLS, INITIAL_TANKS, INITIAL_IRRIGATION),
            { wrapper: createWrapper() },
        );

        act(() => {
            result.current.createTank({
                name: "خزان جديد", type: "elevated", capacity_liters: 5000,
                current_level_percent: 0, source: "البئر", status: "active",
            });
        });

        await waitFor(() => {
            expect(result.current.tanks.length).toBe(2);
        });
    });
});
