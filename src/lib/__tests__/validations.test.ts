import { describe, it, expect } from "vitest";
import {
    createExpenseSchema,
    updateExpenseSchema,
    createCropSchema,
    updateCropSchema,
    createTaskSchema,
    updateTaskSchema,
    createWellSchema,
    createTankSchema,
    createIrrigationSchema,
    createAnimalSchema,
    createInventoryItemSchema,
} from "@/lib/validations";

/* ===================================================
 * Expense validation
 * =================================================== */
describe("createExpenseSchema", () => {
    it("accepts valid expense", () => {
        const result = createExpenseSchema.safeParse({
            category_id: "00000000-0000-4000-8000-00000000a001",
            amount: 1500,
            description: "Ø´Ø±Ø§Ø¡ Ø¨Ø°ÙˆØ±",
            date: "2025-02-10",
        });
        expect(result.success).toBe(true);
    });

    it("rejects non-UUID category_id", () => {
        const result = createExpenseSchema.safeParse({
            category_id: "cat-1",
            amount: 100,
            description: "test",
            date: "2025-01-01",
        });
        expect(result.success).toBe(false);
    });

    it("rejects zero amount", () => {
        const result = createExpenseSchema.safeParse({
            category_id: "00000000-0000-4000-8000-00000000a001",
            amount: 0,
            description: "test",
            date: "2025-01-01",
        });
        expect(result.success).toBe(false);
    });

    it("rejects negative amount", () => {
        const result = createExpenseSchema.safeParse({
            category_id: "00000000-0000-4000-8000-00000000a001",
            amount: -50,
            description: "test",
            date: "2025-01-01",
        });
        expect(result.success).toBe(false);
    });

    it("rejects short description", () => {
        const result = createExpenseSchema.safeParse({
            category_id: "00000000-0000-4000-8000-00000000a001",
            amount: 100,
            description: "a",
            date: "2025-01-01",
        });
        expect(result.success).toBe(false);
    });

    it("rejects invalid date format", () => {
        const result = createExpenseSchema.safeParse({
            category_id: "00000000-0000-4000-8000-00000000a001",
            amount: 100,
            description: "test input",
            date: "not-a-date",
        });
        expect(result.success).toBe(false);
    });
});

describe("updateExpenseSchema", () => {
    it("accepts partial updates with valid UUID id", () => {
        const result = updateExpenseSchema.safeParse({
            id: "00000000-0000-4000-8000-0000000b0001",
            amount: 2000,
        });
        expect(result.success).toBe(true);
    });

    it("rejects non-UUID id", () => {
        const result = updateExpenseSchema.safeParse({
            id: "exp-1",
            amount: 2000,
        });
        expect(result.success).toBe(false);
    });
});

/* ===================================================
 * Crop validation
 * =================================================== */
describe("createCropSchema", () => {
    it("accepts valid crop", () => {
        const result = createCropSchema.safeParse({
            crop_type: "Ø²ÙŠØªÙˆÙ†",
            status: "planted",
            area_hectares: 3.5,
        });
        expect(result.success).toBe(true);
    });

    it("rejects missing crop_type", () => {
        const result = createCropSchema.safeParse({ status: "planted" });
        expect(result.success).toBe(false);
    });

    it("rejects negative area", () => {
        const result = createCropSchema.safeParse({
            crop_type: "Ù‚Ù…Ø­",
            area_hectares: -1,
        });
        expect(result.success).toBe(false);
    });

    it("rejects invalid status enum", () => {
        const result = createCropSchema.safeParse({
            crop_type: "Ù‚Ù…Ø­",
            status: "invalid_status",
        });
        expect(result.success).toBe(false);
    });
});

describe("updateCropSchema", () => {
    it("rejects non-UUID id", () => {
        const result = updateCropSchema.safeParse({
            id: "crop-1",
            crop_type: "updated",
        });
        expect(result.success).toBe(false);
    });

    it("accepts valid UUID id", () => {
        const result = updateCropSchema.safeParse({
            id: "00000000-0000-4000-8000-00000000c001",
            crop_type: "updated",
        });
        expect(result.success).toBe(true);
    });
});

/* ===================================================
 * Task validation
 * =================================================== */
describe("createTaskSchema", () => {
    it("accepts valid task", () => {
        const result = createTaskSchema.safeParse({
            title: "ØªÙ‚Ù„ÙŠÙ… Ø§Ù„Ø£Ø´Ø¬Ø§Ø±",
            priority: "high",
        });
        expect(result.success).toBe(true);
    });

    it("rejects short title", () => {
        const result = createTaskSchema.safeParse({ title: "x" });
        expect(result.success).toBe(false);
    });

    it("rejects invalid priority", () => {
        const result = createTaskSchema.safeParse({
            title: "Valid title",
            priority: "critical",
        });
        expect(result.success).toBe(false);
    });
});

describe("updateTaskSchema", () => {
    it("rejects non-UUID id", () => {
        const result = updateTaskSchema.safeParse({ id: "task-1" });
        expect(result.success).toBe(false);
    });
});

/* ===================================================
 * Water validation
 * =================================================== */
