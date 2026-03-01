import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useExpenses } from "@/hooks/useExpenses";
import type { Expense, Category } from "@/lib/types";

/* ---- Mocks ---- */
const mockAddToast = vi.fn();

vi.mock("@/components/Toast", () => ({
    useToast: () => ({ addToast: mockAddToast, toasts: [], removeToast: vi.fn() }),
}));

const mockGetExpenses = vi.fn();
const mockCreateExpense = vi.fn();
const mockUpdateExpense = vi.fn();
const mockDeleteExpense = vi.fn();

vi.mock("@/lib/actions/expenses", () => ({
    getExpenses: (...args: unknown[]) => mockGetExpenses(...args),
    createExpense: (...args: unknown[]) => mockCreateExpense(...args),
    updateExpense: (...args: unknown[]) => mockUpdateExpense(...args),
    deleteExpense: (...args: unknown[]) => mockDeleteExpense(...args),
}));

/* ---- Helpers ---- */
const CATEGORIES: Category[] = [
    { id: "cat-1", farm_id: "f1", name: "أعلاف", icon: "🌾", color: "#10b981", created_at: "2025-01-01T00:00:00Z" },
];

const INITIAL_EXPENSES: Expense[] = [
    {
        id: "exp-1", farm_id: "f1", category_id: "cat-1", category: CATEGORIES[0],
        amount: 500, currency: "TND", description: "علف", date: "2025-01-01",
        created_at: "2025-01-01T10:00:00Z", created_by: "u1",
    },
];

function createWrapper() {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    function Wrapper({ children }: { children: React.ReactNode }) {
        return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    }
    return Wrapper;
}

describe("useExpenses hook behavior", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockGetExpenses.mockResolvedValue({ ok: true, data: INITIAL_EXPENSES });
    });

    it("returns initial data immediately", () => {
        const { result } = renderHook(
            () => useExpenses(INITIAL_EXPENSES, CATEGORIES),
            { wrapper: createWrapper() },
        );

        expect(result.current.expenses).toHaveLength(1);
        expect(result.current.expenses[0].description).toBe("علف");
    });

    it("creates expense optimistically (appears before server responds)", async () => {
        // Make create hang so we can check optimistic state
        mockCreateExpense.mockReturnValue(new Promise(() => { }));

        const { result } = renderHook(
            () => useExpenses(INITIAL_EXPENSES, CATEGORIES),
            { wrapper: createWrapper() },
        );

        act(() => {
            result.current.createExpense({
                description: "جديد", amount: 100, date: "2025-02-01", category_id: "cat-1",
            });
        });

        // Optimistic = prepended, so we now have 2
        await waitFor(() => {
            expect(result.current.expenses.length).toBe(2);
        });

        // The optimistic entry shows the correct description
        const newEntry = result.current.expenses.find(e => e.description === "جديد");
        expect(newEntry).toBeDefined();
        expect(newEntry!.id).toMatch(/^[0-9a-f]{8}-/);
    });

    it("shows success toast after create resolves", async () => {
        mockCreateExpense.mockResolvedValue({ ok: true, data: { ...INITIAL_EXPENSES[0], id: "new" } });

        const { result } = renderHook(
            () => useExpenses(INITIAL_EXPENSES, CATEGORIES),
            { wrapper: createWrapper() },
        );

        act(() => {
            result.current.createExpense({
                description: "x", amount: 1, date: "2025-01-01", category_id: "cat-1",
            });
        });

        await waitFor(() => {
            expect(mockAddToast).toHaveBeenCalledWith("success", expect.stringContaining("تم إضافة"));
        });
    });

    it("shows error toast and rolls back on create failure", async () => {
        mockCreateExpense.mockResolvedValue({ ok: false, error: { code: "UNKNOWN", message: "خطأ" } });

        const { result } = renderHook(
            () => useExpenses(INITIAL_EXPENSES, CATEGORIES),
            { wrapper: createWrapper() },
        );

        act(() => {
            result.current.createExpense({
                description: "fail", amount: 1, date: "2025-01-01", category_id: "cat-1",
            });
        });

        await waitFor(() => {
            expect(mockAddToast).toHaveBeenCalledWith("error", expect.stringContaining("فشل"));
        });

        // Should roll back to original 1 expense
        await waitFor(() => {
            expect(result.current.expenses).toHaveLength(1);
        });
    });

    it("deletes expense optimistically", async () => {
        mockDeleteExpense.mockReturnValue(new Promise(() => { }));

        const { result } = renderHook(
            () => useExpenses(INITIAL_EXPENSES, CATEGORIES),
            { wrapper: createWrapper() },
        );

        act(() => {
            result.current.deleteExpense("exp-1");
        });

        await waitFor(() => {
            expect(result.current.expenses).toHaveLength(0);
        });
    });
});
