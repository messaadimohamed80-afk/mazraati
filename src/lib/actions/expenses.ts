"use server";

import { isMockMode, getDb, getCurrentFarmId, getCurrentUserId } from "@/lib/db";
import type { Category, Expense } from "@/lib/types";

// ============================================================
// READ
// ============================================================

export async function getCategories(): Promise<Category[]> {
    if (isMockMode()) {
        const { MOCK_CATEGORIES } = await import("@/lib/mock/mock-data");
        return MOCK_CATEGORIES;
    }

    const supabase = await getDb();
    const farmId = await getCurrentFarmId();
    if (!farmId) return [];

    const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("farm_id", farmId)
        .order("name");

    if (error) throw new Error(`Failed to fetch categories: ${error.message}`);
    return data as Category[];
}

export async function getExpenses(): Promise<Expense[]> {
    if (isMockMode()) {
        const { MOCK_CATEGORIES, MOCK_EXPENSES } = await import("@/lib/mock/mock-data");
        return MOCK_EXPENSES.map((e) => ({
            ...e,
            category: MOCK_CATEGORIES.find((c) => c.id === e.category_id),
        }));
    }

    const supabase = await getDb();
    const farmId = await getCurrentFarmId();
    if (!farmId) return [];

    const { data, error } = await supabase
        .from("expenses")
        .select("*, category:categories(*)")
        .eq("farm_id", farmId)
        .order("date", { ascending: false })
        .limit(100);

    if (error) throw new Error(`Failed to fetch expenses: ${error.message}`);
    return data as Expense[];
}

// ============================================================
// CREATE
// ============================================================

import { createExpenseSchema, updateExpenseSchema } from "@/lib/validations";

export async function createExpense(expense: {
    category_id: string;
    amount: number;
    description: string;
    notes?: string;
    date: string;
}): Promise<Expense> {
    const parsed = createExpenseSchema.parse(expense);
    if (isMockMode()) {
        const { MOCK_CATEGORIES, MOCK_EXPENSES } = await import("@/lib/mock/mock-data");
        const newExpense: Expense = {
            id: crypto.randomUUID(),
            farm_id: "00000000-0000-0000-0000-000000000010",
            currency: "TND",
            created_by: "00000000-0000-0000-0000-000000000001",
            created_at: new Date().toISOString(),
            category: MOCK_CATEGORIES.find((c) => c.id === expense.category_id),
            ...expense,
        };
        MOCK_EXPENSES.unshift(newExpense);
        return newExpense;
    }

    const supabase = await getDb();
    const farmId = await getCurrentFarmId();
    const userId = await getCurrentUserId();
    if (!farmId || !userId) throw new Error("Not authenticated");

    const { data, error } = await supabase
        .from("expenses")
        .insert({
            farm_id: farmId,
            created_by: userId,
            ...parsed,
        })
        .select("*, category:categories(*)")
        .single();

    if (error) throw new Error(`Failed to create expense: ${error.message}`);
    return data as Expense;
}

export async function createCategory(category: {
    name: string;
    icon: string;
    color: string;
    budget_planned?: number;
}): Promise<Category> {
    if (isMockMode()) {
        const { MOCK_CATEGORIES } = await import("@/lib/mock/mock-data");
        const newCat: Category = {
            id: crypto.randomUUID(),
            farm_id: "00000000-0000-0000-0000-000000000010",
            created_at: new Date().toISOString(),
            ...category,
        };
        MOCK_CATEGORIES.push(newCat);
        return newCat;
    }

    const supabase = await getDb();
    const farmId = await getCurrentFarmId();
    if (!farmId) throw new Error("Not authenticated");

    const { data, error } = await supabase
        .from("categories")
        .insert({ farm_id: farmId, ...category })
        .select()
        .single();

    if (error) throw new Error(`Failed to create category: ${error.message}`);
    return data as Category;
}

// ============================================================
// UPDATE
// ============================================================

export async function updateExpense(
    id: string,
    updates: Partial<Pick<Expense, "amount" | "description" | "notes" | "date" | "category_id">>
): Promise<Expense> {
    const parsed = updateExpenseSchema.parse({ id, ...updates });
    if (isMockMode()) {
        const { MOCK_EXPENSES } = await import("@/lib/mock/mock-data");
        const idx = MOCK_EXPENSES.findIndex((e) => e.id === id);
        if (idx === -1) throw new Error("Expense not found");
        Object.assign(MOCK_EXPENSES[idx], updates);
        return MOCK_EXPENSES[idx];
    }

    const { id: _parsedId, ...validatedUpdates } = parsed;
    void _parsedId; // validated but not used directly
    const supabase = await getDb();
    const { data, error } = await supabase
        .from("expenses")
        .update(validatedUpdates)
        .eq("id", id)
        .select("*, category:categories(*)")
        .single();

    if (error) throw new Error(`Failed to update expense: ${error.message}`);
    return data as Expense;
}

// ============================================================
// DELETE
// ============================================================

export async function deleteExpense(id: string): Promise<void> {
    if (isMockMode()) {
        const { MOCK_EXPENSES } = await import("@/lib/mock/mock-data");
        const idx = MOCK_EXPENSES.findIndex((e) => e.id === id);
        if (idx !== -1) MOCK_EXPENSES.splice(idx, 1);
        return;
    }

    const supabase = await getDb();
    const { error } = await supabase.from("expenses").delete().eq("id", id);
    if (error) throw new Error(`Failed to delete expense: ${error.message}`);
}
