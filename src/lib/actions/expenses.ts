"use server";

import { useMock, getDb, getCurrentFarmId, getCurrentUserId } from "@/lib/db";
import { MOCK_CATEGORIES, MOCK_EXPENSES } from "@/lib/mock-data";
import type { Category, Expense } from "@/lib/types";

// ============================================================
// READ
// ============================================================

export async function getCategories(): Promise<Category[]> {
    if (useMock()) return MOCK_CATEGORIES;

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
    if (useMock()) {
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
        .order("date", { ascending: false });

    if (error) throw new Error(`Failed to fetch expenses: ${error.message}`);
    return data as Expense[];
}

// ============================================================
// CREATE
// ============================================================

export async function createExpense(expense: {
    category_id: string;
    amount: number;
    description: string;
    notes?: string;
    date: string;
}): Promise<Expense> {
    if (useMock()) {
        const newExpense: Expense = {
            id: `exp-${Date.now()}`,
            farm_id: "farm-1",
            currency: "TND",
            created_by: "user-1",
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
            currency: "TND",
            ...expense,
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
    if (useMock()) {
        const newCat: Category = {
            id: `cat-${Date.now()}`,
            farm_id: "farm-1",
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
    if (useMock()) {
        const idx = MOCK_EXPENSES.findIndex((e) => e.id === id);
        if (idx === -1) throw new Error("Expense not found");
        Object.assign(MOCK_EXPENSES[idx], updates);
        return MOCK_EXPENSES[idx];
    }

    const supabase = await getDb();
    const { data, error } = await supabase
        .from("expenses")
        .update(updates)
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
    if (useMock()) {
        const idx = MOCK_EXPENSES.findIndex((e) => e.id === id);
        if (idx !== -1) MOCK_EXPENSES.splice(idx, 1);
        return;
    }

    const supabase = await getDb();
    const { error } = await supabase.from("expenses").delete().eq("id", id);
    if (error) throw new Error(`Failed to delete expense: ${error.message}`);
}