describe("createWellSchema", () => {
    it("accepts valid well", () => {
        const result = createWellSchema.safeParse({
            name: "Ø¨Ø¦Ø± Ø§Ù„Ø´Ù…Ø§Ù„",
            depth_meters: 120,
            water_quality: "fresh",
        });
        expect(result.success).toBe(true);
    });

    it("rejects zero depth", () => {
        const result = createWellSchema.safeParse({
            name: "test well",
            depth_meters: 0,
        });
        expect(result.success).toBe(false);
    });

    it("validates latitude range", () => {
        const result = createWellSchema.safeParse({
            name: "test well",
            depth_meters: 100,
            latitude: 200,
        });
        expect(result.success).toBe(false);
    });
});

describe("createTankSchema", () => {
    it("accepts valid tank", () => {
        const result = createTankSchema.safeParse({
            name: "Ø®Ø²Ø§Ù† Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠ",
            type: "ground",
            capacity_liters: 5000,
            current_level_percent: 75,
            source: "Ø¨Ø¦Ø± 1",
        });
        expect(result.success).toBe(true);
    });

    it("rejects capacity 0", () => {
        const result = createTankSchema.safeParse({
            name: "test",
            type: "ground",
            capacity_liters: 0,
            current_level_percent: 50,
            source: "test",
        });
        expect(result.success).toBe(false);
    });

    it("rejects level > 100%", () => {
        const result = createTankSchema.safeParse({
            name: "test",
            type: "ground",
            capacity_liters: 5000,
            current_level_percent: 150,
            source: "test",
        });
        expect(result.success).toBe(false);
    });
});

describe("createIrrigationSchema", () => {
    it("accepts valid irrigation", () => {
        const result = createIrrigationSchema.safeParse({
            name: "Ø´Ø¨ÙƒØ© Ø§Ù„ØªÙ†Ù‚ÙŠØ·",
            type: "drip",
            coverage_hectares: 2.5,
            source_name: "Ø¨Ø¦Ø± 1",
        });
        expect(result.success).toBe(true);
    });

    it("rejects invalid type", () => {
        const result = createIrrigationSchema.safeParse({
            name: "test",
            type: "hose",
            coverage_hectares: 1,
            source_name: "test",
        });
        expect(result.success).toBe(false);
    });
});

/* ===================================================
 * Livestock validation
 * =================================================== */
describe("createAnimalSchema", () => {
    it("accepts valid animal", () => {
        const result = createAnimalSchema.safeParse({
            name: "Ù†Ø¹Ø¬Ø© 1",
            type: "sheep",
            breed: "Ø¨Ø±Ø¨Ø±ÙŠØ©",
            gender: "female",
            tag_number: "S001",
            acquisition_date: "2024-01-01",
            acquisition_type: "purchased",
        });
        expect(result.success).toBe(true);
    });

    it("rejects invalid animal type", () => {
        const result = createAnimalSchema.safeParse({
            name: "test",
            type: "horse",
            breed: "test",
            gender: "male",
            tag_number: "T1",
            acquisition_date: "2024-01-01",
            acquisition_type: "purchased",
        });
        expect(result.success).toBe(false);
    });
});

/* ===================================================
 * Inventory validation
 * =================================================== */
describe("createInventoryItemSchema", () => {
    it("accepts valid item", () => {
        const result = createInventoryItemSchema.safeParse({
            name: "Ù…Ø­Ø±Ø§Ø« ÙŠØ¯ÙˆÙŠ",
            category: "tools",
            quantity: 2,
            unit: "Ù‚Ø·Ø¹Ø©",
            min_stock: 1,
            location: "Ø§Ù„Ù…Ø®Ø²Ù†",
            purchase_date: "2024-06-01",
            purchase_price: 500,
        });
        expect(result.success).toBe(true);
    });

    it("rejects invalid category", () => {
        const result = createInventoryItemSchema.safeParse({
            name: "test",
            category: "furniture",
            quantity: 1,
            unit: "unit",
            min_stock: 0,
            location: "test",
            purchase_date: "2024-01-01",
            purchase_price: 100,
        });
        expect(result.success).toBe(false);
    });
});

/* ===================================================
 * UUID parity â€” mock IDs must pass validators
 * =================================================== */
describe("UUID parity â€” mock IDs must pass update validators", () => {
    const mockCropIds = [
        "00000000-0000-4000-8000-00000000c001",
        "00000000-0000-4000-8000-00000000c002",
        "00000000-0000-4000-8000-00000000c007",
    ];
    const mockTaskIds = [
        "00000000-0000-4000-8000-00000000d001",
        "00000000-0000-4000-8000-00000000d008",
    ];
    const mockExpenseIds = [
        "00000000-0000-4000-8000-0000000b0001",
        "00000000-0000-4000-8000-0000000b0010",
    ];

    it("mock crop IDs pass updateCropSchema UUID check", () => {
        for (const id of mockCropIds) {
            const result = updateCropSchema.safeParse({ id });
            expect(result.success).toBe(true);
        }
    });

    it("mock task IDs pass updateTaskSchema UUID check", () => {
        for (const id of mockTaskIds) {
            const result = updateTaskSchema.safeParse({ id });
            expect(result.success).toBe(true);
        }
    });

    it("mock expense IDs pass updateExpenseSchema UUID check", () => {
        for (const id of mockExpenseIds) {
            const result = updateExpenseSchema.safeParse({ id });
            expect(result.success).toBe(true);
        }
    });

    it("old string IDs would FAIL validators (regression proof)", () => {
        expect(updateCropSchema.safeParse({ id: "crop-1" }).success).toBe(false);
        expect(updateTaskSchema.safeParse({ id: "task-1" }).success).toBe(false);
        expect(updateExpenseSchema.safeParse({ id: "exp-1" }).success).toBe(false);
    });
});
