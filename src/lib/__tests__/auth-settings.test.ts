import { describe, it, expect, vi } from "vitest";

// Mock the DB layer
vi.mock("@/lib/db", () => ({
    isMockMode: () => true,
    getDb: vi.fn(),
    getCurrentFarmId: vi.fn(() => "00000000-0000-4000-8000-000000000010"),
    getCurrentUserId: vi.fn(() => "00000000-0000-4000-8000-000000000001"),
}));

vi.mock("@/lib/supabase/server", () => ({
    createServerSupabaseClient: vi.fn(),
    createServiceRoleClient: vi.fn(),
}));

vi.mock("@/lib/actions/seed", () => ({
    seedDemoData: vi.fn(),
}));

import { registerUser } from "@/lib/actions/auth";
import { getFarmSettings, updateFarmSettings } from "@/lib/actions/settings";

describe("registerUser", () => {
    it("returns ok with needsConfirmation=false in mock mode", async () => {
        const result = await registerUser({
            email: "test@test.com",
            password: "pass123",
            fullName: "Test User",
            farmName: "Test Farm",
            currency: "TND",
        });

        expect(result.ok).toBe(true);
        if (result.ok) {
            expect(result.data.needsConfirmation).toBe(false);
        }
    });

    it("returns ActionResult shape (not legacy { success })", async () => {
        const result = await registerUser({
            email: "test@test.com",
            password: "pass123",
            fullName: "Test User",
            farmName: "Test Farm",
            currency: "TND",
        });

        // Must have ActionResult shape
        expect(result).toHaveProperty("ok");
        expect(result).not.toHaveProperty("success"); // Old shape removed
    });
});

describe("getFarmSettings", () => {
    it("returns ActionResult<FarmSettings> in mock mode", async () => {
        const result = await getFarmSettings();

        expect(result.ok).toBe(true);
        if (result.ok) {
            expect(result.data).toHaveProperty("farmName");
            expect(result.data).toHaveProperty("ownerName");
            expect(result.data).toHaveProperty("currency");
            expect(result.data).toHaveProperty("budget");
            expect(typeof result.data.budget).toBe("number");
        }
    });
});

describe("updateFarmSettings", () => {
    it("returns ok(undefined) in mock mode", async () => {
        const result = await updateFarmSettings({
            farmName: "Test",
            ownerName: "Owner",
            phone: "+1234",
            email: "test@test.com",
            location: "Test",
            currency: "TND",
        });

        expect(result.ok).toBe(true);
        if (result.ok) {
            expect(result.data).toBeUndefined();
        }
    });

    it("returns ActionResult shape (not legacy { success })", async () => {
        const result = await updateFarmSettings({
            farmName: "Test",
            ownerName: "Owner",
            phone: "+1234",
            email: "test@test.com",
            location: "Test",
            currency: "TND",
        });

        expect(result).toHaveProperty("ok");
        expect(result).not.toHaveProperty("success");
    });
});
