"use server";

import { useMock, getDb, getCurrentFarmId } from "@/lib/db";
import type { Crop, Task } from "@/lib/types";

// ============================================================
// CROPS — READ
// ============================================================

export async function getCrops(): Promise<Crop[]> {
    if (useMock()) {
        const { MOCK_CROPS } = await import("@/lib/mock/mock-crops-tasks-data");
        return MOCK_CROPS;
    }

    const supabase = await getDb();
    const farmId = await getCurrentFarmId();
    if (!farmId) return [];

    const { data, error } = await supabase
        .from("crops")
        .select("*")
        .eq("farm_id", farmId)
        .order("created_at", { ascending: false })
        .limit(100);

    if (error) throw new Error(`Failed to fetch crops: ${error.message}`);
    return data as Crop[];
}

export async function getCrop(id: string): Promise<Crop | null> {
    if (useMock()) {
        const { MOCK_CROPS } = await import("@/lib/mock/mock-crops-tasks-data");
        return MOCK_CROPS.find((c) => c.id === id) ?? null;
    }

    const supabase = await getDb();
    const { data, error } = await supabase
        .from("crops")
        .select("*")
        .eq("id", id)
        .single();

    if (error) return null;
    return data as Crop;
}

// ============================================================
// CROPS — CREATE / UPDATE
// ============================================================

import { createCropSchema } from "@/lib/validations";

export async function createCrop(crop: {
    crop_type: string;
    variety?: string;
    field_name?: string;
    area_hectares?: number;
    planting_date?: string;
    expected_harvest?: string;
    status?: string;
    latitude?: number;
    longitude?: number;
    notes?: string;
}): Promise<Crop> {
    const parsed = createCropSchema.parse(crop);
    if (useMock()) {
        const { MOCK_CROPS } = await import("@/lib/mock/mock-crops-tasks-data");
        const newCrop: Crop = {
            id: `crop-${Date.now()}`,
            farm_id: "farm-1",
            created_at: new Date().toISOString(),
            crop_type: crop.crop_type,
            variety: crop.variety,
            field_name: crop.field_name,
            area_hectares: crop.area_hectares,
            planting_date: crop.planting_date,
            expected_harvest: crop.expected_harvest,
            latitude: crop.latitude,
            longitude: crop.longitude,
            notes: crop.notes,
            status: (crop.status as Crop["status"]) || "planned",
        };
        MOCK_CROPS.push(newCrop);
        return newCrop;
    }

    const supabase = await getDb();
    const farmId = await getCurrentFarmId();
    if (!farmId) throw new Error("Not authenticated");

    const { data, error } = await supabase
        .from("crops")
        .insert({ farm_id: farmId, ...parsed })
        .select()
        .single();

    if (error) throw new Error(`Failed to create crop: ${error.message}`);
    return data as Crop;
}

export async function updateCrop(
    id: string,
    updates: Partial<Crop>
): Promise<Crop> {
    if (useMock()) {
        const { MOCK_CROPS } = await import("@/lib/mock/mock-crops-tasks-data");
        const idx = MOCK_CROPS.findIndex((c) => c.id === id);
        if (idx === -1) throw new Error("Crop not found");
        Object.assign(MOCK_CROPS[idx], updates);
        return MOCK_CROPS[idx];
    }

    const supabase = await getDb();
    const { data, error } = await supabase
        .from("crops")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

    if (error) throw new Error(`Failed to update crop: ${error.message}`);
    return data as Crop;
}

// ============================================================
// TASKS — READ
// ============================================================

export async function getTasks(): Promise<Task[]> {
    if (useMock()) {
        const { MOCK_TASKS } = await import("@/lib/mock/mock-crops-tasks-data");
        return MOCK_TASKS;
    }

    const supabase = await getDb();
    const farmId = await getCurrentFarmId();
    if (!farmId) return [];

    const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("farm_id", farmId)
        .order("due_date", { ascending: true })
        .limit(100);

    if (error) throw new Error(`Failed to fetch tasks: ${error.message}`);
    return data as Task[];
}

export async function getTasksForCrop(cropId: string): Promise<Task[]> {
    if (useMock()) {
        const { MOCK_TASKS } = await import("@/lib/mock/mock-crops-tasks-data");
        return MOCK_TASKS.filter((t) => t.id.includes("task")); // Mock: return all tasks
    }
    // In real mode, we'd filter by crop_id
    const supabase = await getDb();
    const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("crop_id", cropId)
        .order("due_date", { ascending: true })
        .limit(100);

    if (error) throw new Error(`Failed to fetch tasks for crop: ${error.message}`);
    return data as Task[];
}

// ============================================================
// TASKS — CREATE / UPDATE
// ============================================================

export async function createTask(task: {
    title: string;
    description?: string;
    assigned_to?: string;
    due_date?: string;
    priority?: string;
    crop_id?: string;
    recurring?: boolean;
}): Promise<Task> {
    if (useMock()) {
        const { MOCK_TASKS } = await import("@/lib/mock/mock-crops-tasks-data");
        const newTask: Task = {
            id: `task-${Date.now()}`,
            farm_id: "farm-1",
            status: "pending" as const,
            recurring: task.recurring ?? false,
            created_at: new Date().toISOString(),
            title: task.title,
            description: task.description,
            assigned_to: task.assigned_to,
            due_date: task.due_date,
            crop_id: task.crop_id,
            priority: (task.priority as Task["priority"]) || "medium",
        };
        MOCK_TASKS.push(newTask);
        return newTask;
    }

    const supabase = await getDb();
    const farmId = await getCurrentFarmId();
    if (!farmId) throw new Error("Not authenticated");

    const { data, error } = await supabase
        .from("tasks")
        .insert({ farm_id: farmId, ...task })
        .select()
        .single();

    if (error) throw new Error(`Failed to create task: ${error.message}`);
    return data as Task;
}

export async function updateTask(
    id: string,
    updates: Partial<Task>
): Promise<Task> {
    if (useMock()) {
        const { MOCK_TASKS } = await import("@/lib/mock/mock-crops-tasks-data");
        const idx = MOCK_TASKS.findIndex((t) => t.id === id);
        if (idx === -1) throw new Error("Task not found");
        Object.assign(MOCK_TASKS[idx], updates);
        return MOCK_TASKS[idx];
    }

    const supabase = await getDb();
    const { data, error } = await supabase
        .from("tasks")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

    if (error) throw new Error(`Failed to update task: ${error.message}`);
    return data as Task;
}

export async function deleteTask(id: string): Promise<void> {
    if (useMock()) {
        const { MOCK_TASKS } = await import("@/lib/mock/mock-crops-tasks-data");
        const idx = MOCK_TASKS.findIndex((t) => t.id === id);
        if (idx !== -1) MOCK_TASKS.splice(idx, 1);
        return;
    }

    const supabase = await getDb();
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) throw new Error(`Failed to delete task: ${error.message}`);
}
