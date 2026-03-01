import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCrops } from "@/hooks/useCrops";
import type { Crop } from "@/lib/types";

const mockAddToast = vi.fn();

vi.mock("@/components/Toast", () => ({
    useToast: () => ({ addToast: mockAddToast, toasts: [], removeToast: vi.fn() }),
}));

const mockGetCrops = vi.fn();
const mockCreateCrop = vi.fn();
const mockUpdateCrop = vi.fn();

vi.mock("@/lib/actions/crops", () => ({
    getCrops: (...args: unknown[]) => mockGetCrops(...args),
    createCrop: (...args: unknown[]) => mockCreateCrop(...args),
    updateCrop: (...args: unknown[]) => mockUpdateCrop(...args),
}));

const INITIAL_CROPS: Crop[] = [
    {
        id: "c-1", farm_id: "f1", crop_type: "زيتون", status: "growing",
        area_hectares: 2, created_at: "2025-01-01T10:00:00Z",
    },
];

function createWrapper() {
    const qc = new QueryClient({
        defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    function Wrapper({ children }: { children: React.ReactNode }) {
        return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
    }
    return Wrapper;
}

describe("useCrops hook behavior", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockGetCrops.mockResolvedValue({ ok: true, data: INITIAL_CROPS });
    });

    it("returns initial data", () => {
        const { result } = renderHook(() => useCrops(INITIAL_CROPS), { wrapper: createWrapper() });
        expect(result.current.crops).toHaveLength(1);
        expect(result.current.crops[0].crop_type).toBe("زيتون");
    });

    it("creates crop optimistically", async () => {
        mockCreateCrop.mockReturnValue(new Promise(() => { }));

        const { result } = renderHook(() => useCrops(INITIAL_CROPS), { wrapper: createWrapper() });

        act(() => {
            result.current.createCrop({ crop_type: "قمح" });
        });

        await waitFor(() => {
            expect(result.current.crops).toHaveLength(2);
        });

        const optimistic = result.current.crops.find(c => c.crop_type === "قمح");
        expect(optimistic).toBeDefined();
        expect(optimistic!.id).toMatch(/^[0-9a-f]{8}-/);
    });

    it("shows success toast on create", async () => {
        mockCreateCrop.mockResolvedValue({ ok: true, data: { ...INITIAL_CROPS[0], id: "c-2", crop_type: "قمح" } });

        const { result } = renderHook(() => useCrops(INITIAL_CROPS), { wrapper: createWrapper() });

        act(() => {
            result.current.createCrop({ crop_type: "قمح" });
        });

        await waitFor(() => {
            expect(mockAddToast).toHaveBeenCalledWith("success", expect.stringContaining("تم إضافة"));
        });
    });

    it("shows error toast and rolls back on create failure", async () => {
        mockCreateCrop.mockResolvedValue({ ok: false, error: { code: "UNKNOWN", message: "خطأ" } });

        const { result } = renderHook(() => useCrops(INITIAL_CROPS), { wrapper: createWrapper() });

        act(() => {
            result.current.createCrop({ crop_type: "فاشل" });
        });

        await waitFor(() => {
            expect(mockAddToast).toHaveBeenCalledWith("error", expect.stringContaining("فشل"));
        });

        await waitFor(() => {
            expect(result.current.crops).toHaveLength(1);
        });
    });

    it("updates crop optimistically", async () => {
        mockUpdateCrop.mockReturnValue(new Promise(() => { }));

        const { result } = renderHook(() => useCrops(INITIAL_CROPS), { wrapper: createWrapper() });

        act(() => {
            result.current.updateCrop({ id: "c-1", updates: { status: "harvested" } });
        });

        await waitFor(() => {
            expect(result.current.crops[0].status).toBe("harvested");
        });
    });
});
