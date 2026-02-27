"use server";

import { isMockMode, getDb, getCurrentFarmId, getCurrentUserId } from "@/lib/db";
import type { Category, Expense } from "@/lib/types";
import { ActionResult, ok, err } from "@/lib/action-result";
import { expenseRowSchema, categoryRowSchema, createExpenseSchema, updateExpenseSchema } from "@/lib/validations";
import { z } from "zod";

// ============================================================
// READ
// ============================================================

export async function getCategories(): Promise<ActionResult<Category[]>> {
    try {
        if (isMockMode()) {
            const { MOCK_CATEGORIES } = await import("@/lib/mock/mock-data");
            return ok(z.array(categoryRowSchema).parse(MOCK_CATEGORIES));
        }

        const supabase = await getDb();
        const farmId = await getCurrentFarmId();
        if (!farmId) return ok([]);

        const { data, error } = await supabase
            .from("categories")
            .select("*")
            .eq("farm_id", farmId)
            .order("name");

        if (error) return err(`Failed to fetch categories: ${error.message}`, "DB_ERROR");
        return ok(z.array(categoryRowSchema).parse(data));
    } catch (e: unknown) {
        return err(e instanceof Error ? e.message : String(e), "UNKNOWN");
    }
}

export async function getExpenses(): Promise<ActionResult<Expense[]>> {
    try {
        if (isMockMode()) {
            const { MOCK_CATEGORIES, MOCK_EXPENSES } = await import("@/lib/mock/mock-data");
            const expensesWithCats = MOCK_EXPENSES.map((e) => ({
                ...e,
                category: MOCK_CATEGORIES.find((c) => c.id === e.category_id),
            }));
            return ok(z.array(expenseRowSchema).parse(expensesWithCats));
        }

        const supabase = await getDb();
        const farmId = await getCurrentFarmId();
        if (!farmId) return ok([]);

        const { data, error } = await supabase
            .from("expenses")
            .select("*, category:categories(*)")
            .eq("farm_id", farmId)
            .order("date", { ascending: false })
            .limit(100);

        if (error) return err(`Failed to fetch expenses: ${error.message}`, "DB_ERROR");
        return ok(z.array(expenseRowSchema).parse(data));
    } catch (e: unknown) {
        return err(e instanceof Error ? e.message : String(e), "UNKNOWN");
    }
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
}): Promise<ActionResult<Expense>> {
    try {
        const parsed = createExpenseSchema.parse(expense);
        if (isMockMode()) {
            const { MOCK_CATEGORIES, MOCK_EXPENSES } = await import("@/lib/mock/mock-data");
            const newExpense: Expense = {
                id: crypto.randomUUID(),
                farm_id: "00000000-0000-4000-8000-000000000010",
                created_by: "00000000-0000-4000-8000-000000000001",
                created_at: new Date().toISOString(),
                category: MOCK_CATEGORIES.find((c) => c.id === expense.category_id),
                ...parsed, // Use parsed data
            };
            MOCK_EXPENSES.unshift(newExpense);
            return ok(expenseRowSchema.parse(newExpense));
        }

        const supabase = await getDb();
        const farmId = await getCurrentFarmId();
        const userId = await getCurrentUserId();
        if (!farmId || !userId) return err("Not authenticated", "NOT_AUTHENTICATED");

        const { data, error } = await supabase
            .from("expenses")
            .insert({
                farm_id: farmId,
                created_by: userId,
                ...parsed,
            })
            .select("*, category:categories(*)")
            .single();

        if (error) return err(`Failed to create expense: ${error.message}`, "DB_ERROR");
        return ok(expenseRowSchema.parse(data));
    } catch (e: unknown) {
        return err(e instanceof Error ? e.message : String(e), (e instanceof Error && e.name === "ZodError") ? "VALIDATION_ERROR" : "UNKNOWN");
    }
}

export async function createCategory(category: {
    name: string;
    icon: string;
    color: string;
    budget_planned?: number;
}): Promise<ActionResult<Category>> {
    try {
        if (isMockMode()) {
            const { MOCK_CATEGORIES } = await import("@/lib/mock/mock-data");
            const newCat: Category = {
                id: crypto.randomUUID(),
                farm_id: "00000000-0000-4000-8000-000000000010",
                created_at: new Date().toISOString(),
                ...category,
            };
            MOCK_CATEGORIES.push(newCat);
            return ok(categoryRowSchema.parse(newCat));
        }

        const supabase = await getDb();
        const farmId = await getCurrentFarmId();
        if (!farmId) return err("Not authenticated", "NOT_AUTHENTICATED");

        const { data, error } = await supabase
            .from("categories")
            .insert({ farm_id: farmId, ...category })
            .select()
            .single();

        if (error) return err(`Failed to create category: ${error.message}`, "DB_ERROR");
        return ok(categoryRowSchema.parse(data));
    } catch (e: unknown) {
        return err(e instanceof Error ? e.message : String(e), "UNKNOWN");
    }
}

// ============================================================
// UPDATE
// ============================================================

export async function updateExpense(
    id: string,
    updates: Partial<Pick<Expense, "amount" | "description" | "notes" | "date" | "category_id">>
): Promise<ActionResult<Expense>> {
    try {
        const parsed = updateExpenseSchema.parse({ id, ...updates });
        if (isMockMode()) {
            const { MOCK_EXPENSES, MOCK_CATEGORIES } = await import("@/lib/mock/mock-data");
            const idx = MOCK_EXPENSES.findIndex((e) => e.id === id);
            if (idx === -1) return err("Expense not found", "NOT_FOUND");
            Object.assign(MOCK_EXPENSES[idx], updates);

            // Re-map mock category after update for validation
            const updatedExpense = {
                ...MOCK_EXPENSES[idx],
                category: MOCK_CATEGORIES.find((c) => c.id === MOCK_EXPENSES[idx].category_id),
            };

            return ok(expenseRowSchema.parse(updatedExpense));
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

        if (error) return err(`Failed to update expense: ${error.message}`, "DB_ERROR");
        return ok(expenseRowSchema.parse(data));
    } catch (e: unknown) {
        return err(e instanceof Error ? e.message : String(e), (e instanceof Error && e.name === "ZodError") ? "VALIDATION_ERROR" : "UNKNOWN");
    }
}

// ============================================================
// DELETE
// ============================================================

export async function deleteExpense(id: string): Promise<ActionResult<void>> {
    try {
        if (isMockMode()) {
            const { MOCK_EXPENSES } = await import("@/lib/mock/mock-data");
            const idx = MOCK_EXPENSES.findIndex((e) => e.id === id);
            if (idx !== -1) MOCK_EXPENSES.splice(idx, 1);
            return ok(undefined);
        }

        const supabase = await getDb();
        const { error } = await supabase.from("expenses").delete().eq("id", id);
        if (error) return err(`Failed to delete expense: ${error.message}`, "DB_ERROR");

        return ok(undefined);
    } catch (e: unknown) {
        return err(e instanceof Error ? e.message : String(e), "UNKNOWN");
    }
}
