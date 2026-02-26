import { z } from "zod";

// --- Validations: Expenses ---
export const createExpenseSchema = z.object({
    category_id: z.string().uuid("معرف التصنيف غير صالح"),
    amount: z.number().positive("المبلغ يجب أن يكون أكبر من صفر"),
    currency: z.string().default("TND"),
    description: z.string().min(2, "الوصف قصير جداً").max(200, "الوصف طويل جداً"),
    notes: z.string().max(500, "الملاحظات لا يمكن أن تتجاوز 500 حرف").optional(),
    date: z.string().date("صيغة التاريخ غير صالحة"),
    receipt_url: z.string().url("رابط الإيصال غير صالح").optional(),
});

export const updateExpenseSchema = createExpenseSchema.partial().extend({
    id: z.string().uuid("رقم المصروف غير صالح"),
});

// --- Validations: Water (Wells, Tanks, Irrigation) ---
export const createWellSchema = z.object({
    name: z.string().min(2, "اسم البئر قصير جداً").max(100),
    depth_meters: z.number().positive("العمق يجب أن يكون أكبر من صفر"),
    water_level_meters: z.number().nonnegative("مستوى المياه لا يمكن أن يكون سالباً").optional(),
    water_quality: z.enum(["fresh", "brackish", "saline"]).default("fresh"),
    status: z.enum(["drilling", "testing", "active", "inactive"]).default("drilling"),
    total_cost: z.number().nonnegative().optional(),
    salinity_ppm: z.number().nonnegative().optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
});

export const createTankSchema = z.object({
    name: z.string().min(2).max(100),
    type: z.enum(["ground", "elevated", "underground"]),
    capacity_liters: z.number().positive("السعة يجب أن تكون موجبة"),
    current_level_percent: z.number().min(0).max(100),
    source: z.string().min(2),
    status: z.enum(["active", "maintenance", "empty", "inactive"]).default("active"),
    last_filled: z.string().date().optional(),
    notes: z.string().max(500).optional(),
});

export const createIrrigationSchema = z.object({
    name: z.string().min(2).max(100),
    type: z.enum(["drip", "sprinkler", "flood", "pivot"]),
    coverage_hectares: z.number().nonnegative(),
    source_id: z.string().uuid().optional(),
    source_name: z.string().min(2),
    status: z.enum(["active", "maintenance", "inactive", "planned"]).default("planned"),
    flow_rate_lph: z.number().nonnegative().optional(),
    last_maintenance: z.string().date().optional(),
    notes: z.string().max(500).optional(),
});

// --- Validations: Crops & Tasks ---
export const createCropSchema = z.object({
    crop_type: z.string().min(2).max(100),
    variety: z.string().max(100).optional(),
    field_name: z.string().max(100).optional(),
    area_hectares: z.number().positive("المساحة يجب أن تكون موجبة").optional(),
    planting_date: z.string().date().optional(),
    expected_harvest: z.string().date().optional(),
    actual_harvest: z.string().date().optional(),
    yield_kg: z.number().nonnegative().optional(),
    status: z.enum(["planned", "planted", "growing", "harvested"]).default("planned"),
    current_stage: z.string().max(100).optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    notes: z.string().max(500).optional(),
});

export const updateCropSchema = createCropSchema.partial().extend({
    id: z.string().uuid(),
});

export const createTaskSchema = z.object({
    crop_id: z.string().uuid().optional(),
    title: z.string().min(2).max(200),
    description: z.string().max(1000).optional(),
    assigned_to: z.string().max(100).optional(),
    due_date: z.string().date().optional(),
    priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
    status: z.enum(["pending", "in_progress", "done"]).default("pending"),
    recurring: z.boolean().default(false),
    recurrence_rule: z.string().optional(),
});

export const updateTaskSchema = createTaskSchema.partial().extend({
    id: z.string().uuid(),
});

// --- Validations: Livestock ---
export const createAnimalSchema = z.object({
    name: z.string().min(2).max(100),
    type: z.enum(["sheep", "cattle", "poultry", "goat"]),
    breed: z.string().max(100),
    gender: z.enum(["male", "female"]),
    birth_date: z.string().date().optional(),
    weight_kg: z.number().positive().optional(),
    tag_number: z.string().min(1).max(100),
    status: z.enum(["healthy", "sick", "pregnant", "sold", "deceased"]).default("healthy"),
    mother_id: z.string().uuid().optional(),
    acquisition_date: z.string().date(),
    acquisition_type: z.enum(["born", "purchased"]),
    purchase_price: z.number().nonnegative().optional(),
    notes: z.string().max(500).optional(),
});

export const updateAnimalSchema = createAnimalSchema.partial().extend({
    id: z.string().uuid(),
});

// --- Validations: Inventory ---
export const createInventoryItemSchema = z.object({
    name: z.string().min(2).max(100),
    category: z.enum(["equipment", "chemicals", "seeds", "tools", "supplies", "spare_parts"]),
    quantity: z.number().nonnegative(),
    unit: z.string().min(1).max(50),
    min_stock: z.number().nonnegative(),
    location: z.string().max(200),
    purchase_date: z.string().date(),
    purchase_price: z.number().nonnegative(),
    condition: z.enum(["new", "good", "fair", "needs_repair", "broken"]).default("new"),
    notes: z.string().max(500).optional(),
});

export const updateInventoryItemSchema = createInventoryItemSchema.partial().extend({
    id: z.string().uuid(),
});

// --- Validations: Energy ---
export const createEnergyAssetSchema = z.object({
    name: z.string().min(2).max(100),
    status: z.string(), // Extensively validated in UI
    total_cost: z.number().nonnegative().optional(),
    notes: z.string().max(500).optional(),
}).passthrough(); // Generic passthrough until energy modules are fully fleshed out
