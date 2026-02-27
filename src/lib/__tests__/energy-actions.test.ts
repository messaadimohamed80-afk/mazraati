import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/db", () => ({
    isMockMode: () => true,
    getDb: vi.fn(),
    getCurrentFarmId: vi.fn(() => "00000000-0000-4000-8000-000000000010"),
    getCurrentUserId: vi.fn(() => "00000000-0000-4000-8000-000000000001"),
}));

import { createSolarPanel, createElectricityMeter, createGenerator } from "@/lib/actions/energy";
import { ok, err } from "@/lib/action-result";

describe("Energy server actions (mock mode)", () => {
    describe("ActionResult contract", () => {
        it("ok() helper returns correct shape", () => {
            const result = ok({ name: "test" });
            expect(result.ok).toBe(true);
            expect(result).toHaveProperty("data");
        });

        it("err() helper returns correct shape", () => {
            const result = err("fail", "DB_ERROR");
            expect(result.ok).toBe(false);
            expect(result).toHaveProperty("error");
            if (!result.ok) {
                expect(result.error.message).toBe("fail");
                expect(result.error.code).toBe("DB_ERROR");
            }
        });
    });

    describe("createSolarPanel", () => {
        it("returns ActionResult shape with ok or error", async () => {
            const result = await createSolarPanel({
                name: "لوح شمسي جديد",
                capacity_kw: 5,
                panel_count: 10,
                daily_production_kwh: 20,
                efficiency_percent: 85,
                installation_date: "2025-01-01",
                inverter_type: "string",
                status: "active",
                total_cost: 15000,
            });
            expect(result).toHaveProperty("ok");
            if (result.ok) {
                expect(result.data).toHaveProperty("name");
            } else {
                expect(result.error).toHaveProperty("message");
            }
        });
    });

    describe("createElectricityMeter", () => {
        it("returns ActionResult shape", async () => {
            const result = await createElectricityMeter({
                name: "عداد جديد",
                meter_number: "M-999",
                monthly_kwh: 100,
                monthly_cost: 500,
                tariff_type: "agricultural",
                status: "active",
                total_cost: 2000,
            });
            expect(result).toHaveProperty("ok");
        });
    });

    describe("createGenerator", () => {
        it("returns ActionResult shape", async () => {
            const result = await createGenerator({
                name: "مولد جديد",
                capacity_kw: 50,
                fuel_type: "diesel",
                fuel_consumption_lph: 10,
                hours_used: 0,
                status: "standby",
                total_cost: 30000,
            });
            expect(result).toHaveProperty("ok");
        });
    });
});
