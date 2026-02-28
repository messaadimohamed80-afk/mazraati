import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import ClientExpenses from "../ClientExpenses";
import type { Expense, Category } from "@/lib/types";

// Mock the useExpenses hook
const mockCreateExpense = vi.fn();
const mockUpdateExpense = vi.fn();
const mockDeleteExpense = vi.fn();

vi.mock("@/hooks/useExpenses", () => ({
    useExpenses: (initialData: Expense[]) => ({
        expenses: initialData,
        isLoading: false,
        createExpense: mockCreateExpense,
        isCreating: false,
        updateExpense: mockUpdateExpense,
        isUpdating: false,
        deleteExpense: mockDeleteExpense,
        isDeleting: false,
    }),
}));

// Mock ExpenseModal as a simple stub
vi.mock("@/components/ExpenseModal", () => ({
    default: ({ onClose, onSave }: { onClose: () => void; onSave: (e: unknown) => void }) => (
        <div data-testid="expense-modal">
            <button onClick={onClose}>إلغاء</button>
            <button onClick={() => onSave({ description: "test", amount: 100, date: "2025-01-01", category_id: "cat-1" })}>
                حفظ
            </button>
        </div>
    ),
}));

// Mock formatCurrency and formatDate
vi.mock("@/lib/utils", () => ({
    formatCurrency: (amount: number, currency?: string) => `${amount} ${currency || "TND"}`,
    formatDate: (date: string) => date,
}));

const MOCK_CATEGORIES: Category[] = [
    { id: "cat-1", farm_id: "f1", name: "أعلاف", icon: "🌾", color: "#10b981", created_at: "2025-01-01T00:00:00Z" },
    { id: "cat-2", farm_id: "f1", name: "وقود", icon: "⛽", color: "#f59e0b", created_at: "2025-01-01T00:00:00Z" },
];

const MOCK_EXPENSES: Expense[] = [
    {
        id: "exp-1",
        farm_id: "f1",
        category_id: "cat-1",
        category: MOCK_CATEGORIES[0],
        amount: 500,
        currency: "TND",
        description: "شراء أعلاف",
        date: "2025-02-01",
        created_at: "2025-02-01T10:00:00Z",
        created_by: "user-1",
    },
    {
        id: "exp-2",
        farm_id: "f1",
        category_id: "cat-2",
        category: MOCK_CATEGORIES[1],
        amount: 200,
        currency: "TND",
        description: "وقود للجرار",
        date: "2025-02-05",
        created_at: "2025-02-05T10:00:00Z",
        created_by: "user-1",
    },
    {
        id: "exp-3",
        farm_id: "f1",
        category_id: "cat-1",
        category: MOCK_CATEGORIES[0],
        amount: 300,
        currency: "TND",
        description: "سماد عضوي",
        date: "2025-01-20",
        created_at: "2025-01-20T10:00:00Z",
        created_by: "user-1",
    },
];

describe("ClientExpenses", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders expense rows from initial data", () => {
        render(
            <ClientExpenses
                initialExpenses={MOCK_EXPENSES}
                initialCategories={MOCK_CATEGORIES}
            />
        );

        // Check that expense descriptions appear
        expect(screen.getByText("شراء أعلاف")).toBeInTheDocument();
        expect(screen.getByText("وقود للجرار")).toBeInTheDocument();
        expect(screen.getByText("سماد عضوي")).toBeInTheDocument();
    });

    it("renders stats correctly", () => {
        render(
            <ClientExpenses
                initialExpenses={MOCK_EXPENSES}
                initialCategories={MOCK_CATEGORIES}
            />
        );

        // Total = 500 + 200 + 300 = 1000 (shows in stat card + footer)
        expect(screen.getAllByText(/1000/).length).toBeGreaterThanOrEqual(1);
        // Count = 3
        expect(screen.getAllByText("3").length).toBeGreaterThanOrEqual(1);
    });

    it("filters expenses by search query", () => {
        render(
            <ClientExpenses
                initialExpenses={MOCK_EXPENSES}
                initialCategories={MOCK_CATEGORIES}
            />
        );

        const searchInput = screen.getByPlaceholderText("ابحث في المصاريف...");
        fireEvent.change(searchInput, { target: { value: "وقود" } });

        // Only the fuel expense should show
        expect(screen.getByText("وقود للجرار")).toBeInTheDocument();
        expect(screen.queryByText("شراء أعلاف")).not.toBeInTheDocument();
    });

    it("shows empty state when search yields no results", () => {
        render(
            <ClientExpenses
                initialExpenses={MOCK_EXPENSES}
                initialCategories={MOCK_CATEGORIES}
            />
        );

        const searchInput = screen.getByPlaceholderText("ابحث في المصاريف...");
        fireEvent.change(searchInput, { target: { value: "لا يوجد" } });

        expect(screen.getByText("لا توجد مصاريف مطابقة")).toBeInTheDocument();
    });

    it("opens add modal when add button is clicked", () => {
        render(
            <ClientExpenses
                initialExpenses={MOCK_EXPENSES}
                initialCategories={MOCK_CATEGORIES}
            />
        );

        // Click the add button
        const addButton = screen.getByText("إضافة مصروف");
        fireEvent.click(addButton);

        // Modal should appear
        expect(screen.getByTestId("expense-modal")).toBeInTheDocument();
    });

    it("closes modal when cancel button is clicked", () => {
        render(
            <ClientExpenses
                initialExpenses={MOCK_EXPENSES}
                initialCategories={MOCK_CATEGORIES}
            />
        );

        // Open modal
        fireEvent.click(screen.getByText("إضافة مصروف"));
        expect(screen.getByTestId("expense-modal")).toBeInTheDocument();

        // Close it
        fireEvent.click(screen.getByText("إلغاء"));
        expect(screen.queryByTestId("expense-modal")).not.toBeInTheDocument();
    });

    it("calls createExpense when saving from add modal", () => {
        render(
            <ClientExpenses
                initialExpenses={MOCK_EXPENSES}
                initialCategories={MOCK_CATEGORIES}
            />
        );

        // Open modal and save
        fireEvent.click(screen.getByText("إضافة مصروف"));
        fireEvent.click(screen.getByText("حفظ"));

        expect(mockCreateExpense).toHaveBeenCalledTimes(1);
    });

    it("calls deleteExpense when delete button is clicked", () => {
        render(
            <ClientExpenses
                initialExpenses={MOCK_EXPENSES}
                initialCategories={MOCK_CATEGORIES}
            />
        );

        // Default sort is date desc, so exp-2 (Feb 5) is first row
        const deleteButtons = screen.getAllByTitle("حذف");
        fireEvent.click(deleteButtons[0]);

        expect(mockDeleteExpense).toHaveBeenCalledTimes(1);
        // First row = most recent expense (exp-2)
        expect(mockDeleteExpense).toHaveBeenCalledWith("exp-2");
    });

    it("displays table footer with counts", () => {
        render(
            <ClientExpenses
                initialExpenses={MOCK_EXPENSES}
                initialCategories={MOCK_CATEGORIES}
            />
        );

        expect(screen.getByText(/عرض 3 من 3 معاملة/)).toBeInTheDocument();
    });
});
