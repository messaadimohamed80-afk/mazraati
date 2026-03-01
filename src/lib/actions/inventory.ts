"use server";

import { isMockMode, getDb, getCurrentFarmId } from "@/lib/db";
import type { InventoryItem } from "@/lib/types";
import { ActionResult, ok, err } from "@/lib/action-result";
import { inventoryItemRowSchema } from "@/lib/validations";

// ============================================================
// READ
// ============================================================

export async function getInventory(): Promise<ActionResult<InventoryItem[]>> {
    try {
        if (isMockMode()) {
            const { MOCK_INVENTORY } = await import("@/lib/mock/mock-inventory-data");
            return ok(z.array(inventoryItemRowSchema).parse(MOCK_INVENTORY));
        }

        const supabase = await getDb();
        const farmId = await getCurrentFarmId();
        if (!farmId) return ok([]);

        const { data, error } = await supabase
            .from("inventory_items")
            .select("*")
            .eq("farm_id", farmId)
            .order("name")
            .limit(100);

        if (error) return err(`Failed to fetch inventory: ${error.message}`, "DB_ERROR");
        return ok(z.array(inventoryItemRowSchema).parse(data));
    } catch (e: unknown) {
        return err(e instanceof Error ? e.message : String(e), "UNKNOWN");
    }
}

// ============================================================
// CREATE
// ============================================================

import { z } from "zod";
import { createInventoryItemSchema, updateInventoryItemSchema } from "@/lib/validations";

export async function createInventoryItem(item: {
    name: string;
    category: string;
    quantity: number;
    unit: string;
    min_stock: number;
    location: string;
    purchase_date: string;
    purchase_price: number;
    condition?: string;
    notes?: string;
}): Promise<ActionResult<InventoryItem>> {
    try {
        const parsed = createInventoryItemSchema.parse(item);
        if (isMockMode()) {
            const { MOCK_INVENTORY } = await import("@/lib/mock/mock-inventory-data");
            const newItem: InventoryItem = {
                id: crypto.randomUUID(),
                farm_id: "00000000-0000-4000-8000-000000000010",
                created_at: new Date().toISOString(),
                name: item.name,
                quantity: item.quantity,
                unit: item.unit,
                min_stock: item.min_stock,
                location: item.location,
                purchase_date: item.purchase_date,
                purchase_price: item.purchase_price,
                notes: item.notes,
                category: parsed.category as InventoryItem["category"],
                condition: (parsed.condition as InventoryItem["condition"]) || "new",
            };
            MOCK_INVENTORY.push(newItem);
            return ok(inventoryItemRowSchema.parse(newItem));
        }

        const supabase = await getDb();
        const farmId = await getCurrentFarmId();
        if (!farmId) return err("Not authenticated", "NOT_AUTHENTICATED");

        const { data, error } = await supabase
            .from("inventory_items")
            .insert({ farm_id: farmId, ...parsed })
            .select()
            .single();

        if (error) return err(`Failed to create inventory item: ${error.message}`, "DB_ERROR");
        return ok(inventoryItemRowSchema.parse(data));
    } catch (e: unknown) {
        return err(e instanceof Error ? e.message : String(e), (e instanceof Error && e.name === "ZodError") ? "VALIDATION_ERROR" : "UNKNOWN");
    }
}

// ============================================================
// UPDATE
// ============================================================

export async function updateInventoryItem(
    id: string,
    updates: Partial<InventoryItem>
): Promise<ActionResult<InventoryItem>> {
    try {
        updateInventoryItemSchema.parse({ id, ...updates });
        if (isMockMode()) {
            const { MOCK_INVENTORY } = await import("@/lib/mock/mock-inventory-data");
            const idx = MOCK_INVENTORY.findIndex((i) => i.id === id);
            if (idx === -1) return err("Item not found", "NOT_FOUND");
            Object.assign(MOCK_INVENTORY[idx], updates);
            return ok(inventoryItemRowSchema.parse(MOCK_INVENTORY[idx]));
        }

        const supabase = await getDb();
        const { data, error } = await supabase
            .from("inventory_items")
            .update(updates)
            .eq("id", id)
            .select()
            .single();

        if (error) return err(`Failed to update inventory item: ${error.message}`, "DB_ERROR");
        return ok(inventoryItemRowSchema.parse(data));
    } catch (e: unknown) {
        return err(e instanceof Error ? e.message : String(e), (e instanceof Error && e.name === "ZodError") ? "VALIDATION_ERROR" : "UNKNOWN");
    }
}

// ============================================================
// DELETE
// ============================================================

export async function deleteInventoryItem(id: string): Promise<ActionResult<void>> {
    try {
        if (isMockMode()) {
            const { MOCK_INVENTORY } = await import("@/lib/mock/mock-inventory-data");
            const idx = MOCK_INVENTORY.findIndex((i) => i.id === id);
            if (idx !== -1) MOCK_INVENTORY.splice(idx, 1);
            return ok(undefined);
        }

        const supabase = await getDb();
        const { error } = await supabase.from("inventory_items").delete().eq("id", id);
        if (error) return err(`Failed to delete inventory item: ${error.message}`, "DB_ERROR");
        return ok(undefined);
    } catch (e: unknown) {
        return err(e instanceof Error ? e.message : String(e), "UNKNOWN");
    }
}
