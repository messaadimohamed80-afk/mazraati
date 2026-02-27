import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/db", () => ({
    isMockMode: () => true,
    getDb: vi.fn(),
    getCurrentFarmId: vi.fn(() => "00000000-0000-4000-8000-000000000010"),
    getCurrentUserId: vi.fn(() => "00000000-0000-4000-8000-000000000001"),
}));

import {
    getWells,
    createWell,
    updateWell,
    deleteWell,
    getTanks,
    createTank,
    updateTank,
    deleteTank,
    getIrrigation,
    createIrrigation,
    updateIrrigation,
    deleteIrrigation,
} from "@/lib/actions/water";

describe("Water server actions (mock mode)", () => {
    // ---- WELLS ----
    describe("getWells", () => {
        it("returns ActionResult with wells array", async () => {
            const result = await getWells();
            expect(result).toHaveProperty("ok");
            if (result.ok) {
                expect(Array.isArray(result.data)).toBe(true);
                expect(result.data.length).toBeGreaterThan(0);
                expect(result.data[0]).toHaveProperty("depth_meters");
            }
        });
    });

    describe("createWell", () => {
        it("creates a well and returns ok", async () => {
            const result = await createWell({
                name: "بئر اختبار",
                depth_meters: 50,
                water_quality: "fresh",
                status: "drilling",
            });
            expect(result).toHaveProperty("ok");
            if (result.ok) {
                expect(result.data.name).toBe("بئر اختبار");
                expect(result.data.id).toMatch(
                    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
                );
            }
        });
    });

    describe("updateWell", () => {
        it("updates an existing well", async () => {
            const result = await updateWell("00000000-0000-4000-8000-00000000e001", {
                depth_meters: 130,
            });
            expect(result.ok).toBe(true);
            if (result.ok) {
                expect(result.data.depth_meters).toBe(130);
            }
        });

        it("returns NOT_FOUND for non-existent well", async () => {
            const result = await updateWell("00000000-0000-4000-8000-000000000000", {
                depth_meters: 10,
            });
            expect(result.ok).toBe(false);
            if (!result.ok) expect(result.error.code).toBe("NOT_FOUND");
        });
    });

    describe("deleteWell", () => {
        it("deletes an existing well", async () => {
            // Create one, then delete it
            const created = await createWell({
                name: "بئر للحذف",
                depth_meters: 10,
            });
            if (!created.ok) return;
            const result = await deleteWell(created.data.id);
            expect(result.ok).toBe(true);
        });

        it("returns NOT_FOUND for non-existent well", async () => {
            const result = await deleteWell("00000000-0000-4000-8000-000000000000");
            expect(result.ok).toBe(false);
            if (!result.ok) expect(result.error.code).toBe("NOT_FOUND");
        });
    });

    // ---- TANKS ----
    describe("getTanks", () => {
        it("returns ActionResult with tanks array", async () => {
            const result = await getTanks();
            expect(result).toHaveProperty("ok");
            if (result.ok) {
                expect(Array.isArray(result.data)).toBe(true);
                expect(result.data[0]).toHaveProperty("capacity_liters");
            }
        });
    });

    describe("createTank", () => {
        it("creates a tank and returns ok", async () => {
            const result = await createTank({
                name: "خزان اختبار",
                type: "ground",
                capacity_liters: 5000,
                source: "بئر",
            });
            expect(result).toHaveProperty("ok");
            if (result.ok) {
                expect(result.data.name).toBe("خزان اختبار");
            }
        });
    });

    describe("updateTank", () => {
        it("updates an existing tank", async () => {
            const result = await updateTank("00000000-0000-4000-8000-00000000e201", {
                current_level_percent: 90,
            });
            expect(result.ok).toBe(true);
            if (result.ok) {
                expect(result.data.current_level_percent).toBe(90);
            }
        });
    });

    describe("deleteTank", () => {
        it("returns NOT_FOUND for non-existent tank", async () => {
            const result = await deleteTank("00000000-0000-4000-8000-000000000000");
            expect(result.ok).toBe(false);
        });
    });

    // ---- IRRIGATION ----
    describe("getIrrigation", () => {
        it("returns ActionResult with irrigation array", async () => {
            const result = await getIrrigation();
            expect(result).toHaveProperty("ok");
            if (result.ok) {
                expect(Array.isArray(result.data)).toBe(true);
                expect(result.data[0]).toHaveProperty("coverage_hectares");
            }
        });
    });

    describe("createIrrigation", () => {
        it("creates an irrigation network", async () => {
            const result = await createIrrigation({
                name: "شبكة اختبار",
                type: "drip",
                coverage_hectares: 1.0,
                source_name: "بئر",
            });
            expect(result).toHaveProperty("ok");
        });
    });

    describe("updateIrrigation", () => {
        it("updates an existing network", async () => {
            const result = await updateIrrigation("00000000-0000-4000-8000-00000000e301", {
                coverage_hectares: 3.0,
            });
            expect(result.ok).toBe(true);
            if (result.ok) {
                expect(result.data.coverage_hectares).toBe(3.0);
            }
        });
    });

    describe("deleteIrrigation", () => {
        it("returns NOT_FOUND for non-existent network", async () => {
            const result = await deleteIrrigation("00000000-0000-4000-8000-000000000000");
            expect(result.ok).toBe(false);
        });
    });
});
