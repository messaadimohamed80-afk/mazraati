import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/db", () => ({
    isMockMode: () => true,
    getDb: vi.fn(),
    getCurrentFarmId: vi.fn(() => "00000000-0000-4000-8000-000000000010"),
    getCurrentUserId: vi.fn(() => "00000000-0000-4000-8000-000000000001"),
}));

import {
    getSolarPanels,
    createSolarPanel,
    updateSolarPanel,
    deleteSolarPanel,
    getElectricityMeters,
    createElectricityMeter,
    updateElectricityMeter,
    deleteElectricityMeter,
    getGenerators,
    createGenerator,
    updateGenerator,
    deleteGenerator,
} from "@/lib/actions/energy";

describe("Energy server actions (mock mode)", () => {
    // ---- SOLAR PANELS ----
    describe("getSolarPanels", () => {
        it("returns ActionResult with panels array", async () => {
            const result = await getSolarPanels();
            expect(result).toHaveProperty("ok");
            if (result.ok) {
                expect(Array.isArray(result.data)).toBe(true);
                expect(result.data.length).toBeGreaterThan(0);
                expect(result.data[0]).toHaveProperty("capacity_kw");
            }
        });
    });

    describe("createSolarPanel", () => {
        it("creates a panel and returns ok", async () => {
            const result = await createSolarPanel({
                name: "لوح شمسي جديد",
                capacity_kw: 5,
                panel_count: 10,
                daily_production_kwh: 20,
                efficiency_percent: 85,
                installation_date: "2025-01-01",
                inverter_type: "Test",
                status: "active",
                total_cost: 15000,
            });
            expect(result).toHaveProperty("ok");
            if (result.ok) {
                expect(result.data.name).toBe("لوح شمسي جديد");
                expect(result.data.id).toMatch(
                    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
                );
            }
        });
    });

    describe("updateSolarPanel", () => {
        it("updates an existing panel", async () => {
            const result = await updateSolarPanel("00000000-0000-4000-8000-00000000f001", {
                capacity_kw: 6.0,
            });
            expect(result.ok).toBe(true);
            if (result.ok) {
                expect(result.data.capacity_kw).toBe(6.0);
            }
        });

        it("returns NOT_FOUND for non-existent panel", async () => {
            const result = await updateSolarPanel("00000000-0000-4000-8000-000000000000", {
                capacity_kw: 1,
            });
            expect(result.ok).toBe(false);
            if (!result.ok) expect(result.error.code).toBe("NOT_FOUND");
        });
    });

    describe("deleteSolarPanel", () => {
        it("deletes an existing panel", async () => {
            const created = await createSolarPanel({
                name: "للحذف",
                capacity_kw: 1,
                panel_count: 1,
            });
            if (!created.ok) return;
            const result = await deleteSolarPanel(created.data.id);
            expect(result.ok).toBe(true);
        });

        it("returns NOT_FOUND for non-existent panel", async () => {
            const result = await deleteSolarPanel("00000000-0000-4000-8000-000000000000");
            expect(result.ok).toBe(false);
        });
    });

    // ---- ELECTRICITY METERS ----
    describe("getElectricityMeters", () => {
        it("returns ActionResult with meters", async () => {
            const result = await getElectricityMeters();
            expect(result).toHaveProperty("ok");
            if (result.ok) {
                expect(Array.isArray(result.data)).toBe(true);
                expect(result.data[0]).toHaveProperty("meter_number");
            }
        });
    });

    describe("createElectricityMeter", () => {
        it("creates a meter", async () => {
            const result = await createElectricityMeter({
                name: "عداد جديد",
                meter_number: "M-999",
                provider: "الستاغ",
                monthly_consumption_kwh: 100,
                monthly_cost: 500,
                tariff_type: "agricultural",
                status: "active",
                total_cost: 2000,
            });
            expect(result).toHaveProperty("ok");
        });
    });

    describe("updateElectricityMeter", () => {
        it("updates an existing meter", async () => {
            const result = await updateElectricityMeter("00000000-0000-4000-8000-00000000f101", {
                monthly_consumption_kwh: 500,
            });
            expect(result.ok).toBe(true);
            if (result.ok) {
                expect(result.data.monthly_consumption_kwh).toBe(500);
            }
        });
    });

    describe("deleteElectricityMeter", () => {
        it("returns NOT_FOUND for non-existent meter", async () => {
            const result = await deleteElectricityMeter("00000000-0000-4000-8000-000000000000");
            expect(result.ok).toBe(false);
        });
    });

    // ---- GENERATORS ----
    describe("getGenerators", () => {
        it("returns ActionResult with generators", async () => {
            const result = await getGenerators();
            expect(result).toHaveProperty("ok");
            if (result.ok) {
                expect(Array.isArray(result.data)).toBe(true);
                expect(result.data[0]).toHaveProperty("capacity_kva");
            }
        });
    });

    describe("createGenerator", () => {
        it("creates a generator", async () => {
            const result = await createGenerator({
                name: "مولد جديد",
                capacity_kva: 50,
                fuel_type: "diesel",
                fuel_consumption_lph: 10,
                runtime_hours: 0,
                status: "standby",
                total_cost: 30000,
            });
            expect(result).toHaveProperty("ok");
        });
    });

    describe("updateGenerator", () => {
        it("updates an existing generator", async () => {
            const result = await updateGenerator("00000000-0000-4000-8000-00000000f201", {
                runtime_hours: 1300,
            });
            expect(result.ok).toBe(true);
            if (result.ok) {
                expect(result.data.runtime_hours).toBe(1300);
            }
        });
    });

    describe("deleteGenerator", () => {
        it("returns NOT_FOUND for non-existent generator", async () => {
            const result = await deleteGenerator("00000000-0000-4000-8000-000000000000");
            expect(result.ok).toBe(false);
        });
    });
});
