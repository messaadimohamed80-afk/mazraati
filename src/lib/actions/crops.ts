"use server";

import { isMockMode, getDb, getCurrentFarmId } from "@/lib/db";
import type { Crop, Task } from "@/lib/types";
import { z } from "zod";
import { ActionResult, ok, err } from "@/lib/action-result";
import { cropRowSchema, taskRowSchema } from "@/lib/validations";

// ============================================================
// CROPS - READ
// ============================================================

export async function getCrops(): Promise<ActionResult<Crop[]>> {
    try {
        if (isMockMode()) {
            const { MOCK_CROPS } = await import("@/lib/mock/mock-crops-tasks-data");
            return ok(z.array(cropRowSchema).parse(MOCK_CROPS));
        }

        const supabase = await getDb();
        const farmId = await getCurrentFarmId();
        if (!farmId) return ok([]);

        const { data, error } = await supabase
            .from("crops")
            .select("*")
            .eq("farm_id", farmId)
            .order("created_at", { ascending: false })
            .limit(100);

        if (error) return err(`Failed to fetch crops: ${error.message}`, "DB_ERROR");
        return ok(z.array(cropRowSchema).parse(data));
    } catch (e: unknown) {
        return err(e instanceof Error ? e.message : String(e), "UNKNOWN");
    }
}

export async function getCrop(id: string): Promise<ActionResult<Crop>> {
    try {
        if (isMockMode()) {
            const { MOCK_CROPS } = await import("@/lib/mock/mock-crops-tasks-data");
            const crop = MOCK_CROPS.find((c) => c.id === id);
            return crop ? ok(cropRowSchema.parse(crop)) : err("Crop not found", "NOT_FOUND");
        }

        const supabase = await getDb();
        const { data, error } = await supabase
            .from("crops")
            .select("*")
            .eq("id", id)
            .single();

        if (error || !data) return err("Crop not found", "NOT_FOUND");
        return ok(cropRowSchema.parse(data));
    } catch (e: unknown) {
        return err(e instanceof Error ? e.message : String(e), "UNKNOWN");
    }
}

// ============================================================
// CROPS - CREATE / UPDATE
// ============================================================

import { createCropSchema, updateCropSchema, createTaskSchema, updateTaskSchema } from "@/lib/validations";

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
}): Promise<ActionResult<Crop>> {
    try {
        const parsed = createCropSchema.parse(crop);
        if (isMockMode()) {
            const { MOCK_CROPS } = await import("@/lib/mock/mock-crops-tasks-data");
            const newCrop: Crop = {
                id: crypto.randomUUID(),
                farm_id: "00000000-0000-4000-8000-000000000010",
                created_at: new Date().toISOString(),
                crop_type: parsed.crop_type,
                variety: parsed.variety,
                field_name: parsed.field_name,
                area_hectares: parsed.area_hectares,
                planting_date: parsed.planting_date,
                expected_harvest: parsed.expected_harvest,
                latitude: parsed.latitude,
                longitude: parsed.longitude,
                notes: parsed.notes,
                status: (parsed.status as Crop["status"]) || "planned",
            };
            MOCK_CROPS.push(newCrop);
            return ok(cropRowSchema.parse(newCrop));
        }

        const supabase = await getDb();
        const farmId = await getCurrentFarmId();
        if (!farmId) return err("Not authenticated", "NOT_AUTHENTICATED");

        const { data, error } = await supabase
            .from("crops")
            .insert({ farm_id: farmId, ...parsed })
            .select()
            .single();

        if (error) return err(`Failed to create crop: ${error.message}`, "DB_ERROR");
        return ok(cropRowSchema.parse(data));
    } catch (e: unknown) {
        return err(e instanceof Error ? e.message : String(e), (e instanceof Error && e.name === "ZodError") ? "VALIDATION_ERROR" : "UNKNOWN");
    }
}

export async function updateCrop(
    id: string,
    updates: Partial<Crop>
): Promise<ActionResult<Crop>> {
    try {
        updateCropSchema.parse({ id, ...updates });
        if (isMockMode()) {
            const { MOCK_CROPS } = await import("@/lib/mock/mock-crops-tasks-data");
            const idx = MOCK_CROPS.findIndex((c) => c.id === id);
            if (idx === -1) return err("Crop not found", "NOT_FOUND");
            Object.assign(MOCK_CROPS[idx], updates);
            return ok(cropRowSchema.parse(MOCK_CROPS[idx]));
        }

        const supabase = await getDb();
        const { data, error } = await supabase
            .from("crops")
            .update(updates)
            .eq("id", id)
            .select()
            .single();

        if (error) return err(`Failed to update crop: ${error.message}`, "DB_ERROR");
        return ok(cropRowSchema.parse(data));
    } catch (e: unknown) {
        return err(e instanceof Error ? e.message : String(e), (e instanceof Error && e.name === "ZodError") ? "VALIDATION_ERROR" : "UNKNOWN");
    }
}

// ============================================================
// TASKS - READ
// ============================================================

