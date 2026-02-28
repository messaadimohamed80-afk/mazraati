import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import ClientTasks from "../ClientTasks";
import type { Task } from "@/lib/types";

// Mock useTasks hook
const mockCreateTask = vi.fn();
const mockUpdateTask = vi.fn();
const mockDeleteTask = vi.fn();

vi.mock("@/hooks/useTasks", () => ({
    useTasks: (initialData: Task[]) => ({
        tasks: initialData,
        isLoading: false,
        createTask: mockCreateTask,
        isCreating: false,
        updateTask: mockUpdateTask,
        isUpdating: false,
        deleteTask: mockDeleteTask,
        isDeleting: false,
    }),
}));

// Mock crops-tasks-data helpers
vi.mock("@/lib/mock/mock-crops-tasks-data", () => ({
    TASK_PRIORITY_MAP: {
        low: { label: "منخفضة", icon: "🟢", color: "#10b981" },
        medium: { label: "متوسطة", icon: "🟡", color: "#f59e0b" },
        high: { label: "عالية", icon: "🟠", color: "#f97316" },
        urgent: { label: "عاجلة", icon: "🔴", color: "#ef4444" },
    },
    TASK_STATUS_MAP: {
        pending: { label: "قيد الانتظار", color: "#f59e0b" },
        in_progress: { label: "جاري", color: "#3b82f6" },
        done: { label: "مكتمل", color: "#10b981" },
    },
    isOverdue: (date?: string) => {
        if (!date) return false;
        return new Date(date) < new Date("2025-02-15");
    },
    getDaysUntil: () => 5,
}));

const MOCK_TASKS: Task[] = [
    {
        id: "task-1",
        farm_id: "f1",
        title: "ري البستان",
        description: "ري أشجار الزيتون",
        status: "pending",
        priority: "high",
        due_date: "2025-03-01",
        recurring: false,
        created_at: "2025-02-01T10:00:00Z",
    },
    {
        id: "task-2",
        farm_id: "f1",
        title: "تسميد القمح",
        status: "in_progress",
        priority: "medium",
        due_date: "2025-02-20",
        assigned_to: "أحمد",
        recurring: false,
        created_at: "2025-02-05T10:00:00Z",
    },
    {
        id: "task-3",
        farm_id: "f1",
        title: "حصاد الطماطم",
        status: "done",
        priority: "low",
        completed_at: "2025-01-28",
        recurring: false,
        created_at: "2025-01-15T10:00:00Z",
    },
    {
        id: "task-4",
        farm_id: "f1",
        title: "إصلاح السياج",
        status: "pending",
        priority: "urgent",
        due_date: "2025-01-10",
        recurring: false,
        created_at: "2025-01-05T10:00:00Z",
    },
];

describe("ClientTasks", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders task titles from initial data", () => {
        render(<ClientTasks initialTasks={MOCK_TASKS} />);

        expect(screen.getByText("ري البستان")).toBeInTheDocument();
        expect(screen.getByText("تسميد القمح")).toBeInTheDocument();
        expect(screen.getByText("حصاد الطماطم")).toBeInTheDocument();
        expect(screen.getByText("إصلاح السياج")).toBeInTheDocument();
    });

    it("renders correct stat counts", () => {
        render(<ClientTasks initialTasks={MOCK_TASKS} />);

        // Total tasks = 4 (stat card + filter count)
        expect(screen.getAllByText("4").length).toBeGreaterThanOrEqual(1);
        // Done count appears in stat card
        expect(screen.getAllByText("1").length).toBeGreaterThanOrEqual(1);
    });

    it("filters tasks by status (pending)", () => {
        render(<ClientTasks initialTasks={MOCK_TASKS} />);

        // Click pending filter button (first match — the filter button, not badges)
        const pendingBtns = screen.getAllByText(/قيد الانتظار/);
        // The filter button is a <button> inside crops-filters
        const filterBtn = pendingBtns.find(el => el.closest(".crops-filter-btn"));
        fireEvent.click(filterBtn!);

        expect(screen.getByText("ري البستان")).toBeInTheDocument();
        expect(screen.getByText("إصلاح السياج")).toBeInTheDocument();
        expect(screen.queryByText("تسميد القمح")).not.toBeInTheDocument();
        expect(screen.queryByText("حصاد الطماطم")).not.toBeInTheDocument();
    });

    it("filters tasks by search text", () => {
        const { container } = render(<ClientTasks initialTasks={MOCK_TASKS} />);

        const searchInput = screen.getByPlaceholderText("ابحث عن مهمة...");
        fireEvent.change(searchInput, { target: { value: "ري" } });

        // Check task card titles in the tasks list
        const taskCards = container.querySelectorAll(".task-card-title");
        const titles = Array.from(taskCards).map(el => el.textContent);
        expect(titles).toContain("ري البستان");
        expect(titles).not.toContain("تسميد القمح");
    });

    it("shows empty state when no tasks match", () => {
        render(<ClientTasks initialTasks={MOCK_TASKS} />);

        const searchInput = screen.getByPlaceholderText("ابحث عن مهمة...");
        fireEvent.change(searchInput, { target: { value: "xxxxx" } });

        expect(screen.getByText("لا توجد مهام مطابقة")).toBeInTheDocument();
    });

    it("shows task description when provided", () => {
        render(<ClientTasks initialTasks={MOCK_TASKS} />);

        expect(screen.getByText("ري أشجار الزيتون")).toBeInTheDocument();
    });

    it("shows assigned person", () => {
        const { container } = render(<ClientTasks initialTasks={MOCK_TASKS} />);

        const metaItems = container.querySelectorAll(".task-meta-item");
        const texts = Array.from(metaItems).map(el => el.textContent);
        expect(texts.some(t => t?.includes("أحمد"))).toBe(true);
    });

    it("shows priority badges", () => {
        const { container } = render(<ClientTasks initialTasks={MOCK_TASKS} />);

        const badges = container.querySelectorAll(".task-priority-badge");
        const badgeTexts = Array.from(badges).map(el => el.textContent);
        expect(badgeTexts.some(t => t?.includes("عالية"))).toBe(true);
        expect(badgeTexts.some(t => t?.includes("عاجلة"))).toBe(true);
    });
});
