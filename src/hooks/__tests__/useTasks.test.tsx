import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTasks } from "@/hooks/useTasks";
import type { Task } from "@/lib/types";

const mockAddToast = vi.fn();

vi.mock("@/components/Toast", () => ({
    useToast: () => ({ addToast: mockAddToast, toasts: [], removeToast: vi.fn() }),
}));

const mockGetTasks = vi.fn();
const mockCreateTask = vi.fn();
const mockUpdateTask = vi.fn();
const mockDeleteTask = vi.fn();

vi.mock("@/lib/actions/crops", () => ({
    getTasks: (...args: unknown[]) => mockGetTasks(...args),
    createTask: (...args: unknown[]) => mockCreateTask(...args),
    updateTask: (...args: unknown[]) => mockUpdateTask(...args),
    deleteTask: (...args: unknown[]) => mockDeleteTask(...args),
}));

const INITIAL_TASKS: Task[] = [
    {
        id: "t-1", farm_id: "f1", title: "ري", status: "pending",
        priority: "high", recurring: false, created_at: "2025-01-01T10:00:00Z",
    },
];

function createWrapper() {
    const qc = new QueryClient({
        defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    function Wrapper({ children }: { children: React.ReactNode }) {
        return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
    }
    return Wrapper;
}

describe("useTasks hook behavior", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockGetTasks.mockResolvedValue({ ok: true, data: INITIAL_TASKS });
    });

    it("returns initial data", () => {
        const { result } = renderHook(() => useTasks(INITIAL_TASKS), { wrapper: createWrapper() });
        expect(result.current.tasks).toHaveLength(1);
        expect(result.current.tasks[0].title).toBe("ري");
    });

    it("creates task optimistically", async () => {
        mockCreateTask.mockReturnValue(new Promise(() => { }));

        const { result } = renderHook(() => useTasks(INITIAL_TASKS), { wrapper: createWrapper() });

        act(() => {
            result.current.createTask({ title: "مهمة جديدة", priority: "medium" });
        });

        await waitFor(() => {
            expect(result.current.tasks).toHaveLength(2);
        });

        const optimistic = result.current.tasks.find(t => t.title === "مهمة جديدة");
        expect(optimistic).toBeDefined();
        expect(optimistic!.status).toBe("pending"); // default
    });

    it("shows success toast on create", async () => {
        mockCreateTask.mockResolvedValue({ ok: true, data: { ...INITIAL_TASKS[0], id: "t-2" } });

        const { result } = renderHook(() => useTasks(INITIAL_TASKS), { wrapper: createWrapper() });

        act(() => {
            result.current.createTask({ title: "x", priority: "low" });
        });

        await waitFor(() => {
            expect(mockAddToast).toHaveBeenCalledWith("success", expect.stringContaining("تم إضافة"));
        });
    });

    it("shows error toast and rolls back on create failure", async () => {
        mockCreateTask.mockResolvedValue({ ok: false, error: { code: "UNKNOWN", message: "خطأ" } });

        const { result } = renderHook(() => useTasks(INITIAL_TASKS), { wrapper: createWrapper() });

        act(() => {
            result.current.createTask({ title: "فاشل", priority: "low" });
        });

        await waitFor(() => {
            expect(mockAddToast).toHaveBeenCalledWith("error", expect.stringContaining("فشل"));
        });

        await waitFor(() => {
            expect(result.current.tasks).toHaveLength(1);
        });
    });

    it("deletes task optimistically", async () => {
        mockDeleteTask.mockReturnValue(new Promise(() => { }));

        const { result } = renderHook(() => useTasks(INITIAL_TASKS), { wrapper: createWrapper() });

        act(() => {
            result.current.deleteTask("t-1");
        });

        await waitFor(() => {
            expect(result.current.tasks).toHaveLength(0);
        });
    });

    it("updates task status optimistically", async () => {
        mockUpdateTask.mockReturnValue(new Promise(() => { }));

        const { result } = renderHook(() => useTasks(INITIAL_TASKS), { wrapper: createWrapper() });

        act(() => {
            result.current.updateTask({ id: "t-1", updates: { status: "done" } });
        });

        await waitFor(() => {
            expect(result.current.tasks[0].status).toBe("done");
        });
    });
});
