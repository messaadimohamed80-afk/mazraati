"use server";

import { isMockMode, getDb, getCurrentFarmId } from "@/lib/db";
import type { InventoryItem } from "@/lib/types";

// ============================================================
// READ
// ============================================================

export async function getInventory(): Promise<InventoryItem[]> {
    if (isMockMode()) {
        const { MOCK_INVENTORY } = await import("@/lib/mock/mock-inventory-data");
        return MOCK_INVENTORY;
    }

    const supabase = await getDb();
    const farmId = await getCurrentFarmId();
    if (!farmId) return [];

    const { data, error } = await supabase
        .from("inventory_items")
        .select("*")
        .eq("farm_id", farmId)
        .order("name")
        .limit(100);

    if (error) throw new Error(`Failed to fetch inventory: ${error.message}`);
    return data as InventoryItem[];
}

// ============================================================
// CREATE
// ============================================================

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
}): Promise<InventoryItem> {
    const parsed = createInventoryItemSchema.parse(item);
    if (isMockMode()) {
        const { MOCK_INVENTORY } = await import("@/lib/mock/mock-inventory-data");
        const newItem: InventoryItem = {
            id: `inv-${Date.now()}`,
            farm_id: "00000000-0000-0000-0000-000000000010",
            created_at: new Date().toISOString(),
            name: item.name,
            quantity: item.quantity,
            unit: item.unit,
            min_stock: item.min_stock,
            location: item.location,
            purchase_date: item.purchase_date,
            purchase_price: item.purchase_price,
            notes: item.notes,
            category: item.category as InventoryItem["category"],
            condition: (item.condition as InventoryItem["condition"]) || "new",
        };
        MOCK_INVENTORY.push(newItem);
        return newItem;
    }

    const supabase = await getDb();
    const farmId = await getCurrentFarmId();
    if (!farmId) throw new Error("Not authenticated");

    const { data, error } = await supabase
        .from("inventory_items")
        .insert({ farm_id: farmId, ...parsed })
        .select()
        .single();

    if (error) throw new Error(`Failed to create inventory item: ${error.message}`);
    return data as InventoryItem;
}

// ============================================================
// UPDATE
// ============================================================

export async function updateInventoryItem(
    id: string,
    updates: Partial<InventoryItem>
): Promise<InventoryItem> {
    updateInventoryItemSchema.parse({ id, ...updates });
    if (isMockMode()) {
        const { MOCK_INVENTORY } = await import("@/lib/mock/mock-inventory-data");
        const idx = MOCK_INVENTORY.findIndex((i) => i.id === id);
        if (idx === -1) throw new Error("Item not found");
        Object.assign(MOCK_INVENTORY[idx], updates);
        return MOCK_INVENTORY[idx];
    }

    const supabase = await getDb();
    const { data, error } = await supabase
        .from("inventory_items")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

    if (error) throw new Error(`Failed to update inventory item: ${error.message}`);
    return data as InventoryItem;
}

// ============================================================
// DELETE
// ============================================================

export async function deleteInventoryItem(id: string): Promise<void> {
    if (isMockMode()) {
        const { MOCK_INVENTORY } = await import("@/lib/mock/mock-inventory-data");
        const idx = MOCK_INVENTORY.findIndex((i) => i.id === id);
        if (idx !== -1) MOCK_INVENTORY.splice(idx, 1);
        return;
    }

    const supabase = await getDb();
    const { error } = await supabase.from("inventory_items").delete().eq("id", id);
    if (error) throw new Error(`Failed to delete inventory item: ${error.message}`);
}