export async function getTasks(): Promise<ActionResult<Task[]>> {
    try {
        if (isMockMode()) {
            const { MOCK_TASKS } = await import("@/lib/mock/mock-crops-tasks-data");
            return ok(z.array(taskRowSchema).parse(MOCK_TASKS));
        }

        const supabase = await getDb();
        const farmId = await getCurrentFarmId();
        if (!farmId) return ok([]);

        const { data, error } = await supabase
            .from("tasks")
            .select("*")
            .eq("farm_id", farmId)
            .order("due_date", { ascending: true })
            .limit(100);

        if (error) return err(`Failed to fetch tasks: ${error.message}`, "DB_ERROR");
        return ok(z.array(taskRowSchema).parse(data));
    } catch (e: unknown) {
        return err(e instanceof Error ? e.message : String(e), "UNKNOWN");
    }
}

export async function getTasksForCrop(cropId: string): Promise<ActionResult<Task[]>> {
    try {
        if (isMockMode()) {
            const { MOCK_TASKS } = await import("@/lib/mock/mock-crops-tasks-data");
            return ok(z.array(taskRowSchema).parse(MOCK_TASKS.filter((t) => t.id.includes("task")))); // Mock: return all tasks
        }
        // In real mode, we'd filter by crop_id
        const supabase = await getDb();
        const { data, error } = await supabase
            .from("tasks")
            .select("*")
            .eq("crop_id", cropId)
            .order("due_date", { ascending: true })
            .limit(100);

        if (error) return err(`Failed to fetch tasks for crop: ${error.message}`, "DB_ERROR");
        return ok(z.array(taskRowSchema).parse(data));
    } catch (e: unknown) {
        return err(e instanceof Error ? e.message : String(e), "UNKNOWN");
    }
}

// ============================================================
// TASKS - CREATE / UPDATE
// ============================================================

export async function createTask(task: {
    title: string;
    description?: string;
    assigned_to?: string;
    due_date?: string;
    priority?: string;
    crop_id?: string;
    recurring?: boolean;
}): Promise<ActionResult<Task>> {
    try {
        const parsed = createTaskSchema.parse(task);
        if (isMockMode()) {
            const { MOCK_TASKS } = await import("@/lib/mock/mock-crops-tasks-data");
            const newTask: Task = {
                id: crypto.randomUUID(),
                farm_id: "00000000-0000-4000-8000-000000000010",
                status: "pending" as const,
                recurring: parsed.recurring ?? false,
                created_at: new Date().toISOString(),
                title: parsed.title,
                description: parsed.description,
                assigned_to: parsed.assigned_to,
                due_date: parsed.due_date,
                crop_id: parsed.crop_id,
                priority: (parsed.priority as Task["priority"]) || "medium",
            };
            MOCK_TASKS.push(newTask);
            return ok(taskRowSchema.parse(newTask));
        }

        const supabase = await getDb();
        const farmId = await getCurrentFarmId();
        if (!farmId) return err("Not authenticated", "NOT_AUTHENTICATED");

        const { data, error } = await supabase
            .from("tasks")
            .insert({ farm_id: farmId, ...parsed })
            .select()
            .single();

        if (error) return err(`Failed to create task: ${error.message}`, "DB_ERROR");
        return ok(taskRowSchema.parse(data));
    } catch (e: unknown) {
        return err(e instanceof Error ? e.message : String(e), (e instanceof Error && e.name === "ZodError") ? "VALIDATION_ERROR" : "UNKNOWN");
    }
}

export async function updateTask(
    id: string,
    updates: Partial<Task>
): Promise<ActionResult<Task>> {
    try {
        updateTaskSchema.parse({ id, ...updates });
        if (isMockMode()) {
            const { MOCK_TASKS } = await import("@/lib/mock/mock-crops-tasks-data");
            const idx = MOCK_TASKS.findIndex((t) => t.id === id);
            if (idx === -1) return err("Task not found", "NOT_FOUND");
            Object.assign(MOCK_TASKS[idx], updates);
            return ok(taskRowSchema.parse(MOCK_TASKS[idx]));
        }

        const supabase = await getDb();
        const { data, error } = await supabase
            .from("tasks")
            .update(updates)
            .eq("id", id)
            .select()
            .single();

        if (error) return err(`Failed to update task: ${error.message}`, "DB_ERROR");
        return ok(taskRowSchema.parse(data));
    } catch (e: unknown) {
        return err(e instanceof Error ? e.message : String(e), (e instanceof Error && e.name === "ZodError") ? "VALIDATION_ERROR" : "UNKNOWN");
    }
}

export async function deleteTask(id: string): Promise<ActionResult<void>> {
    try {
        if (isMockMode()) {
            const { MOCK_TASKS } = await import("@/lib/mock/mock-crops-tasks-data");
            const idx = MOCK_TASKS.findIndex((t) => t.id === id);
            if (idx !== -1) MOCK_TASKS.splice(idx, 1);
            return ok(undefined);
        }

        const supabase = await getDb();
        const { error } = await supabase.from("tasks").delete().eq("id", id);
        if (error) return err(`Failed to delete task: ${error.message}`, "DB_ERROR");

        return ok(undefined);
    } catch (e: unknown) {
        return err(e instanceof Error ? e.message : String(e), "UNKNOWN");
    }
}
